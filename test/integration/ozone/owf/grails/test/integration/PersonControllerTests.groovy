package ozone.owf.grails.test.integration

import grails.converters.JSON
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Role
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.controllers.PersonController

class PersonControllerTests extends OWFGroovyTestCase {
	
	def controller

    void setUp() {
      controller = new PersonController()
      controller.accountService = accountService
      controller.request.contentType = "text/json"
    }

    void testListPersons() {
      Person.build(username: 'testAdmin1')
      Person.build(username: 'testUser1')
      loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

      controller.list()

      assertEquals true, JSON.parse(controller.response.contentAsString).success
      assertEquals 2, JSON.parse(controller.response.contentAsString).data.size()
    }

    void XtestListActionWithMaxParam() {
		Person.build(username:'person1')
		Person.build(username:'person2')
		Person.build(username:'person3')
		Person.build(username:'person4')
		Person.build(username:'person5')

	
		controller.params.max = 3
		controller.list()

                assertEquals true, JSON.parse(controller.response.contentAsString).success
                def personList = JSON.parse(controller.response.contentAsString).data
		assertEquals 3, personList.size()
		assertEquals 'person1', personList[0].username
		assertEquals 'person2', personList[1].username
		assertEquals 'person3', personList[2].username		
	}
	
	void XtestListActionWithoutMaxParams() {
		Person.build(username:'person1')
		Person.build(username:'person2')
		Person.build(username:'person3')
		Person.build(username:'person4')
		Person.build(username:'person5')
		
		
		 controller.list()

                assertEquals true, JSON.parse(controller.response.contentAsString).success
		def personList = JSON.parse(controller.response.contentAsString).data
		
		assertEquals 'person1', model.personList[0].username
		assertEquals 'person2', model.personList[1].username
		assertEquals 'person3', model.personList[2].username		
		assertEquals 'person4', model.personList[3].username
		assertEquals 'person5', model.personList[4].username		
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

		assertEquals 'person1', model.person.username
		assertEquals 2, model.roleNames.size()
		assertEquals 'ADMIN', model.roleNames[0]
		assertEquals 'USER', model.roleNames[1]
	}
	
	void testShowActionForNonexistentPerson() {
		
		controller.params.id = 5 // non existent person id
		controller.show()

		assertNull Person.get(controller.params.id)
		assertEquals "Person not found with id " + controller.params.id, controller.flash.message
		assertEquals "/person/list", controller.response.redirectedUrl
	}
	
	void testDeleteAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin2')

		assertEquals 'testAdmin2', Person.get(person.id).username

		controller.params.data = '[{"id":'+person.id+'}]'
		controller.delete()
		
		assertNull Person.get(person.id)
	}
	
	void XtestDeleteActionForNonExistentPerson() {
		
		controller.params.id = 5 // non existent person id
		controller.delete()
		
		assertNull Person.get(controller.params.id)
		assertEquals "Person not found with id " + controller.params.id, controller.flash.message
		assertEquals "/person/list", controller.response.redirectedUrl
	}
	
	void testUpdateAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'person1', userRealName:'Person', description:'Updating Person')

         controller.params.data = [[
                 id: person.id,
                 username: 'person1',
                 userRealName: "New Person",
                 description: "Updated Person"
         ]].asType(JSON).toString()

		controller.createOrUpdate()

		person = Person.get(person.id)
		assertEquals "New Person", person.userRealName
		assertEquals "Updated Person", person.description
	}
	
	void XtestCreateAction() {
		def roleUser = Role.build(authority:'USER', description:'Role User')
		def roleAdmin = Role.build(authority:'ADMIN', description:'Role Admin')

		def authorities = []
		authorities << roleUser
		authorities << roleAdmin
		
		
		controller.params.username = 'testUser'
		controller.params.userRealName = 'test user'
		controller.params.description = 'new test user'
		controller.params.passwd = 'password'
		controller.params.authorities = authorities
		
		controller.create()
		def person = Person.findByUsername('testUser')

		assertEquals "/person/show/"+person.id, controller.response.redirectedUrl
		assertEquals "testUser", person.username
		assertEquals "test user", person.userRealName
		assertEquals "new test user", person.description
	}
	
	void testWhoamiAction() {
		loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
		def person = Person.build(username:'testAdmin1', userRealName:'Test Admin 1', email: 'testAdmin1@ozone.com')

	
		controller.whoami()

		assertEquals(([
                currentUserName:person.username,
                currentUser:person.userRealName,
                currentUserPrevLogin:person.prevLogin,
                currentId:person.id,
                email: person.email
        ] as JSON).toString(), controller.response.contentAsString)
	}
}
