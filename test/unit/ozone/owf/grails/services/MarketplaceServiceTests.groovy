package ozone.owf.grails.services

import grails.converters.deep.JSON
import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.*

class MarketplaceServiceTests extends GrailsUnitTestCase {
    MarketplaceService marketplaceService
    def stackServiceMockClass
    def widgetDefinitionServiceMockClass

    void setUp() {
        super.setUp()
        marketplaceService = new MarketplaceService()
        def domainMappingServiceMockClass = mockFor(DomainMappingService)
        domainMappingServiceMockClass.demand.deleteAllMappings(0..9999) { a, b, c -> [] }
        marketplaceService.domainMappingService = domainMappingServiceMockClass.createMock()

        widgetDefinitionServiceMockClass = mockFor(WidgetDefinitionService)
        marketplaceService.widgetDefinitionService = widgetDefinitionServiceMockClass.createMock()

        // Mock out the various widget types available
        mockDomain(WidgetType, [
                new WidgetType(name: "standard"),
                new WidgetType(name: "marketplace"),
                new WidgetType(name: "metric"),
                new WidgetType(name: "administration"),
        ])

        mockDomain(WidgetDefinitionIntent)
        mockDomain(Intent)
        mockDomain(IntentDataType)
        mockDomain(WidgetDefinition)
    }

    void tearDown() {
        super.tearDown()
    }
    // copied from what Marketplace sends for a simple, no intents, no dependencies, widget
    def singleSimpleWidgetJson='''
    {
        "displayName":"name",
        "description":"description",
        "imageUrlMedium":"largeImage",
        "imageUrlSmall":"smallImage",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6f",
        "widgetUrl":"http://wikipedia.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "mobileReady":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "intents":{"send":[],"receive":[]},
        "widgetTypes":["standard"]
    }
    '''

    def singleSimpleWidgetJsonWithUniversalNameJson='''
    {
        "displayName":"name",
        "description":"description",
        "imageUrlMedium":"largeImage",
        "imageUrlSmall":"smallImage",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6f",
        "widgetUrl":"http://wikipedia.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "mobileReady":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "intents":{"send":[],"receive":[]},
        "widgetTypes":["standard"],
        "universalName":"universalName"
    }
    '''

    def singleSimpleWidgetJsonWithNullUniversalNameJson='''
    {
        "displayName":"name",
        "description":"description",
        "imageUrlMedium":"largeImage",
        "imageUrlSmall":"smallImage",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6f",
        "widgetUrl":"http://wikipedia.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "mobileReady":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "intents":{"send":[],"receive":[]},
        "widgetTypes":["standard"],
        "universalName":null
    }
    '''

    def singleWidgetWithIntentsJson='''
    {
        "displayName":"nameIntents",
        "description":"descriptionIntents",
        "imageUrlMedium":"largeImageIntents",
        "imageUrlSmall":"smallImageIntents",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6e",
        "widgetUrl":"http://Intents.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "mobileReady":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "intents":
            {"send":[
                {"action":"send","dataTypes":["text/plain","text/html"]}
            ],"receive":[
                {"action":"receive","dataTypes":["text/plain","text/html"]}
            ]},
        "widgetTypes":["metric"]
    }
    '''

    def widgetWithInterestingWidgetTypesJSON='''
    {
        "displayName":"testWidgetTypes",
        "description":"descriptionIntents",
        "imageUrlMedium":"largeImageIntents",
        "imageUrlSmall":"smallImageIntents",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6e",
        "widgetUrl":"http://Intents.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "mobileReady":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "intents":
            {"send":[
                {"action":"send","dataTypes":["text/plain","text/html"]}
            ],"receive":[
                {"action":"receive","dataTypes":["text/plain","text/html"]}
            ]},
        "widgetTypes":["administration", "marketplace", "metric", "nonexistent"]
    }
    '''

    def singleSimpleStackJson='''
    {
        "name": "Me",
        "stackContext": "myveryown",
        "description": "My description",
        "widgets": [],
        "dashboards": [{
            "guid": "739961c3-8900-442b-94e0-88ec1bc89e22",
            "layoutConfig": {
                "widgets": [],
                "defaultSettings": {},
                "height": "100%",
                "items": [],
                "xtype": "tabbedpane",
                "flex": 1,
                "paneType": "tabbedpane"
            },
            "isdefault": true,
            "dashboardPosition": 1,
            "description": "The flash",
            "name":"Dash",
            "locked":false
        }]
    }
    '''

    def singleSimpleWidget=new JSONArray("[${singleSimpleWidgetJson}]")
    def singleSimpleWidgetWithUniversalName=new JSONArray("[${singleSimpleWidgetJsonWithUniversalNameJson}]")
    def singleSimpleWidgetWithNullUniversalName=new JSONArray("[${singleSimpleWidgetJsonWithNullUniversalNameJson}]")
    def singleWidgetWithIntents=new JSONArray("[${singleWidgetWithIntentsJson}]")
    def withAndWithoutIntents=new JSONArray("[${singleSimpleWidgetJson},${singleWidgetWithIntentsJson}]")
    def widgetWithInterestingWidgetTypes = new JSONArray("[${widgetWithInterestingWidgetTypesJSON}]")
    def singleSimpleStack=new JSONArray("[${singleSimpleStackJson}]")

