package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import grails.converters.JSON;


import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.controllers.PreferenceController

@TestMixin(IntegrationTestMixin)
class PreferenceControllerTests extends OWFGroovyTestCase {

	def preferenceService
	def controller

    void testShowPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.show()

		assert 'com.dev.foo' == JSON.parse(controller.response.contentAsString).namespace
		assert 'test path' == JSON.parse(controller.response.contentAsString).path
    }

	void testShowForNonExistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.show()

		assert null ==  Preference.findByNamespaceAndPath('com.dev.foo1', 'test path1')
	}

	void testDoesPreferenceExistForExistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.doesPreferenceExist()

		assert JSON.parse(controller.response.contentAsString).preferenceExist
		assert 200 == JSON.parse(controller.response.contentAsString).statusCode
	}

	void testDoesPreferenceExistForNonexistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.doesPreferenceExist()

		assert false ==(JSON.parse(controller.response.contentAsString).preferenceExist)
		assert 200 == JSON.parse(controller.response.contentAsString).statusCode
	}

	void testListPreferenceByUser() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Preference.build(path:'test path1', namespace:'com.dev.foo1', value:'123', user:person)
		Preference.build(path:'test path2', namespace:'com.dev.foo2', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.list()

		assert 2 == Preference.findAllByUser(person).size()
		assert 'test path1' == JSON.parse(controller.response.contentAsString).rows[0].path
		assert 'test path2' == JSON.parse(controller.response.contentAsString).rows[1].path
		assert 'com.dev.foo1' == JSON.parse(controller.response.contentAsString).rows[0].namespace
		assert 'com.dev.foo2' == JSON.parse(controller.response.contentAsString).rows[1].namespace
	}

	void testListPreferenceByUserAndNamespace() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		Preference.build(path:'test path1', namespace:'com.dev.foo', value:'123', user:person)
		Preference.build(path:'test path2', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.list()

		assert 2 == Preference.findAllByUserAndNamespace(person, 'com.dev.foo').size()
		assert 'test path1' == JSON.parse(controller.response.contentAsString).rows[0].path
		assert 'test path2' == JSON.parse(controller.response.contentAsString).rows[1].path
		assert 'com.dev.foo' == JSON.parse(controller.response.contentAsString).rows[0].namespace
		assert 'com.dev.foo' == JSON.parse(controller.response.contentAsString).rows[1].namespace
	}

	void testCreatePreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin3')

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.value = '123'
		controller.params.userid = person.id

		controller.create()

		assert 'test path' == JSON.parse(controller.response.contentAsString).path
		assert 'com.dev.foo' == JSON.parse(controller.response.contentAsString).namespace
		assert '123' == JSON.parse(controller.response.contentAsString).value
	}

	void testUpdatePreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.params.value = '1234'
		controller.params.userid = person.id

		controller.update()

		assert 'test path1' == JSON.parse(controller.response.contentAsString).path
		assert 'com.dev.foo1' == JSON.parse(controller.response.contentAsString).namespace
		assert '1234' == JSON.parse(controller.response.contentAsString).value
	}

	void testUpdatePreferenceByUnauthorizedUser() {
		loginAsUsernameAndRole('testUser3', ERoleAuthority.ROLE_USER.strVal)

		def person = Person.build(username:'testUser3')
		def person2 = Person.build(username:'not_testUser3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person2)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.params.value = '1234'
		controller.params.userid = person2.id

		controller.update()

		assert '"Error during update: You are not authorized to access this entity. You are not authorized to edit preferences for other users."' == controller.response.contentAsString
		assert null ==  Preference.findByNamespaceAndPath('com.dev.foo1', 'test path1')
	}

	void testDeletePreferenceByUsernameAndPathAndNamespace() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		assert null != Preference.findByUserAndNamespace(person, 'com.dev.foo')

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.username = 'testAdmin3'

		controller.delete()

		assert null ==  Preference.findByUserAndNamespace(person, 'com.dev.foo')
	}

	void testDeletePreferenceByPersonIdAndPathAndNamespace() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		assert null != Preference.findByUserAndNamespace(person, 'com.dev.foo')

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.userid = person.id

		controller.delete()

		assert null ==  Preference.findByUserAndNamespace(person, 'com.dev.foo')
	}

	void testDeletePreferenceByUnauthorizedUser() {
		loginAsUsernameAndRole('testUser3', ERoleAuthority.ROLE_USER.strVal)

		def person = Person.build(username:'testUser3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.userid = person.id

		controller.delete()

		assert '"Error during delete: You are not authorized to access this entity. You are not authorized to delete preferences for other users."' == controller.response.contentAsString
		assert null != Preference.findByNamespaceAndPath('com.dev.foo', 'test path')

	}

	void testDeleteNonexistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)

		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		assert null != Preference.findByUserAndNamespace(person, 'com.dev.foo')

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"

		controller.params.prefNamespace = 'com.dev.foo1'
		controller.params.path = 'test path1'

		controller.delete()

		assert '{"success":true =="preference":null}', controller.response.contentAsString
		assert null != Preference.findByUserAndNamespace(person, 'com.dev.foo')
	}
}
