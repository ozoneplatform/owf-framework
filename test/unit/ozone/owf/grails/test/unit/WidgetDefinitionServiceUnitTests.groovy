package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import ozone.owf.grails.services.WidgetDefinitionService
import ozone.owf.grails.OwfException

class WidgetDefinitionServiceUnitTests extends GrailsUnitTestCase {

	def widgetDefinitionService

	protected void setUp() {
        super.setUp()
        mockLogging(WidgetDefinitionService,false) //new to grails 1.1
        widgetDefinitionService = new WidgetDefinitionService()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConvertJsonParamToDomainField() {
        assertEquals 'displayName', widgetDefinitionService.convertJsonParamToDomainField('value.namespace')
    }

    void testConvertJsonParamToDomainFieldException() {
        shouldFail(OwfException, 
                    { widgetDefinitionService.convertJsonParamToDomainField('iwillneverexist') }
                  )
    }

}