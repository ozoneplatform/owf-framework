package ozone.owf.grails.domain

import spock.lang.Specification


class PersonWidgetDefinitionSpec extends Specification
		implements DomainConstraintsUnitTest<PersonWidgetDefinition> {

    void testVisibleRequired()  {
		expect:
		initializedPropertyIsRequired('visible', true)
	}


    void testPwdPositionRequired() {
		expect:
		propertyIsRequired('pwdPosition')
	}
    
    void testValidConfiguration() {
		when:
		domain.widgetDefinition = new WidgetDefinition()
		domain.person = new Person()
    	domain.pwdPosition = 0
    	domain.visible = true

		then:
    	domain.validate()
    }

}
