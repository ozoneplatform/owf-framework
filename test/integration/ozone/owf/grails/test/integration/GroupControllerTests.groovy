package ozone.owf.grails.test.integration

import grails.converters.JSON

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person

import ozone.owf.grails.controllers.GroupController

@TestMixin(IntegrationTestMixin)
class GroupControllerTests extends OWFGroovyTestCase {

	def groupService
	def controller

	void createGroupForTest() {
		Group.build(
				name: 'Group1',
				description: '',
				email: 'test@test.com',
				automatic: false,
                                stackDefault: false,
				status: 'active')
	}

	void createGroupForTest(name, description, email, stackDefault, automatic, status) {
		Group.build(
				name: name,
				description: description,
				email: email,
                                stackDefault: stackDefault,
				automatic: automatic,
				status: status)
	}

	void testShowForExistentGroup() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		createGroupForTest()

		controller = new GroupController()
		controller.groupService = groupService
		controller.request.contentType = "text/json"

		controller.params.id = Group.findByName('Group1').id
		controller.show()

		assert 'Group1' == JSON.parse(controller.response.contentAsString).data.name
		assert Group.findByName('Group1').id == JSON.parse(controller.response.contentAsString).data.id
	}

	void testShowForNonexistentGroup() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		createGroupForTest()

		controller = new GroupController()
		controller.groupService = groupService
		controller.request.contentType = "text/json"

		controller.params.id = Group.findByName('Group1').id + 1
		controller.show()

		assert '"Error during show: The requested entity was not found. Group '+(Group.findByName('Group1').id + 1)+ ' not found."' == controller.response.contentAsString
	}

	void testListForWidgetDefinition() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		createGroupForTest()

		controller = new GroupController()
		controller.groupService = groupService
		controller.request.contentType = "text/json"

		controller.params.id = Group.findByName('Group1').id as String
		controller.list()

		assert null != JSON.parse(controller.response.contentAsString).data
		assert 'Group1' == JSON.parse(controller.response.contentAsString).data.name[0]
		assert Group.findByName('Group1').id == JSON.parse(controller.response.contentAsString).data.id[0]
	}

	void testCreateWidgetDefinition() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

		controller = new GroupController()
		controller.groupService = groupService
		controller.request.contentType = "text/json"

		controller.params.name = 'Group1'
		controller.params.description = ''
		controller.params.email = 'test@test.com'
		controller.params.automatic = false
		controller.params.status = 'active'

		controller.createOrUpdate()

		assert null != Group.findByName('Group1')
		assert 'Group1' == JSON.parse(controller.response.contentAsString).data[0].name
		assert 'test@test.com' == JSON.parse(controller.response.contentAsString).data[0].email
	}

	/*void testDeleteExistentWidgetDefinition() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		createGroupForTest()

		assert null != Group.findByName('Group1')

		controller = new GroupController()
		controller.groupService = groupService
		controller.request.contentType = "text/json"

		controller.params.data = '{"id":'+Group.findByName('Group1').id+'}'
		controller.delete()
		println controller.response.contentAsString
		assert Group.findByName('Group1').id == JSON.parse(controller.response.contentAsString).data[0].id
		assert null ==  Group.findByName('Group1')
	}*/

	/*void testDeleteNonexistentWidgetDefinition() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		createWidgetDefinitionForTest('Widget C','widgetC.gif','widgetCsm.gif','0c5435cf-4021-4f2a-ba69-dde451d12551','widget-c.html')

		controller = new WidgetController()
		controller.widgetDefinitionService = widgetDefinitionService
		controller.request.contentType = "text/json"

		controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12558'
		controller.delete()

		//assert '"Error during delete: The requested entity was not found Widget Definition 0c5435cf-4021-4f2a-ba69-dde451d12558 not found."' == controller.response.contentAsString
		assert null != WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
	}*/
}
