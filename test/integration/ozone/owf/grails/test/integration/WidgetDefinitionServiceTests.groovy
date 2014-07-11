package ozone.owf.grails.test.integration

import grails.converters.JSON
import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.*
import ozone.owf.grails.services.AutoLoginAccountService

@TestMixin(IntegrationTestMixin)
class WidgetDefinitionServiceTests {

    def domainMappingService
    def widgetDefinitionService
    def origAccountService

    private final samplesArray = ["A", "D", "C", "AA", "B", "BB"]

    void setUp() {
        origAccountService = widgetDefinitionService.accountService
        cleanup()

        def acctService = new AutoLoginAccountService()
        Person p = new Person(
            username: 'testWidgetDefinitionServiceTesting',
            userRealName: 'foo',
            enabled: true
        )
        p.save()
        acctService.autoAccountName = 'testWidgetDefinitionServiceTesting'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        widgetDefinitionService.accountService = acctService
    }

    void tearDown() {
        widgetDefinitionService.accountService = origAccountService
        cleanup()
    }

    private void cleanup() {
        Person.withTransaction { Person.findAll().each { it.delete() } }
        WidgetDefinition.withTransaction { WidgetDefinition.findAll().each { it.delete() } }
    }

    void testCreate() {
        def resultOfCreate = widgetDefinitionService.create(WidgetDefinitionPostParams.generatePostParamsA())
        assert resultOfCreate.success
        assert "12345678-1234-1234-1234-1234567890a0" == resultOfCreate.data[0].widgetGuid
        def widgetDefinition = WidgetDefinition.findByWidgetGuid("12345678-1234-1234-1234-1234567890a0")
        assert widgetDefinition.widgetGuid == resultOfCreate.data[0].widgetGuid
    }

    void testUpdate() {
        def postParamsA = WidgetDefinitionPostParams.generatePostParamsA()
        def resultOfCreate = widgetDefinitionService.create(postParamsA)

        def postParamsB = WidgetDefinitionPostParams.generatePostParamsB()
        postParamsB.id = postParamsB.widgetGuid
        def resultOfUpdate = widgetDefinitionService.update(postParamsB)

        assert resultOfUpdate.success
        assert 1 == WidgetDefinition.findAll().size()

        def widgetDefinition = WidgetDefinition.findByWidgetGuid("12345678-1234-1234-1234-1234567890a0")
        assert "My Widget Updated" == widgetDefinition.displayName
    }

    void testListWithStartAndLimit() {
        createDataForListTests()
        def expectedOrder = samplesArray

        def widgets = widgetDefinitionService.list([offset: "4", max: "1"])
        assert expectedOrder[4] == widgets.data[0].displayName
    }

    void testListWithSortAndDir() {
        createDataForListTests()
        def expectedOrder = ["D", "C", "BB", "B", "AA", "A"]

        def widgets = widgetDefinitionService.list([sort: 'value.namespace', order: 'desc'])

        assert expectedOrder == widgets.data*.displayName
    }

    void testListWithSortAndDirAndStartAndLimit() {
        createDataForListTests()
        def expectedOrder = ["A", "AA", "B", "BB", "C", "D"]

        def widgets = widgetDefinitionService.list([offset: "4", max: "1", sort: 'value.namespace', order: 'asc'])

        assert expectedOrder[4] == widgets.data[0].displayName
    }

    void testListWithNoParams() {
        createDataForListTests()
        assert samplesArray.size() == widgetDefinitionService.list().data.size()
    }

    void testListCount() {
        createDataForListTests()
        assert WidgetDefinition.count() == widgetDefinitionService.list().results
    }

    void testListWithOnlySortParameter() {
        createDataForListTests()
        def expectedOrder = ["A", "AA", "B", "BB", "C", "D"]

        def widgets = widgetDefinitionService.list([sort: 'value.namespace'])

        assert expectedOrder == widgets.data*.displayName
    }

    void testListWithWidgetTypesParameter() {
        WidgetType storeWidgetType = WidgetType.build(displayName: 'store')

        createDataForListTests()

        WidgetDefinition storeWidgetA = WidgetDefinition.findByDisplayName('A')
        WidgetDefinition storeWidgetB = WidgetDefinition.findByDisplayName('B')

        storeWidgetA.addToWidgetTypes(storeWidgetType)
        storeWidgetB.addToWidgetTypes(storeWidgetType)

        storeWidgetA.save()
        storeWidgetB.save()

        def widgets = widgetDefinitionService.list([widgetTypes: 'store'])

        assert 2 == widgets.results
    }

