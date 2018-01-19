package ozone.owf.devel

import groovy.util.logging.Slf4j

import grails.compiler.GrailsTypeChecked
import grails.core.GrailsApplication
import org.grails.datastore.gorm.GormEntity

import org.hibernate.SessionFactory

import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Role
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.services.DashboardService
import ozone.owf.grails.services.DomainMappingService
import ozone.owf.grails.services.PersonWidgetDefinitionService
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration

import static ozone.owf.devel.DefaultData.*


@Slf4j
@GrailsTypeChecked
class DefaultDataLoader {

    GrailsApplication grailsApplication

    SessionFactory sessionFactory

    DomainMappingService domainMappingService
    DashboardService dashboardService
    PersonWidgetDefinitionService personWidgetDefinitionService

    private Role adminRole
    private Role userRole

    private Group adminGroup
    private Group userGroup

    private Person admin1
    private Person user1

    private Stack adminStack
    private Stack investmentStack
    private Stack sampleStack

    private Map<String, WidgetType> widgetTypes = [:]

    private WidgetType adminWidgetType
    private WidgetType standardWidgetType

    void initialize() {
        initializeApplicationConfiguration()

        initializeRoles()
        initializeGroups()

        initializeUsers()
        initializeAdminPreferences()

        initializeWidgetTypes()

        def adminWidgets = initializeAdminWidgetDefinitions()

        adminWidgets.eachWithIndex { widget, index ->
                create(PersonWidgetDefinition, [
                        person: admin1,
                        widgetDefinition: widget,
                        visible: true,
                        pwdPosition: index])
        }

        initializeStacks()

        // initializeDashboards()

        flushAndClearSession()
    }

    private void initializeApplicationConfiguration() {
        APPLICATION_CONFIGURATION.forEach { Map appConfig -> create(ApplicationConfiguration, appConfig) }
    }

    private void initializeRoles() {
        adminRole = create(Role, ADMIN_ROLE)
        userRole = create(Role, USER_ROLE)
    }

    private void initializeGroups() {
        adminGroup = create(Group, ADMIN_GROUP)
        userGroup = create(Group, USER_GROUP)
    }

    private void initializeUsers() {
        admin1 = create(Person, ADMIN1, [authorities: [userRole, adminRole], groups: [adminGroup]])
        user1 = create(Person, USER1, [authorities: [userRole], groups: [userGroup]])
    }

    private void initializeAdminPreferences() {
        ADMIN1_PREFERENCES.forEach { Map pref -> create(Preference, pref, [user: admin1]) }
    }

    private void initializeWidgetTypes() {
        WIDGET_TYPES.forEach { Map type ->
            def widgetType = create(WidgetType, type)
            widgetTypes[widgetType.name] = widgetType
        }

        adminWidgetType = widgetTypes[ADMIN_WIDGET_TYPE.name]
        standardWidgetType = widgetTypes[STANDARD_WIDGET_TYPE.name]
    }

    private List<WidgetDefinition> initializeAdminWidgetDefinitions() {
        def widgets = ADMIN_WIDGET_DEFINITIONS.
                collect { Map definition -> create(WidgetDefinition, definition, [widgetTypes: [adminWidgetType]])
                }

        widgets.eachWithIndex {
            widget, index -> domainMappingService.createMapping(adminGroup, RelationshipType.owns, widget)
        }

        widgets
    }

    private void initializeStacks() {
        adminStack = create(Stack, ADMIN_STACK, [
                groups: [adminGroup],
                defaultGroup: adminGroup
        ])

        investmentStack = create(Stack, INVESTMENT_STACK, [
                groups: [userGroup],
                defaultGroup: userGroup
        ])

        sampleStack = create(Stack, SAMPLE_STACK, [
                groups: [userGroup],
                defaultGroup: userGroup
        ])
    }

    private void initializeDashboards() {
        // new Dashboard(APPS_DASHBOARD + [stack: adminStack]).save(failOnError: true)
    }

    private static <T extends GormEntity<T>> T create(Class<T> type, Map params, Map extraParams = [:]) {
        (params + extraParams).asType(type).save(failOnError: true)
    }

    private void flushAndClearSession() {
        sessionFactory.currentSession.with {
            flush()
            clear()
        }
    }

}
