package ozone.owf.grails.test.integration

import ozone.owf.grails.domain.Person

class PersonTests extends GroovyTestCase {
    
    boolean transactional = false

    def serviceModelService

    void tearDown() {
        Person.withTransaction {
            Person.findAll().each { it.delete() }            
        }

    }

    void testEmptyDescription() {
        // test fails in oracle if constraint is nullable false because Oracle tries to store a '' as a null
        // may be fixed in driver for Oracle 11
        def person = new Person(username: 'testuser', userRealName: 'Test User', passwd: 'passwd', enable: true, email: 'something', lastLogin: '01/01/2009')
        person.description = ''
        assertEquals 0, Person.count()

        Person.withTransaction {
            assertTrue person.validate()
            person.save()
        }
        
        assertEquals 1, Person.count()
        assertEquals '', person.description
        //assertEquals '', person.refresh().description #broken for oracle, return null
    }
    
    void testEmptyEmail() {
        // test fails in oracle if constraint is nullable false because Oracle tries to store a '' as a null
        // may be fixed in driver for Oracle 11
        assertEquals 0, Person.count()
        def person = new Person(username: 'testuser', userRealName: 'Test User', passwd: 'passwd', enable: true, description: 'something', lastLogin: '01/01/2009')
        person.email = ''
        
        
        Person.withTransaction {
            assertTrue person.validate()
            person.save()
        }
        
        assertEquals 1, Person.count()
        assertEquals '', person.email
        //assertEquals '', person.refresh().email #broken for oracle, return null
    }

    void testUsernameWithApostrophe() {
        assertEquals 0, Person.count()
        def username = "Mike O'Neil"
        def person = new Person(
                username: username,
                userRealName: "Mike O'Neil",
                passwd: 'passwd',
                enable: true,
                description: 'something',
                lastLogin: '01/01/2009')


        Person.withTransaction {
            assertTrue person.validate()
            person.save()
        }

        def retrievedPerson = Person.findAll()[0]
        assertEquals username, retrievedPerson.username        
    }

    void testUserRealNameWithApostrophe() {
        assertEquals 0, Person.count()
        def userRealName = "Mike O'Neil"
        def person = new Person(
                username: "Mike O'Neil",
                userRealName: userRealName,
                passwd: 'passwd',
                enable: true,
                description: 'something',
                lastLogin: '01/01/2009')


        Person.withTransaction {
            assertTrue person.validate()
            person.save()
        }

        def retrievedPerson = Person.findAll()[0]
        assertEquals userRealName, retrievedPerson.userRealName
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
            assertTrue person.validate()
            person.save()
        }

        def retrievedPerson = Person.findByUsername(username)
	    assertEquals username, serviceModelService.createServiceModel(retrievedPerson).username
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
            assertTrue person.validate()
            person.save()
        }

        def retrievedPerson = Person.findByUserRealName(userRealName)
	    assertEquals userRealName, serviceModelService.createServiceModel(retrievedPerson).userRealName
	}
}
