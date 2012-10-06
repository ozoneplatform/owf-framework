package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import ozone.owf.grails.domain.Person

class PersonUnitTests extends GrailsUnitTestCase {
	
	def person
	
	protected void setUp() {
		super.setUp()
		mockDomain(Person)
		mockForConstraintsTests(Person)
		person = new Person()
	}
	
	protected void tearDown() {
		super.tearDown()
	}
	
	void testUsernameIsRequired()
	{
		TestUtil.assertPropertyRequired('username', person)
	}
	
	void testUsernameIsValid()
	{
		person.username = "\""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = "\\"
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = """/"""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = "#"
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = "="
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = """{"""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = """}"""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = ":"
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = ";"
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = ""","""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = """["""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = """]"""
		TestUtil.assertNoErrorOnProperty('username', person)
		person.username = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('username', person)
	}
	
	void testUsernameEscapedIsValid()
	{
		person.username = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('username', person)
	}
	
	void testUserRealNameIsRequired()
	{
		TestUtil.assertPropertyRequired('userRealName', person)
	}
	
	void testUserRealNameIsValid()
	{
		person.userRealName = "\""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = "\\"
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = """/"""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = "#"
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = "="
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = """{"""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = """}"""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = ":"
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = ";"
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = ""","""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = """["""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = """]"""
		TestUtil.assertNoErrorOnProperty('userRealName', person)
		person.userRealName = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('userRealName', person)
	}
	
	void testUserRealNameEscapedIsValid()
	{
		person.userRealName = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('userRealName', person)
	}
	
}
