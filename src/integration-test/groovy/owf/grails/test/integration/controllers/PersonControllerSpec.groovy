package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.PersonController
import ozone.owf.grails.domain.Person

import static owf.grails.test.integration.JsonUtil.asJsonString
import static owf.grails.test.integration.JsonUtil.toJsonDateString


@Integration
@Rollback
class PersonControllerSpec extends Specification
        implements ControllerTestMixin<PersonController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void testListPersons() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            data*.id == [this.admin1.id, this.user1.id]
        }
    }

    void testShowAction() {
        given:
        setupUsers()

        when:
        params([id: user1.id])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            person.id == this.user1.id
            roleNames == ['ROLE_USER']
        }
    }


    void testShowActionForNonexistentPerson() {
        given:
        setupUsers()

        when:
        params([id: -1])

        controller.show()

        then:
        responseStatus == HttpStatus.FOUND  // Due to redirect?

        flash.message == "Person not found with id -1"

        // redirectedTo "/person/list"
    }

    void testDeleteAction() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([data: /[ { "id": "${user1.id}" } ]/])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success == true
            data*.id == ["${this.user1.id}"]
        }

        Person.get(user1.id) == null
    }

    void testUpdateAction() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def jsonData = asJsonString([[id          : user1.id,
                                      username    : user1.username,
                                      userRealName: 'New Name',
                                      description : 'New Description']])

        params([data: jsonData])

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data[0].id == this.user1.id
            data[0].username == this.user1.username
            data[0].userRealName == this.user1.userRealName
        }

        with(Person.get(user1.id)) {
            userRealName == 'New Name'
            description == 'New Description'
        }
    }

    void testWhoamiAction() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        controller.whoami()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            currentId == this.admin1.id
            currentUser == this.admin1.userRealName
            currentUserName == this.admin1.username
            email == this.admin1.email
            currentUserPrevLogin == toJsonDateString(this.admin1.prevLogin)
        }
    }

}
