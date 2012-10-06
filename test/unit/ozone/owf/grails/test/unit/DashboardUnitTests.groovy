package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.validation.ConstrainedProperty

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.DashboardWidgetState
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
		dashboard.state = [] as SortedSet
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testSetState()
	{
		def dashboardWidgetState = new DashboardWidgetState()
		dashboard.state.add(dashboardWidgetState)
		assertEquals dashboard.state.toArray()[0],dashboardWidgetState
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
/*	
	void testNameCharactersWrong()
	{
		dashboard.name = "\""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = "\\"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = """/"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = "#"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = "="
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = """{"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = """}"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = ":"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = ";"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = ""","""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = """["""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
		dashboard.name = """]"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboard)
	}
*/
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
	
//	void testLayoutRequired()
//	{
//		TestUtil.assertPropertyRequired('layout', dashboard)
//	}
	
	/*void testLayoutEnumListInvalid()
	{
		dashboard.layout = 'break'
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.NOT_PREFIX + ConstrainedProperty.IN_LIST_CONSTRAINT, 'layout', dashboard)
	}
	
	void testLayoutnEnumListValid()
	{
		EDashboardLayout.list().each{
			dashboard.layout = it.strVal
			TestUtil.assertNoErrorOnProperty('region', dashboard)
		}
	}*/
	
	
	void testColumnCountRequired()
	{
		TestUtil.assertPropertyRequired('columnCount',dashboard)
	}
	
	void testColumnCountRange()
	{
		TestUtil.checkNumberSizeConstraintProperty('columnCount', dashboard, 3, 0)
	}
	
    
    void testAsJSONWithState() {
        //TODO: write a test here
    }
    
	void testNotLockedByDefault()
	{
		TestUtil.assertEquals(false, dashboard.locked)
	}
    
/*	guid(nullable: false, blank: false, unique:true, matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/)
	isdefault(nullable: false, blank: false)
    //TODO What special characters are allowed in name field? 
    name(nullable:false, blank:false, matches: /^[^\\\"]{1,200}$/)
	//TODO Enum the layout
	layout(nullable:false, blank:false, inList:EDashboardLayout.listAsStrings())
	columnCount(nullable:false, blank:false, minSize:0, maxSize: 3)
	state(nullable:false)*/

}
