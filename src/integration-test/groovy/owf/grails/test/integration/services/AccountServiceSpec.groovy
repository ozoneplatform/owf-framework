package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.ServiceModelService
import ozone.owf.grails.services.model.ServiceModel


@Integration
@Rollback
class AccountServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    AccountService accountService

    @Autowired
    ServiceModelService serviceModelService

    Person admin1
    Person user1

    private void setupData() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void "when not logged in as Admin, getAllUsers throws an OwfException"() {
        given:
        setupData()
        loggedInAs user1

        when:
        accountService.getAllUsers()

        then:
        thrown(OwfException)
    }

    void "when logged in as Admin, getAllUsers succeeds"() {
        given:
        setupData()
        loggedInAs admin1

        expect:
        accountService.getAllUsers().size() == 2
    }

    void testGetLoggedInUsername() {
        given:
        setupData()
        loggedInAs user1

        expect:
        accountService.getLoggedInUsername() == user1.username
    }

    void testIsUserAdmin() {
        given:
        setupData()

        expect:
        accountService.isUserAdmin(admin1)
    }

    void testIsUserAdmin_whenNotAdmin_returnsFalse() {
        given:
        setupData()

        expect:
        !accountService.isUserAdmin(user1)
    }

    void testGetLoggedInUserIsAdmin_whenAdmin_returnsTrue() {
        given:
        setupData()
        loggedInAs admin1

        expect:
        accountService.getLoggedInUserIsAdmin()
    }

    void testGetLoggedInUserIsAdmin_whenNotAdmin_returnsFalse() {
        given:
        setupData()
        loggedInAs user1

        expect:
        !accountService.getLoggedInUserIsAdmin()
    }

    void testGetAllUsersWithApos() {
        given:
        setupData()
        loggedInAs admin1

        when:
        List<ServiceModel> json = accountService.getAllUsers().collect { serviceModelService.createServiceModel(it) }

        then:
        json?.size() == 2
    }

}
