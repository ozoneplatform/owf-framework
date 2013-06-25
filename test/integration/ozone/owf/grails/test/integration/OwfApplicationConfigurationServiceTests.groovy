package ozone.owf.grails.test.integration

import org.springframework.security.web.authentication.session.ConcurrentSessionControlStrategy
import org.springframework.security.core.session.SessionRegistryImpl

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration;
import ozone.owf.grails.services.OwfApplicationConfigurationService;
import static ozone.owf.enums.OwfApplicationSetting.*
import static org.junit.Assert.assertThat
import static org.hamcrest.CoreMatchers.*

public class OwfApplicationConfigurationServiceTests extends GroovyTestCase{
	
	OwfApplicationConfigurationService owfApplicationConfigurationService

    def grailsApplication
    def quartzScheduler

	//As more logic is added we can build these tests more.  For now we can just assume that there should be more than
	//zero application configuration items
	public void testCreateRequired(){
		
		 
		 owfApplicationConfigurationService.createRequired()
		 
		 assertTrue(owfApplicationConfigurationService.getAllApplicationConfigurations().size() > 0)
	}

    def testSessionControlConfigurations() {

        def sessionStrategy = 
            new ConcurrentSessionControlStrategy(new SessionRegistryImpl())
        def service = owfApplicationConfigurationService
        ApplicationConfiguration enabledConf = service.getApplicationConfiguration( 
            SESSION_CONTROL_ENABLED)
        ApplicationConfiguration maxConf = service.getApplicationConfiguration(
            SESSION_CONTROL_MAX_CONCURRENT)
        
        

        //link the service to the sessionStrategy
        service.concurrentSessionControlStrategy = sessionStrategy

        //check defaults
        assertThat(enabledConf.value.toBoolean(), 
            is(grailsApplication.config.owf.dynamic.session.control.enabled))
        assertThat(maxConf.value.toInteger(), 
            is(grailsApplication.config.owf.dynamic.session.control.max.concurrent))

        //test enabling
        enabledConf.value = 'true'
        service.saveApplicationConfiguration(enabledConf)
        assertThat(sessionStrategy.getMaximumSessionsForThisUser(null), is(1))
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_ENABLED).value.toBoolean(),
            is(true)
        )
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_MAX_CONCURRENT).value.toInteger(),
            is(1)
        )

        //test changing number of concurrent session while enabled
        maxConf.value = '2'
        service.saveApplicationConfiguration(enabledConf)
        assertThat(sessionStrategy.getMaximumSessionsForThisUser(null), is(2))
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_ENABLED).value.toBoolean(),
            is(true)
        )
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_MAX_CONCURRENT).value.toInteger(),
            is(2)
        )

        //test disabling 
        enabledConf.value = 'false'
        service.saveApplicationConfiguration(enabledConf)
        assertThat(sessionStrategy.getMaximumSessionsForThisUser(null), is(-1))
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_ENABLED).value.toBoolean(),
            is(false)
        )
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_MAX_CONCURRENT).value.toInteger(),
            is(2)
        )

        //test changing number of concurrent sessions while disabled
        maxConf.value = '3'
        service.saveApplicationConfiguration(enabledConf)
        assertThat(sessionStrategy.getMaximumSessionsForThisUser(null), is(-1))
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_ENABLED).value.toBoolean(),
            is(false)
        )
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_MAX_CONCURRENT).value.toInteger(),
            is(3)
        )

        //test re-enabling after having changed the max
        enabledConf.value = 'true'
        service.saveApplicationConfiguration(enabledConf)
        assertThat(sessionStrategy.getMaximumSessionsForThisUser(null), is(3))
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_ENABLED).value.toBoolean(),
            is(true)
        )
        assertThat (
            service.getApplicationConfiguration(
                SESSION_CONTROL_MAX_CONCURRENT).value.toInteger(),
            is(3)
        )
    }


    def testInactiveAccountConfigurations() {

        def service = owfApplicationConfigurationService
        def name = "deleteInactiveAccounts"
        def group = "owfDeleteInactiveAccounts"

        ApplicationConfiguration disabledConf = service.getApplicationConfiguration(
                DISABLE_INACTIVE_ACCOUNTS)
        ApplicationConfiguration thresholdConf = service.getApplicationConfiguration(
                INACTIVITY_THRESHOLD)

        ApplicationConfiguration startConf = service.getApplicationConfiguration(
                JOB_DISABLE_ACCOUNTS_START)

        ApplicationConfiguration intervalConf = service.getApplicationConfiguration(
                JOB_DISABLE_ACCOUNTS_INTERVAL)


        // Test initial values
        assertThat(disabledConf.value.toBoolean(), is(grailsApplication.config.owf.dynamic.disable.inactive.accounts))
        assertThat(thresholdConf.value.toInteger(), is(grailsApplication.config.owf.dynamic.inactivity.threshold))
        assertThat(startConf.value, is(grailsApplication.config.owf.dynamic.job.disable.accounts.start.time))
        assertThat(intervalConf.value.toInteger(), is(grailsApplication.config.owf.dynamic.job.disable.accounts.interval))

        // Test changing a value, that the value is returned
        disabledConf.value = 'false'
        service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean(), is(false))

        disabledConf.value = 'true'
        service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean(), is(true))

        thresholdConf.value = '50'
        service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger(), is(50))

        thresholdConf.value = '90'
        service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger(), is(90))

        // Test that setting the disabled flag starts and stops the job

        disabledConf.value = 'false'
        service.saveApplicationConfiguration(disabledConf)
        assertNull(quartzScheduler.getJobDetail(name,group))

        disabledConf.value = 'true'
        service.saveApplicationConfiguration(disabledConf)
        assertNotNull(quartzScheduler.getJobDetail(name,group))

        // Set it back to false
        disabledConf.value = 'false'
        service.saveApplicationConfiguration(disabledConf)
        assertNull(quartzScheduler.getJobDetail(name,group))
    }
}
