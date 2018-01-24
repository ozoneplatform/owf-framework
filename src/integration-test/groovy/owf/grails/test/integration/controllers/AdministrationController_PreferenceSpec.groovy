package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.JsonUtil
import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.AdministrationController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference


@Integration
@Rollback
class AdministrationController_PreferenceSpec extends Specification
        implements ControllerTestMixin<AdministrationController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    List<Preference> preferences = new ArrayList<>()

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    private void createPreferences(int num, Map preferenceArgs = [:]) {
        (0..<num).each { createPreference(preferenceArgs) }
    }

    private Preference createPreference(Map preferenceArgs = [:]) {
        def count = preferences.size()

        def presetArgs = [namespace: "com.foo.bar$count",
                          path     : "test path entry $count",
                          value    : 'value',
                          user     : admin1]

        def args = presetArgs + preferenceArgs

        def preference = save new Preference(args)

        preferences << preference

        preference
    }

    void testAddPreferenceSubmit() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([namespace      : 'com.foo.bar',
                path           : 'test path entry 5',
                value          : 'value',
                isExtAjaxFormat: true,
                checkedTargets : admin1.id])

        controller.addCopyPreferenceSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            namespace == 'com.foo.bar'
            path == 'test path entry 5'
            assignedCount == 1
        }

        and: "Preference has been stored with new values"
        with(Preference.findByUser(admin1)) {
            user == admin1
            namespace == 'com.foo.bar'
            path == 'test path entry 5'
            value == 'value'
        }
    }

    void testCopyPreferencesSubmit() {
        given:
        setupUsers()
        loggedInAs admin1

        def preference = createPreference()

        when:
        params([namespace      : preference.namespace,
                path           : preference.path,
                value          : preference.value,
                isExtAjaxFormat: true,
                checkedTargets : user1.id])

        controller.addCopyPreferenceSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success == true
            namespace == preference.namespace
            path == preference.path
            assignedCount == 1
        }

        and: "Preference has been stored with new values"
        with(Preference.findByUser(user1)) {
            user == user1
            namespace == preference.namespace
            path == preference.path
            value == preference.value
        }
    }

    void testUpdatePreference() {
        given:
        setupUsers()
        loggedInAs admin1

        def preference = createPreference()

        when:
        def newPath = "${preference.path} new"
        def newNamespace = "${preference.namespace}.new"
        def newValue = "value.value"

        params([originalNamespace: preference.namespace,
                originalPath     : preference.path,
                namespace        : newNamespace,
                path             : newPath,
                value            : newValue])

        updatePreference()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            path == newPath
            namespace == newNamespace
            value == newValue
            user.userId == this.admin1.username
        }

        and: "Preference has been stored with new values"
        with(Preference.findByUser(admin1)) {
            user == this.admin1
            path == newPath
            namespace == newNamespace
            value == newValue
        }
    }

    void testListPreferences() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreferences(3)

        when:
        controller.listPreferences()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 3
            rows*.path == this.preferences*.path
            rows*.namespace == this.preferences*.namespace
        }
    }

    void testListPreferencesWithNamespaceParam() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreference([namespace: 'com.foo'])
        createPreferences(3, [namespace: 'com.foo.bar'])

        when:
        params([namespace: 'com.foo.bar'])

        controller.listPreferences()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 3
            rows*.path == this.preferences[1..3]*.path
            rows*.namespace == this.preferences[1..3]*.namespace
        }
    }

    void testDeletePreferencesByPersonId() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreferences(2)
        def target = createPreference()

        when:
        params([namespace: target.namespace,
                path     : target.path,
                userid   : admin1.id])

        deletePreferences()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == target.id
            namespace == target.namespace
            path == target.path
            value == target.value
            user.userId == target.user.username
        }

        Preference.count() == 2
    }

    void testDeletePreferencesByPersonUsername() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreferences(2)
        def target = createPreference()

        when:
        params([namespace: target.namespace,
                path     : target.path,
                username : admin1.username])

        deletePreferences()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == target.id
            namespace == target.namespace
            path == target.path
            value == target.value
            user.userId == target.user.username
        }

        Preference.count() == 2
    }

    void testDeleteNonexistentPreference() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreferences(2)
        def target = createPreference()

        when:
        params([namespace: target.namespace,
                path     : target.path + " bad!",
                username : admin1.username])

        deletePreferences()

        then:
        responseStatus == HttpStatus.OK // TODO: Why OK for a failed

        with(responseJson) {
            success // TODO: But we didn't succeed... :(
            preference == null
        }

        Preference.count() == 3
    }

    void testBulkDeletePreferences() {
        given:
        setupUsers()
        loggedInAs admin1

        createPreferences(3)

        when:
        def listParams = JsonUtil.asJsonString(preferences.collect {
            [namespace: it.namespace,
             path     : it.path,
             username : it.user.username]
        })

        params([preferencesToDelete: listParams])

        deletePreferences()

        then:
        responseStatus == HttpStatus.OK

        responseJson.success

        Preference.count() == 0
    }

    /**
     * A wrapper to controller.deletePreferences() that flushes the session after.
     *
     * @todo Should be inlined if the service is modified to no longer require the flush.
     */
    private void deletePreferences() {
        controller.deletePreferences()

        flushSession()
    }

    /**
     * A wrapper to controller.updatePreference() that flushes the session after.
     *
     * @todo Should be inlined if the service is modified to no longer require the flush.
     */
    private void updatePreference() {
        controller.updatePreference()

        flushSession()
    }

}
