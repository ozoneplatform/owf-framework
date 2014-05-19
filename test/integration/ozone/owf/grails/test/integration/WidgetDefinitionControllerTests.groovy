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
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.services.DomainMappingService

class WidgetDefinitionControllerTests extends OWFGroovyTestCase {

    def widgetDefinitionService
    def controller

    void createWidgetDefinitionForTest() {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/widgetC.gif',
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

    def createWidgetDefinitionForTest(widgetName, imageUrlMedium, imageUrlSml, guid, widgetUrl, descriptorUrl, uname, widgetTypes = null) {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/' + descriptorUrl,
            displayName : widgetName,
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/' + imageUrlMedium,
            imageUrlSmall : '../images/blue/icons/widgetContainer/' + imageUrlSml,
            widgetVersion : '1.0',
            widgetGuid : guid,
            universalName : uname,
            widgetUrl : '../examples/fake-widgets/' + widgetUrl,
            width : 980,
            widgetTypes: widgetTypes
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
        //Test the max decription size of 4000 characters
        controller.params.description = "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"
		controller.params.widgetUrl = '../examples/fake-widgets/widget-c.html'
		controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetCsm.gif'
		controller.params.imageUrlMedium = '../images/blue/icons/widgetIcons/widgetC.gif'
		controller.params.width = 980
		controller.params.height = 740
		controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetVersion = '1.0'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-c.json'
		controller.params.intents = [send:[[action: "Pan", dataTypes: ["Address", "City"]]],
			receive:[[action: "Plot", dataTypes: ["City"]]]]

		controller.create()

		assertEquals 'Widget C', JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assertEquals 4000, JSON.parse(controller.response.contentAsString).data[0].value.description.length()
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
        controller.params.imageUrlMedium = '../images/blue/icons/widgetIcons/widgetC.gif'
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
        controller.params.imageUrlMedium = '../images/blue/icons/widgetIcons/widgetC.gif'
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
        controller.params.imageUrlMedium	= '../images/blue/icons/widgetIcons/widgetD.gif'
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

    void testHasMarketplace() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def marketplaceType = [WidgetType.findByName('marketplace')]
        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        // verify that there is no marketplace widget definition
        assertEquals(false, controller.widgetDefinitionService.hasMarketplace().data)

        // create marketplace1 instance then verify that it has a marketplace widget definition
        createWidgetDefinitionForTest('Marketplace','marketplace.gif','marketplacesm.gif','88888888-4021-4f2a-ba69-dde451d12551','marketplace.html','marketplace.json', 'com.example.marketplace', marketplaceType)
        assertEquals(true, controller.widgetDefinitionService.hasMarketplace().data)

        // delete the marketplace widget then verify it doesn't have a marketplace widget definition
        controller.params.id = '88888888-4021-4f2a-ba69-dde451d12551'
        controller.delete()
        assertEquals(false, controller.widgetDefinitionService.hasMarketplace().data)
    }
}
