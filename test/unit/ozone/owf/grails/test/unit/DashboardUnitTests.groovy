package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.validation.ConstrainedProperty

import ozone.owf.grails.domain.Dashboard
//import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.EDashboardLayout
import ozone.owf.grails.domain.Person
import org.codehaus.groovy.grails.web.json.JSONObject

class DashboardUnitTests extends GrailsUnitTestCase {

	def dashboard

	protected void setUp() {
        super.setUp()
        mockDomain(Dashboard)
        mockForConstraintsTests(Dashboard)
        dashboard = new Dashboard()
    }

    protected void tearDown() {
        super.tearDown()
    }

	void testGuidRequired()
	{
		TestUtil.assertPropertyRequired('guid', dashboard)
	}

	void testGuidIsGuidConstrained()
	{
		TestUtil.assertPropertyMatchesGuidConstraints('guid', dashboard)
	}

	void testNameIsRequired()
	{
		TestUtil.assertPropertyRequired('name', dashboard)
	}

	void testNameIsValid()
	{
		dashboard.name = "\""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = "\\"
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = """/"""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = "#"
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = "="
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = """{"""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = """}"""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = ":"
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = ";"
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = ""","""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = """["""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = """]"""
		TestUtil.assertNoErrorOnProperty('name', dashboard)
		dashboard.name = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('name', dashboard)
	}

	void testNameEscapedIsValid()
	{
		dashboard.name = "\u5317\u7F8E\u4E2D\u6587\u5831\u7D19"
		TestUtil.assertNoErrorOnProperty('name', dashboard)
	}


    void testAsJSONWithState() {
        //TODO: write a test here
    }

	void testNotLockedByDefault()
	{
		assertEquals(false, dashboard.locked)
	}

}
