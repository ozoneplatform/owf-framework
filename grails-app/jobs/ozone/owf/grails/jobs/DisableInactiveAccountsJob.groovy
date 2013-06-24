package ozone.owf.grails.jobs

import org.quartz.Job
import org.quartz.JobDetail
import org.quartz.JobExecutionContext
import org.quartz.SimpleTrigger
import org.quartz.Trigger
import org.codehaus.groovy.grails.web.context.ServletContextHolder
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes

class DisableInactiveAccountsJob implements Job {
    def name = "deleteInactiveAccounts"
    def group = "owfDeleteInactiveAccounts"
    def purgeUserService

    public DisableInactiveAccountsJob() {

    }

    static triggers = {

    }

    def schedule(def quartzScheduler) {
        def job = new JobDetail(name, group, this.class)
        def trigger = new SimpleTrigger(name, group, new Date(), null, SimpleTrigger.REPEAT_INDEFINITELY, 1000*60*60*24)
        if (quartzScheduler.getJobDetail(name, group)) {
            log.info "$name job already exists, don't schedule"
        } else {
            quartzScheduler.scheduleJob(job, trigger)    
        }
    }

    def cancel(def quartzScheduler) {
        quartzScheduler.deleteJob(name, group)
    }

    /**
     * Execute this Job.
     * @param context
     * @return
     */
    public void execute(JobExecutionContext context) {
        println("Deleting a user")
        def ctx = ServletContextHolder.servletContext.getAttribute(GrailsApplicationAttributes.APPLICATION_CONTEXT)
        if (!ctx) throw new RuntimeException('Unable to execute DisableInactiveAccountsJob: AppContext is unavailable')
        if (!purgeUserService) {
            purgeUserService = ctx?.purgeUserService
        }

        log.info "Purging inactive users"
        purgeUserService.purgeInactiveAccounts()
    }

}
