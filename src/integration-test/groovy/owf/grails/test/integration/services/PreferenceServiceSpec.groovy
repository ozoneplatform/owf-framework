package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.services.PreferenceService

/******************************** THINGS LEFT TO TEST **************************************************
 Test listForAdmin, listForUser, findByUserAndNamespaceAndPath, and findByAdminAndNamespaceAndPath
 when (params?.limit) && (params?.start) && (params?.sort)
 Test create when !preference.save()
 Test deleteForUser when preference.delete() fails
 Test updateForUser when !preference.save()
 ********************************************************************************************************/

@Integration
@Rollback
class PreferenceServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    PreferenceService service

    Person admin1
    Person user1
    Person user2
    Preference pref1
    Preference pref2
    Preference pref3
    Preference pref4
    Preference pref5
    Preference pref6
    Preference pref7
    Preference pref8

    private void setupData() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
        user2 = createUser('user2')

        pref1 = createPreference('namespace1', 'path1', 'value1', admin1)
        pref2 = createPreference('namespace2', 'path2', 'value2', admin1)
        pref3 = createPreference('namespace3', 'path3', 'value3', admin1)
        pref4 = createPreference('namespace1', 'path1', 'value4', user1)
        pref5 = createPreference('namespace2', 'path2', 'value5', user1)
        pref6 = createPreference('namespace1', 'path3', 'value6', user2)
        pref7 = createPreference('namespace1', 'path3', 'value6', user1)
        pref8 = createPreference('namespace1', 'path3', 'value6', admin1)
    }

    void testListAsNonAdmin() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.list()

        then:
        result.success
        result.preference != null
        result.count == 3
    }

    void testListAsAdminShowsAll() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.list()

        then:
        result.success
        result.preference != null
        result.count == 8
    }

    void testListByNamespace() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.list([namespace: 'namespace1'])

        then:
        result.success
        result.preference != null
        result.count == 5
    }


    void testListByNamespaceAndPath() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.list([namespace: 'namespace3', path: 'path3'])

        then:
        result.success
        result.preference != null
        result.preference[0].value == "value3"
        result.count == 1
    }

    void testListByNamespaceAndPathWithDuplicates() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.list([namespace: 'namespace1', path: 'path1'])

        then:
        result.success
        result.preference != null
        result.count == 2
    }


    void testShowForUserWithExistingPreference() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.showForUser([namespace: 'namespace1', path: 'path1'])

        then:
        result.success
        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
            value == "value4"
        }
    }

    void testShowForUserNoLanguageSet() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.showForUser([namespace: 'owf.lang', path: 'language'])

        then:
        result.success
        result.preference == null
    }

    void testShowForUserWithNonExistingPreference() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.showForUser([namespace: 'namespaceX', path: 'pathX'])

        then:
        result.success
        result.preference == null
    }

    void testCreateInvalidPreference_EmptyNamespace() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.create([namespace: '', path: 'pathX', value: 'valueX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testCreateInvalidPreference_NullNamespace() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.create([path: 'pathX', value: 'valueX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testCreateInvalidPreference_NullPath() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.create([namespace: 'foo', value: 'valueX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testCreateInvalidPreference_NullValue() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.create([namespace: 'foo', path: 'pathX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }


    void testCreateValidPreference() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.create([namespace: 'namespaceX', path: 'pathX', value: 'valueX'])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == 'namespaceX'
            path == 'pathX'
            value == 'valueX'
        }
    }

    void testDeepCloneAsUnauthorizedUser() {
        given:
        setupData()
        loggedInAs user2

        when:
        service.deepClone([namespace: 'namespace1', path: 'path1', value: 'clonedValue'], user1.id)

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }


    void testDeepCloneWithNoUserid() {
        given:
        setupData()

        Person user3 = createUser("testUser4")
        loggedInAs user3

        when:
        def result = service.deepClone([namespace: 'namespace1', path: 'path1', value: 'clonedValue'])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == 'namespace1'
            path == 'path1'
            value == 'clonedValue'
            user == user3
        }
    }

    void testDeepCloneAsAdminForAnotherUser() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.deepClone([namespace: 'namespace1', path: 'path1', value: 'clonedValue'], user1.id)

        then:
        result.success

        with(result.preference, Preference) {
            namespace == 'namespace1'
            path == 'path1'
            value == 'clonedValue'
            user == user1
        }
    }

    void testDeleteForAdminAsNonAdminFails() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.deleteForAdmin([namespace: 'namespaceX', path: 'pathX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testDeleteForAdminWithInvalidPreference() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.deleteForAdmin([namespace: 'namespaceX', path: 'pathX', username: admin1.username])

        then:
        result.success
        result.preference == null
    }

    void testDeleteForAdminWithValidPreference() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.deleteForAdmin([namespace: 'namespace1', path: 'path3', username: user2.username])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == 'namespace1'
            path == 'path3'
            user == user2
        }

        flushSession()

        with(service.list()) {
            success
            count == 7
        }
    }

    void testDeleteForAdminWithoutUsernameSpecified() {
        given:
        setupData()
        loggedInAs admin1

        when:
        service.deleteForAdmin([namespace: 'namespace1', path: 'path3'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.NotFound
    }

    void testDeleteForUserAsUnauthorizedUser() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.deleteForUser([namespace: 'namespace1', path: 'path3', userid: user2.id])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testDeleteForUserAsSelf() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.deleteForUser([preference: pref4])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
        }

        flushSession()

        with(service.showForUser([namespace: 'namespace1', path: 'path1'])) {
            success
            preference == null
        }
    }

    void testDeleteForUserWithUserid() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.deleteForUser([namespace: 'namespace1', path: 'path1', userid: user1.id])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
        }

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 7
        }
    }

    void testDeleteForUserWithUsername() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.deleteForUser([namespace: 'namespace1', path: 'path1', username: user1.username])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
        }

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 7
        }
    }

    void testBulkDeleteForAdminAsUnauthorizedUser() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.bulkDeleteForAdmin([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1', username:'${admin1.username}'," +
                                "{namespace:'namespace2', path:'path2', username:'${admin1.username}}," +
                                "{namespace:'namespace3', path:'path3', username:'${admin1.username}'}]"])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testBulkDeleteForAdminWithNullPreferences() {
        given:
        setupData()
        loggedInAs admin1

        when:
        service.bulkDeleteForAdmin([preferencesToDelete: null])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testBulkDeleteForAdmin() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.bulkDeleteForAdmin([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1', username:'${admin1.username}'}," +
                                "{namespace:'namespace2', path:'path2', username:'${admin1.username}'}," +
                                "{namespace:'namespace3', path:'path3', username:'${admin1.username}'}]"])

        then:
        result.success

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 5
        }
    }

    void testBulkDeleteForAdminWithDuplicatePathNames() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.bulkDeleteForAdmin([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1', username:'${admin1.username}'}," +
                                "{namespace:'namespace1', path:'path1', username:'${user1.username}'}]"])

        then:
        result.success

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 6
        }

        service.findPreference([username: admin1.username, namespace: "namespace1", path: "path1"]) == null
        service.findPreference([username: user1.username, namespace: "namespace1", path: "path1"]) == null
    }

    void testBulkDeleteForAdminWithErrorsFails() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.bulkDeleteForAdmin([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1', username:'${admin1.username}'}," +
                                "{namespace:'namespaceX', path:'pathX', username:'${admin1.username}'}," +
                                "{namespace:'namespace3', path:'path3', username:'${admin1.username}'}]"])

        then:
        result.success
        result.preference == null

        // UNCOMMENT THE LINES BELOW ONCE THE TRANSACTION PROPAGATION BUG IS FIXED
        // def result2 = service.listForAdmin([])
        //
        // assert result2.success
        // assert null != result2.preference
        // assert 6 == result2.preference.size
        // assert 6 == result2.count
    }

    void testBulkDeleteForUserWithNullPreferences() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.bulkDeleteForUser([preferencesToDelete: null])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testBulkDeleteForUser() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.bulkDeleteForUser([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1'}," +
                                "{namespace:'namespace2', path:'path2'}]"])

        then:
        result.success

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 1
        }
    }

    void testBulkDeleteForUserWithErrorsFails() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.bulkDeleteForUser([
                preferencesToDelete:
                        "[{namespace:'namespace1', path:'path1'}," +
                                "{namespace:'namespaceX', path:'pathX'}]"])

        then:
        result.success
        result.preference == null

        // UNCOMMENT THE LINES BELOW ONCE THE TRANSACTION PROPAGATION BUG IS FIXED
        // def result2 = service.listForUser([])
        //
        // assert result2.success
        // assert null != result2.preference
        // assert 2 == result2.preference.size
        // assert 4 == result2.count
    }

    /*void testUpdateForUserAsUnauthorizedUser() {
        loginAsUsernameAndRole('testUser1', 'ROLE_USER')

        def params = [userid:testAdmin1.id]

        shouldFail(OwfException){
            def result = service.updateForUser(params)
        }

        try {
            def result = service.updateForUser(params)
        } catch(e) {
            assert OwfException == e.class
            assert 'You are not authorized to edit preferences for other users.' == e.message
            assert OwfExceptionTypes.Authorization == e.exceptionType
        }
    }*/

    void testUpdateForUserAsAdmin() {
        given:
        setupData()
        loggedInAs admin1

        when:
        def result = service.updateForUser(
                [userid: user1.id, namespace: 'namespace1', path: 'path1', value: 'updatedValue'])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
            value == "updatedValue"
            user == user1
        }
    }

    void testUpdateForUserAsSelf() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.updateForUser([namespace: 'namespace1', path: 'path1', value: 'updatedValue'])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "path1"
            value == "updatedValue"
            user == user1
        }
    }

    void testUpdateForUserCreatesPreferenceIfItDoesntExist() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.updateForUser([namespace: 'namespace1', path: 'newPath', value: 'newValue'])

        then:
        result.success

        with(result.preference, Preference) {
            namespace == "namespace1"
            path == "newPath"
            value == "newValue"
            user == user1
        }

        flushSession()

        with(service.list()) {
            success
            preference != null
            count == 4
        }
    }

    void testUpdateForUserInvalidPreference() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.updateForUser([namespace: '', path: 'pathX', value: 'valueX'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testUpdateForUserInvalidPreferenceValue() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.updateForUser([namespace: 'namespace1', path: 'path1', value: null])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    private static Preference createPreference(String namespace, String path, String value, Person user) {
        save new Preference(namespace: namespace, path: path, value: value, user: user)
    }

}
