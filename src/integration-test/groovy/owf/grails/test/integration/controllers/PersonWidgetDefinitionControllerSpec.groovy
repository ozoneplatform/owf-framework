package owf.grails.test.integration.controllers

import spock.lang.Ignore
import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.PersonWidgetDefinitionController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition

import static owf.grails.test.integration.DomainBuilders.*


@Integration
@Rollback
class PersonWidgetDefinitionControllerSpec extends Specification
        implements ControllerTestMixin<PersonWidgetDefinitionController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1
    Person user2

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
        user2 = createUser('user2')
    }

    private static final String CREATE_NOT_AUTHORIZED =
            '"Error during create: You are not authorized to access this entity. You are not authorized to create widgets for other users."'

    private static final String SHOW_WIDGET_NOT_FOUND =
            '"Error during show: The requested entity was not found. Widget with guid of %1$s not found."'

    private static final String CREATE_PERSON_NOT_FOUND =
            '"Error during create: The requested entity was not found. Person with id of %1$d not found while attempting to create a widget for a user."'

    private static final String VALIDATION_ERROR =
            '"Error during %1$s: The requested entity failed to pass validation. A fatal validation error occurred. %2$s param required. Params: [:]"'

    private static final String UPDATE_WIDGET_NOT_FOUND =
            '"Error during update: The requested entity was not found. Widget %1$s not found."'

    void listUserAndGroupWidgets() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void listUserAndGroupWidgets_bySimilarName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetName: "%${widgetDef.displayName[0]}%"])

        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void listUserAndGroupWidgets_byExactName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetName: widgetDef.displayName])

        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void listUserAndGroupWidgets_byVersion() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetVersion: widgetDef.widgetVersion])

        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void listUserAndGroupWidgets_byWidgetGuid() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetGuid: widgetDef.widgetGuid])

        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void listUserAndGroupWidgets_byUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([universalName: widgetDef.universalName])

        controller.listUserAndGroupWidgets()

        then:
        responseStatus == HttpStatus.OK

        responseJson.id[0] == widgetDef.widgetGuid
    }

    void bulkDelete() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetGuidsToDelete: /[ "${widgetDef.widgetGuid}" ]/])

        controller.bulkDelete()

        then:
        responseStatus == HttpStatus.OK

        responseJson.success
    }

    void bulkUpdate() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetsToUpdate: /[{ "guid": "${widgetDef.widgetGuid}", "visible": true }]/])

        controller.bulkUpdate()

        then:
        responseStatus == HttpStatus.OK

        responseJson.success
    }

    void bulkDelete_missingParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createWidgetDefinitionWithPWD(admin1)

        when:
        controller.bulkDelete()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseStringMatches VALIDATION_ERROR, ['bulkDelete', 'WidgetsToDelete']
    }

    void bulkDeleteAndUpdate_missingParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createWidgetDefinitionWithPWD(admin1)

        when:
        controller.bulkDeleteAndUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseStringMatches VALIDATION_ERROR, ['bulkDeleteAndUpdate', 'WidgetsToDelete']
    }

    void bulkUpdate_missingParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createWidgetDefinitionWithPWD(admin1)

        when:
        controller.bulkUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseStringMatches VALIDATION_ERROR, ['bulkUpdate', 'WidgetsToUpdate']
    }

    void list_byWidgetName_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        createWidgetDefinitionWithPWD(admin1)

        when:
        params([widgetName: '1'])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        responseJson.size() == 0
    }

    @Ignore
    void create_notAuthorized() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        params([guid      : widgetDef.widgetGuid,
                personId  : "${user1.id}",
                windowname: "true"])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        false
        //assert "\"Error during create: You are not authorized to access this entity. You are not authorized to create widgets for other users.\"".equals(controller.response.contentAsString)
    }

    @Ignore
    void create_duplicateWidget_notAuthorized() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid      : widgetDef.widgetGuid,
                windowname: "true"])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        false
        //assert "\"Error during create: You are not authorized to access this entity. You are not authorized to create widgets for other users.\"".equals(controller.response.contentAsString)
    }

    void create_byGuid() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        params([guid    : widgetDef.widgetGuid,
                personId: admin1.id])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            value.namespace == widgetDef.displayName
            path == widgetDef.widgetGuid
        }
    }

    void create_byGuid_userNotFound() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        params([guid    : widgetDef.widgetGuid,
                personId: -1])

        controller.create()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseStringMatches CREATE_PERSON_NOT_FOUND, -1
    }

    void create_byGuid_forOtherUser_notAuthorized() {
        given:
        setupUsers()
        loggedInAs user1

        def widgetDef = createWidgetDefinition()

        when:
        params([guid    : widgetDef.widgetGuid,
                personId: user2.id])

        controller.create()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED

        responseString == CREATE_NOT_AUTHORIZED
    }

    void show_byGuid() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid: widgetDef.widgetGuid])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }
    }

    void show_byGuid_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        params([guid: widgetDef.widgetGuid])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseStringMatches SHOW_WIDGET_NOT_FOUND, widgetDef.widgetGuid
    }

    void show_byGuidAndUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid         : widgetDef.widgetGuid,
                universalName: widgetDef.universalName])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }
    }

    void show_byGuidAndUniversalName_missingUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid: widgetDef.universalName])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseStringMatches(SHOW_WIDGET_NOT_FOUND, widgetDef.universalName)
    }

    void show_byUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([universalName: widgetDef.universalName])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }
    }

    void list_bySimilarWidgetName() {
        given:
        setupUsers()
        loggedInAs admin1

        def widget1 = createWidgetDefinitionWithPWD(admin1, [displayName: 'Widget 1', pwdPosition: 1])
        def widget2 = createWidgetDefinitionWithPWD(admin1, [displayName: 'Widget 2', pwdPosition: 2])

        when:
        params([widgetName: '%Widget%'])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        responseJson*.value.namespace == [widget2.displayName, widget1.displayName]
    }

    void update() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition([displayName: 'Widget A'])
        def personWidgetDef = createPersonWidgetDefinition(admin1, widgetDef)

        when:
        personWidgetDef.widgetDefinition.displayName = 'Widget B'

        params([guid    : personWidgetDef.widgetDefinition.widgetGuid,
                personId: admin1.id])

        controller.update()

        then:
        responseStatus == HttpStatus.OK

        responseJson.value.namespace == 'Widget B'
    }

    void update_widgetGuidNotFound() {
        given:
        setupUsers()
        loggedInAs admin1

        createWidgetDefinitionWithPWD(admin1)

        when:
        def fakeGuid = UUID.randomUUID().toString()

        params([guid     : fakeGuid,
                persionId: admin1.id])

        controller.update()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseStringMatches UPDATE_WIDGET_NOT_FOUND, fakeGuid
    }

    void delete_byWidgetGuidAndUsername() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid        : widgetDef.widgetGuid,
                username    : admin1.username,
                adminEnabled: true])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }

        and: "PersonWidgetDefinition has been deleted"
        PersonWidgetDefinition.findByWidgetDefinitionAndPerson(widgetDef, admin1) == null
    }

    void delete_byWidgetGuidAndPersonId() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid        : widgetDef.widgetGuid,
                personId    : admin1.id,
                adminEnabled: true])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }

        and: "PersonWidgetDefinition has been deleted"
        PersonWidgetDefinition.findByWidgetDefinitionAndPerson(widgetDef, admin1) == null
    }

    void delete_byWidgetGuid() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinitionWithPWD(admin1)

        when:
        params([guid: widgetDef.widgetGuid])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == widgetDef.widgetGuid
            value.namespace == widgetDef.displayName
        }

        and: "PersonWidgetDefinition has been deleted"
        PersonWidgetDefinition.findByWidgetDefinitionAndPerson(widgetDef, admin1) == null
    }

}