    void testListWithStackId() {
        createDataForListTests()

        def widget1 = WidgetDefinition.findByDisplayName(samplesArray[0])
        def widget2 = WidgetDefinition.findByDisplayName(samplesArray[1])
        def widget3 = WidgetDefinition.findByDisplayName(samplesArray[2])

        def stack1 = Stack.build(name: 'Stack One', description: 'Stack One description', stackContext: 'one',
                imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack1.defaultGroup = Group.build(name: 'Group1', automatic: false, status: 'active', stackDefault: true)
        stack1.save()

        def stackDashboard1 = Dashboard.build(alteredByAdmin: false, guid: '12345678-1234-1234-1234-123456789000',
                locked: false, isdefault: false, name: 'Stack Dashboard1', layoutConfig: """{
                    "cls": "hbox",
                    "items":[{
                        "xtype": "tabbedpane",
                        "flex": 1,
                        "height": "100%",
                        "items": [],
                        "paneType": "desktoppane",
                        "widgets": [{
                            "widgetGuid":"${widget3.widgetGuid}"
                        },{
                            "widgetGuid":"${widget2.widgetGuid}"
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

        def stackDashboard2 = Dashboard.build(alteredByAdmin: false, guid: '12345678-1234-1234-1234-123456789001',
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

        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard1)
        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard2)

        def result = widgetDefinitionService.list([stack_id: stack1.id])
        assert result.success
        assert 3 == result.results
    }

    void testListSuccess() {
        createDataForListTests()
        assert widgetDefinitionService.list().success
    }

    void testListWithNoWidgetDefinitions() {
        def list = widgetDefinitionService.list()
        assert list.success
        assert 0 == list.data.size()
        assert 0 == list.results
    }

    void testListWithBadJSONNameParameter() {
        shouldFail(OwfException,
                { widgetDefinitionService.list([sort: 'youneverfindmeindomain']) }
        )

    }

    void testExport() {
        def standardWidgetType = WidgetType.build(name: 'standard')

        def widget = WidgetDefinition.build(
                descriptorUrl: '../examples/fake-widgets/widget-c.json',
                displayName: 'Widget C',
                description: 'Widget C description',
                height: 740,
                imageUrlMedium: '../images/blue/icons/widgetIcons/widgetC.gif',
                imageUrlSmall: '../images/blue/icons/widgetContainer/widgetCsm.gif',
                widgetGuid: '0c5435cf-4021-4f2a-ba69-dde451d12551',
                universalName: 'com.company.widget.universalname',
                widgetVersion: '1.0',
                widgetUrl: '../examples/fake-widgets/widget-c.html',
                width: 980,
                widgetTypes: [standardWidgetType]
        )

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widget,
                Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2]),
                [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widget,
                Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3]),
                [intentDataType1, intentDataType3], false, true)

        def widgetDescriptor = widgetDefinitionService.export([id: widget.widgetGuid, filename: "test"])

        assert widgetDescriptor.contains('"displayName": "' + widget.displayName + '"')
        assert widgetDescriptor.contains('"universalName": "' + widget.universalName + '"')
        assert widgetDescriptor.contains('"widgetUrl": "' + widget.widgetUrl + '"')
        assert widgetDescriptor.contains('"imageUrlMedium": "' + widget.imageUrlMedium + '"')
        assert widgetDescriptor.contains('"imageUrlSmall": "' + widget.imageUrlSmall + '"')
        assert widgetDescriptor.contains('"description": "' + widget.description + '"')
        assert widgetDescriptor.contains('"widgetVersion": "' + widget.widgetVersion + '"')
        assert widgetDescriptor.contains('"widgetTypes": ["' + standardWidgetType.name + '"]')
        assert widgetDescriptor.contains('"height": ' + widget.height)
        assert widgetDescriptor.contains('"width": ' + widget.width)
        assert widgetDescriptor.contains('"visible": ' + widget.visible)
        assert widgetDescriptor.contains('"background": ' + widget.background)
        assert widgetDescriptor.contains('"singleton": ' + widget.singleton)
        assert widgetDescriptor.contains('"intents":')
        assert widgetDescriptor.contains('"send":')
        assert widgetDescriptor.contains('"receive":')
    }

    void testGetWidgetDescriptorJson() {
        def standardWidgetType = WidgetType.build(name: 'standard')

        def widget = WidgetDefinition.build(
                descriptorUrl: '../examples/fake-widgets/widget-c.json',
                description: 'Widget C description',
                displayName: 'Widget C',
                height: 740,
                imageUrlMedium: '../images/blue/icons/widgetIcons/widgetC.gif',
                imageUrlSmall: '../images/blue/icons/widgetContainer/widgetCsm.gif',
                widgetGuid: '0c5435cf-4021-4f2a-ba69-dde451d12551',
                universalName: 'com.company.widget.universalname',
                widgetVersion: '1.0',
                widgetUrl: '../examples/fake-widgets/widget-c.html',
                width: 980,
                widgetTypes: [standardWidgetType]
        )

        def intentDataType1 = IntentDataType.build(dataType: "Address")
        def intentDataType2 = IntentDataType.build(dataType: "City")
        def intentDataType3 = IntentDataType.build(dataType: "LongLat")

        def widgetDefinitionIntent1 = createWidgetDefinitionIntentForTest(widget,
                Intent.build(action: "Pan", dataTypes: [intentDataType1, intentDataType2]),
                [intentDataType1, intentDataType2], true, false)
        def widgetDefinitionIntent2 = createWidgetDefinitionIntentForTest(widget,
                Intent.build(action: "Plot", dataTypes: [intentDataType2, intentDataType1, intentDataType3]),
                [intentDataType1, intentDataType3], false, true)

        def widgetDescriptor = JSON.parse(widgetDefinitionService.getWidgetDescriptorJson(widget))

        //Set up string arrays of the intent data types so they can be compared for equality
        def widgetDefinitionIntent1DataTypes = [], widgetDefinitionIntent2DataTypes = []
        widgetDefinitionIntent1.dataTypes.each { widgetDefinitionIntent1DataTypes.push(it.dataType) }
        widgetDefinitionIntent2.dataTypes.each { widgetDefinitionIntent2DataTypes.push(it.dataType) }
        def resultSendDataTypes = [], resultReceiveDataTypes = []
        widgetDescriptor.intents.send[0].dataTypes.each { resultSendDataTypes.push(it) }
        widgetDescriptor.intents.receive[0].dataTypes.each { resultReceiveDataTypes.push(it) }

        assert widget.displayName == widgetDescriptor.displayName
        assert widget.universalName == widgetDescriptor.universalName
        assert widget.widgetUrl == widgetDescriptor.widgetUrl
        assert widget.imageUrlMedium == widgetDescriptor.imageUrlMedium
        assert widget.imageUrlSmall == widgetDescriptor.imageUrlSmall
        assert widget.description == widgetDescriptor.description
        assert widget.widgetVersion == widgetDescriptor.widgetVersion
        assert widget.height == widgetDescriptor.height
        assert widget.width == widgetDescriptor.width
        assert widget.visible == widgetDescriptor.visible
        assert widget.background == widgetDescriptor.background
        assert widget.singleton == widgetDescriptor.singleton
        assert '["' + widget.widgetTypes.toArray()[0].name + '"]' == widgetDescriptor.widgetTypes.toString()
        assert widgetDefinitionIntent1.intent.action == widgetDescriptor.intents.send[0].action
        assert widgetDefinitionIntent1DataTypes.toArray() == resultSendDataTypes.toArray()
        assert widgetDefinitionIntent2.intent.action == widgetDescriptor.intents.receive[0].action
        assert widgetDefinitionIntent2DataTypes.toArray() == resultReceiveDataTypes.toArray()
    }

    private void createDataForListTests() {
        // just some sample data, must be called in each test, spring transactions clean up the db
        samplesArray.eachWithIndex { obj, i ->
            WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: obj)
        }
    }

    private def createWidgetDefinitionIntentForTest(widgetDefinition, intent, dataTypes, send, receive) {
        def widgetDefinitionIntent = WidgetDefinitionIntent.build(
                widgetDefinition: widgetDefinition,
                intent: intent,
                dataTypes: dataTypes,
                send: send,
                receive: receive)

        widgetDefinitionIntent.save(flush: true)
        return widgetDefinitionIntent
    }
}
