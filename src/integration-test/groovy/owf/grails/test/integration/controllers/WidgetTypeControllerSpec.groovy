package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import org.grails.web.json.JSONObject

import org.springframework.http.HttpStatus

import owf.grails.test.integration.DomainBuilders
import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.WidgetTypeController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetType


@Integration
@Rollback
class WidgetTypeControllerSpec extends Specification
        implements ControllerTestMixin<WidgetTypeController>, OwfSpecMixin, SecurityMixin
{

    Person admin1
    Person user1

    WidgetType standardType
    WidgetType adminType

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void setupData() {
        standardType = DomainBuilders.createWidgetType('standard', 'standard')
        adminType = DomainBuilders.createWidgetType('administration', 'administration')
    }

    void list() {
        given:
        setupUsers()
        loggedInAs admin1

        setupData()

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson, JSONObject) {
            success
            results == 2

            data.size() == 2
            data[0] == [id         : this.adminType.id,
                        name       : this.adminType.name,
                        displayName: this.adminType.displayName]
            data[1] == [id         : this.standardType.id,
                        name       : this.standardType.name,
                        displayName: this.standardType.displayName]
        }
    }

    void list_requiresAdmin() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED
        responseString == /"Error during list: You are not authorized to access this entity. You must be an admin"/
    }

}
