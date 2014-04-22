package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import grails.converters.JSON;

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.controllers.WidgetController

@TestMixin(IntegrationTestMixin)
class WidgetControllerTests extends OWFGroovyTestCase {

    def widgetDefinitionService
    def controller

    def createWidgetDefinitionForTest() {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlLarge : '../images/blue/icons/widgetIcons/widgetC.gif',
            imageUrlSmall : '../images/blue/icons/widgetContainer/widgetCsm.gif',
            widgetGuid : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            universalName : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            widgetVersion : '1.0',
            widgetUrl : '../examples/fake-widgets/widget-c.html',
            width : 980
        )

        return widgetDefinition
    }

    def createWidgetDefinitionForTest(widgetName, imageUrlLarge, imageUrlSml, guid, widgetUrl, descriptorUrl, universalName) {
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/' + descriptorUrl,
            displayName : widgetName,
            height : 740,
            imageUrlLarge : '../images/blue/icons/widgetIcons/' + imageUrlLarge,
            imageUrlSmall : '../images/blue/icons/widgetContainer/' + imageUrlSml,
            widgetVersion : '1.0',
            widgetGuid : guid,
            universalName : universalName,
            widgetUrl : '../examples/fake-widgets/' + widgetUrl,
            width : 980
        )

        return widgetDefinition
    }

    void testShowForExistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest()

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.show()

        assert null != WidgetDefinition.findByDisplayNameAndWidgetGuid('Widget C', '0c5435cf-4021-4f2a-ba69-dde451d12551')
        assert 'Widget C' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].path
    }

    void testShowForNonexistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest()

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12559'
        controller.show()

        assert null ==  WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12559')
    }

    void testListForWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')
        createWidgetDefinitionForTest('Widget D','widgetD.gif','widgetDsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12552','widget-d.html','widget-d.json', 'com.example.widgetd')

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.widgetName = '%Widget%'
        controller.list()

        assert 2 == JSON.parse(controller.response.contentAsString).data.size()
        assert 'Widget C' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert 'Widget D' == JSON.parse(controller.response.contentAsString).data[1].value.namespace
        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].path
        assert '0c5435cf-4021-4f2a-ba69-dde451d12552' == JSON.parse(controller.response.contentAsString).data[1].path
        assert '../examples/fake-widgets/widget-c.json' == JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assert '../examples/fake-widgets/widget-d.json' == JSON.parse(controller.response.contentAsString).data[1].value.descriptorUrl
    }

    void testCreateWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        controller = new WidgetController()
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

        controller.createOrUpdate()

        assert 'Widget C' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].path
        assert '../examples/fake-widgets/widget-c.json' == JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
    }

    void testCreateWidgetDefinitionWithDescriptorFilenameAndNoUniversalName() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        controller = new WidgetController()
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

        controller.createOrUpdate()
        assert 'Widget C' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].path
        assert '../examples/fake-widgets/widget-c.json' == JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assert JSON.parse(controller.response.contentAsString).data[0].value.universalName.equals(null)
    }

    void testCreateWidgetDefinitionWithDescriptorFilenameAndEmptyUniveralName() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        controller = new WidgetController()
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

        controller.createOrUpdate()
        assert 'Widget C' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].path
        assert '../examples/fake-widgets/widget-c.json' == JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assert JSON.parse(controller.response.contentAsString).data[0].value.universalName.equals(null)
    }

    void testUpdateWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def widgetDefinition = createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widgetDefinition,
            Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2]),
            [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widgetDefinition,
            Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3]),
            [intentDataType1, intentDataType3], false, true)

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.universalName = 'com.example.fakewidgetd'
        controller.params.widgetVersion = '1.0'
        controller.params.displayName = 'Widget D'
        controller.params.widgetUrl = '../examples/fake-widgets/widget-d.html'
        controller.params.imageUrlSmall = '../images/blue/icons/widgetContainer/widgetDsm.gif'
        controller.params.imageUrlLarge	= '../images/blue/icons/widgetIcons/widgetD.gif'
        controller.params.descriptorUrl = '../examples/fake-widgets/widget-d.json'
        controller.params.intents = JSON.parse('{"send":[{"action":"Graph","dataTypes":["application/html"]}],"receive":[{"action":"View","dataTypes":["text/html"]}]}')

        controller.createOrUpdate()

        assert 'Widget D' == JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert 'com.example.fakewidgetd' == JSON.parse(controller.response.contentAsString).data[0].value.universalName
        assert '../examples/fake-widgets/widget-d.html' == JSON.parse(controller.response.contentAsString).data[0].value.url
        assert '../images/blue/icons/widgetContainer/widgetDsm.gif' == JSON.parse(controller.response.contentAsString).data[0].value.headerIcon
        assert '../images/blue/icons/widgetIcons/widgetD.gif' == JSON.parse(controller.response.contentAsString).data[0].value.image
        assert '../examples/fake-widgets/widget-d.json' == JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
        assert '{"send":[{"action":"Graph" =="dataTypes":["application/html"]}],"receive":[{"action":"View","dataTypes":["text/html"]}]}', JSON.parse(controller.response.contentAsString).data[0].value.intents.toString()
        assert 'Widget C' != JSON.parse(controller.response.contentAsString).data[0].value.namespace
        assert '../examples/fake-widgets/widget-c.html' != JSON.parse(controller.response.contentAsString).data[0].value.url
        assert '../images/blue/icons/widgetContainer/widgetCsm.gif' != JSON.parse(controller.response.contentAsString).data[0].value.headerIcon
        assert '../images/blue/icons/widgetIcons/widgetC.gif' != JSON.parse(controller.response.contentAsString).data[0].value.image
        assert '../examples/fake-widgets/widget-c.json' != JSON.parse(controller.response.contentAsString).data[0].value.descriptorUrl
    }

    void testDeleteExistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        assert null != WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.delete()

        assert '0c5435cf-4021-4f2a-ba69-dde451d12551' == JSON.parse(controller.response.contentAsString).data[0].id
        assert null ==  WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }

    void testDeleteNonexistentWidgetDefinition() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12558'
        controller.delete()

        //assert '"Error during delete: The requested entity was not found Widget Definition 0c5435cf-4021-4f2a-ba69-dde451d12558 not found."' == controller.response.contentAsString
        assert null != WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }

    void testExport() {

        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)

        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html','widget-c.json', 'com.example.widgetc')

        def filename = 'test'

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.filename = filename
        controller.export()

        def resp = controller.response
        assert "attachment; filename=" + filename + ".html" == resp.getHeader("Content-disposition")
        assert null != resp.getContentAsString()
    }

    void testFailedExport() {

        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)

        def filename = 'test'

        controller = new WidgetController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.params.filename = filename
        controller.export()

        def resp = JSON.parse(controller.response.contentAsString.decodeHTML())
        assert false == resp.success
    }

    /*void testDeleteWidgetDefinitionForUnauthorizedUser() {
        loginAsUsernameAndRole('testUser1', ERoleAuthority.ROLE_USER.strVal)
        createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html')

        controller = new WidgetDefinitionController()
        controller.widgetDefinitionService = widgetDefinitionService
        controller.request.contentType = "text/json"

        controller.params.widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
        controller.delete()

        assert '"Error during delete: You are not authorized to access this entity. You are not authorized to delete widget definitions."' == controller.response.contentAsString
        assert null != WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }*/

    private def createWidgetDefinitionIntentForTest(widgetDefinition, intent, dataTypes, send, receive) {
        def widgetDefinitionIntent = WidgetDefinitionIntent.build(
            widgetDefinition : widgetDefinition,
            intent : intent,
            dataTypes : dataTypes,
            send : send,
            receive : receive)

        widgetDefinitionIntent.save(flush:true)
        return widgetDefinitionIntent
    }
}
