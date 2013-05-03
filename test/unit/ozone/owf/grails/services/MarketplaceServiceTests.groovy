package ozone.owf.grails.services

import grails.test.*
import grails.test.mixin.*

import org.codehaus.groovy.grails.web.json.JSONArray

import ozone.owf.grails.domain.*
import grails.converters.JSON

class MarketplaceServiceTests extends GrailsUnitTestCase {
    MarketplaceService marketplaceService

    protected void setUp() {
        super.setUp()
        marketplaceService = new MarketplaceService()
        def domainMappingServiceMockClass= mockFor(DomainMappingService)
        domainMappingServiceMockClass.demand.deleteAllMappings(0..9999) { a,b,c -> [] }
        marketplaceService.domainMappingService= domainMappingServiceMockClass.createMock()

        // Stub out taggable.  Kinda annoying
        WidgetDefinition.metaClass.mockTags = []
        WidgetDefinition.metaClass.getTags= { 
            return delegate.mockTags.collect {[tag:[name:it]]}
        }
        WidgetDefinition.metaClass.removeTag={ name -> delegate.mockTags.remove(name)}
        WidgetDefinition.metaClass.addTag={name, visible, position, editable -> delegate.mockTags << name}
        
        // Mock out the various widget types available
        mockDomain(WidgetType,[
            new WidgetType(name:"standard"),
            new WidgetType(name:"marketplace"),
            new WidgetType(name:"metric"),
            new WidgetType(name:"administration"),
        ])
        
        mockDomain(WidgetDefinitionIntent)
        mockDomain(Intent)
        mockDomain(IntentDataType)
        mockDomain(WidgetDefinition)
    }

    protected void tearDown() {
        super.tearDown()
    }
    // copied from what Marketplace sends for a simple, no intents, no dependencies, widget
    def singleSimpleWidgetJson='''
    {
        "displayName":"name",
        "description":"description",
        "imageUrlLarge":"largeImage",
        "imageUrlSmall":"smallImage",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6f",
        "widgetUrl":"http://wikipedia.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "defaultTags" : ["tag"],
        "intents":{"send":[],"receive":[]},
        "widgetTypes":["standard"]
    }
    '''
    def singleWidgetWithIntentsJson='''
    {
        "displayName":"nameIntents",
        "description":"descriptionIntents",
        "imageUrlLarge":"largeImageIntents",
        "imageUrlSmall":"smallImageIntents",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6e",
        "widgetUrl":"http://Intents.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "defaultTags" : ["tag"],
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
        "imageUrlLarge":"largeImageIntents",
        "imageUrlSmall":"smallImageIntents",
        "widgetGuid":"086ca7a6-5c53-438c-99f2-f7820638fc6e",
        "widgetUrl":"http://Intents.com",
        "widgetVersion":"1",
        "singleton":false,
        "visible":true,
        "background":false,
        "height":200,
        "width":300,
        "directRequired" :[],
        "defaultTags" : ["tag"],
        "intents":
            {"send":[
                {"action":"send","dataTypes":["text/plain","text/html"]}
            ],"receive":[
                {"action":"receive","dataTypes":["text/plain","text/html"]}
            ]},
        "widgetTypes":["administration", "marketplace", "metric", "nonexistent"]
    }
    '''

    def singleSimpleWidget=new JSONArray("[${singleSimpleWidgetJson}]")
    def singleWidgetWithIntents=new JSONArray("[${singleWidgetWithIntentsJson}]")
    def withAndWithoutIntents=new JSONArray("[${singleSimpleWidgetJson},${singleWidgetWithIntentsJson}]")
    def widgetWithInterestingWidgetTypes = new JSONArray("[${widgetWithInterestingWidgetTypesJSON}]")

    // just make sure that it actually parses a basic widget
    void testSimplestWidget() {

        def widgets = marketplaceService.addListingsToDatabase(singleSimpleWidget);
        def resultWidget = widgets[0]
        assert 1,widgets.size()
        assert "name" == resultWidget.displayName
        assert "description" == resultWidget.description
        assert "largeImage" == resultWidget.imageUrlLarge
        assert "smallImage" == resultWidget.imageUrlSmall
        assert "086ca7a6-5c53-438c-99f2-f7820638fc6f" == resultWidget.widgetGuid
        assert "http://wikipedia.com" == resultWidget.widgetUrl
        assert "1" == resultWidget.widgetVersion
        assert !resultWidget.singleton
        assert resultWidget.visible
        assert !resultWidget.background
        assert 200 == resultWidget.height
        assert 300 == resultWidget.width

        def typesList = resultWidget.widgetTypes as List

        assert typesList.size() == 1
        assert 'standard' == typesList[0].name
    }

    void testProcessesIntentsOnOneWidget() {
        def resultWidget = marketplaceService.addListingsToDatabase(singleWidgetWithIntents)[0];

        assertEquals 2,resultWidget.widgetDefinitionIntents.size()
        boolean hasSend=false,hasReceive=false
        resultWidget.widgetDefinitionIntents.each {
            if(it.intent.action == "send") {
                hasSend=true
            } else if(it.intent.action == "receive") {
                hasReceive=true
            } else {
                fail("Should not have action: " + it.intent.action)
            }
            assertEquals "Should be two data types for this action",2,it.dataTypes.size()
            assertTrue "Should have the text/plain datatype", it.dataTypes.find { it.dataType == "text/plain"} != null
            assertTrue "Should have the text/plain datatype", it.dataTypes.find { it.dataType == "text/html"} != null

        }
        assertTrue "Definition should contain send intents",hasSend
        assertTrue "Definition should contain receive intents",hasReceive

        def typesList = resultWidget.widgetTypes as List

        assert typesList.size() == 1
        assert 'metric' == typesList[0].name
    }

    void testMultipleWidgets() {

        def widgets=marketplaceService.addListingsToDatabase(withAndWithoutIntents);
        assertEquals 2,widgets.size()
        assertEquals "name",widgets[0].displayName
        assertEquals "nameIntents",widgets[1].displayName
    }

    void testAllWidgetTypesProperlyConverted() {
        def resultWidget = marketplaceService.addListingsToDatabase(widgetWithInterestingWidgetTypes)[0];

        def typeNamesList = ((resultWidget.widgetTypes as List).sort{WidgetType type -> type.name})*.name

        println (typeNamesList.join(', '))

        assert 4 == typeNamesList.size()
        assert ['administration', 'marketplace', 'metric', 'standard']
    }
}