    // just make sure that it actually parses a basic widget
    void testSimplestWidget() {
        widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..1) { a, b -> true }

        def widgets = marketplaceService.addListingsToDatabase(singleSimpleWidget);
        def resultWidget = widgets[0]
        assert 1 == widgets.size()
        assert "name" == resultWidget.displayName
        assert "description" == resultWidget.description
        assert "largeImage" == resultWidget.imageUrlMedium
        assert "smallImage" == resultWidget.imageUrlSmall
        assert "086ca7a6-5c53-438c-99f2-f7820638fc6f" == resultWidget.widgetGuid
        assert "http://wikipedia.com" == resultWidget.widgetUrl
        assert "1" == resultWidget.widgetVersion
        assert !resultWidget.singleton
        assert resultWidget.visible
        assert !resultWidget.background
        assert !resultWidget.mobileReady
        assert 200 == resultWidget.height
        assert 300 == resultWidget.width

        def typesList = resultWidget.widgetTypes as List

        assert typesList.size() == 1
        assert 'standard' == typesList[0].name
    }

    // just make sure that it actually parses a basic widget
    void testWidgetWithNullUniversalName() {
        widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..1) { a, b -> true }

        def widgets = marketplaceService.addListingsToDatabase(singleSimpleWidgetWithNullUniversalName);
        def resultWidget = widgets[0]
        assert 1 == widgets.size()
        assert "name" == resultWidget.displayName
        assert "description" == resultWidget.description
        assert "largeImage" == resultWidget.imageUrlMedium
        assert "smallImage" == resultWidget.imageUrlSmall
        assert "086ca7a6-5c53-438c-99f2-f7820638fc6f" == resultWidget.widgetGuid
        assert "http://wikipedia.com" == resultWidget.widgetUrl
        assert "1" == resultWidget.widgetVersion
        assert !resultWidget.singleton
        assert resultWidget.visible
        assert !resultWidget.background
        assert !resultWidget.mobileReady
        assert 200 == resultWidget.height
        assert 300 == resultWidget.width
        assert resultWidget.universalName == null

        def typesList = resultWidget.widgetTypes as List

        assert typesList.size() == 1
        assert 'standard' == typesList[0].name
    }

    void testSimplestWidgetWithExistingUniversalNameFails() {
        shouldFail(OwfException) {
            widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..1) { a, b -> false }
            marketplaceService.addListingsToDatabase(singleSimpleWidgetWithUniversalName)
        }
    }

    void testProcessesIntentsOnOneWidget() {
        widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..1) { a, b -> true }

        def resultWidget = marketplaceService.addListingsToDatabase(singleWidgetWithIntents)[0];

        assertEquals 2, resultWidget.widgetDefinitionIntents.size()
        boolean hasSend = false, hasReceive = false
        resultWidget.widgetDefinitionIntents.each {
            if (it.intent.action == "send") {
                hasSend = true
            } else if (it.intent.action == "receive") {
                hasReceive = true
            } else {
                fail("Should not have action: " + it.intent.action)
            }
            assertEquals "Should be two data types for this action", 2, it.dataTypes.size()
            assertTrue "Should have the text/plain datatype", it.dataTypes.find { it.dataType == "text/plain" } != null
            assertTrue "Should have the text/plain datatype", it.dataTypes.find { it.dataType == "text/html" } != null

        }
        assertTrue "Definition should contain send intents", hasSend
        assertTrue "Definition should contain receive intents", hasReceive

        def typesList = resultWidget.widgetTypes as List

        assert typesList.size() == 1
        assert 'metric' == typesList[0].name
    }

    void testMultipleWidgets() {
        widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..2) { a, b -> true }

        def widgets = marketplaceService.addListingsToDatabase(withAndWithoutIntents);
        assertEquals 2, widgets.size()
        assertEquals "name", widgets[0].displayName
        assertEquals "nameIntents", widgets[1].displayName
    }

    void testAllWidgetTypesProperlyConverted() {
        widgetDefinitionServiceMockClass.demand.canUseUniversalName(0..1) { a, b -> true }

        def resultWidget = marketplaceService.addListingsToDatabase(widgetWithInterestingWidgetTypes)[0];

        def typeNamesList = ((resultWidget.widgetTypes as List).sort { WidgetType type -> type.name })*.name

        println(typeNamesList.join(', '))

        assert 4 == typeNamesList.size()
        assert ['administration', 'marketplace', 'metric', 'standard']
    }

    // just make sure that it recognizes a stack and passes it to the StackService
    void testSimplestStack() {
        def accountServiceMockClass = mockFor(AccountService, true)
        boolean asAdmin = false
        accountServiceMockClass.demand.runAsAdmin(0..9999) { closure ->
            asAdmin = true
            closure.call()
            asAdmin = false
        }
        marketplaceService.accountService = accountServiceMockClass.createMock()

        stackServiceMockClass = mockFor(StackService)
        marketplaceService.stackService = stackServiceMockClass.createMock()

        mockDomain(Stack)

        stackServiceMockClass.demand.importStack { params ->
            assertTrue(asAdmin)
            assertEquals([data: singleSimpleStack[0].toString()], params)
        }

        marketplaceService.addListingsToDatabase(singleSimpleStack);

        stackServiceMockClass.verify()
    }
}
