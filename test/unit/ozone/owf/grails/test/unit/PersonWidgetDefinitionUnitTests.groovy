package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.WidgetDefinition

class PersonWidgetDefinitionUnitTests extends GrailsUnitTestCase {
    
	def personWidgetDefinition
	
	protected void setUp() {
        super.setUp()
        mockDomain(PersonWidgetDefinition)
        mockForConstraintsTests(PersonWidgetDefinition)
        personWidgetDefinition = new PersonWidgetDefinition()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testSetPerson() {
    	def person = new Person()
    	personWidgetDefinition.person = person
    	assertSame person, personWidgetDefinition.person
    }
    
    void testSetWidgetDefinition() {
    	def widgetDefinition = new WidgetDefinition()
    	personWidgetDefinition.widgetDefinition = widgetDefinition
    	assertSame widgetDefinition, personWidgetDefinition.widgetDefinition
    }
    
    void testVisibleRequired()
	{
		TestUtil.assertInitializedPropertyRequired('visible', personWidgetDefinition, true)
	}
    
    void testPwdPositionRequired()
	{
		TestUtil.assertPropertyRequired('pwdPosition', personWidgetDefinition)
	}
    
    void testValidConfiguration() {
    	def widgetDefinition = new WidgetDefinition()
    	personWidgetDefinition.widgetDefinition = widgetDefinition
    	def person = new Person()
    	personWidgetDefinition.person = person
    	personWidgetDefinition.pwdPosition = 0
    	personWidgetDefinition.visible = true
    	
    	assertTrue personWidgetDefinition.validate()
    }
}
