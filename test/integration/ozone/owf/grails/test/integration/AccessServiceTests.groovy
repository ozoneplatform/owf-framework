package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.domain.WidgetDefinition

@TestMixin(IntegrationTestMixin)
class AccessServiceTests {

    def accessService
    def widgetId1 = '3b12f1df-5232-4804-897e-917bf397618a'
    def widgetId2 = '5b12f1df-5232-4804-897e-917bf397618b'

    private Object save(Object object) {
        validateAndPrintErrors(object)
        Object result = object.save(flush:true)
        assert "Object not created: " + object, result != null
        return result
    }

    private void validateAndPrintErrors(Object object) {
        if (!object.validate()) {
            object.errors.allErrors.each {error ->
                println error
            }
            fail("failed to save object ${object}")
        }
    }

    private buildWidgetDefinition (def id, def url) {

        return new WidgetDefinition( widgetGuid:  id, widgetUrl:  url, displayName: 'Generic', height: 200, width: 200,
            imageUrlLarge: 'http://foo.jpg', imageUrlSmall: 'http://bar.jpg')
    }

    void setUp() {
        WidgetDefinition definition  =  buildWidgetDefinition (  widgetId1,  "http://localhost:8443/owf/examples/foo.html")
        WidgetDefinition definition2  = buildWidgetDefinition(  widgetId2, "http://localhost:8443/owf/examples/bar.html")
        save(definition)
        save(definition2)
    }

    void testCheckAccess() {
        def receivingWidgetGUID = widgetId1       // this should be a widget ID findable in WidgetDefinition.findWidgetByGUID
        def sendingWidgetGUID = widgetId2
        def params = [ widgetId: receivingWidgetGUID, senderId: sendingWidgetGUID   ]
        def accessCheck =  accessService.checkAccess(params)

        assert(accessCheck.success==true)
    }
}
