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
        
        // Mock out the various domains we'll use
        mockDomain(WidgetType,[
            new WidgetType(name:"standard"),
            new WidgetType(name:"marketplace"),
            new WidgetType(name:"metric"),
        ])
        
        mockDomain(WidgetDefinitionIntent)
        mockDomain(Intent)
        mockDomain(IntentDataType)
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
        "widgetTypes":["Widget"]
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
        "widgetTypes":["Widget"]
    }
    '''
    def singleSimpleWidget=new JSONArray("[${singleSimpleWidgetJson}]")
    def singleWidgetWithIntents=new JSONArray("[${singleWidgetWithIntentsJson}]")
    def withAndWithoutIntents=new JSONArray("[${singleSimpleWidgetJson},${singleWidgetWithIntentsJson}]")

    // just make sure that it actually parses a basic widget
    void testSimplestWidget() {
        mockDomain(WidgetDefinition)
        
        def widgets=marketplaceService.addListingsToDatabase(singleSimpleWidget);
        assertEquals 1,widgets.size()
        assertEquals "name",widgets[0].displayName
        assertEquals "description",widgets[0].description
        assertEquals "largeImage",widgets[0].imageUrlLarge
        assertEquals "smallImage",widgets[0].imageUrlSmall
        assertEquals "086ca7a6-5c53-438c-99f2-f7820638fc6f",widgets[0].widgetGuid
        assertEquals "http://wikipedia.com",widgets[0].widgetUrl
        assertEquals "1",widgets[0].widgetVersion
        assertEquals false,widgets[0].singleton
        assertEquals true,widgets[0].visible
        assertEquals false,widgets[0].background
        assertEquals 200,widgets[0].height
        assertEquals 300,widgets[0].width
    }

    void testProcessesIntentsOnOneWidget() {
        mockDomain(WidgetDefinition)
        def widgets=marketplaceService.addListingsToDatabase(singleWidgetWithIntents);
        assertEquals 2,widgets[0].widgetDefinitionIntents.size()
        boolean hasSend=false,hasReceive=false
        widgets[0].widgetDefinitionIntents.each {
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
    }
    void testMultipleWidgets() {
        mockDomain(WidgetDefinition)
        
        def widgets=marketplaceService.addListingsToDatabase(withAndWithoutIntents);
        assertEquals 2,widgets.size()
        assertEquals "name",widgets[0].displayName
        assertEquals "nameIntents",widgets[1].displayName
    }

}
