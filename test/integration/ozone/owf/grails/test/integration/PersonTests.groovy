package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.domain.Person

@TestMixin(IntegrationTestMixin)
class PersonTests {

    boolean transactional = true

    def serviceModelService

    void setUp() {
        tearDown()
    }

    void tearDown() {
        Person.withTransaction {
            Person.findAll().each { it.delete() }
        }
    }

    void testEmptyDescription() {
        // test fails in oracle if constraint is nullable false because Oracle tries to store a '' as a null
        // may be fixed in driver for Oracle 11
        def person = new Person(username: 'testuser', userRealName: 'Test User', passwd: 'passwd', enable: true, email: 'something')
        person.description = ''
        assert 0 == Person.count()

        Person.withTransaction {
            person.save(flush:true, failOnError: true)
        }

        assert 1 == Person.count()
        assert '' == person.description
    }

    void testEmptyEmail() {
        // test fails in oracle if constraint is nullable false because Oracle tries to store a '' as a null
        // may be fixed in driver for Oracle 11
        assert 0 == Person.count()
        def person = new Person(username: 'testuser', userRealName: 'Test User', passwd: 'passwd', enable: true, description: 'something')
        person.email = ''


        Person.withTransaction {
            person.save(flush:true, failOnError: true)
        }

        assert 1 == Person.count()
        assert '' == person.email
    }

    void testUsernameWithApostrophe() {
        assert 0 == Person.count()
        def username = "Mike O'Neil"
        def person = new Person(
                username: username,
                userRealName: "Mike O'Neil",
                passwd: 'passwd',
                enable: true,
                description: 'something')


        Person.withTransaction {
            person.save(flush:true, failOnError: true)
        }

        def retrievedPerson = Person.findAll()[0]
        assert username == retrievedPerson.username
    }

    void testUserRealNameWithApostrophe() {
        assert 0 == Person.count()
        def userRealName = "Mike O'Neil"
        def person = new Person(
                username: "Mike O'Neil",
                userRealName: userRealName,
                passwd: 'passwd',
                enable: true,
                description: 'something')


        Person.withTransaction {
            person.save(flush:true, failOnError: true)
        }

        def retrievedPerson = Person.findAll()[0]
        assert userRealName == retrievedPerson.userRealName
    }

    void testAsJSONWithApostropheInUsername() {
	    def username = "Mike O'Leary"

	    def person = new Person(
	        username: username,
	        userRealName: "Mike OLeary with no apos",
	        passwd: "password",
	        enabled: true
	    )

        Person.withTransaction {
            assert person.validate()
            person.save(failOnError: true)
        }

        def retrievedPerson = Person.findByUsername(username)
	    assert username == serviceModelService.createServiceModel(retrievedPerson).username
	}

    void testAsJSONWithApostropheInUserRealName() {
	    def userRealName = "Mike O'Leary"

	    def person = new Person(
	        username: "moleary",
	        userRealName: userRealName,
	        passwd: "password",
	        enabled: true
	    )

        Person.withTransaction {
            assert person.validate()
            person.save(failOnError: true)
        }

        def retrievedPerson = Person.findByUserRealName(userRealName)
	    assert userRealName == serviceModelService.createServiceModel(retrievedPerson).userRealName
	}
}
