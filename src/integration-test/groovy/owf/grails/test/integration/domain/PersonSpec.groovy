package owf.grails.test.integration.domain

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin

import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.ServiceModelService
import ozone.owf.grails.services.model.PersonServiceModel
import ozone.owf.grails.services.model.ServiceModel


@Integration
@Rollback
class PersonSpec extends Specification implements OwfSpecMixin {

    private static final String USERNAME_WITH_APOSTROPHE = "mo'neil"
    private static final String REAL_NAME_WITH_APOSTROPHE = "Mike O'Neil"

    @Autowired
    ServiceModelService serviceModelService

    // test fails in oracle if constraint is nullable false because Oracle tries to store a '' as a null
    // may be fixed in driver for Oracle 11
    void testEmptyDescription() {
        when:
        def person = createExamplePerson()
        person.description = ''
        save(person)

        then:
        findFirstPerson().description == ''
    }

    void testEmptyEmail() {
        when:
        def person = createExamplePerson()
        person.email = ''
        save(person)

        then:
        findFirstPerson().email == ''
    }

    void testUsernameWithApostrophe() {
        when:
        def person = createExamplePerson()
        person.username = USERNAME_WITH_APOSTROPHE
        save person

        then:
        findFirstPerson().username == USERNAME_WITH_APOSTROPHE
    }

    void testUserRealNameWithApostrophe() {
        when:
        def person = createExamplePerson()
        person.userRealName = REAL_NAME_WITH_APOSTROPHE
        save person

        then:
        findFirstPerson().userRealName == REAL_NAME_WITH_APOSTROPHE
    }

    void testAsJSONWithApostropheInUsername() {
        given:
        def person = createExamplePerson()
        person.username = USERNAME_WITH_APOSTROPHE
        save person

        when:
        ServiceModel personJson = serviceModelService.createServiceModel(findFirstPerson())

        then:
        with(personJson, PersonServiceModel) {
            username == USERNAME_WITH_APOSTROPHE
        }
    }

    void testAsJSONWithApostropheInUserRealName() {
        given:
        def person = createExamplePerson()
        person.userRealName = REAL_NAME_WITH_APOSTROPHE
        save person

        when:
        ServiceModel personJson = serviceModelService.createServiceModel(findFirstPerson())

        then:
        with(personJson, PersonServiceModel) {
            userRealName == REAL_NAME_WITH_APOSTROPHE
        }
    }

    private static Person createExamplePerson() {
        new Person(
                username: 'testuser',
                userRealName: 'Test User',
                passwd: 'passwd',
                enable: true,
                description: 'example description',
                email: 'testuser@domain.com')
    }

    private static Person findFirstPerson() {
        List<Person> persons = Person.findAll()

        assert persons.size() == 1

        Person person = persons[0]

        assert person != null

        person
    }

}
