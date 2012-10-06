package ozone.owf.grails.test.integration

import grails.converters.JSON

import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Dashboard

import ozone.owf.grails.controllers.DashboardController

class DashboardControllerTests extends OWFGroovyTestCase {
	def dashboardService
	def controller

	protected void loginAsUsernameAndRole(def username, def role_string) {
	  super.loginAsUsernameAndRole(username,role_string)
	  dashboardService.accountService = accountService
	}

  void testDashboardList() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.list()

	  assertEquals 10, JSON.parse(controller.response.contentAsString).data.size()
  }
  
  void testDashboardListWithPagingWithFilterOnName() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 5
	  controller.params.offset = 0
	  controller.params.filterOperator = "OR"
	  controller.params.filters = """[{"filterField":"name","filterValue":"Dashboard 0"}]"""
	  
	  //default sorts by pos
	  controller.list()

	  assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
	  assertEquals 'Dashboard 0', JSON.parse(controller.response.contentAsString).data[0].name
  }

  void testDashboardListWithPaging() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 5
	  controller.params.offset = 0

	  //default sorts by pos
	  controller.list()

	  assertEquals 5, JSON.parse(controller.response.contentAsString).data.size()
	  assertEquals 'Dashboard 0', JSON.parse(controller.response.contentAsString).data[0].name
	  assertEquals 'Dashboard 4', JSON.parse(controller.response.contentAsString).data[4].name
  }

  void testDashboardListWithPagingGetSecondPage() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 5
	  controller.params.offset = 5

	  //default sorts by pos
	  controller.list()

	  assertEquals 5, JSON.parse(controller.response.contentAsString).data.size()
	  assertEquals 'Dashboard 5', JSON.parse(controller.response.contentAsString).data[0].name
	  assertEquals 'Dashboard 9', JSON.parse(controller.response.contentAsString).data[4].name
  }

  void testDashboardListWithPagingZeroMax() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 0
	  controller.params.offset = 0

	  //default sorts by pos
	  controller.list()

	  assertEquals 0, JSON.parse(controller.response.contentAsString).data.size()
  }

  void testDashboardListWithPagingOffsetGreaterThanMax() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 5
	  controller.params.offset = 100

	  //default sorts by pos
	  controller.list()

	  assertEquals 0, JSON.parse(controller.response.contentAsString).data.size()
  }

  void testDashboardListWithPagingMaxIsOne() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 1
	  controller.params.offset = 0

	  //default sorts by pos
	  controller.list()

	  assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
  }

  void testDashboardListWithPagingOffsetSetToTotalMinusOne() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 20
	  controller.params.offset = 9

	  //default sorts by pos
	  controller.list()

	  assertEquals 1, JSON.parse(controller.response.contentAsString).data.size()
  }

  void testDashboardListWithPagingNegativeValuesIgnored() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new DashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = -5
	  controller.params.offset = -100

	  //default sorts by pos
	  controller.list()

	  assertEquals 10, JSON.parse(controller.response.contentAsString).results
  }

	void testCreateDashboardForAdmin()
	{
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.name = 'dashboard1'
		controller.params.layout = 'portal'
		controller.params.columnCount = 3
		controller.params.showLaunchMenu = false
		
		controller.create()

		assertEquals 'dashboard1', JSON.parse(controller.response.contentAsString).name
		assertEquals '12345678-1234-1234-1234-1234567890a0', JSON.parse(controller.response.contentAsString).guid
	}
	
	void testCreateDashboardForUser()
	{
		loginAsUsernameAndRole("testUser1", ERoleAuthority.ROLE_USER.strVal)
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.name = 'dashboard1'
		controller.params.layout = 'portal'
		controller.params.columnCount = 3
		controller.params.showLaunchMenu = false
		
		controller.create()
		
		assertEquals 'dashboard1', JSON.parse(controller.response.contentAsString).name
		assertEquals '12345678-1234-1234-1234-1234567890a0', JSON.parse(controller.response.contentAsString).guid
	}
	
	void testCreateDashboardForUserWithIntentConfig()
	{
		loginAsUsernameAndRole("testUser1", ERoleAuthority.ROLE_USER.strVal)
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.name = 'dashboard1'
		controller.params.layout = 'portal'
		controller.params.columnCount = 3
		controller.params.showLaunchMenu = false
		controller.params.intentConfig = """
				[{"action":"Plot","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Chart","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Locate","src":"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
				"dest":"22ea2970-7f28-92f0-d702-cdee0c83b07c"}]
				"""
		
		controller.create()
		
		assertEquals 'dashboard1', JSON.parse(controller.response.contentAsString).name
		assertEquals """
				[{"action":"Plot","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Chart","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Locate","src":"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
				"dest":"22ea2970-7f28-92f0-d702-cdee0c83b07c"}]
				""", JSON.parse(controller.response.contentAsString).intentConfig
		assertEquals '12345678-1234-1234-1234-1234567890a0', JSON.parse(controller.response.contentAsString).guid
	}
	
	void testCreateDuplicateDashboardName()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def dashboard = Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'portal', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a1'
		controller.params.name = 'dashboard1'
		controller.params.layout = 'desktop'
		controller.params.columnCount = 3
		controller.params.personId = person.id
		controller.params.showLaunchMenu = false
		
		controller.create()

		assertNull JSON.parse(controller.response.contentAsString)[0]
	}
	
	
	void testListDashboards()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.list()
		
		assertEquals 3, JSON.parse(controller.response.contentAsString).data.size()
	}
	
    void testDeleteDashboardFromPreferenceAPI() {
          loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

          def person = Person.build(username:'testAdmin3')
          Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person, layout:'desktop', state:new TreeSet())

          assertEquals 1, queryDashboardByUser('testAdmin3', 'dashboard3').size()

          controller = new DashboardController()
          controller.dashboardService = dashboardService
          controller.request.contentType = "text/json"

          controller.params.guid = '12345678-1234-1234-1234-1234567890a2'
          controller.delete()

          assertEquals 'dashboard3', JSON.parse(controller.response.contentAsString).name
          assertEquals '12345678-1234-1234-1234-1234567890a2', JSON.parse(controller.response.contentAsString).guid

          assertEquals 0, queryDashboardByUser('testAdmin3', 'dashboard3').size()
      }

	void testDeleteDashboardsByUserId()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person, layout:'desktop', state:new TreeSet())

		assertEquals 1, queryDashboardByUser('testAdmin3', 'dashboard3').size()

		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.data = '[{"guid":"12345678-1234-1234-1234-1234567890a2","user_id":'+person.id+'}]'
		controller.params.adminEnabled = true;
		controller.delete()

		assertEquals 'dashboard3', JSON.parse(controller.response.contentAsString).data.name[0]
		assertEquals '12345678-1234-1234-1234-1234567890a2', JSON.parse(controller.response.contentAsString).data.guid[0]
		
		assertEquals 0, queryDashboardByUser('testAdmin3', 'dashboard3').size()
	}
	
	void testDeleteDashboardsByUser()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person, layout:'desktop', state:new TreeSet())
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person, layout:'desktop', state:new TreeSet())
		
		assertEquals 1, queryDashboardByUser('testAdmin3', 'dashboard3').size()
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.data = '[{"guid":"12345678-1234-1234-1234-1234567890a2"}]'
		controller.params.adminEnabled = true;
		controller.delete()
		
		assertEquals 'dashboard3', JSON.parse(controller.response.contentAsString).data.name[0]
		assertEquals '12345678-1234-1234-1234-1234567890a2', JSON.parse(controller.response.contentAsString).data.guid[0]
		
		assertEquals 0, queryDashboardByUser('testAdmin3', 'dashboard3').size()
	}
		
	void testDeleteNonExistentDashboard() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin3')

		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.data = '[{"guid":"12345678-1234-1234-1234-1234567890a3","user_id":'+person.id+'}]'
		controller.params.adminEnabled = true;
		controller.delete()
		
		assertEquals '"Error during delete: The requested entity was not found. Dashboard 12345678-1234-1234-1234-1234567890a3 not found."', controller.response.contentAsString
	}
	
	void testUpdateDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.personId = person.id
		controller.params.name = 'dashboard2'
		controller.update()
		
		assertEquals 'dashboard2', JSON.parse(controller.response.contentAsString).name
		assertNotSame 'dashboard1', JSON.parse(controller.response.contentAsString).name
	}
	
	void testUpdateDashboardWithIntentConfig()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		// controller.params.personId = person.id
		controller.params.name = 'dashboard2'
		controller.params.intentConfig = """
				[{"action":"Plot","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Chart","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Locate","src":"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
				"dest":"22ea2970-7f28-92f0-d702-cdee0c83b07c"}]
				"""
		controller.update()
		
		assertEquals 'dashboard2', JSON.parse(controller.response.contentAsString).name
		assertEquals """
				[{"action":"Plot","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Chart","src":"22ea2970-7f28-92f0-d702-cdee0c83b07c",
				"dest":"9465b5e6-5397-cf10-84a3-2f344b8d7146"},{"action":"Locate","src":"0532b6d3-fc61-f4dd-c7bb-18194a136fd8",
				"dest":"22ea2970-7f28-92f0-d702-cdee0c83b07c"}]
				""", JSON.parse(controller.response.contentAsString).intentConfig
		assertNotSame 'dashboard1', JSON.parse(controller.response.contentAsString).name
	}
	
