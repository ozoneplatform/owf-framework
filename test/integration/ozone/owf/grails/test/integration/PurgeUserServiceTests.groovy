package ozone.owf.grails.test.integration

import ozone.owf.grails.domain.Person
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration;

class PurgeUserServiceTests extends GroovyTestCase {
    def purgeUserService

    def testUser1
    def testUser2
    def originalUserCount
    def owfApplicationConfigurationService

    protected void setUp() {
        super.setUp()

        testUser1 = new Person(username: 'purgeUser1', displayName: 'Toby Purged', createdDate: new Date())
        testUser1.save(flush:true)

        testUser2 = new Person(username: 'keepUser2', displayName: 'Dont Purge', createdDate: new Date())
        testUser2.save(flush:true)

        originalUserCount = Person.count()
    }

    void testPurgePerson() {
        createPerson(testUser1)
        Person ownedByOtherUser = createPerson(testUser2)
        assertEquals originalUserCount+2, Person.count()
        assertNotNull Person.findByUsername(testUser1.username)
        assertNotNull Person.findByUsername(testUser2.username)

        purgeUserService.purgeUser(Person.findByUsername(testUser1.username))
        assertEquals originalUserCount+1, Person.count()
        assertNull Person.findByUsername(testUser1.username)
        assertEquals ownedByOtherUser, Person.findByUsername(testUser2.username)
    }

    void testGetInactiveAccounts_NoUsers() {
        def inactiveAccounts = purgeUserService.getInactiveAccounts(90)
        assertEquals 0, inactiveAccounts.size()
    }

    void testGetInactiveAccounts_SelectsCorrectUsers() {
        def today = new Date()
        def thresholdInDays = 90
        def inactiveUser = createPersonWithLastLogin(today.minus(thresholdInDays+1))
        createPersonWithLastLogin(today.minus(thresholdInDays-1))

        def inactiveAccounts = purgeUserService.getInactiveAccounts(thresholdInDays)
        assertEquals 1, inactiveAccounts.size()
        assertEquals inactiveUser, inactiveAccounts[0]
    }

    void testPurgeInactiveUsers() {
        createRequiredConfigs()
        def today = new Date()
        def thresholdInDays = 90
        def inactiveUser = createPersonWithLastLogin(today.minus(thresholdInDays+1))
        def activeUser = createPersonWithLastLogin(today.minus(thresholdInDays-1))

        purgeUserService.purgeInactiveAccounts()

        assertNull Person.findByUsername(inactiveUser.username)
        assertNotNull Person.findByUsername(activeUser.username)
    }

    private Person createPerson(Person user) {
        Person person = Person.build(username: user.username)
        return person
    }

    private Person createPersonWithLastLogin(Date lastLoginDate) {
        Person person = Person.build(lastLogin: lastLoginDate)
        return person
    }

    private createRequiredConfigs() {

		new ApplicationConfiguration(code: DISABLE_INACTIVE_ACCOUNTS.code, value: "true",title:"DISABLE_INACTIVE_ACCOUNTS", type: "Boolean",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: INACTIVITY_THRESHOLD.code, value: "90",title:"INACTIVITY_THRESHOLD", type: "Integer",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: JOB_DISABLE_ACCOUNTS_START.code, value: "23:59:59",title:"JOB_DISABLE_ACCOUNTS_START", type: "String",groupName: USER_ACCOUNT_SETTINGS.description).save()
		new ApplicationConfiguration(code: JOB_DISABLE_ACCOUNTS_INTERVAL.code, value: "1440",title:"JOB_DISABLE_ACCOUNTS_INTERVAL", type: "Integer",groupName: USER_ACCOUNT_SETTINGS.description).save()
		
        owfApplicationConfigurationService.handleDisableInactiveAccountsJobChange(owfApplicationConfigurationService.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS))
    }
}
