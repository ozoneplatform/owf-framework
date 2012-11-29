package ozone.owf.grails.test.integration

import grails.converters.JSON;
import ozone.owf.grails.controllers.StackController
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetType

class StackControllerTests extends OWFGroovyTestCase {
    
    def domainMappingService
    def stackService
    def stackController
    def stackIds = []
    
    protected void setUp() {
        super.setUp()
        
        def stack1 = ozone.owf.grails.domain.Stack.build(name: 'Stack One', description: 'Stack One description', stackContext: 'one', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack1.addToGroups(Group.build(name: 'Group1', automatic: false, status: 'active', stackDefault: true))
        def stack2 = ozone.owf.grails.domain.Stack.build(name: 'Stack Two', description: 'Stack Two description', stackContext: 'two', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack2.addToGroups(Group.build(name: 'Group2', automatic: false, status: 'active', stackDefault: true))
        stackIds = [stack1.id, stack2.id]
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testList() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.list()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        
        assertEquals 2, resp.results
        assertEquals 'Stack One', resp.data[0].name
        assertEquals 'Stack One description', resp.data[0].description
        assertEquals 'one', resp.data[0].stackContext
        assertEquals 'http://www.images.com/theimage.png', resp.data[0].imageUrl
        assertEquals 'http://www.descriptors.com/thedescriptor', resp.data[0].descriptorUrl
    }
    
    void testCreate() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                name: 'Stack Three',
                description: 'Stack Three description',
                stackContext: 'three',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        stackController.createOrUpdate()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
        assertEquals 'Stack Three', resp.data[0].name
        assertEquals 'Stack Three description', resp.data[0].description
        assertEquals 'three', resp.data[0].stackContext
        assertEquals 'http://www.images.com/theimage.png', resp.data[0].imageUrl
    }
    
    void testUpdate() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                id: ${stackIds[0]},
                name: 'The Updated Stack',
                description: 'This is the Stack description',
                stackContext: 'thestack',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        stackController.createOrUpdate()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
        assertEquals 'The Updated Stack', resp.data[0].name
    }
    
    void testDelete() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                id: ${stackIds[0]}
            }"""
        stackController.params.adminEnabled = true
        stackController.delete()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
    }
    
    void testExport() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)

        def standardWidgetType = WidgetType.build(name: 'standard')

        def widget1 = WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: 'widget1', widgetTypes: [standardWidgetType])
        def widget2 = WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: 'widget2', widgetTypes: [standardWidgetType])
        
        def stackDashboard1 = Dashboard.build(alteredByAdmin: false, guid: java.util.UUID.randomUUID(),
            locked: false, isdefault: false, name: 'Stack Dashboard1', layoutConfig: """{
                    "cls": "hbox",
                    "items":[{
                        "xtype": "tabbedpane",
                        "flex": 1,
                        "height": "100%",
                        "items": [],
                        "paneType": "desktoppane",
                        "widgets": [{
                            "widgetGuid":"${widget1.widgetGuid}"
                        }],
                        "defaultSettings": {}
                    },{
                        "xtype": "desktoppane",
                        "flex": 1,
                        "height": "100%",
                        "items": [],
                        "paneType": "desktoppane",
                        "widgets": [{
                            "widgetGuid":"${widget1.widgetGuid}"
                        },{
                            "widgetGuid":"${widget2.widgetGuid}"
                        },{
                            "widgetGuid":"${widget1.widgetGuid}"
                        }],
                        "defaultSettings": {}
                    }],
                    "xtype":"container", 
                    "layout":[{
                        "align":"stretch", 
                        "type":"hbox"
                    }], 
                    "flex":3
                }""", description: 'This is a stack dashboard.')

        def stackDashboard2 = Dashboard.build(alteredByAdmin: false, guid: java.util.UUID.randomUUID(),
            locked: false, isdefault: false, name: 'Stack Dashboard2', layoutConfig: """{
                    "xtype": "tabbedpane",
                    "flex": 1,
                    "height": "100%",
                    "items": [],
                    "paneType": "desktoppane",
                    "widgets": [{
                        "widgetGuid":"${widget2.widgetGuid}"
                    }],
                    "defaultSettings": {}
                }""", description: 'This is a stack dashboard.')

        def stack1 = Stack.findById(stackIds[0])

        domainMappingService.createMapping(stack1.findStackDefaultGroup(), RelationshipType.owns, stackDashboard1)
        domainMappingService.createMapping(stack1.findStackDefaultGroup(), RelationshipType.owns, stackDashboard2)

        def filename = 'test'
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.id = stackIds[0]
        stackController.params.filename = filename

        stackController.export()
        
        def resp = stackController.response
        assertEquals "attachment; filename=" + filename + ".html", resp.getHeader("Content-disposition")
        assertNotNull resp.getContentAsString()
    }
    
    void testFailedExportNotAdmin() {

        def filename = 'test'
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.id = stackIds[0]
        stackController.params.filename = filename

        stackController.export()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertEquals false, resp.success
        assertEquals "You are not authorized to access this entity. You must be an admin", resp.errorMsg
    }
    
    void testFailedExport() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)

        def filename = 'test'
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.id = -1 //Invalid id, should fail
        stackController.params.filename = filename

        stackController.export()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertEquals false, resp.success
    }
	
	void testImport() {
		
		loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def widgetGuid = java.util.UUID.randomUUID()
		def dashboardGuid = java.util.UUID.randomUUID()
		def fileJson = """{
		"widgets": [
	      {
	         "universalName": null,
	         "visible": true,
	         "defaultTags": [],
	         "imageUrlSmall": "http://www.image.com/theimage.png",
	         "imageUrlLarge": "http://www.image.com/theimage.png",
	         "singleton": false,
	         "width": 540,
	         "widgetVersion": "1.0",
	         "intents": {
	            "send": [],
	            "receive": []
	         },
	         "height": 440,
	         "widgetUrl": "http://www.widget.com/widget1.html",
	         "description": "This is my widget description",
	         "background": false,
	         "widgetTypes": ["standard"],
	         "widgetGuid": "$widgetGuid",
	         "displayName": "widget1",
	         "descriptorUrl": null
	      }],
		"description": "This is my stack description.",
		"name": "Stack1",
		"stackContext": "stack1",
		"dashboards": [{
			"layoutConfig": {
                    "xtype": "tabbedpane",
                    "flex": 1,
                    "height": "100%",
                    "items": [],
                    "paneType": "desktoppane",
                    "widgets": [{
                        "widgetGuid":"$widgetGuid"
                    }],
                    "defaultSettings": {}
                },
			"guid": "$dashboardGuid",
	        "isdefault": false,
	        "dashboardPosition": 5,
	        "description": "This is a stack dashboard.",
	        "name": "Stack Dash 1",
	        "locked": false
		}]
		}"""

		stackController = new StackController()
		stackController.stackService = stackService
		stackController.params.data = fileJson
		stackController.params.descriptorUrl = "http://www.stack.com/descriptor.html"
		
		stackController.importStack()
		
		def resp = JSON.parse(stackController.response.contentAsString)
		assertEquals 'Stack1', resp.name	
	}
}