package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import grails.converters.JSON

import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Dashboard

import ozone.owf.grails.controllers.PrefsDashboardController

@TestMixin(IntegrationTestMixin)
class PrefsDashboardControllerTests extends OWFGroovyTestCase {

	def dashboardService
	def controller

    protected void loginAsUsernameAndRole(def username, def role_string) {
      super.loginAsUsernameAndRole(username,role_string)
      dashboardService.accountService = accountService
    }

  void testDashboardList() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.list()

      assert 10 == JSON.parse(controller.response.contentAsString).size()
  }

  void testDashboardListWithPagingWithFilterOnName() {
	  loginAsUsernameAndRole('testAdmin1', 'role')
	  createTestDashboards(10)

	  controller = new PrefsDashboardController()
	  controller.dashboardService = dashboardService
	  controller.request.contentType = "text/json"
	  controller.params.max = 5
	  controller.params.offset = 0
	  controller.params.filterOperator = "OR"
	  controller.params.filters = """[{"filterField":"name","filterValue":"Dashboard 0"}]"""

	  //default sorts by pos
	  controller.list()

	  assert 1 == JSON.parse(controller.response.contentAsString).size()
	  assert 'Dashboard 0' == JSON.parse(controller.response.contentAsString)[0].name
  }

  void testDashboardListWithPaging() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 5
      controller.params.offset = 0

      //default sorts by pos
      controller.list()

      assert 5 == JSON.parse(controller.response.contentAsString).size()
      assert 'Dashboard 0' == JSON.parse(controller.response.contentAsString)[0].name
      assert 'Dashboard 4' == JSON.parse(controller.response.contentAsString)[4].name
  }

  void testDashboardListWithPagingGetSecondPage() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 5
      controller.params.offset = 5

      //default sorts by pos
      controller.list()

      assert 5 == JSON.parse(controller.response.contentAsString).size()
      assert 'Dashboard 5' == JSON.parse(controller.response.contentAsString)[0].name
      assert 'Dashboard 9' == JSON.parse(controller.response.contentAsString)[4].name
  }

  void testDashboardListWithPagingZeroMax() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 0
      controller.params.offset = 0

      //default sorts by pos
      controller.list()

      assert 0 == JSON.parse(controller.response.contentAsString).size()
  }

  void testDashboardListWithPagingOffsetGreaterThanMax() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 5
      controller.params.offset = 100

      //default sorts by pos
      controller.list()

      assert 0 == JSON.parse(controller.response.contentAsString).size()
  }

  void testDashboardListWithPagingMaxIsOne() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 1
      controller.params.offset = 0

      //default sorts by pos
      controller.list()

      assert 1 == JSON.parse(controller.response.contentAsString).size()
  }

  void testDashboardListWithPagingOffsetSetToTotalMinusOne() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = 20
      controller.params.offset = 9

      //default sorts by pos
      controller.list()

      assert 1 == JSON.parse(controller.response.contentAsString).size()
  }

  void testDashboardListWithPagingNegativeValuesIgnored() {
      loginAsUsernameAndRole('testAdmin1', 'role')
      createTestDashboards(10)

      controller = new PrefsDashboardController()
      controller.dashboardService = dashboardService
      controller.request.contentType = "text/json"
      controller.params.max = -5
      controller.params.offset = -100

      //default sorts by pos
      controller.list()

      assert 10 == JSON.parse(controller.response.contentAsString).size()
  }

    void testCreateDashboardForAdmin()
	{
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.name = 'dashboard1'

		controller.create()

		assert 'dashboard1' == JSON.parse(controller.response.contentAsString).name
		assert '12345678-1234-1234-1234-1234567890a0' == JSON.parse(controller.response.contentAsString).guid
    }

	void testCreateDashboardForUser()
	{
		loginAsUsernameAndRole("testUser1", ERoleAuthority.ROLE_USER.strVal)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.name = 'dashboard1'

		controller.create()

		assert 'dashboard1' == JSON.parse(controller.response.contentAsString).name
		assert '12345678-1234-1234-1234-1234567890a0' == JSON.parse(controller.response.contentAsString).guid
	}

	void testCreateDuplicateDashboardName()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def dashboard = Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a1'
		controller.params.name = 'dashboard1'
		controller.params.personId = person.id

		controller.create()

		assert null ==  JSON.parse(controller.response.contentAsString)[0]
	}


	void testListDashboards()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person)
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.list()
		assert 3 == JSON.parse(controller.response.contentAsString).size()
	}

	void testDeleteDashboardsByUserId()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person)
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person)

		assert 1 == queryDashboardByUser('testAdmin3', 'dashboard3').size()

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a2'
		controller.params.personId = person.id
		controller.delete()

		assert 'dashboard3' == JSON.parse(controller.response.contentAsString).name
		assert '12345678-1234-1234-1234-1234567890a2' == JSON.parse(controller.response.contentAsString).guid

		assert 0 == queryDashboardByUser('testAdmin3', 'dashboard3').size()
	}

	void testDeleteDashboardsByUser()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)
		Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a1', user:person)
		Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a2', user:person)

		assert 1 == queryDashboardByUser('testAdmin3', 'dashboard3').size()

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a2'
		controller.delete()

		assert 'dashboard3' == JSON.parse(controller.response.contentAsString).name
		assert '12345678-1234-1234-1234-1234567890a2' == JSON.parse(controller.response.contentAsString).guid

		assert 0 == queryDashboardByUser('testAdmin3', 'dashboard3').size()
	}

	void testDeleteNonExistentDashboard() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin3')

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a3'
		controller.params.personId = person.id
		controller.delete()

		assert '"Error during delete: The requested entity was not found. Dashboard 12345678-1234-1234-1234-1234567890a3 not found."' == controller.response.contentAsString
	}

	void testUpdateDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.params.personId = person.id
		controller.params.name = 'dashboard2'
		controller.update()

		assert 'dashboard2' == JSON.parse(controller.response.contentAsString).name
		assert 'dashboard1' != JSON.parse(controller.response.contentAsString).name
	}

