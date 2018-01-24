package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.PreferenceController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference

import static owf.grails.test.integration.DomainBuilders.createPreference


@Integration
@Rollback
class PreferenceControllerSpec extends Specification
        implements ControllerTestMixin<PreferenceController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1
    Person user2

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
        user2 = createUser('user2')
    }

    void show() {
        given:
        setupUsers()
        loggedInAs admin1

        def pref = createPreference(admin1)

        when:
        params([prefNamespace: pref.namespace,
                path         : pref.path])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == pref.id
            user.userId == this.admin1.username
            namespace == pref.namespace
            path == pref.path
        }
    }

    void show_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([prefNamespace: 'com.missing',
                path         : 'not here'])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            preference == null
        }
    }

    void doesPreferenceExist() {
        given:
        setupUsers()
        loggedInAs admin1

        def pref = createPreference(admin1)

        when:
        params([prefNamespace: pref.namespace,
                path         : pref.path])

        controller.doesPreferenceExist()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            preferenceExist
            statusCode == 200
        }
    }

    void doesPreferenceExist_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([prefNamespace: 'com.missing',
                path         : 'not here'])

        controller.doesPreferenceExist()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            !preferenceExist
            statusCode == 200
        }
    }

    void list_byUser() {
        given:
        setupUsers()
        loggedInAs user1

        createPreference(admin1, [namespace: 'com.foo.bar', path: 'foo 1'])
        def pref1 = createPreference(user1, [namespace: 'com.foo.bar', path: 'foo 1'])
        def pref2 = createPreference(user1, [namespace: 'com.foo.bar', path: 'foo 2'])

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 2
            rows*.id.sort() == [pref1.id, pref2.id]
        }
    }

    void list_byUserAndNamespace() {
        given:
        setupUsers()
        loggedInAs user1

        createPreference(user1, [namespace: 'com.foo.qux', path: 'foo 1'])
        def pref1 = createPreference(user1, [namespace: 'com.foo.bar', path: 'foo 1'])
        def pref2 = createPreference(user1, [namespace: 'com.foo.bar', path: 'foo 2'])

        when:
        params([prefNamespace: pref1.namespace])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 2
            rows*.id.sort() == [pref1.id, pref2.id]
        }
    }

    void create() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        params([prefNamespace: 'com.foo.bar',
                path         : 'fizz buzz',
                value        : '123'])

        controller.create()

        def result = responseJson

        then:
        responseStatus == HttpStatus.OK

        with(result) {
            id != null
            namespace == 'com.foo.bar'
            path == 'fizz buzz'
            user.userId == this.user1.username
        }

        and:
        with(Preference.findById(result.id)) {
            namespace == 'com.foo.bar'
            path == 'fizz buzz'
            user == this.user1
        }
    }

    void update() {
        given:
        setupUsers()
        loggedInAs user1

        def pref = createPreference(user1)

        def newNamespace = pref.namespace + ".biz"
        def newPath = pref.path + " quack"
        def newValue = pref.value + "4"

        when:
        params([prefNamespace: newNamespace,
                path         : newPath,
                value        : newValue])

        controller.update()

        def result = responseJson

        then:
        responseStatus == HttpStatus.OK

        with(result) {
            id != pref.id
            namespace == newNamespace
            path == newPath
            user.userId == this.user1.username
        }

        and:
        with(Preference.findById(result.id)) {
            namespace == newNamespace
            path == newPath
            user == this.user1
        }
    }

    void update_forOtherUser_notAuthorized() {
        given:
        setupUsers()
        loggedInAs user1

        def pref = createPreference(user2)

        def newNamespace = pref.namespace + ".biz"
        def newPath = pref.path + " quack"
        def newValue = pref.value + "4"

        when:
        params([prefNamespace: newNamespace,
                path         : newPath,
                value        : newValue,
                userid       : user2.id])

        controller.update()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED

        responseString == '"Error during update: You are not authorized to access this entity. You are not authorized to edit preferences for other users."'

        and:
        Preference.findByNamespaceAndPath(newNamespace, newPath) == null
    }

    void delete_byNamespaceAndPath() {
        given:
        setupUsers()
        loggedInAs user1

        def pref = createPreference(user1)

        assert Preference.findAllByUser(user1).size() == 1

        when:
        params([prefNamespace: pref.namespace,
                path         : pref.path])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == pref.id
            namespace == pref.namespace
            path == pref.path
            value == pref.value
            user.userId == this.user1.username
        }

        and:
        Preference.findAllByUser(user1).size() == 0
    }

    void delete_asAdmin_byPersonIdAndPathAndNamespace() {
        given:
        setupUsers()
        loggedInAs admin1

        def pref = createPreference(user1)

        assert Preference.findAllByUser(user1).size() == 1

        when:
        params([prefNamespace: pref.namespace,
                path         : pref.path,
                userid       : user1.id])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            id == pref.id
            namespace == pref.namespace
            path == pref.path
            value == pref.value
            user.userId == this.user1.username
        }

        and:
        Preference.findAllByUser(user1).size() == 0
    }

    void delete_forOtherUser_notAuthorized() {
        given:
        setupUsers()
        loggedInAs user1

        def pref = createPreference(user2)

        when:
        params([prefNamespace: pref.namespace,
                path         : pref.path,
                userid       : user2.id])

        controller.delete()

        then:
        responseStatus == HttpStatus.UNAUTHORIZED

        responseString == '"Error during delete: You are not authorized to access this entity. You are not authorized to delete preferences for other users."'

        and:
        Preference.findAllByUser(user2).size() == 1
    }

    void delete_notFound() {
        given:
        setupUsers()
        loggedInAs user1

        def pref = createPreference(user1)

        assert Preference.findAllByUser(user1).size() == 1

        when:
        params([prefNamespace: pref.namespace + ".qux",
                path         : pref.path])

        controller.delete()

        flushSession()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            preference == null
        }

        and:
        Preference.findAllByUser(user1).size() == 1
    }
}
