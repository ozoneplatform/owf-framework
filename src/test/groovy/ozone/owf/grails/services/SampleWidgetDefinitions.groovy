package ozone.owf.grails.services

class SampleWidgetDefinitions {

    public static final String SIMPLE_WIDGET = '''
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

    public static final String SIMPLE_WIDGET_WITH_UNIVERSAL_NAME = '''
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

    public static final String SIMPLE_WIDGET_WITH_NULL_UNIVERSAL_NAME = '''
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

    public static final String WIDGET_WITH_INTENTS = '''
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

    public static final String WIDGET_WITH_INTERESTING_TYPES = '''
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

    public static final String SIMPLE_STACK = '''
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
}
