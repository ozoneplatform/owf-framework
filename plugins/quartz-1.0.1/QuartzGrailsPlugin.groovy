/*
 * Copyright (c) 2011 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import grails.plugins.quartz.CustomTriggerFactoryBean
import grails.plugins.quartz.GrailsJobClass
import grails.plugins.quartz.GrailsJobFactory
import grails.plugins.quartz.JobArtefactHandler
import grails.plugins.quartz.JobDetailFactoryBean
import grails.plugins.quartz.TriggerUtils
import grails.plugins.quartz.listeners.ExceptionPrinterJobListener
import grails.plugins.quartz.listeners.SessionBinderJobListener
import grails.spring.BeanBuilder
import grails.util.Environment

import org.codehaus.groovy.grails.commons.spring.GrailsApplicationContext
import org.quartz.JobDataMap
import org.quartz.JobDetail
import org.quartz.JobKey
import org.quartz.ListenerManager
import org.quartz.Scheduler
import org.quartz.SimpleTrigger
import org.quartz.Trigger
import org.quartz.TriggerKey
import org.quartz.impl.matchers.KeyMatcher
import org.quartz.spi.MutableTrigger
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.config.MethodInvokingFactoryBean
import org.springframework.context.ApplicationContext
import org.springframework.scheduling.quartz.SchedulerFactoryBean

/**
 * Configures Quartz job support.
 *
 * @author Graeme Rocher
 * @author Marcel Overdijk
 * @author Sergey Nebolsin
 * @author Ryan Vanderwerf
 * @author Vitalii Samolovskikh
 */
class QuartzGrailsPlugin {

    def version = "1.0.1"
    def grailsVersion = "2.0 > *"

    def author = "Sergey Nebolsin, Graeme Rocher, Ryan Vanderwerf, Vitalii Samolovskikh"
    def authorEmail = "rvanderwerf@gmail.com"
    def title = "Quartz plugin for Grails"
    def description = 'Adds Quartz job scheduling features'
    def documentation = "http://grails.org/plugin/quartz"
    def pluginExcludes = [
        'grails-app/jobs/**',
        'src/docs/**',
        'web-app/**'
    ]

    def license = "APACHE"
    def issueManagement = [system: "JIRA", url: "http://jira.grails.org/browse/GPQUARTZ"]
    def scm = [url: "http://github.com/grails-plugins/grails-quartz"]

    def loadAfter = ['core', 'hibernate', 'datasources']
    def watchedResources = [
            "file:./grails-app/jobs/**/*Job.groovy",
            "file:./plugins/*/grails-app/jobs/**/*Job.groovy"
    ]

    def artefacts = [new JobArtefactHandler()]

    // The logger for the plugin class
    private Logger log = LoggerFactory.getLogger('grails.plugins.quartz.QuartzGrailsPlugin')

    /**
     * Configures The Spring context.
     */
    def doWithSpring = { context ->
        def config = loadQuartzConfig(application.config)
        boolean hasHibernate = manager?.hasGrailsPlugin("hibernate")

        // Configure job beans
        application.jobClasses.each { GrailsJobClass jobClass ->
            configureJobBeans.delegate = delegate
            configureJobBeans(jobClass, hasHibernate)
        }

        // Configure the session listener if there is the Hibernate
        if (hasHibernate) {
            // register SessionBinderJobListener to bind Hibernate Session to each Job's thread
            "${SessionBinderJobListener.NAME}"(SessionBinderJobListener) { bean ->
                bean.autowire = "byName"
            }
        }

        // register global ExceptionPrinterJobListener which will log exceptions occured
        // during job's execution
        "${ExceptionPrinterJobListener.NAME}"(ExceptionPrinterJobListener)

        // Configure the job factory to create job instances on executions.
        quartzJobFactory(GrailsJobFactory)

        // Configure Scheduler
        configureScheduler.delegate = delegate
        configureScheduler(config)
    }

    def configureScheduler = {config->
        quartzScheduler(SchedulerFactoryBean) { bean ->
            quartzProperties = config._properties

            // Use the instanceName property to set the name of the scheduler
            if (quartzProperties['org.quartz.scheduler.instanceName']) {
                schedulerName = quartzProperties['org.quartz.scheduler.instanceName']
            }

            // delay scheduler startup to after-bootstrap stage
            autoStartup = false

            // Store
            if (config.jdbcStore) {
                dataSource = ref(config.jdbcStoreDataSource ?: 'dataSource')
                transactionManager = ref('transactionManager')
            }
            waitForJobsToCompleteOnShutdown = config.waitForJobsToCompleteOnShutdown
            exposeSchedulerInRepository = config.exposeSchedulerInRepository
            jobFactory = quartzJobFactory

            // Global listeners on each job.
            globalJobListeners = [ref("${ExceptionPrinterJobListener.NAME}")]

            // Destroys the scheduler before the application will stop.
            bean.destroyMethod = 'destroy'
        }
    }

