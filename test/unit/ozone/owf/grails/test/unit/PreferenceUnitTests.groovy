package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase

import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.Person

class PreferenceUnitTests extends GrailsUnitTestCase {
	
	def preference
	
	protected void setUp() {
		super.setUp()
		mockDomain(Preference)
		mockForConstraintsTests(Preference)
		preference = new Preference()
	}
	
	protected void tearDown() {
		super.tearDown()
	}
	
	void testNamespaceIsRequired()
	{
		TestUtil.assertPropertyRequired('namespace', preference)
	}
	
	void testNamespaceIsValid()
	{
		preference.namespace = "\""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = "\\"
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = """/"""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = "#"
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = "="
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = """{"""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = """}"""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = ":"
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = ";"
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = ""","""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = """["""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = """]"""
		TestUtil.assertNoErrorOnProperty('namespace', preference)
		preference.namespace = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('namespace', preference)
	}
	
	void testNamespaceEscapedIsValid()
	{
		preference.namespace = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('namespace', preference)
	}
	
	void testPathIsRequired()
	{
		TestUtil.assertPropertyRequired('path', preference)
	}
	
	void testPathIsValid()
	{
		preference.path = "\""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = "\\"
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = """/"""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = "#"
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = "="
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = """{"""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = """}"""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = ":"
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = ";"
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = ""","""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = """["""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = """]"""
		TestUtil.assertNoErrorOnProperty('path', preference)
		preference.path = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('path', preference)
	}
	
	void testPathEscapedIsValid()
	{
		preference.path = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('path', preference)
	}
	
	void testValueIsRequired()
	{
		TestUtil.assertPropertyRequired('value', preference)
	}

	void testValueIsValid()
	{
		preference.value = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('value', preference)
	}
	
	void testValueEscapedIsValid()
	{
		preference.value = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('value', preference)
	}
	
	Person createUser() {
		return new Person(username: "Mike O'Neil", userRealName: "Mike O'Neil",enabled: true,description: 'something')
	}
	
}
