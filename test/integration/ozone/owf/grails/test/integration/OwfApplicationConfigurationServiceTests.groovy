package ozone.owf.grails.test.integration

import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.security.web.authentication.session.ConcurrentSessionControlStrategy
import org.springframework.security.core.session.SessionRegistryImpl

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration;
import ozone.owf.grails.services.OwfApplicationConfigurationService;
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*
import static org.junit.Assert.assertThat
import static org.hamcrest.CoreMatchers.*

public class OwfApplicationConfigurationServiceTests extends GroovyTestCase{
	
	OwfApplicationConfigurationService owfApplicationConfigurationService

    def quartzScheduler

    protected void setUp() {
        createRequiredConfigs()
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
        assertThat(enabledConf.value.toBoolean(), is(true))
        assertThat(maxConf.value.toInteger(), is(1))

        //test enabling
        enabledConf.value = 'true'
        enabledConf = service.saveApplicationConfiguration(enabledConf)
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
        maxConf = service.saveApplicationConfiguration(maxConf)
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
        enabledConf = service.saveApplicationConfiguration(enabledConf)
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
        maxConf = service.saveApplicationConfiguration(maxConf)
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
        enabledConf = service.saveApplicationConfiguration(enabledConf)
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
        assertThat(disabledConf.value.toBoolean(), is(true))
        assertThat(thresholdConf.value.toInteger(), is(90))
        assertThat(startConf.value, is("23:59:59"))
        assertThat(intervalConf.value.toInteger(), is(1440))
                  JOB_DISABLE_ACCOUNTS_INTERVAL
        // Test changing a value, that the value is returned
        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean(), is(false))

        disabledConf.value = 'true'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assertThat(service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean(), is(true))

        thresholdConf.value = '50'
        thresholdConf = service.saveApplicationConfiguration(thresholdConf)
        assertThat(service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger(), is(50))

        thresholdConf.value = '90'
        thresholdConf = service.saveApplicationConfiguration(thresholdConf)
        assertThat(service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger(), is(90))

        // Test that setting the disabled flag starts and stops the job

        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assertNull(quartzScheduler.getJobDetail(name,group))

        disabledConf.value = 'true'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assertNotNull(quartzScheduler.getJobDetail(name,group))

        // Set it back to false
        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assertNull(quartzScheduler.getJobDetail(name,group))
    }

    private void createRequiredConfigs() {
        def group = USER_ACCOUNT_SETTINGS
        int subGroupCtr = 0

        owfApplicationConfigurationService.createOrUpdateApplicationConfig(SESSION_CONTROL_ENABLED, group,  "Boolean", "true", ++subGroupCtr, null)
        owfApplicationConfigurationService.createOrUpdateApplicationConfig(SESSION_CONTROL_MAX_CONCURRENT, group,  "Integer", "1", ++subGroupCtr, null)

        group = USER_ACCOUNT_SETTINGS
        subGroupCtr = 0

        owfApplicationConfigurationService.createOrUpdateApplicationConfig(DISABLE_INACTIVE_ACCOUNTS, group, "Boolean", "true", ++subGroupCtr, null)
        owfApplicationConfigurationService.createOrUpdateApplicationConfig(INACTIVITY_THRESHOLD, group, "Integer", "90", ++subGroupCtr, null)
        owfApplicationConfigurationService.createOrUpdateApplicationConfig(JOB_DISABLE_ACCOUNTS_START, group, "String", "23:59:59", ++subGroupCtr, null)
        owfApplicationConfigurationService.createOrUpdateApplicationConfig(JOB_DISABLE_ACCOUNTS_INTERVAL, group, "Integer", "1440", ++subGroupCtr, null)

        owfApplicationConfigurationService.createRequired()

    }
}