//	void testUpdateForNonexistentDashboard() {
//		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
//
//		def person = Person.build(username:'testAdmin3')
//
//		controller = new PrefsDashboardController()
//		controller.dashboardService = dashboardService
//		controller.request.contentType = "text/json"
//
//		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
//		controller.params.personId = person.id
//		controller.update()
//
//	}

	void testShowDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a0'
		controller.show()

		assert 'dashboard1' == JSON.parse(controller.response.contentAsString).name
		assert '12345678-1234-1234-1234-1234567890a0' == JSON.parse(controller.response.contentAsString).guid
	}

	void testShowNonExistentDashboard()
	{
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.guid = '12345678-1234-1234-1234-1234567890a2'
		controller.show()

		assert null ==  JSON.parse(controller.response.contentAsString)[0]
	}

	void testBulkDeleteWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.bulkDelete()
		assert '"Error during bulkDelete: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"' == controller.response.contentAsString

	}

	void testBulkUpdateWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.bulkUpdate()
		assert '"Error during bulkUpdate: The requested entity failed to pass validation. A fatal validation error occurred. viewsToUpdate param required. Params: [:]"' == controller.response.contentAsString

	}

	void testBulkDeleteAndUpdateWithoutParams() {
		loginAsUsernameAndRole('testAdmin1', 'role')
		createTestDashboards(2)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.bulkDeleteAndUpdate()
		assert '"Error during bulkDeleteAndUpdate: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"' == controller.response.contentAsString

	}

	void testGetDefault() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person, isdefault: true)

		controller = new PrefsDashboardController()
		controller.dashboardService = dashboardService
		controller.request.contentType = "text/json"

		controller.params.personId = person.id

		controller.getdefault()
		assert '12345678-1234-1234-1234-1234567890a0' == JSON.parse(controller.response.contentAsString).guid
	}

    private void createTestDashboards(num) {
      def person = Person.findByUsername('testAdmin1')
      for (int i = 0 ; i < num ; i++) {
        Dashboard.build(name:'Dashboard '+i, guid:java.util.UUID.randomUUID().toString(), user:person, dashboardPosition: i)
      }
    }
}
