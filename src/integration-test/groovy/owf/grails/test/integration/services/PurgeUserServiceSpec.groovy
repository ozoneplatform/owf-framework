package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin

import ozone.owf.enums.OwfApplicationSetting
import ozone.owf.enums.OwfApplicationSettingType
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.OwfApplicationConfigurationService
import ozone.owf.grails.services.PurgeUserService
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration


@Integration
@Rollback
class PurgeUserServiceSpec extends Specification implements OwfSpecMixin {

    private static final Date TODAY = new Date()

    private static final int INACTIVITY_THRESHOLD = 90

    @Autowired
    PurgeUserService purgeUserService

    @Autowired
    OwfApplicationConfigurationService owfApplicationConfigurationService

    Person activeUser1
    Person activeUser2
    Person inactiveUser1
    Person inactiveUser2

    private void setupData() {
        activeUser1 = createPerson('active1')
        activeUser2 = createPerson('active2', fromThreshold(1))
        inactiveUser1 = createPerson('inactive1', fromThreshold(-1))
        inactiveUser2 = createPerson('inactive2', fromThreshold(0))
    }

    void testPurgePerson() {
        given:
        setupData()

        when:
        purgeUserService.purgeUser(inactiveUser1)

        flushSession()

        then:
        findAllUsers() == [activeUser1, activeUser2, inactiveUser2]
    }

    void testGetInactiveAccounts() {
        given:
        setupData()

        expect:
        purgeUserService.getInactiveAccounts(INACTIVITY_THRESHOLD) == [inactiveUser1, inactiveUser2]
    }

    void testPurgeInactiveUsers() {
        given:
        setupData()
        createRequiredConfigs()

        when:
        purgeUserService.purgeInactiveAccounts()

        flushSession()

        then:
        findAllUsers() == [activeUser1, activeUser2]
    }

    private static List<Person> findAllUsers() {
        Person.list(sort: "username", order: "asc")
    }

    private static Date fromThreshold(int days) {
        (TODAY - INACTIVITY_THRESHOLD) + days
    }

    private static Person createPerson(String name, Date lastLogin = TODAY) {
        save new Person(
                username: name,
                userRealName: name,
                lastLogin: lastLogin)
    }

    private createRequiredConfigs() {
        save new ApplicationConfiguration(
                code: OwfApplicationSetting.DISABLE_INACTIVE_ACCOUNTS.code,
                value: "true",
                title: "DISABLE_INACTIVE_ACCOUNTS",
                type: "Boolean",
                groupName: OwfApplicationSettingType.USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: OwfApplicationSetting.INACTIVITY_THRESHOLD.code,
                value: INACTIVITY_THRESHOLD.toString(),
                title: "INACTIVITY_THRESHOLD",
                type: "Integer",
                groupName: OwfApplicationSettingType.USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: OwfApplicationSetting.JOB_DISABLE_ACCOUNTS_START.code,
                value: "23:59:59",
                title: "JOB_DISABLE_ACCOUNTS_START",
                type: "String",
                groupName: OwfApplicationSettingType.USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: OwfApplicationSetting.JOB_DISABLE_ACCOUNTS_INTERVAL.code,
                value: "1440",
                title: "JOB_DISABLE_ACCOUNTS_INTERVAL",
                type: "Integer",
                groupName: OwfApplicationSettingType.USER_ACCOUNT_SETTINGS.description)

        owfApplicationConfigurationService.handleDisableInactiveAccountsJobChange(
                owfApplicationConfigurationService.getApplicationConfiguration(
                        OwfApplicationSetting.DISABLE_INACTIVE_ACCOUNTS))
    }
}
