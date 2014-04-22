package ozone.owf.grails.test.integration

import grails.converters.JSON
import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Role
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.controllers.PersonController

@TestMixin(IntegrationTestMixin)
class PersonControllerTests extends OWFGroovyTestCase {

	def controller

    void setUp() {
        super.setUp()
        cleanup()

        controller = new PersonController()
        controller.accountService = accountService
        controller.request.contentType = "text/json"
    }

    void tearDown() {
        super.tearDown()
        cleanup()
    }

    void cleanup() {
        Person.withTransaction { Person.list().each { it.delete() } }
    }

    void testListPersons() {
      Person.build(username: 'testAdmin1')
      Person.build(username: 'testUser1')
      loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

      controller.list()

      assert true == JSON.parse(controller.response.contentAsString).success
      assert 2 == JSON.parse(controller.response.contentAsString).data.size()
    }

	void testShowAction() {
		def roleUser = Role.build(authority:'USER', description:'Role User')
		def roleAdmin = Role.build(authority:'ADMIN', description:'Role Admin')

		def authorities = []
		authorities << roleUser
		authorities << roleAdmin

		def person = Person.build(username:'person1', authorities:authorities)


		controller.params.id = person.id
		def model = controller.show()

		assert 'person1' == model.person.username
		assert 2 == model.roleNames.size()
		assert 'ADMIN' == model.roleNames[0]
		assert 'USER' == model.roleNames[1]
	}

	void testShowActionForNonexistentPerson() {

		controller.params.id = 5 // non existent person id
		controller.show()

		assert Person.get(controller.params.id) == null
		assert "Person not found with id " + controller.params.id == controller.flash.message
		assert "/person/list" == controller.response.redirectedUrl
	}

	void testDeleteAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin2')

		assert 'testAdmin2' == Person.get(person.id).username

		controller.params.data = '[{"id":'+person.id+'}]'
		controller.delete()

		assert Person.get(person.id) == null
	}

	void testUpdateAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'person1', userRealName:'Person', description:'Updating Person').save(failOnError: true)

         controller.params.data = [[
                 id: person.id,
                 username: 'person1',
                 userRealName: "New Person",
                 description: "Updated Person"
         ]].asType(JSON).toString()

		controller.createOrUpdate()

		person = Person.get(person.id)
println "Person = ${person.dump()}"
		assert "New Person" == person.userRealName
		assert "Updated Person" == person.description
	}

	void testWhoamiAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin1', userRealName:'Test Admin 1', email: 'testAdmin1@ozone.com')


		controller.whoami()

		assert ([
            currentUserName:person.username,
            currentUser:person.userRealName,
            currentUserPrevLogin:person.prevLogin,
            currentId:person.id,
            email: person.email
        ] as JSON).toString() == controller.response.contentAsString
	}
}