    /**
     * Configure job beans.
     */
    def configureJobBeans = { GrailsJobClass jobClass, boolean hasHibernate = true ->
        def fullName = jobClass.fullName

        try {
            "${fullName}Class"(MethodInvokingFactoryBean) {
                targetObject = ref("grailsApplication", true)
                targetMethod = "getArtefact"
                arguments = [JobArtefactHandler.TYPE, jobClass.fullName]
            }

            "${fullName}"(ref("${fullName}Class")) { bean ->
                bean.factoryMethod = "newInstance"
                bean.autowire = "byName"
                bean.scope = "prototype"
            }
        } catch (Exception e) {
            log.error("Error declaring ${fullName}Detail bean in context", e)
        }
    }

    /**
     * Adds quartz plugin dynamic methods to all jobs.
     */
    def doWithDynamicMethods = { ctx ->
        application.jobClasses.each { GrailsJobClass tc ->
            addMethods(tc, ctx)
        }
    }

    /**
     * Adds schedule methods for job classes.
     */
    private static void addMethods(tc, ctx) {
        Scheduler quartzScheduler = ctx.quartzScheduler
        def mc = tc.metaClass
        String jobName = tc.getFullName()
        String jobGroup = tc.getGroup()

        def scheduleTrigger = { Trigger trigger, Map params = null ->
            if (params) {
                trigger.jobDataMap.putAll(params)
            }
            quartzScheduler.scheduleJob(trigger)
        }

        // Schedule with job with cron trigger
        mc.'static'.schedule = { String cronExpression, Map params = null ->
            scheduleTrigger(TriggerUtils.buildCronTrigger(jobName, jobGroup, cronExpression), params)
        }

        // Schedule the job with simple trigger
        mc.'static'.schedule = {
            Long repeatInterval, Integer repeatCount = SimpleTrigger.REPEAT_INDEFINITELY, Map params = null ->
                scheduleTrigger(TriggerUtils.buildSimpleTrigger(jobName, jobGroup, repeatInterval, repeatCount), params)
        }

        // Schedule the job at specified time
        mc.'static'.schedule = { Date scheduleDate, Map params = null ->
            scheduleTrigger(TriggerUtils.buildDateTrigger(jobName, jobGroup, scheduleDate), params)
        }

        // Schedule the job with trigger
        mc.'static'.schedule = { Trigger trigger, Map params = null ->
            JobKey jobKey = new JobKey(jobName, jobGroup)
            if(trigger.jobKey != jobKey && trigger instanceof MutableTrigger){
                trigger.setJobKey(jobKey)
            } else {
                throw new IllegalArgumentException(
                        "The trigger job key is not equals the job key and trigger is immutable."
                )
            }
            if (params) {
                trigger.jobDataMap.putAll(params)
            }
            quartzScheduler.scheduleJob(trigger)
        }

        mc.'static'.triggerNow = { Map params = null ->
            quartzScheduler.triggerJob(new JobKey(jobName, jobGroup), params ? new JobDataMap(params) : null)
        }

        mc.'static'.removeJob = {
            quartzScheduler.deleteJob(new JobKey(jobName, jobGroup))
        }

        mc.'static'.reschedule = { Trigger trigger, Map params = null ->
            if (params) trigger.jobDataMap.putAll(params)
            quartzScheduler.rescheduleJob(trigger.key, trigger)
        }

        mc.'static'.unschedule = { String triggerName, String triggerGroup = Constants.DEFAULT_TRIGGERS_GROUP ->
            quartzScheduler.unscheduleJob(TriggerKey.triggerKey(triggerName, triggerGroup))
        }
    }

    // Schedule jobs
    def doWithApplicationContext = { applicationContext ->
        application.jobClasses.each { GrailsJobClass jobClass ->
            scheduleJob(jobClass, applicationContext, manager?.hasGrailsPlugin("hibernate"))
        }
        log.debug("Scheduled Job Classes count: " + application.jobClasses.size())
    }

