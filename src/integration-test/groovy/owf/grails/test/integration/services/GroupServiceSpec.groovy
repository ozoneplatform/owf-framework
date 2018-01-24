package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.GroupService

import static groovy.json.JsonOutput.toJson


@Integration
@Rollback
class GroupServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    GroupService service

    Group group1

    Person admin1
    Person user1

    private void setupData() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')

        group1 = save new Group(name: 'Group1',
                automatic: false,
                status: 'active',
                stackDefault: true)
    }

    void delete_whenNotAdmin_shouldThrowException() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.delete([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void delete() {
        given:
        setupData()
        loggedInAs admin1

        when:
        service.delete([data: toJson([id: group1.id])])

        def ret = service.list([:])

        then:
        ret.results == 0
    }

}
