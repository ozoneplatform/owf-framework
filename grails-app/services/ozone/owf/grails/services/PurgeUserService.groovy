package ozone.owf.grails.services

import ozone.owf.grails.domain.Person
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
        person.delete()
    }
}