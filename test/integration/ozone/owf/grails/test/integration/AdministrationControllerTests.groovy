package ozone.owf.grails.test.integration

import grails.converters.JSON
import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import org.codehaus.groovy.grails.web.json.JSONArray
import org.codehaus.groovy.grails.web.json.JSONObject
import ozone.owf.grails.controllers.AdministrationController
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Role
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.services.ServiceModelService

@TestMixin(IntegrationTestMixin)
class AdministrationControllerTests extends OWFGroovyTestCase {

    //def accountService
    def preferenceService
    def administrationService
    def widgetDefinitionService
    def personWidgetDefinitionService
    def dashboardService
    def serviceModelService
    def controller

    void setUp(){
    }

    void tearDown() {

    }
    void testListWidgetDefinitions() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        controller = new AdministrationController()
        controller.widgetDefinitionService = widgetDefinitionService
        WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/widgetC.gif',
            imageUrlSmall : '../images/blue/icons/widgetContainer/widgetCsm.gif',
            widgetGuid : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            universalName : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            widgetVersion: '1.0',
            widgetUrl : '../examples/fake-widgets/widget-c.html',
            width : 980
        )

        controller.params.id = '0c5435cf-4021-4f2a-ba69-dde451d12551'

        controller.listWidgetDefinitions()
    }

    void testDeletWidgetDefintions() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        controller = new AdministrationController()
        controller.widgetDefinitionService = widgetDefinitionService
        WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/widgetC.gif',
            imageUrlSmall : '../images/blue/icons/widgetContainer/widgetCsm.gif',
            widgetGuid : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            universalName : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            widgetVersion: '1.0',
            widgetUrl : '../examples/fake-widgets/widget-c.html',
            width : 980
        )

        assert null != WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')

        controller.params.data = '[{"id":"0c5435cf-4021-4f2a-ba69-dde451d12551"}]'
        controller.deleteWidgetDefinitions()
        assert null ==  WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551')
    }

    void testDeletePersons() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        controller = new AdministrationController()
        controller.accountService = accountService
        controller.serviceModelService = serviceModelService
        Person.build(username: 'testAdmin2')

        assert null != Person.findByUsername('testAdmin2')

        controller.params.username = 'testAdmin2'
        controller.deletePersons()
        assert null ==  Person.findByUsername('testAdmin2')
    }

    void testCreateOrUpdatePerson() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        controller = new AdministrationController()
        controller.administrationService = administrationService

        controller.params.data = '[{"username":"testAdmin2", "userRealName":"testAdmin2"}]'
        controller.createOrUpdatePerson()

        controller.params.data = null
        controller.params.id = 12
        controller.params.update_action = true
        controller.createOrUpdatePerson()
    }

    void testListPersonRoles() {
        Role.build(authority:ERoleAuthority.ROLE_ADMIN.strVal, description:'admin')
        Person.build(username:'testAdmin1')
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        controller = new AdministrationController()
        controller.accountService = accountService
        controller.administrationService = administrationService
        controller.listPersonRoles()

        assert true == JSON.parse(controller.response.contentAsString).success
        assert 1 == JSON.parse(controller.response.contentAsString).results
        assert ERoleAuthority.ROLE_ADMIN.strVal == JSON.parse(controller.response.contentAsString).rows[0]
    }

    /**
     * Dashboard Integration Tests
     */
    void testAddDashboardNameDuplicatesForCurrentUser() {
        def person = Person.build(username:'testAdmin1')

        // login as testAdmin1
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        controller = new AdministrationController()
        controller.accountService = accountService
        controller.administrationService = administrationService
        controller.dashboardService = dashboardService
        dashboardService.accountService = accountService
        controller.request.contentType = "text/json"

        controller.params.name = 'dashboard1'
        controller.params.checkedTargets = person.id
        controller.params.guid = '12345678-1234-1234-1234-1234567890a2'

        controller.addCopyDashboardSubmit()
        assert 'dashboard1' == JSON.parse(controller.response.contentAsString).name

        // Request to add another dashboard with the same name as above.
        controller.addCopyDashboardSubmit()

        def dashboards = queryDashboardByUser('testAdmin1', 'dashboard1')

        assert 2 == dashboards.size()
    }

    void testCopyDashboardNameDuplicatesForCurrentUser() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)

        def person = Person.build(username:'testAdmin1')
        def dashboard = Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person)

        controller = new AdministrationController()
        controller.accountService = accountService
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        // Copy the dashboard name and guid from the above existing dashboard
        controller.params.name = dashboard.name
        controller.params.checkedTargets = person.id
        controller.params.guid = dashboard.guid

        controller.addCopyDashboardSubmit()

        def dashboards = queryDashboardByUser('testAdmin1', 'dashboard1')

        assert 2 == dashboards.size()
    }

    void testAddSameDashboardNameForDifferentUser() {
        // login testAdmin1 user
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        controller = new AdministrationController()
        controller.accountService = accountService
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        controller.params.name = 'dashboard1'
        controller.params.checkedTargets = person1.id
        controller.params.guid = 'c65435cf-4021-4f2a-ba69-dde451d12551'

        controller.addCopyDashboardSubmit()
        // Request to add the same dashboard
        controller.addCopyDashboardSubmit()

        def dashboards = queryDashboardByUser('testAdmin1', 'dashboard1')
        assert 2 == dashboards.size()

        // login testAdmin2 user
        loginAsUsernameAndRole('testUser1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person2 = Person.build(username:'testUser1')

        controller.params.name = 'dashboard1'
        controller.params.checkedTargets = person2.id
        controller.params.guid = 'c65435cf-4021-4f2a-ba69-dde451d12551'

        controller.addCopyDashboardSubmit()

        dashboards = queryDashboardByUser('testUser1', 'dashboard1')
        assert 1 == dashboards.size()
    }

    void testCopySameDashboardNameForDifferentUser() {
        // login testAdmin1 user
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')
        def dashboard = Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a0', user:person1)

        controller = new AdministrationController()
        controller.accountService = accountService
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        controller.params.name = 'dashboard1'
        controller.params.checkedTargets = person1.id
        controller.params.guid = 'c65435cf-4021-4f2a-ba69-dde451d12551'

        // Requesting to copy dashboard with the same name as above for testAdmin1
        controller.addCopyDashboardSubmit()

        def dashboards = queryDashboardByUser('testAdmin1', 'dashboard1')
        assert 2 == dashboards.size()

        // login testAdmin2 user
        loginAsUsernameAndRole('testAdmin2', ERoleAuthority.ROLE_ADMIN.strVal)
        def person2 = Person.build(username:'testAdmin2')

        controller.params.name = dashboard.name
        controller.params.checkedTargets = person2.id
        controller.params.guid = dashboard.guid

        // Request to add dashboard for testAdmin2
        controller.addCopyDashboardSubmit()

        dashboards = queryDashboardByUser('testAdmin2', 'dashboard1')
        assert 1 == dashboards.size()
    }

    void testListDashboards() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', dashboardPosition: 0, guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', dashboardPosition: 1, guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', dashboardPosition: 2, guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.listDashboards()

        assert 3 == JSON.parse(controller.response.contentAsString).rows.size()
        assert 'dashboard1' == JSON.parse(controller.response.contentAsString).rows[0].name
        assert 'dashboard2' == JSON.parse(controller.response.contentAsString).rows[1].name
        assert 'dashboard3' == JSON.parse(controller.response.contentAsString).rows[2].name
    }

    void testListDashboardsByGuidParams() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.guid = "12345678-1234-1234-1234-1234567890a2"
        controller.listDashboards()

        assert 1 == JSON.parse(controller.response.contentAsString).rows.size()
        assert 'dashboard2' == JSON.parse(controller.response.contentAsString).rows[0].name
        assert '12345678-1234-1234-1234-1234567890a2' == JSON.parse(controller.response.contentAsString).rows[0].guid
    }

    void testListDashboardsByIsDefaultParams() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1, isdefault:false)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1, isdefault:false)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1, isdefault:false)

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.isdefault = false
        controller.params.sort = 'name'
        controller.listDashboards()

        assert 3 == JSON.parse(controller.response.contentAsString).results
        assert 'dashboard1' == JSON.parse(controller.response.contentAsString).rows[0].name
        assert 'dashboard2' == JSON.parse(controller.response.contentAsString).rows[1].name
        assert 'dashboard3' == JSON.parse(controller.response.contentAsString).rows[2].name
    }

    void testUpdateDashboards() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.personId = person1.id
        controller.params.guid = '12345678-1234-1234-1234-1234567890a1'
        controller.params.name = 'dashboard2'
        controller.updateDashboard()

        assert 'dashboard2' == JSON.parse(controller.response.contentAsString).name
        assert 'dashboard1' != JSON.parse(controller.response.contentAsString).name
    }

    void testDeleteDashboardByPersonIdParams() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        assert 3 == Dashboard.list().size()

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.guid = '12345678-1234-1234-1234-1234567890a3'
        controller.params.personId = person1.id
        controller.deleteDashboards()

        assert 2 == Dashboard.list().size()
        assert 'dashboard3' == JSON.parse(controller.response.contentAsString).name
        assert '12345678-1234-1234-1234-1234567890a3' == JSON.parse(controller.response.contentAsString).guid
    }

    void testDeleteDashboardByPersonUsernameParams() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        assert 3 == Dashboard.list().size()

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.guid = '12345678-1234-1234-1234-1234567890a3'
        controller.params.username = person1.username
        controller.deleteDashboards()

        assert 2 == Dashboard.list().size()
        assert 'dashboard3' == JSON.parse(controller.response.contentAsString).name
        assert '12345678-1234-1234-1234-1234567890a3' == JSON.parse(controller.response.contentAsString).guid
    }

    void testDeleteNonexistentDashboard() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        assert 3 == Dashboard.list().size()

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        controller.params.guid = '12345678-1234-1234-1234-1234567890a4'
        controller.params.username = person1.username
        controller.deleteDashboards()

        assert 3 == Dashboard.list().size()
        assert null ==  JSON.parse(controller.response.contentAsString).name
        assert null ==  JSON.parse(controller.response.contentAsString).guid
    }

    void testBulkDeleteDashboardsForAdmin() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person1 = Person.build(username:'testAdmin1')

        Dashboard.build(name:'dashboard1', guid:'12345678-1234-1234-1234-1234567890a1', user:person1)
        Dashboard.build(name:'dashboard2', guid:'12345678-1234-1234-1234-1234567890a2', user:person1)
        Dashboard.build(name:'dashboard3', guid:'12345678-1234-1234-1234-1234567890a3', user:person1)

        assert 3 == Dashboard.list().size()

        controller = new AdministrationController()
        controller.dashboardService = dashboardService
        controller.request.contentType = "text/json"

        def dashboardGuidList = new JSONArray()
        Dashboard.list().each{
            dashboardGuidList.add(it.guid)
        }

        controller.params.guid = '12345678-1234-1234-1234-1234567890a4'
        controller.params._method = 'DELETE'
        controller.params.guid = null
        controller.params.viewGuidsToDelete = dashboardGuidList.toString()
        controller.deleteDashboards()

        assert 0 == Dashboard.list().size()
    }

    /**
     * Preferences Integration Tests
     */

    void testAddPreferenceSubmit() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        controller = new AdministrationController()
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        controller.params.path = "test path entry 5"
        controller.params.value = "value"
        controller.params.namespace = "com.foo.bar"
        controller.params.isExtAjaxFormat = true
        controller.params.checkedTargets = person.id

        controller.addCopyPreferenceSubmit()

        def preference = Preference.findByUser(person)

        assert 'test path entry 5' == JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar' == JSON.parse(controller.response.contentAsString).namespace
        assert 'test path entry 5' == preference.path
        assert 'com.foo.bar' == preference.namespace
    }

    void testCopyPreferencesSubmit() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def personAdmin = Person.build(username:'testAdmin1')
        def personUser = Person.build(username:'testUser1')
        def preference = Preference.build(path:'test path entry 5', namespace:'com.foo.bar', value:'value', user:personAdmin)

        controller = new AdministrationController()
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        controller.params.path = preference.path
        controller.params.value = preference.value
        controller.params.namespace = preference.namespace
        controller.params.isExtAjaxFormat = true
        controller.params.checkedTargets = personUser.id // Copy preference parameters in testAdmin1 to testUser1

        controller.addCopyPreferenceSubmit()

        preference = Preference.findByUser(personUser)

        assert 'test path entry 5' == JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar' == JSON.parse(controller.response.contentAsString).namespace
        assert 'test path entry 5' == preference.path
        assert 'com.foo.bar' == preference.namespace
    }

    void testUpdatePreference() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')
        def preference = Preference.build(path:'test path entry 5', namespace:'com.foo.bar', value:'value', user:person)

        controller = new AdministrationController()
        controller.administrationService = administrationService
        controller.request.contentType = "text/json"

        controller.params.path = "test path entry 6"
        controller.params.originalPath = "test path entry 5"
        controller.params.value = "value.value"
        controller.params.namespace = "com.foo.bar.dev"
        controller.params.originalNamespace = "com.foo.bar"

        controller.updatePreference()

        preference = Preference.findByUser(person)

        assert 'test path entry 6' == JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar.dev' == JSON.parse(controller.response.contentAsString).namespace
        assert 'test path entry 5' != JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar' != JSON.parse(controller.response.contentAsString).namespace
        assert 'test path entry 6' == preference.path
        assert 'com.foo.bar.dev' == preference.namespace
        assert 'test path entry 5' != preference.path
        assert 'com.foo.bar' != preference.namespace
    }

    void testListPreferences() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar1', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar2', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar3', value:'value', user:person)

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.listPreferences()

        assert 3 == JSON.parse(controller.response.contentAsString).results
        assert 'test path entry 1' == JSON.parse(controller.response.contentAsString).rows[0].path
        assert 'test path entry 2' == JSON.parse(controller.response.contentAsString).rows[1].path
        assert 'test path entry 3' == JSON.parse(controller.response.contentAsString).rows[2].path
        assert 'com.foo.bar1' == JSON.parse(controller.response.contentAsString).rows[0].namespace
        assert 'com.foo.bar2' == JSON.parse(controller.response.contentAsString).rows[1].namespace
        assert 'com.foo.bar3' == JSON.parse(controller.response.contentAsString).rows[2].namespace
    }

    void testListPreferencesWithNamespaceParam() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar', value:'value', user:person)

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.params.namespace = 'com.foo.bar'
        controller.listPreferences()

        assert 3 == JSON.parse(controller.response.contentAsString).results
        assert 'test path entry 1' == JSON.parse(controller.response.contentAsString).rows[0].path
        assert 'test path entry 2' == JSON.parse(controller.response.contentAsString).rows[1].path
        assert 'test path entry 3' == JSON.parse(controller.response.contentAsString).rows[2].path
        assert 'com.foo.bar' == JSON.parse(controller.response.contentAsString).rows[0].namespace
        assert 'com.foo.bar' == JSON.parse(controller.response.contentAsString).rows[1].namespace
        assert 'com.foo.bar' == JSON.parse(controller.response.contentAsString).rows[2].namespace
    }

    void testDeletePreferencesByPersonId() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar1', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar2', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar3', value:'value', user:person)

        assert 3 == Preference.list().size()

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.params.path = 'test path entry 2'
        controller.params.namespace = 'com.foo.bar2'
        controller.params.userid = person.id
        controller.deletePreferences()

        assert 2 == Preference.list().size()
        assert 'test path entry 2' == JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar2' == JSON.parse(controller.response.contentAsString).namespace
    }

    void testDeletePreferencesByPersonUsername() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar1', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar2', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar3', value:'value', user:person)

        assert 3 == Preference.list().size()

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.params.path = 'test path entry 1'
        controller.params.namespace = 'com.foo.bar1'
        controller.params.username = person.username
        controller.deletePreferences()

        assert 2 == Preference.list().size()
        assert 'test path entry 1' == JSON.parse(controller.response.contentAsString).path
        assert 'com.foo.bar1' == JSON.parse(controller.response.contentAsString).namespace
    }

    void testDeleteNonexistentPreference() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar1', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar2', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar3', value:'value', user:person)

        assert 3 == Preference.list().size()

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.params.path = 'test path entry'
        controller.params.namespace = 'com.foo.bar'
        controller.params.username = person.username
        controller.deletePreferences()

        assert 3 == Preference.list().size()
        assert null ==  JSON.parse(controller.response.contentAsString).path
        assert null ==  JSON.parse(controller.response.contentAsString).namespace
    }

    void testBulkDeletePreferences() {
        loginAsUsernameAndRole('testAdmin1', ERoleAuthority.ROLE_ADMIN.strVal)
        def person = Person.build(username:'testAdmin1')

        Preference.build(path:'test path entry 1', namespace:'com.foo.bar1', value:'value', user:person)
        Preference.build(path:'test path entry 2', namespace:'com.foo.bar2', value:'value', user:person)
        Preference.build(path:'test path entry 3', namespace:'com.foo.bar3', value:'value', user:person)

        assert 3 == Preference.list().size()

        def preferenceJsonList = new JSONArray()
        Preference.list().each{
            def json = new JSONObject(namespace:it.namespace, path:it.path, username:it.user.username)
            preferenceJsonList.add(json)
        }

        controller = new AdministrationController()
        controller.preferenceService = preferenceService
        controller.request.contentType = "text/json"

        controller.params.preferencesToDelete = preferenceJsonList.toString()
        controller.params.namespace = null
        controller.params.path = null
        controller.params._method = 'DELETE'
        controller.deletePreferences()

        assert 0 == Preference.list().size()
    }

    void createWidgetDefinitionForTest() {
        def person = Person.build(username: 'testAdmin1')
        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/widget-c.json',
            displayName : 'Widget C',
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/widgetC.gif',
            imageUrlSmall : '../images/blue/icons/widgetContainer/widgetCsm.gif',
            widgetGuid : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            universalName : '0c5435cf-4021-4f2a-ba69-dde451d12551',
            widgetVersion: '1.0',
            widgetUrl : '../examples/fake-widgets/widget-c.html',
            width : 980
        )
        def personWidgetDefinition = PersonWidgetDefinition.build(person: person,
            widgetDefinition: widgetDefinition,
            visible : true,
            pwdPosition: 1)
    }

    void createWidgetDefinitionForTest(widgetName, imageUrlLarge, imageUrlSml, guid, widgetUrl, pwdPosition, descriptorUrl) {
        def person = Person.findByUsername('testAdmin1')

        def widgetDefinition = WidgetDefinition.build(
            descriptorUrl : '../examples/fake-widgets/' + descriptorUrl,
            displayName : widgetName,
            height : 740,
            imageUrlMedium : '../images/blue/icons/widgetIcons/' + imageUrlMedium,
            imageUrlSmall : '../images/blue/icons/widgetContainer/' + imageUrlSml,
            widgetGuid : guid,
            universalName : guid,
            widgetVersion: '1.0',
            widgetUrl : '../examples/fake-widgets/' + widgetUrl,
            width : 980
        )
        PersonWidgetDefinition.build(person: person, widgetDefinition: widgetDefinition, visible : true, pwdPosition: pwdPosition)
    }
}
