package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import grails.util.Holders
import org.springframework.security.web.authentication.session.ConcurrentSessionControlStrategy
import org.springframework.security.core.session.SessionRegistryImpl

import org.quartz.JobKey

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration;
import ozone.owf.grails.services.OwfApplicationConfigurationService;
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*
import static org.hamcrest.CoreMatchers.*

@TestMixin(IntegrationTestMixin)
public class OwfApplicationConfigurationServiceTests {

	OwfApplicationConfigurationService owfApplicationConfigurationService

    def quartzScheduler

    void setUp() {
        createRequiredConfigs()
    }

    void testSessionControlConfigurations() {

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
        assert enabledConf.value.toBoolean() == true
        assert maxConf.value.toInteger() == 1

        //test enabling
        enabledConf.value = 'true'
        enabledConf = service.saveApplicationConfiguration(enabledConf)
        assert sessionStrategy.getMaximumSessionsForThisUser(null) == 1
        assert service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
                .value.toBoolean() == true
        assert service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
                .value.toInteger() == 1

        //test changing number of concurrent session while enabled
        maxConf.value = '2'
        maxConf = service.saveApplicationConfiguration(maxConf)
        assert sessionStrategy.getMaximumSessionsForThisUser(null) == 2
        assert service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
                .value.toBoolean() == true
        assert service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
                .value.toInteger() == 2

        //test disabling
        enabledConf.value = 'false'
        enabledConf = service.saveApplicationConfiguration(enabledConf)
        assert sessionStrategy.getMaximumSessionsForThisUser(null) == -1
        assert service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
                .value.toBoolean() == false
        assert service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
                .value.toInteger() == 2

        //test changing number of concurrent sessions while disabled
        maxConf.value = '3'
        maxConf = service.saveApplicationConfiguration(maxConf)
        assert sessionStrategy.getMaximumSessionsForThisUser(null) == -1
        assert service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
                .value.toBoolean() == false
        assert service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
                .value.toInteger() == 3

        //test re-enabling after having changed the max
        enabledConf.value = 'true'
        enabledConf = service.saveApplicationConfiguration(enabledConf)
        assert sessionStrategy.getMaximumSessionsForThisUser(null) == 3
        assert service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
                .value.toBoolean() == true
        assert service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
                .value.toInteger() == 3
    }

    void testInactiveAccountConfigurations() {

        def service = owfApplicationConfigurationService
        def name = "deleteInactiveAccounts"
        def group = "owfDeleteInactiveAccounts"
        def jobKey = new JobKey(name, group)

        ApplicationConfiguration disabledConf = service.getApplicationConfiguration(
                DISABLE_INACTIVE_ACCOUNTS)
        ApplicationConfiguration thresholdConf = service.getApplicationConfiguration(
                INACTIVITY_THRESHOLD)

        ApplicationConfiguration startConf = service.getApplicationConfiguration(
                JOB_DISABLE_ACCOUNTS_START)

        ApplicationConfiguration intervalConf = service.getApplicationConfiguration(
                JOB_DISABLE_ACCOUNTS_INTERVAL)


        // Test initial values
        assert disabledConf.value.toBoolean() == true
        assert thresholdConf.value.toInteger() == 90
        assert startConf.value == "23:59:59"
        assert intervalConf.value.toInteger() == 1440
                  JOB_DISABLE_ACCOUNTS_INTERVAL
        // Test changing a value, that the value is returned
        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assert service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean() == false

        disabledConf.value = 'true'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assert service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean() == true

        thresholdConf.value = '50'
        thresholdConf = service.saveApplicationConfiguration(thresholdConf)
        assert service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger() == 50

        thresholdConf.value = '90'
        thresholdConf = service.saveApplicationConfiguration(thresholdConf)
        assert service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger() == 90

        // Test that setting the disabled flag starts and stops the job

        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assert null == (quartzScheduler.getJobDetail(jobKey))

        disabledConf.value = 'true'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assert null !=(quartzScheduler.getJobDetail(jobKey))

        // Set it back to false
        disabledConf.value = 'false'
        disabledConf = service.saveApplicationConfiguration(disabledConf)
        assert null == (quartzScheduler.getJobDetail(jobKey))
    }

    private void createRequiredConfigs() {

		new ApplicationConfiguration(code: SESSION_CONTROL_ENABLED.code, value: "true",title:"SESSION_CONTROL_ENABLED", type: "Boolean",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: SESSION_CONTROL_MAX_CONCURRENT.code, value: "1",title:"SESSION_CONTROL_MAX_CONCURRENT", type: "Integer",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: DISABLE_INACTIVE_ACCOUNTS.code, value: "true",title:"DISABLE_INACTIVE_ACCOUNTS", type: "Boolean",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: INACTIVITY_THRESHOLD.code, value: "90",title:"INACTIVITY_THRESHOLD", type: "Integer",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: JOB_DISABLE_ACCOUNTS_START.code, value: "23:59:59",title:"JOB_DISABLE_ACCOUNTS_START", type: "String",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: JOB_DISABLE_ACCOUNTS_INTERVAL.code, value: "1440",title:"JOB_DISABLE_ACCOUNTS_INTERVAL", type: "Integer",groupName: USER_ACCOUNT_SETTINGS.description).save()

    }
}
