package ozone.owf.grails.services

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Dashboard
import ozone.owf.enums.OwfApplicationSetting

class PurgeUserService {
    def owfApplicationConfigurationService

    void purgeInactiveAccounts() {
        def thresholdInDays = owfApplicationConfigurationService.valueOf(OwfApplicationSetting.INACTIVITY_THRESHOLD)
        List<Person> inactiveAccounts = getInactiveAccounts(thresholdInDays)
        inactiveAccounts.each { account ->
            Person person = Person.findByUsername(account.username)
            if (person) {
                purgeUser(person)
            }
        }
    }

    List<Person> getInactiveAccounts(def thresholdInDays) {
        Date cutOffDate = new Date().minus(thresholdInDays.toInteger())
        List<Person> inactiveAccounts = Person.findAllByLastLoginLessThan(cutOffDate)
        return inactiveAccounts
    }

    void purgeUser(Person person) {
        //we need to make a copy of the list of groups because hibernate will update the same list when a the user is
        //removed from the group
        def groups = person.groups.collect{it}
        groups.each { it.removeFromPeople(person) }

        //we need to unset audit log fields which will
        //cause a constraint violation if we let grails simply cascade delete the user

        //search through all dashboards for dashboards which have reference to the user being deleted
        def dashboards = Dashboard.withCriteria { eq('createdBy',person) }

        //if there are any dashboards unassign this user from the fields
        dashboards.each {
            //explicitly clear those audit log fields
            it.createdBy = null
        }

        //search through all dashboards for dashboards which have reference to the user being deleted
        dashboards = Dashboard.withCriteria { eq('editedBy',person) }

        //if there are any dashboards unassign this user from the fields
        dashboards.each {
            //explicitly clear those audit log fields
            it.editedBy = null
        }

        //delete person
        person.delete()
    }
}