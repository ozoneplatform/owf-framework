package ozone.owf.grails.domain

import spock.lang.Specification


class PersonSpec extends Specification
		implements DomainConstraintsUnitTest<Person> {
	
	void testUsernameIsRequired() {
		expect:
		propertyIsRequired('username');
	}

	void testUsernameIsValid(String username) {
		expect:
		propertyValueIsValid("username", username)

		where:
		username << VALID_NAME_STRINGS
	}

	void testUserRealNameIsRequired() {
		expect:
		propertyIsRequired('userRealName');
	}

	void testUserRealNameIsValid(String realName) {
		expect:
		propertyValueIsValid("userRealName", realName)

		where:
		realName << VALID_NAME_STRINGS
	}

}
