package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import ozone.owf.grails.services.AdministrationService
import ozone.owf.grails.OwfException
import ozone.owf.grails.services.DashboardService

class AdministrationServiceUnitTests extends GrailsUnitTestCase {

    def administrationService
    def mockDashboardService
    def mockAccountService

	protected void setUp() {
        super.setUp()
        //mockLogging AdministrationService //new to grails 1.1
        administrationService = new AdministrationService()

        mockAccountService = new Expando(getLoggedInUserIsAdmin:  { true })
        administrationService.accountService = mockAccountService
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testCreateDashboardIfNotAdmin() {
        mockAccountService.getLoggedInUserIsAdmin = { false }
        shouldFail(OwfException,
                {administrationService.createDashboard([:])}
        )
    }
    
    
    void testCreateDashboardCallsDashboardServiceCreate() {
        def params = "blah"
		
		mockDashboardService = mockFor(DashboardService)
		// Expect that the create method is called on the dashboardService
		mockDashboardService.demand.create(1..1) { -> params }
		administrationService.dashboardService = mockDashboardService.createMock()
		
		administrationService.createDashboard(params)
		// assert that the create method was called.
        mockDashboardService.verify()
    }


}