//	void testUpdateForNonexistentDashboard() {
//		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
//		
//		def person = Person.build(username:'testAdmin3')
//		
//		controller = new DashboardController()
//		controller.dashboardService = dashboardService
//		controller.request.contentType = "text/json"
//		
//		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
//		controller.params.personId = person.id
//		controller.update()
//
//		println controller.response.contentAsString
//	}
	
	void testShowDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.show()
		
		assertEquals 'dashboard1', JSON.parse(controller.response.contentAsString).name
		assertEquals 'desktop', JSON.parse(controller.response.contentAsString).layout
		assertEquals '12345678-1234-1234-1234-1234567890a0', JSON.parse(controller.response.contentAsString).guid
	}
	
	void testShowNonExistentDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.guid = '12345678-1234-1234-1234-1234567890a2'
		controller.show()

		assertNull JSON.parse(controller.response.contentAsString)[0]
	}
	
	void testBulkDeleteWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)
  
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.bulkDelete()
		assertEquals '"Error during bulkDelete: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"', controller.response.contentAsString

	}
	
	void testBulkUpdateWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)
  
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.bulkUpdate()
		assertEquals '"Error during bulkUpdate: The requested entity failed to pass validation. A fatal validation error occurred. viewsToUpdate param required. Params: [:]"', controller.response.contentAsString
		
	}
	
	void testBulkDeleteAndUpdateWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)
  
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.bulkDeleteAndUpdate()
		assertEquals '"Error during bulkDeleteAndUpdate: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"', controller.response.contentAsString

	}
	
	void testGetDefault() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, layout:'desktop', state:new TreeSet())
		
		controller = new DashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"
		
		controller.params.personId = person.id
		
		controller.getdefault()
		assertEquals '12345678-1234-1234-1234-1234567890a0', JSON.parse(controller.response.contentAsString).guid
	}

	private void createTestDashboards(num) {
	  def person = Person.findByUsername('testAdmin1')
	  for (int i = 0 ; i < num ; i++) {
		Dashboard.build(name:'Dashboard '+i, guid:java.util.UUID.randomUUID().toString(), user:person, dashboardPosition: i, layout:'desktop', state:new TreeSet())
	  }
	}
}