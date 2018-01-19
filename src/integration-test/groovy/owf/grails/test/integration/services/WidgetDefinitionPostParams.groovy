package owf.grails.test.integration.services


class WidgetDefinitionPostParams {


    public static final String WIDGET_1_GUID = "12345678-1234-1234-1234-1234567890a0"
    public static final String WIDGET_2_GUID = "12345678-1234-1234-1234-1234567890a1"
    public static final String WIDGET_3_GUID = "12345678-1234-1234-1234-1234567890a2"
    public static final String WIDGET_4_GUID = "12345678-1234-1234-1234-1234567890b2"
    public static final String WIDGET_5_GUID = "12345678-1234-1234-1234-1234567890c2"
    public static final String WIDGET_6_GUID = "12345678-1234-1234-1234-1234567890e2"
    public static final String WIDGET_7_GUID = "12345678-1234-1234-1234-1234567890f2"
    public static final String WIDGET_8_GUID = "12345678-1234-1234-1234-1234567890e4"
    public static final String WIDGET_9_GUID = "12345678-1234-1234-1234-1234567890f4"
    public static final String WIDGET_10_GUID = "12345678-1234-1234-1234-1234567890f6"
    public static final String WIDGET_11_GUID = "12345678-1234-1234-1234-1234567890e6"
    public static final String WIDGET_12_GUID = "12345678-1234-1234-1234-123456789102"

    static def widgetDefinitionParams(Map params) {
        [
                "widgetGuid"    : params.guid ?: UUID.randomUUID().toString(),
                "widgetVersion" : "1.0",
                "displayName"   : params.name ?: "Widget",
                "widgetUrl"     : "http://foo.com/widget",
                "imageUrlSmall" : "http://foo.com/widget/images/small.jpg",
                "imageUrlMedium": "http://foo.com/widget/images/large.jpg",
                "width"         : 200,
                "height"        : 200
        ]
    }

    static def generatePostParamsA() {
        widgetDefinitionParams(guid: WIDGET_1_GUID, name: "My Widget")
    }

    static def generatePostParamsB() {
        widgetDefinitionParams(guid: WIDGET_1_GUID, name: "My Widget Updated")
    }

    static def generatePostParamsC() {
        widgetDefinitionParams(guid: WIDGET_2_GUID, name: "My Widget 2")
    }

    static def generateDSTPostParamsA1() {
        widgetDefinitionParams(guid: WIDGET_3_GUID, name: "My Widget 3")
    }

    static def generateDSTPostParamsA2() {
        widgetDefinitionParams(guid: WIDGET_4_GUID, name: "My Widget 4")
    }

    static def generateDSTPostParamsA3() {
        widgetDefinitionParams(guid: WIDGET_5_GUID, name: "My Widget 5")
    }

    static def generateDSTPostParamsB1() {
        widgetDefinitionParams(guid: WIDGET_6_GUID, name: "My Widget 6")
    }

    static def generateDSTPostParamsB2() {
        widgetDefinitionParams(guid: WIDGET_7_GUID, name: "My Widget 7")
    }

    static def generateDSTPostParamsD1() {
        widgetDefinitionParams(guid: WIDGET_8_GUID, name: "My Widget 8")
    }

    static def generateDSTPostParamsD2() {
        widgetDefinitionParams(guid: WIDGET_9_GUID, name: "My Widget 9")
    }

    static def generateDSTPostParamsEF1() {
        widgetDefinitionParams(guid: WIDGET_10_GUID, name: "My Widget 10")
    }

    static def generateDSTPostParamsEF2() {
        widgetDefinitionParams(guid: WIDGET_11_GUID, name: "My Widget 11")
    }

    static def generateDSTPostParamsI3() {
        widgetDefinitionParams(guid: WIDGET_12_GUID, name: "My Widget 12")
    }

}
