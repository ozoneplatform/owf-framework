package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.validation.ConstrainedProperty
import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.EDashboardRegion
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.PersonWidgetDefinition

class DashboardWidgetStateTests extends GrailsUnitTestCase {
    
	def dashboardWidgetState

	protected void setUp() {
        super.setUp()
        mockDomain(DashboardWidgetState)
        mockForConstraintsTests(DashboardWidgetState)
        dashboardWidgetState = new DashboardWidgetState()
    }

    protected void tearDown() {
        super.tearDown()
    }


	void testUniqueIdRequired()
	{
		TestUtil.assertPropertyRequired('uniqueId', dashboardWidgetState)
	}
	
	void testUniqueIdIsGuidConstrained()
	{
		TestUtil.assertPropertyMatchesGuidConstraints('uniqueId', dashboardWidgetState)
	}
	
	void testNameIsRequired()
	{
		TestUtil.assertPropertyRequired('name', dashboardWidgetState)
	}
/*	
	void testNameCharactersWrong()
	{
		dashboardWidgetState.name = "\""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = "\\"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = """/"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = "#"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = "="
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = """{"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = """}"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = ":"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = ";"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = ""","""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = """["""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
		dashboardWidgetState.name = """]"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'name', dashboardWidgetState)
	}
*/
	void testNameIsValid()
	{
		dashboardWidgetState.name = "\""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = "\\"
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = """/"""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = "#"
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = "="
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = """{"""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = """}"""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = ":"
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = ";"
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = ""","""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = """["""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = """]"""
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
		dashboardWidgetState.name = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
	}
	
	void testNameEscapedIsValid()
	{
		dashboardWidgetState.name = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('name', dashboardWidgetState)
	}
/*	
	void testButtonIdCharactersWrong()
	{
		dashboardWidgetState.buttonId = "\""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "\\"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """/"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "#"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "="
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """{"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """}"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ":"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ";"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ""","""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """["""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """]"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'buttonId', dashboardWidgetState)
	}
*/	
	void testButtonIdIsValid()
	{
		dashboardWidgetState.buttonId = "\""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "\\"
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """/"""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "#"
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "="
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """{"""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """}"""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ":"
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ";"
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = ""","""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """["""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = """]"""
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
		dashboardWidgetState.buttonId = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
	}
	
	void testButtonIdEscapedIsValid()
	{
		dashboardWidgetState.buttonId = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('buttonId', dashboardWidgetState)
	}
	
	void testActiveRequired()
	{
		TestUtil.assertPropertyRequired('active', dashboardWidgetState)
	}
	
	void testWidthRequired()
	{
		TestUtil.assertPropertyRequired('width', dashboardWidgetState)
	}
	
	void testWidthLength()
	{
		TestUtil.checkSizeConstraintProperty('width',null,0)
	}
	
	void testHeightRequired()
	{
		TestUtil.assertPropertyRequired('height', dashboardWidgetState)
	}
	
	void testHeightLength()
	{
		TestUtil.checkSizeConstraintProperty('height',null,0)
	}
	
	void testXRequired()
	{
		TestUtil.assertPropertyRequired('x', dashboardWidgetState)
	}
	
	void testXLength()
	{
		TestUtil.checkSizeConstraintProperty('x',null,0)
	}
	
	void testYRequired()
	{
		TestUtil.assertPropertyRequired('y', dashboardWidgetState)
	}
	
	void testYLength()
	{
		TestUtil.checkSizeConstraintProperty('y',null,0)
	}
	
	void testZIndexRequired()
	{
		TestUtil.assertPropertyRequired('zIndex', dashboardWidgetState)
	}
	
	void testMinimizedRequired()
	{
		TestUtil.assertPropertyRequired('minimized', dashboardWidgetState)
	}
	
	void testMaximizedRequired()
	{
		TestUtil.assertPropertyRequired('maximized', dashboardWidgetState)
	}
	
	void testPinnedRequired()
	{
		TestUtil.assertPropertyRequired('pinned', dashboardWidgetState)
	}
	
	void testCollapsedRequired()
	{
		TestUtil.assertPropertyRequired('collapsed', dashboardWidgetState)
	}
	
	void testColumnPosRequired()
	{
		TestUtil.assertPropertyRequired('columnPos', dashboardWidgetState)
	}
	
	void testColumnPosRange()
	{
		TestUtil.checkNumberSizeConstraintProperty('columnPos', dashboardWidgetState,3, 0)
	}
	
	void testButtonOpenedRequired()
	{
		TestUtil.assertPropertyRequired('buttonOpened', dashboardWidgetState)
	}
	
	void testRegionEnumListInvalid()
	{
		dashboardWidgetState.region = 'break'
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.NOT_PREFIX + ConstrainedProperty.IN_LIST_CONSTRAINT, 'region', dashboardWidgetState)
	}
	
	void testRegionEnumListValid()
	{
		EDashboardRegion.list().each{
			dashboardWidgetState.region = it.strVal
			TestUtil.assertNoErrorOnProperty('region', dashboardWidgetState)
		}
	}
	
	private void setupValidDashboardWidgetState() {
	    dashboardWidgetState.dashboard			   = new Dashboard()
		dashboardWidgetState.personWidgetDefinition= new PersonWidgetDefinition(
		    widgetDefinition: new WidgetDefinition(universalName: '3F2504E0-4F89-11D3-9A0C-0305E82C3302',  widgetGuid:'3F2504E0-4F89-11D3-9A0C-0305E82C3302',  widgetVersion: '1.0')
		)
		dashboardWidgetState.uniqueId              = '3F2504E0-4F89-11D3-9A0C-0305E82C3301'
    	dashboardWidgetState.name                  = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
    	dashboardWidgetState.active                = false
    	dashboardWidgetState.width                 = 0
    	dashboardWidgetState.height                = 0
    	dashboardWidgetState.x                     = 0
    	dashboardWidgetState.y                     = 0
    	dashboardWidgetState.zIndex                = 0
    	dashboardWidgetState.minimized             = false
    	dashboardWidgetState.maximized             = false
    	dashboardWidgetState.pinned                = false
    	dashboardWidgetState.collapsed             = false
    	dashboardWidgetState.columnPos             = 0
    	dashboardWidgetState.buttonId              = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
    	dashboardWidgetState.buttonOpened          = false
    	dashboardWidgetState.region                = EDashboardRegion.None.strVal
		dashboardWidgetState.statePosition         = 0
		
		assertTrue dashboardWidgetState.validate()
	}
	
}
