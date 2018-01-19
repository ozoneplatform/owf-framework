package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.GroupController
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person


@Integration
@Rollback
class GroupControllerSpec extends Specification
        implements ControllerTestMixin<GroupController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1
    Group group1

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void setupUsersAndGroups() {
        setupUsers()

        group1 = save new Group(
                name: 'Group1',
                description: '',
                email: 'test@test.com',
                automatic: false,
                stackDefault: false,
                status: 'active')

        user1.addToGroups(group1)
    }

    void testShow_forExistentGroup() {
        given:
        setupUsersAndGroups()
        loggedInAs user1

        when:
        params([id: "${group1.id}"])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            data.id == this.group1.id
            data.name == this.group1.name
        }
    }

    void testShow_forNonexistentGroup() {
        given:
        setupUsersAndGroups()
        loggedInAs user1

        when:
        params([id: "${group1.id + 1}"])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString == "\"Error during show: The requested entity was not found. Group ${group1.id + 1} not found.\""
    }

    void testList() {
        given:
        setupUsersAndGroups()
        loggedInAs admin1

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            results == 1
            data[0].name == this.group1.name
            data[0].id == this.group1.id
        }
    }

    void testCreate() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([name       : 'Group2',
                description: '',
                email      : 'test@test.com',
                automatic  : false,
                status     : 'active'])

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data[0].name == 'Group2'
            data[0].email == 'test@test.com'
        }

        Group.findByName('Group2') != null
    }

    void testDelete() {
        given:
        setupUsersAndGroups()
        loggedInAs admin1

        when:
        params([data: /{ "id": "${group1.id}" }/])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data[0].id == this.group1.id as String
        }

        Group.findById(group1.id) == null
    }

    void testDelete_userDoesNotHavePermission() {
        given:
        setupUsersAndGroups()
        loggedInAs user1

        when:
        params([data: /{ "id": "${group1.id}" }/])

        controller.delete()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED

        with(responseJson) {
            !success
        }
    }

}
