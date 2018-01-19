package owf.grails.test.integration.domain

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.services.ServiceModelService


@Integration
@Rollback
class PreferenceSpec extends Specification implements OwfSpecMixin {

    @Autowired
    ServiceModelService serviceModelService

    /**
     * OWF-1052: The asJSON method was calling StringEscapeUtils.escapeJavaScript on class variables. This
     * was causing the escaped values to be saved to the database. For example; let say you created a
     * preference with the value of "I can't do it". After you saved it was stored in the db as entered.
     * Then you refresh your admin screen. Now the database has "I can\'t do it". What happened? Well, the
     * preference list rest call was calling the asJSON method of each retrieved preference. Whenever a
     * parse error occurred when trying to generate the JSON (which was the first time you hit a character
     * that needs to be escaped in JS) we would escape the characters in the class variable. This was marking
     * them dirty in GORM and being committed back to the db when the transaction committed (even on a list
     * or a show)
     */
    void testAsJsonNotEscapingCharactersInTheDB() {
        given:
        Person user = createUser('user1')

        and:
        def expectedValue = "I can't do it"

        Preference preference = save new Preference(
                namespace: "com.company.widget",
                path: "status",
                value: expectedValue,
                user: user)

        when:
        serviceModelService.createServiceModel(preference)

        then:
        preference.value == expectedValue
        preference.user.username == user.username
    }

}
