package ozone.owf.grails.domain

import spock.lang.Specification


class PreferenceSpec extends Specification
		implements DomainConstraintsUnitTest<Preference> {
	
	void testNamespaceIsRequired() {
		expect:
		propertyIsRequired('namespace')
	}
	
	void testNamespaceIsValid(String namespace) {
		expect:
		propertyValueIsValid('namespace', namespace)

		where:
		namespace << VALID_NAME_STRINGS
	}
	
	void testPathIsRequired() {
		expect:
		propertyIsRequired('path')
	}
	
	void testPathIsValid(String path) {
		expect:
		propertyValueIsValid('path', path)

		where:
		path << VALID_NAME_STRINGS
	}
	
	void testValueIsRequired() {
		expect:
		propertyIsRequired('value')
	}

	void testValueIsValid() {
		expect:
		propertyValueIsValid('value', "Hello World 1234567890!@\$%^&*()_+-|?><`~.")
		propertyValueIsValid('value', '\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19')

	}
	
}
