package ozone.owf.grails.test.integration

import grails.converters.JSON;


import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.controllers.PreferenceController


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
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.show()
		
		assertEquals 'com.dev.foo', JSON.parse(controller.response.contentAsString).namespace
		assertEquals 'test path', JSON.parse(controller.response.contentAsString).path
    }
	
	void testShowForNonExistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.show()

		assertNull Preference.findByNamespaceAndPath('com.dev.foo1', 'test path1')
	}
	
	void testDoesPreferenceExistForExistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.doesPreferenceExist()

		assertTrue(JSON.parse(controller.response.contentAsString).preferenceExist)
		assertEquals 200, JSON.parse(controller.response.contentAsString).statusCode
	}
	
	void testDoesPreferenceExistForNonexistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.doesPreferenceExist()

		assertFalse(JSON.parse(controller.response.contentAsString).preferenceExist)
		assertEquals 200, JSON.parse(controller.response.contentAsString).statusCode		
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

		assertEquals 2, Preference.findAllByUser(person).size()
		assertEquals 'test path1', JSON.parse(controller.response.contentAsString).rows[0].path
		assertEquals 'test path2', JSON.parse(controller.response.contentAsString).rows[1].path
		assertEquals 'com.dev.foo1', JSON.parse(controller.response.contentAsString).rows[0].namespace
		assertEquals 'com.dev.foo2', JSON.parse(controller.response.contentAsString).rows[1].namespace
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
		
		assertEquals 2, Preference.findAllByUserAndNamespace(person, 'com.dev.foo').size()
		assertEquals 'test path1', JSON.parse(controller.response.contentAsString).rows[0].path
		assertEquals 'test path2', JSON.parse(controller.response.contentAsString).rows[1].path
		assertEquals 'com.dev.foo', JSON.parse(controller.response.contentAsString).rows[0].namespace
		assertEquals 'com.dev.foo', JSON.parse(controller.response.contentAsString).rows[1].namespace				
	}
	
	void testCreatePreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin3')
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.value = '123'
		controller.params.userid = person.id
		
		controller.create()

		assertEquals 'test path', JSON.parse(controller.response.contentAsString).path
		assertEquals 'com.dev.foo', JSON.parse(controller.response.contentAsString).namespace
		assertEquals '123', JSON.parse(controller.response.contentAsString).value		
	}
	
	void testUpdatePreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.params.value = '1234'
		controller.params.userid = person.id
		
		controller.update()
		
		assertEquals 'test path1', JSON.parse(controller.response.contentAsString).path
		assertEquals 'com.dev.foo1', JSON.parse(controller.response.contentAsString).namespace
		assertEquals '1234', JSON.parse(controller.response.contentAsString).value
	}
	
	void testUpdatePreferenceByUnauthorizedUser() {
		loginAsUsernameAndRole('testUser3', ERoleAuthority.ROLE_USER.strVal)
		
		def person = Person.build(username:'testUser3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		controller.params.value = '1234'
		controller.params.userid = person.id
		
		controller.update()
		
		assertEquals '"Error during update: You are not authorized to access this entity. You are not authorized to edit preferences for other users."', controller.response.contentAsString
		assertNull Preference.findByNamespaceAndPath('com.dev.foo1', 'test path1')
	}
	
	void testDeletePreferenceByUsernameAndPathAndNamespace() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		assertNotNull Preference.findByUserAndNamespace(person, 'com.dev.foo')
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.username = 'testAdmin3'
		
		controller.delete()
		
		assertNull Preference.findByUserAndNamespace(person, 'com.dev.foo')
	}
	
	void testDeletePreferenceByPersonIdAndPathAndNamespace() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)

		assertNotNull Preference.findByUserAndNamespace(person, 'com.dev.foo')
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.userid = person.id
		
		controller.delete()
		
		assertNull Preference.findByUserAndNamespace(person, 'com.dev.foo')		
	}
	
	void testDeletePreferenceByUnauthorizedUser() {
		loginAsUsernameAndRole('testUser3', ERoleAuthority.ROLE_USER.strVal)

		def person = Person.build(username:'testUser3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)		

		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo'
		controller.params.path = 'test path'
		controller.params.userid = person.id
		
		controller.delete()

		assertEquals '"Error during delete: You are not authorized to access this entity. You are not authorized to delete preferences for other users."', controller.response.contentAsString
		assertNotNull Preference.findByNamespaceAndPath('com.dev.foo', 'test path')
				
	}
	
	void testDeleteNonexistentPreference() {
		loginAsUsernameAndRole('testAdmin3', ERoleAuthority.ROLE_ADMIN.strVal)
		
		def person = Person.build(username:'testAdmin3')
		def preference = Preference.build(path:'test path', namespace:'com.dev.foo', value:'123', user:person)
		
		assertNotNull Preference.findByUserAndNamespace(person, 'com.dev.foo')
		
		controller = new PreferenceController()
		controller.preferenceService = preferenceService
		controller.request.contentType = "text/json"
		
		controller.params.namespace = 'com.dev.foo1'
		controller.params.path = 'test path1'
		
		controller.delete()

		assertEquals '{"success":true,"preference":null}', controller.response.contentAsString
		assertNotNull Preference.findByUserAndNamespace(person, 'com.dev.foo')		
	}
}
