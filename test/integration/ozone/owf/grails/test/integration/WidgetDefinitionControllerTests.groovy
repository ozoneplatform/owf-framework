package ozone.owf.grails.test.integration

import grails.converters.JSON;

import ozone.owf.grails.controllers.WidgetDefinitionController
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.services.DomainMappingService

class WidgetDefinitionControllerTests extends OWFGroovyTestCase {
	
    def widgetDefinitionService
    def controller
	
    void createWidgetDefinitionForTest() {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlLarge : '../images/blue/icons/widgetIcons/widgetC.gif',
            imageUrlSmall : '../images/blue/icons/widgetContainer/widgetCsm.gif',
            widgetGuid : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            universalName : 'com.company.widget.universalname',
            widgetVersion : '1.0',
            widgetUrl : '../examples/fake-widgets/widget-c.html',
            width : 980
        )

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDefinition, 
        	Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2]),
        	[intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDefinition, 
        	Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3]),
        	[intentDataType1, intentDataType3], false, true)
        widgetDefinition.widgetDefinitionIntents = [widgetDefinitionIntent2, widgetDefinitionIntent1]
	}
	
    def createWidgetDefinitionForTest(widgetName, imageUrlLarge, imageUrlSml, guid, widgetUrl, descriptorUrl, uname) {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/' + descriptorUrl,
            displayName : widgetName,
            height : 740,
            imageUrlLarge : '../images/blue/icons/widgetIcons/' + imageUrlLarge,
            imageUrlSmall : '../images/blue/icons/widgetContainer/' + imageUrlSml,
            widgetVersion : '1.0',
            widgetGuid : guid,
            universalName : uname,
            widgetUrl : '../examples/fake-widgets/' + widgetUrl,
            width : 980
        )

		widgetDefinition.save(flush:true)
		return widgetDefinition
	}

	def createWidgetDefinitionIntentForTest(widgetDefinition, intent, dataTypes, send, receive) {
		def widgetDefinitionIntent = WidgetDefinitionIntent.build(
			widgetDefinition : widgetDefinition,
			intent : intent,
			dataTypes : dataTypes,
			send : send,
			receive : receive)

		widgetDefinitionIntent.save(flush:true)
	}
		
    void testShowForExistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest()
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.show()

        assertNotNull WidgetDefinition.findByDisplayNameAndWidgetGuid('Widget C', '0c5435cf-4021-4f2a-ba69-dde451d12551')
        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).value.namespace
        assertEquals '0c5435cf-4021-4f2a-ba69-dde451d12551', JSON.parse(controller.response.contentAsString).path
    }
	
    void testShowForNonexistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest()
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12559'
        controller.show()
		
        assertNull WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12559')
    }
	
    void testListForWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')
        createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html','widget-d.json', 'com.example.widgetd')
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.widgetName = '%Widget%'
        controller.list()

        assertEquals 2, JSON.parse(controller.response.contentAsString).data.size()
        assertTrue(['Widget C', 'Widget D'] as Set == [JSON.parse(controller.response.contentAsString).data[0].value.namespace,
                JSON.parse(controller.response.contentAsString).data[1].value.namespace] as Set)
        assertTrue(['0c5435cf-4021-4f2a-ba69-dde451d12551', '0c5435cf-4021-4f2a-ba69-dde451d12552'] as Set == 
                [JSON.parse(controller.response.contentAsString).data[0].path,
                JSON.parse(controller.response.contentAsString).data[1].path] as Set)
        assertTrue(['../examples/fake-widgets/widget-c.json', '../examples/fake-widgets/widget-d.json'] as Set == 
                [JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl,
                JSON.parse(controller.response.contentAsString).data[1].value.descriptorUrl] as Set)
    }
	
    void testListForWidgetDefinitionByUniversalName() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		
        createWidgetDefinitionForTest()
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.universalName = 'com.company.widget.universalname'
        controller.list()

        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals 'com.company.widget.universalname', JSON.parse(controller.response.contentAsString).data[0].value.universalName
        assertEquals '../examples/fake-widgets/widget-c.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
    }
	
	void testListForWidgetDefinitionByIntentAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
			'widget-c.json', 'com.example.widgetc')
		def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
			'widget-d.json', 'com.example.widgetd')
		def widgetDef3 = createWidgetDefinitionForTest('Widget E','widgetE.gif','widgetEsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12553','widget-e.html',
			'widget-e.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")
        def intentDataType4 = IntentDataType.build(dataType: "Id")

		def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2])
		def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3])
		def intent3 = Intent.build(action: "Zoom", dataTypes: [intentDataType1, intentDataType3])
		def intent4 = Intent.build(action: "Open", dataTypes: [intentDataType4])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent1, [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent2, [intentDataType3, intentDataType2], false, true)
        def widgetDefinitionIntent3 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent4, [intentDataType3], false, true)
        def widgetDefinitionIntent4 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent3, [intentDataType3], false, true)
        def widgetDefinitionIntent5 = createWidgetDefinitionIntentForTest(widgetDef3, 
        	intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent6 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent3, [intentDataType1], true, false)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1, widgetDefinitionIntent2, widgetDefinitionIntent6]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent3, widgetDefinitionIntent4]
        widgetDef3.widgetDefinitionIntents = [widgetDefinitionIntent5]
		
		controller = new WidgetDefinitionController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"
		
		controller.params.intent = "{'action':'Pan'}"
		controller.list()

		assertEquals 2, JSON.parse(controller.response.contentAsString).data.size()
        assertTrue(['Widget C', 'Widget E'] as Set == [JSON.parse(controller.response.contentAsString).data[0].value.namespace,
                JSON.parse(controller.response.contentAsString).data[1].value.namespace] as Set)
	}
	
	void testListForWidgetDefinitionWithNonExistentIntentAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif',
			'0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')
		def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif',
			'0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html','widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

		def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2])
		def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent1, [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent2, [intentDataType3, intentDataType1, intentDataType2], true, false)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent2]
		
		controller = new WidgetDefinitionController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"
		
		controller.params.intent = "{'action':'Open'}"
		controller.list()

		assertEquals 0, JSON.parse(controller.response.contentAsString).data.size()
	}
	
	void testListForWidgetDefinitionByIntentDataType() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

		def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
			'widget-c.json', 'com.example.widgetc')
		def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
			'widget-d.json', 'com.example.widgetd')
		def widgetDef3 = createWidgetDefinitionForTest('Widget E','widgetE.gif','widgetEsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12553','widget-e.html',
			'widget-e.json', 'com.example.widgete')
		def widgetDef4 = createWidgetDefinitionForTest('Widget F','widgetF.gif','widgetFsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12554','widget-f.html',
			'widget-f.json', 'com.example.widgetf')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")
        def intentDataType4 = IntentDataType.build(dataType: "Id")

		def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])
		def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3])
		def intent3 = Intent.build(action: "Zoom", dataTypes: [intentDataType1, intentDataType3])
		def intent4 = Intent.build(action: "Open", dataTypes: [intentDataType4])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent1, [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent2, [intentDataType3, intentDataType2], false, true)
        def widgetDefinitionIntent3 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent4, [intentDataType3], false, true)
        def widgetDefinitionIntent4 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent3, [intentDataType3], false, true)
        def widgetDefinitionIntent5 = createWidgetDefinitionIntentForTest(widgetDef3, 
        	intent4, [intentDataType1], true, false)
        def widgetDefinitionIntent6 = createWidgetDefinitionIntentForTest(widgetDef4, 
        	intent2, [intentDataType1, intentDataType2, intentDataType3], true, false)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1, widgetDefinitionIntent2]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent3, widgetDefinitionIntent4]
        widgetDef3.widgetDefinitionIntents = [widgetDefinitionIntent5]
		
		controller = new WidgetDefinitionController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"
		
		controller.params.intent = "{'dataType':'Address'}"
		controller.list()

		assertEquals 3, JSON.parse(controller.response.contentAsString).data.size()
        assertTrue(['Widget C', 'Widget F', 'Widget E'] as Set == [JSON.parse(controller.response.contentAsString).data[0].value.namespace,
                JSON.parse(controller.response.contentAsString).data[1].value.namespace,
                JSON.parse(controller.response.contentAsString).data[2].value.namespace] as Set)
	}
	
	void testListForWidgetDefinitionByIntentDataTypeAndAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

		def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
			'widget-c.json', 'com.example.widgetc')
		def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
			'widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")

		def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])
		def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType1, intentDataType2])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent2, [intentDataType2], false, true)
        def widgetDefinitionIntent3 = createWidgetDefinitionIntentForTest(widgetDef2, 
        	intent2, [intentDataType1, intentDataType2], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1, widgetDefinitionIntent2]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent3]
		
		controller = new WidgetDefinitionController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"
		
        controller.params.intent = "{'action':'Plot','dataType':'Address'}"
		controller.list()

		assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
		assertEquals 'Widget D', JSON.parse(controller.response.contentAsString).data[0].value.namespace
		assertEquals 'Plot', JSON.parse(controller.response.contentAsString).data[0].value.intents.receive[0].action
	}
    
    void testListForWidgetDefinitionByIntentSend() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")

        def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])
        def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType1])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent2, [intentDataType1], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent2]
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.intent = "{'send':'true'}"
        controller.list()

        assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals 'Pan', JSON.parse(controller.response.contentAsString).data[0].value.intents.send[0].action
    }
    
    void testListForWidgetDefinitionByIntentReceive() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")

        def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])
        def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType1])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent2, [intentDataType1], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent2]
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.intent = "{'receive':'true'}"
        controller.list()

        assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
        assertEquals 'Widget D', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals 'Plot', JSON.parse(controller.response.contentAsString).data[0].value.intents.receive[0].action
    }
    
    void testListForWidgetDefinitionByIntentSendAndAction() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")

        def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent1, [intentDataType1], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent2]
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.intent = "{'action':'Pan','send':'true'}"
        controller.list()

        assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
    }
    
    void testListForWidgetDefinitionByIntentReceiveAndAction() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')

        def intentDataType1 = IntentDataType.build(dataType: "Address")

        def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent1, [intentDataType1], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent2]
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.intent = "{'action':'Pan','receive':'true'}"
        controller.list()

        assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
        assertEquals 'Widget D', JSON.parse(controller.response.contentAsString).data[0].value.namespace
    }
    
    void testListForWidgetDefinitionByIntentSendDataTypeAndAction() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')
        def widgetDef3 = createWidgetDefinitionForTest('Widget E','widgetE.gif','widgetEsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12553','widget-e.html',
            'widget-e.json', 'com.example.widgete')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")

        def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2])
        def intent2 = Intent.build(action: "Zoom", dataTypes: [intentDataType1, intentDataType2])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent1, [intentDataType1], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef1, 
            intent2, [intentDataType1], true, false)
        def widgetDefinitionIntent3 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent1, [intentDataType1, intentDataType2], false, true)
        def widgetDefinitionIntent4 = createWidgetDefinitionIntentForTest(widgetDef2, 
            intent2, [intentDataType1, intentDataType2], false, true)
        def widgetDefinitionIntent5 = createWidgetDefinitionIntentForTest(widgetDef3, 
            intent1, [intentDataType2], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1]
        widgetDef2.widgetDefinitionIntents = [widgetDefinitionIntent3, widgetDefinitionIntent4]
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.intent = "{'action':'Pan','dataType':'Address','receive':'true'}"
        controller.list()

        assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
        assertEquals 'Widget D', JSON.parse(controller.response.contentAsString).data[0].value.namespace
    }
    
    void testListForWidgetDefinitionByGroupIds() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')
        def widgetDef3 = createWidgetDefinitionForTest('Widget E','widgetE.gif','widgetEsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12553','widget-e.html',
            'widget-e.json', 'com.example.widgete')

        def group1 = Group.build(name:'Group1',automatic:false,status:'active')
        def group2 = Group.build(name:'Group2',automatic:false,status:'active')
        def group3 = Group.build(name:'Group3',automatic:false,status:'active')

        def domainMappingService = new DomainMappingService()
        domainMappingService.createMapping(group1, RelationshipType.owns, widgetDef1)
        domainMappingService.createMapping(group1, RelationshipType.owns, widgetDef2)
        domainMappingService.createMapping(group1, RelationshipType.owns, widgetDef3)
        domainMappingService.createMapping(group2, RelationshipType.owns, widgetDef2)
        domainMappingService.createMapping(group3, RelationshipType.owns, widgetDef1)
        domainMappingService.createMapping(group3, RelationshipType.owns, widgetDef3)

        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.groupIds = "['" + group1.id + "','" + group3.id + "']"
        controller.list()

        assertEquals 2, JSON.parse(controller.response.contentAsString).data.size()
        assertTrue(['Widget C', 'Widget E'] as Set == [JSON.parse(controller.response.contentAsString).data[0].value.namespace,
                JSON.parse(controller.response.contentAsString).data[1].value.namespace] as Set)
    }
    
    void testListForWidgetDefinitionByTags() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html',
            'widget-c.json', 'com.example.widgetc')
        def widgetDef2 = createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html',
            'widget-d.json', 'com.example.widgetd')
        def widgetDef3 = createWidgetDefinitionForTest('Widget E','widgetE.gif','widgetEsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12553','widget-e.html',
            'widget-e.json', 'com.example.widgete')

        widgetDef1.setTags([[name:'tag1',visible:true,position:-1,editable:true],[name:'tag2',visible:true,position:-1,editable:true]])
        widgetDef2.setTags([[name:'tag3',visible:true,position:-1,editable:true],[name:'tag1',visible:true,position:-1,editable:true]])
        widgetDef3.setTags([[name:'tag1',visible:true,position:-1,editable:true],[name:'tag2',visible:true,position:-1,editable:true],
            [name:'tag3',visible:true,position:-1,editable:true]])

        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.tags = "['tag1','tag3']"
        controller.list()

        assertEquals 2, JSON.parse(controller.response.contentAsString).data.size()
        assertTrue(['Widget D', 'Widget E'] as Set == [JSON.parse(controller.response.contentAsString).data[0].value.namespace,
                JSON.parse(controller.response.contentAsString).data[1].value.namespace] as Set)
    }
	
	void testCreateWidgetDefinition() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		
		controller = new WidgetDefinitionController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"
		
		controller.params.displayName = 'Widget C'
		controller.params.widgetUrl = '../examples/fake-widgets/widget-c.html'
		controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetCsm.gif'
		controller.params.imageUrlLarge = '../images/blue/icons/widgetIcons/widgetC.gif'
		controller.params.width = 980
		controller.params.height = 740
		controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetVersion = '1.0'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-c.json'
		controller.params.intents = [send:[[action: "Pan", dataTypes: ["Address", "City"]]],
			receive:[[action: "Plot", dataTypes: ["City"]]]]

		controller.create()
		
		assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
		assertEquals '0c5435cf-4021-4f2a-ba69-dde451d12551', JSON.parse(controller.response.contentAsString).data[0].path
		assertEquals '../examples/fake-widgets/widget-c.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
		assertEquals 'Pan', JSON.parse(controller.response.contentAsString).data[0].value.intents.send[0].action
		assertEquals 'City', JSON.parse(controller.response.contentAsString).data[0].value.intents.receive[0].dataTypes[0]
	}
    
    void testCreateWidgetDefinitionWithDescriptorFilenameAndNoUniversalName() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.displayName = 'Widget C'
        controller.params.widgetUrl = '../examples/fake-widgets/widget-c.html'
        controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetCsm.gif'
        controller.params.imageUrlLarge = '../images/blue/icons/widgetIcons/widgetC.gif'
        controller.params.width = 980
        controller.params.height = 740
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetVersion = '1.0'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-c.json'

        controller.create()
        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals '0c5435cf-4021-4f2a-ba69-dde451d12551', JSON.parse(controller.response.contentAsString).data[0].path
        assertEquals '../examples/fake-widgets/widget-c.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assertTrue JSON.parse(controller.response.contentAsString).data[0].value.universalName.equals(null)
    }
    
    void testCreateWidgetDefinitionWithDescriptorFilenameAndEmptyUniveralName() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.displayName = 'Widget C'
        controller.params.widgetUrl = '../examples/fake-widgets/widget-c.html'
        controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetCsm.gif'
        controller.params.imageUrlLarge = '../images/blue/icons/widgetIcons/widgetC.gif'
        controller.params.width = 980
        controller.params.height = 740
        controller.params.universalName = ''
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetVersion = '1.0'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-c.json'

        controller.create()
        assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals '0c5435cf-4021-4f2a-ba69-dde451d12551', JSON.parse(controller.response.contentAsString).data[0].path
        assertEquals '../examples/fake-widgets/widget-c.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assertTrue JSON.parse(controller.response.contentAsString).data[0].value.universalName.equals(null)
    }
	
    void testUpdateWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        
        def widgetDef1 = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif',
        	'0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

		def intent1 = Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2])
		def intent2 = Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3])

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent1, [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDef1, 
        	intent2, [intentDataType3, intentDataType2], false, true)

        widgetDef1.widgetDefinitionIntents = [widgetDefinitionIntent1, widgetDefinitionIntent2]
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetVersion = '1.0'
        controller.params.displayName = 'Widget D'
        controller.params.widgetUrl = '../examples/fake-widgets/widget-d.html'
        controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetDsm.gif'
        controller.params.imageUrlLarge	= '../images/blue/icons/widgetIcons/widgetD.gif'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-d.json'
		controller.params.intents = [send:[[action:"TestAction1",dataTypes:["Test1"]]],receive:[]]
		
        controller.update()

		assertEquals 'Widget D', JSON.parse(controller.response.contentAsString).data[0].value.namespace
		assertEquals '../examples/fake-widgets/widget-d.html', JSON.parse(controller.response.contentAsString).data[0].value.url
		assertEquals '../images/blue/icons/widgetContainer/widgetDsm.gif', JSON.parse(controller.response.contentAsString).data[0].value.headerIcon
		assertEquals '../images/blue/icons/widgetIcons/widgetD.gif', JSON.parse(controller.response.contentAsString).data[0].value.image
		assertEquals '../examples/fake-widgets/widget-d.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
		assertEquals 'TestAction1', JSON.parse(controller.response.contentAsString).data[0].value.intents.send[0].action
		assertEquals 1, JSON.parse(controller.response.contentAsString).data[0].value.intents.send.size()
		assertEquals 0, JSON.parse(controller.response.contentAsString).data[0].value.intents.receive.size()
		assertNotSame 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertNotSame '../examples/fake-widgets/widget-c.json', JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
		assertNotSame '../images/blue/icons/widgetContainer/widgetCsm.gif', JSON.parse(controller.response.contentAsString).data[0].value.headerIcon
		assertNotSame '../images/blue/icons/widgetIcons/widgetC.gif', JSON.parse(controller.response.contentAsString).data[0].value.image
	}
	
    void testDeleteExistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        assertNotNull WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')

        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.delete()

        assertEquals '0c5435cf-4021-4f2a-ba69-dde451d12551', JSON.parse(controller.response.contentAsString).data[0].id
        assertNull WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }

    void testDeleteNonexistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')
		
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
		
        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12558'
        controller.delete()

        //assertEquals '"Error during delete: The requested entity was not found Widget Definition 0c5435cf-4021-4f2a-ba69-dde451d12558 not found."', controller.response.contentAsString
        assertNotNull WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }

    /*void testDeleteWidgetDefinitionForUnauthorizedUser() {
        loginAsUsernameAndRole('testUser1', ERoleAuthority.ROLE_USER.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html')
        
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"
        
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.delete()
        
        assertEquals '"Error during delete: You are not authorized to access this entity. You are not authorized to delete widget definitions."', controller.response.contentAsString
        assertNotNull WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }*/
}