    /**
     * Schedules jobs. Creates job details and trigger beans. And schedules them.
     */
    def scheduleJob(GrailsJobClass jobClass, ApplicationContext ctx, boolean hasHibernate) {
        Scheduler scheduler = ctx.quartzScheduler
        if (scheduler) {
            def fullName = jobClass.fullName

            // Creates job details
            JobDetailFactoryBean jdfb = new JobDetailFactoryBean()
            jdfb.jobClass = jobClass
            jdfb.afterPropertiesSet()
            JobDetail jobDetail = jdfb.object

            // adds the job to the scheduler, and associates triggers with it
            scheduler.addJob(jobDetail, true)

            // The session listener if is needed
            if (hasHibernate && jobClass.sessionRequired) {
                SessionBinderJobListener listener = ctx.getBean(SessionBinderJobListener.NAME)
                if (listener != null) {
                    ListenerManager listenerManager = scheduler.getListenerManager()
                    KeyMatcher<JobKey> matcher = KeyMatcher.keyEquals(jobDetail.key)
                    if(listenerManager.getJobListener(listener.getName())==null){
                        listenerManager.addJobListener(listener, matcher)
                    } else {
                        listenerManager.addJobListenerMatcher(listener.getName(), matcher)
                    }
                } else {
                    log.error("The SessionBinderJobListener has not been initialized.")
                }
            }

            // Creates and schedules triggers
            jobClass.triggers.each { name, Expando descriptor ->
                CustomTriggerFactoryBean factory = new CustomTriggerFactoryBean()
                factory.triggerClass = descriptor.triggerClass
                factory.triggerAttributes = descriptor.triggerAttributes
                factory.jobDetail = jobDetail
                factory.afterPropertiesSet()
                Trigger trigger = factory.object

                TriggerKey key = trigger.key
                log.debug("Scheduling $fullName with trigger $key: ${trigger}")
                if (scheduler.getTrigger(key) != null) {
                    scheduler.rescheduleJob(key, trigger)
                } else {
                    scheduler.scheduleJob(trigger)
                }
                log.debug("Job ${fullName} scheduled")
            }
        } else {
            log.error("Failed to schedule job details and job triggers: scheduler not found.")
        }
    }

    def onChange = { event ->
        if (
                event.source instanceof Class &&
                application.isArtefactOfType(JobArtefactHandler.TYPE, event.source as Class)
        ) {
            log.debug("Job ${event.source} changed. Reloading...")

            GrailsApplicationContext context = event.ctx
            def scheduler = context?.quartzScheduler

            GrailsJobClass jobClass = application.getJobClass(event.source?.name)

            if (context && jobClass) {
                addMethods(jobClass, context)
            }

            // get quartz scheduler
            if (context && scheduler) {
                // if job already exists, delete it from scheduler
                if (jobClass) {
                    def jobKey = new JobKey(jobClass.fullName, jobClass.group)
                    scheduler.deleteJob(jobKey)
                    log.debug("Job ${jobClass.fullName} deleted from the scheduler")
                }

                // add job artifact to application
                jobClass = application.addArtefact(JobArtefactHandler.TYPE, event.source as Class)

                def fullName = jobClass.fullName
                boolean hasHibernate = manager?.hasGrailsPlugin("hibernate")

                // configure and register job beans
                BeanBuilder beans = beans {
                    configureJobBeans.delegate = delegate
                    configureJobBeans(jobClass, hasHibernate)
                }

                context.registerBeanDefinition("${fullName}Class", beans.getBeanDefinition("${fullName}Class"))
                context.registerBeanDefinition("${fullName}", beans.getBeanDefinition("${fullName}"))

                // Reschedule jobs
                scheduleJob(jobClass, event.ctx, hasHibernate)
            } else {
                log.error("Application context or Quartz Scheduler not found. Can't reload Quartz plugin.")
            }
        }
    }

    /*
     * Load the various configs.
     * Order of priority has been "fixed" in 1.0-RC2 to be:
     *
     * 1. DefaultQuartzConfig is loaded
     * 2. App's Config.groovy is loaded in and overwrites anything from DQC
     * 3. QuartzConfig is loaded and overwrites anything from DQC or AppConfig
     * 4. quartz.properties are loaded into config as quartz._props
     */
    private ConfigObject loadQuartzConfig(ConfigObject config) {
        def classLoader = new GroovyClassLoader(getClass().classLoader)
        String environment = Environment.current.name

        // Note here the order of objects when calling merge - merge OVERWRITES values in the target object
        // Load default Quartz config as a basis
        def newConfig = new ConfigSlurper(environment).parse(
                classLoader.loadClass('DefaultQuartzConfig')
        )

        // Overwrite defaults with what Config.groovy has supplied, perhaps from external files
        newConfig.merge(config)

        // Overwrite with contents of QuartzConfig
        try {
            newConfig.merge(new ConfigSlurper(environment).parse(
                    classLoader.loadClass('QuartzConfig'))
            )
        } catch (Exception ignored) {
            // ignore, just use the defaults
        }

        // Now merge our correctly merged DefaultQuartzConfig and QuartzConfig into the main config
        config.merge(newConfig)

        // And now load quartz properties into main config
        def properties = new Properties()
        def resource = classLoader.getResourceAsStream("quartz.properties")
        if (resource != null) {
            properties.load(resource)
        }

        if (config.quartz.containsKey('props')) {
            properties << config.quartz.props.toProperties('org.quartz')
        }

        config.quartz._properties = properties

        return config.quartz
    }
}
