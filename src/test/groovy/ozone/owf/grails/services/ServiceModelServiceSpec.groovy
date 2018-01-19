package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.services.ServiceUnitTest

import ozone.owf.grails.domain.*
import ozone.owf.grails.services.model.*


class ServiceModelServiceSpec extends Specification
        implements ServiceUnitTest<ServiceModelService> {

    void setup() {
        WidgetRequiredIdsService requiredIdsService = Mock() {
            getAllRequiredIds(_) >> []
            getDirectRequiredIds(_) >> []
        }

        service.widgetRequiredIdsService = requiredIdsService
    }

    void testDashboardDefinitionToServiceModel() {
        given:
        def testStack = new Stack(
                name: 'Test Stack',
                description: 'This is a test stack',
                stackContext: 'testStack',
                imageUrl: 'testStack.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor')

        def dashboard = new Dashboard(
                guid: '3F2504E0-4F89-11D3-9A0C-0305E82C3301',
                isdefault: false,
                dashboardPosition: 0,
                name: 'Hello World 1234567890!@$%^&*()_+-|?><`~.',
                user: new Person(),
                stack: testStack)

        when:
        ServiceModel serviceModel = service.createServiceModel(dashboard)

        then:
        with(serviceModel, DashboardServiceModel) {
            name == dashboard.name
            isdefault == dashboard.isdefault
            guid == dashboard.guid
            stack.id == testStack.id
        }
    }

    void testDashboardDefinitionToServiceModelWithApostropheInUsername() {
        given:
        def username = "George Can'tstanza"
        def dashboard = new Dashboard(
                guid: '3F2504E0-4F89-11D3-9A0C-0305E82C3301',
                isdefault: false,
                dashboardPosition: 0,
                name: 'Testing userid with apostrophe',
                user: new Person(username: username))

        when:
        ServiceModel serviceModel = service.createServiceModel(dashboard)

        then:
        with(serviceModel, DashboardServiceModel) {
            name == dashboard.name
            isdefault == dashboard.isdefault
        }
    }

    void testPersonToServiceModel() {
        given:
        Person person = createPerson()

        when:
        ServiceModel serviceModel = service.createServiceModel(person)

        then:
        with(serviceModel, PersonServiceModel) {
            username == person.username
            userRealName == person.userRealName
        }
    }

    void testPreferenceToServiceModelWithSingleTinckInValue() {
        given:
        def preference = new Preference(
                namespace: "com.company.widget",
                path: "status",
                value: "I can't do it",
                user: createPerson())

        when:
        ServiceModel serviceModel = service.createServiceModel(preference)

        then:
        with(serviceModel, PreferenceServiceModel) {
            namespace == preference.namespace
            value == preference.value
            path == preference.path
            user.username == preference.user.username
        }
    }

    void testPreferenceToJsonWithJsonInValue() {
        given:
        def preference = new Preference(
                namespace: "com.company.widget",
                path: "abc",
                user: createPerson(),
                value: '''
                       {
                           "a": "apple",
                           "b": "banana"
                       }
                       ''')

        when:
        Map json = service.createServiceModel(preference).toDataMap()

        then:
        with(json) {
            get('namespace') == preference.namespace
            get('path') == preference.path
            get('user').get('userId') == preference.user.username
            get('value') == preference.value
        }
    }

    void testWidgetDefinitionToServiceModel() {
        given:
        def widgetDefinition = new WidgetDefinition(
                universalName: "3F2504E0-4F89-11D3-9A0C-0305E82C3301",
                widgetGuid: "3F2504E0-4F89-11D3-9A0C-0305E82C3301",
                widgetVersion: "1.0",
                displayName: "Hello World 1234567890!@\$'%^&*()_+-|?><`~.",
                widgetUrl: "https://localhost/",
                imageUrlSmall: "https://localhost/",
                imageUrlMedium: "https://localhost/",
                width: 200,
                height: 200,
                personWidgetDefinitions: [])

        when:
        ServiceModel serviceModel = service.createServiceModel(widgetDefinition)

        then:
        with(serviceModel, WidgetDefinitionServiceModel) {
            displayName == widgetDefinition.displayName
            widgetGuid == widgetDefinition.widgetGuid
            widgetUrl == widgetDefinition.widgetUrl
            imageUrlSmall == widgetDefinition.imageUrlSmall
            imageUrlMedium == widgetDefinition.imageUrlMedium
            width == widgetDefinition.width
            height == widgetDefinition.height
            widgetVersion == widgetDefinition.widgetVersion
        }
    }

    private static Person createPerson() {
        new Person(
                username: "MO'Leary",
                userRealName: "Mike O'Leary",
                enabled: true)
    }

}
