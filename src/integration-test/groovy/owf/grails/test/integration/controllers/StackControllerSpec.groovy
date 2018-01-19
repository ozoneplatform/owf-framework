package owf.grails.test.integration.controllers

import spock.lang.Ignore
import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.StackController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack

import static owf.grails.test.integration.DomainBuilders.createStackWithGroup
import static owf.grails.test.integration.JsonUtil.asJsonString


@Integration
@Rollback
class StackControllerSpec extends Specification
        implements ControllerTestMixin<StackController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void list() {
        given:
        setupUsers()
        loggedInAs admin1

        def stack1 = createStackWithGroup(admin1, "One")
        def stack2 = createStackWithGroup(admin1, "Two")

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            results == 2
            data.size() == 2
            data[0].name == stack1.name
            data[1].name == stack2.name
        }
    }

    void create() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def newStack = [name        : 'Stack',
                        description : 'Stack Description',
                        stackContext: 'stack_one']

        params([data: asJsonString(newStack)])

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            data.size() == 1
            data[0].name == newStack.name
            data[0].description == newStack.description
            data[0].stackContext == newStack.stackContext
        }
    }

    void update() {
        given:
        setupUsers()
        loggedInAs admin1

        def stack1 = createStackWithGroup(admin1, "One")

        when:
        def stackUpdate = [id          : stack1.id,
                           name        : 'Stack Updated',
                           description : 'Description Updated',
                           stackContext: 'stack_foo']

        params([data: asJsonString(stackUpdate)])

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            data.size() == 1
            data[0].id == stack1.id
            data[0].name == stackUpdate.name
            data[0].description == stackUpdate.description
            data[0].stackContext == stackUpdate.stackContext
        }
    }

    @Ignore
    void delete() {
        given:
        setupUsers()
        loggedInAs admin1

        def stack1 = createStackWithGroup(admin1, "One")

        assert Stack.count() == 1

        when:
        params([data        : /{ "id": $stack1.id }/,
                adminEnabled: true])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        responseJson.success

        and:
        Stack.count() == 0
    }

    void export_whenNotAdmin_shouldFail() {
        given:
        setupUsers()
        loggedInAs user1

        def stack1 = createStackWithGroup(admin1, "One")

        when:
        params([id      : stack1.id,
                filename: 'filename'])

        controller.export()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED

        with(responseJson) {
            !success
            errorMsg == "You are not authorized to access this entity. You must be an admin"
        }
    }

    void export_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([id      : 10000,
                filename: 'filename'])

        controller.export()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        with(responseJson) {
            !success
            errorMsg =~ /^The requested entity was not found/
        }
    }

// TODO:
//    void testExport() {
//
//        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
//
//        def standardWidgetType = WidgetType.build(name: 'standard')
//
//        def widget1 = WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: 'widget1', widgetTypes: [standardWidgetType])
//        def widget2 = WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: 'widget2', widgetTypes: [standardWidgetType])
//
//        def stackDashboard1 = Dashboard.build(alteredByAdmin: false, guid: java.util.UUID.randomUUID(),
//                locked: false, isdefault: false, name: 'Stack Dashboard1', layoutConfig: """{
//                    "cls": "hbox",
//                    "items":[{
//                        "xtype": "tabbedpane",
//                        "flex": 1,
//                        "height": "100%",
//                        "items": [],
//                        "paneType": "desktoppane",
//                        "widgets": [{
//                            "widgetGuid":"${widget1.widgetGuid}"
//                        }],
//                        "defaultSettings": {}
//                    },{
//                        "xtype": "desktoppane",
//                        "flex": 1,
//                        "height": "100%",
//                        "items": [],
//                        "paneType": "desktoppane",
//                        "widgets": [{
//                            "widgetGuid":"${widget1.widgetGuid}"
//                        },{
//                            "widgetGuid":"${widget2.widgetGuid}"
//                        },{
//                            "widgetGuid":"${widget1.widgetGuid}"
//                        }],
//                        "defaultSettings": {}
//                    }],
//                    "xtype":"container",
//                    "layout":[{
//                        "align":"stretch",
//                        "type":"hbox"
//                    }],
//                    "flex":3
//                }""", description: 'This is a stack dashboard.')
//
//        def stackDashboard2 = Dashboard.build(alteredByAdmin: false, guid: java.util.UUID.randomUUID(),
//                locked: false, isdefault: false, name: 'Stack Dashboard2', layoutConfig: """{
//                    "xtype": "tabbedpane",
//                    "flex": 1,
//                    "height": "100%",
//                    "items": [],
//                    "paneType": "desktoppane",
//                    "widgets": [{
//                        "widgetGuid":"${widget2.widgetGuid}"
//                    }],
//                    "defaultSettings": {}
//                }""", description: 'This is a stack dashboard.')
//
//        def stack1 = Stack.findById(stackIds[0])
//
//        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard1)
//        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard2)
//
//        def filename = 'test'
//
//        stackController = new StackController()
//        stackController.stackService = stackService
//        stackController.request.contentType = "text/json"
//        stackController.params.id = stackIds[0]
//        stackController.params.filename = filename
//
//        stackController.export()
//
//        def resp = stackController.response
//        assert "attachment; filename=" + filename + ".html" == resp.getHeader("Content-disposition")
//        assert resp.getContentAsString() != null
//    }
//

// TODO:
//    void testImport() {
//
//        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
//
//        def widgetGuid = java.util.UUID.randomUUID()
//        def dashboardGuid = java.util.UUID.randomUUID()
//        def fileJson = """{
//		"widgets": [
//	      {
//	         "universalName": null,
//	         "visible": true,
//	         "imageUrlSmall": "http://www.image.com/theimage.png",
//	         "imageUrlMedium": "http://www.image.com/theimage.png",
//	         "singleton": false,
//	         "width": 540,
//	         "widgetVersion": "1.0",
//	         "intents": {
//	            "send": [],
//	            "receive": []
//	         },
//	         "height": 440,
//	         "widgetUrl": "http://www.widget.com/widget1.html",
//	         "description": "This is my widget description",
//	         "background": false,
//	         "mobileReady": false,
//	         "widgetTypes": ["standard"],
//	         "widgetGuid": "$widgetGuid",
//	         "displayName": "widget1",
//	         "descriptorUrl": null
//	      }],
//		"description": "This is my stack description.",
//		"name": "Stack1",
//		"stackContext": "stack1",
//		"dashboards": [{
//			"layoutConfig": {
//                    "xtype": "tabbedpane",
//                    "flex": 1,
//                    "height": "100%",
//                    "items": [],
//                    "paneType": "desktoppane",
//                    "widgets": [{
//                        "widgetGuid":"$widgetGuid"
//                    }],
//                    "defaultSettings": {}
//                },
//			"guid": "$dashboardGuid",
//	        "isdefault": false,
//	        "dashboardPosition": 5,
//	        "description": "This is a stack dashboard.",
//	        "name": "Stack Dash 1",
//	        "locked": false
//		}]
//		}"""
//
//        stackController = new StackController()
//        stackController.stackService = stackService
//        stackController.params.data = fileJson
//        stackController.params.descriptorUrl = "http://www.stack.com/descriptor.html"
//
//        stackController.importStack()
//
//        def resp = JSON.parse(stackController.response.contentAsString)
//        assert 'Stack1' == resp.name
//    }

}
