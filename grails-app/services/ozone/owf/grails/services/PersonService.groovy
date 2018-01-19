package ozone.owf.grails.services

import org.springframework.transaction.annotation.Transactional

import org.hibernate.CacheMode

import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack


@Transactional
class PersonService {

    @Transactional
    void save(Person person){
        person.save()        
    }

    @Transactional(readOnly = true)
    Set<Group> findStackDefaultGroupsFor(Person person) {
        Group.withCriteria(uniqueResult: true) {
            eq('stackDefault', true)
            people {
                eq('id', person.id)
            }
        } as Set
    }

    @Transactional(readOnly = true)
    Set<Group> findNonStackDefaultGroupsFor(Person person) {
        Group.withCriteria {
            people {
                eq('id', person.id)
            }
            eq('status','active')
            eq('stackDefault', false)
            cache(true)

            //turn cache mode to GET which means don't use instances from this query for the 2nd level cache
            //seems to be a bug where the people collection is cached with only one person due to the people association filter above
            cacheMode(CacheMode.GET)
        } as Set ?: new HashSet<Group>()
    }

    @Transactional(readOnly = true)
    Set<Stack> findStacksOwnedBy(Person person) {
        Stack.findAllByOwner(person)?.toSet() ?: new HashSet<>()
    }

}
