package ozone.owf.grails.domain

import spock.lang.Specification


class DashboardSpec extends Specification
		implements DomainConstraintsUnitTest<Dashboard> {

	void testGuidRequired() {
		expect:
		propertyIsRequired('guid')
	}

	void testGuidIsGuidConstrained() {
		expect:
		propertyMatchesGuid('guid')
	}

	void testNameIsRequired() {
		expect:
		propertyIsRequired('name')
	}

	void testNameIsValid(String name) {
		expect:
		propertyValueIsValid("name", name)

		where:
		name << VALID_NAME_STRINGS
	}

    void testAsJSONWithState() {
        //TODO: write a test here
    }

	void testNotLockedByDefault() {
		expect:
		!domain.locked
	}

}
