package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import org.quartz.JobKey
import org.quartz.Scheduler
import owf.grails.test.integration.OwfSpecMixin

import ozone.owf.grails.services.OwfApplicationConfigurationService
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration

import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.USER_ACCOUNT_SETTINGS


@Integration
@Rollback
class ApplicationConfig_InactivitySpec extends Specification implements OwfSpecMixin {

    private static final JobKey JOB_KEY = new JobKey("deleteInactiveAccounts", "owfDeleteInactiveAccounts")

    @Autowired
    OwfApplicationConfigurationService service

    @Autowired
    Scheduler quartzScheduler

    private static void setupData() {
        save new ApplicationConfiguration(
                code: DISABLE_INACTIVE_ACCOUNTS.code,
                value: 'true',
                title: 'DISABLE_INACTIVE_ACCOUNTS',
                type: 'Boolean',
                groupName: USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: INACTIVITY_THRESHOLD.code,
                value: '90',
                title: 'INACTIVITY_THRESHOLD',
                type: 'Integer',
                groupName: USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: JOB_DISABLE_ACCOUNTS_START.code,
                value: '23:59:59',
                title: 'JOB_DISABLE_ACCOUNTS_START',
                type: 'String',
                groupName: USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: JOB_DISABLE_ACCOUNTS_INTERVAL.code,
                value: '1440',
                title: 'JOB_DISABLE_ACCOUNTS_INTERVAL',
                type: 'Integer',
                groupName: USER_ACCOUNT_SETTINGS.description)
    }

    void testDefaultValues() {
        given:
        setupData()

        expect:
        jobIsEnabled
        jobStartTime == "23:59:59"
        inactivityThreshold == 90
        disableAccountsInterval == 1440
    }

    void testDisableJob() {
        given:
        setupData()

        when:
        updateJobEnabled false

        then:
        !jobIsEnabled

        quartzScheduler.getJobDetail(JOB_KEY) == null
    }

    void testEnableJob() {
        given:
        setupData()

        updateJobEnabled false

        when:
        updateJobEnabled true

        then:
        jobIsEnabled

        quartzScheduler.getJobDetail(JOB_KEY) != null
    }

    void testUpdateInactivityThreshold() {
        given:
        setupData()

        when:
        updateInactivityThreshold 50

        then:
        inactivityThreshold == 50
    }

    private boolean getJobIsEnabled() {
        service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS).value.toBoolean()
    }

    private void updateJobEnabled(boolean value) {
        ApplicationConfiguration disabledConf = service.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS)
        disabledConf.value = value.toString()
        service.saveApplicationConfiguration(disabledConf)
    }

    private int getInactivityThreshold() {
        service.getApplicationConfiguration(INACTIVITY_THRESHOLD).value.toInteger()
    }

    private void updateInactivityThreshold(int value) {
        ApplicationConfiguration thresholdConf = service.getApplicationConfiguration(INACTIVITY_THRESHOLD)
        thresholdConf.value = value.toString()
        service.saveApplicationConfiguration(thresholdConf)
    }

    private String getJobStartTime() {
        service.getApplicationConfiguration(JOB_DISABLE_ACCOUNTS_START).value
    }

    private int getDisableAccountsInterval() {
        service.getApplicationConfiguration(JOB_DISABLE_ACCOUNTS_INTERVAL).value.toInteger()
    }

}
