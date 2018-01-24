package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.AdministrationController
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition


@Integration
@Rollback
class AdministrationControllerSpec extends Specification
        implements ControllerTestMixin<AdministrationController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    private WidgetDefinition createWidgetDefinition(Person user = admin1) {
        assert user != null

        save new WidgetDefinition(
                displayName: 'Widget C',
                widgetGuid: '0c5435cf-4021-4f2a-ba69-dde451d12551',
                universalName: '0c5435cf-4021-4f2a-ba69-dde451d12551',
                widgetVersion: '1.0',
                widgetUrl: '../examples/fake-widgets/widget-c.html',
                descriptorUrl: '../examples/fake-widgets/widget-c.json',
                imageUrlSmall: '../images/blue/icons/widgetContainer/widgetCsm.gif',
                imageUrlMedium: '../images/blue/icons/widgetIcons/widgetC.gif',
                width: 980,
                height: 740)
    }

    void testListWidgetDefinitions() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDefinition = createWidgetDefinition()

        when:
        params([id: widgetDefinition.widgetGuid])

        controller.listWidgetDefinitions()

        then:
        responseStatus == HttpStatus.OK

        // TODO: Why is the response empty?
        responseJson.size() == 0
    }

    void testDeleteWidgetDefintions() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDefinition = createWidgetDefinition()

        when:
        params([data: /[{ "id": "${widgetDefinition.widgetGuid}" }]/])

        controller.deleteWidgetDefinitions()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            data.size() == 1
            data[0].id == widgetDefinition.widgetGuid
        }

        WidgetDefinition.findByWidgetGuid(widgetDefinition.widgetGuid) == null
    }

    void testDeletePersons() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([username: user1.username])

        controller.deletePersons()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == this.user1.id
        }

        Person.findByUsername(user1.username) == null
    }

    void testCreateOrUpdatePerson_createNewUser() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([data: /[ {"username": "newUser", "userRealName": "New User"} ]/])

        controller.createOrUpdatePerson()

        then:
        responseStatus == HttpStatus.OK

        // TODO: Seems broken
        with(responseJson) {
            success
            person == null
            errormsg == null
        }
    }

    void testCreateOrUpdatePerson_updateExistingUser() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([id           : user1.id,
                update_action: true])

        controller.createOrUpdatePerson()

        then:
        responseStatus == HttpStatus.OK

        // TODO: Seems broken
        with(responseJson) {
            success
            person == null
            errormsg == null
        }

    }


    void testListPersonRoles() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        controller.listPersonRoles()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 2
            rows == [ERoleAuthority.ROLE_ADMIN.strVal, ERoleAuthority.ROLE_USER.strVal]
        }
    }

}
