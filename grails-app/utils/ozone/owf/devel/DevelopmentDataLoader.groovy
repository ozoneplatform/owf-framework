package ozone.owf.devel

import groovy.util.logging.Slf4j

import grails.compiler.GrailsTypeChecked
import grails.config.Config
import grails.converters.JSON
import grails.core.GrailsApplication
import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.gorm.GormValidateable
import org.grails.web.json.JSONObject

import org.springframework.validation.FieldError

import org.hibernate.SessionFactory

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
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
import ozone.owf.grails.services.SyncService


@Slf4j
@GrailsTypeChecked
class DevelopmentDataLoader {

    GrailsApplication grailsApplication

    SessionFactory sessionFactory

    DomainMappingService domainMappingService
    DashboardService dashboardService
    PersonWidgetDefinitionService personWidgetDefinitionService

    SyncService syncService

    void initializeExampleWidgets() {
        Config config = grailsApplication.config

        String exampleWidgetsBaseUrl = config.getProperty('owf.exampleWidgets.baseUrl', String, 'widgets')
        log.info "Example Widget Base URL: $exampleWidgetsBaseUrl"

        def loader = new ExampleWidgetLoader(
                sessionFactory: sessionFactory,
                baseUrl: exampleWidgetsBaseUrl)

        loader.loadAndAssignExamplesWidgets()
    }

    void initializeDevelopmentData() {
        Config config = grailsApplication.config

        boolean enabled = config.getProperty("owf.exampleData.enabled", Boolean, false)

        log.info "Development Data Generation Enabled?: $enabled"

        if (!enabled) return

        boolean assignToOWFUsersGroup = config.getProperty("owf.exampleData.assignToOWFUsersGroup", Boolean, false)
        log.info "Generate test data for OWF Users Group?: $assignToOWFUsersGroup"

        int numWidgets = config.getProperty("owf.exampleData.numWidgets", Integer, 0)
        int numWidgetsPerUser = config.getProperty("owf.exampleData.numWidgetsPerUser", Integer, 0)
        int numAdmins = config.getProperty("owf.exampleData.numAdmins", Integer, 1)
        int numUsers = config.getProperty("owf.exampleData.numUsers", Integer, 2)
        int numGroups = config.getProperty("owf.exampleData.numGroups", Integer, 2)
        int numGroupsPerUser = config.getProperty("owf.exampleData.numGroupsPerUser", Integer, 2)
        int numWidgetsInGroups = config.getProperty("owf.exampleData.numWidgetsInGroups", Integer, 2)
        int numDashboardsWidgets = config.getProperty("owf.exampleData.numDashboardsWidgets", Integer, 0)
        int numStacks = config.getProperty("owf.exampleData.numStacks", Integer, 0)
        int numStacksPerUser = config.getProperty("owf.exampleData.numStacksPerUser", Integer, 0)
        int numStackDashboards = config.getProperty("owf.exampleData.numStackDashboards", Integer, 0)
        int numPreferences = config.getProperty("owf.exampleData.numPreferences", Integer, 0)

        log.info "Widgets:            $numWidgets"
        log.info "Widgets Per User:   $numWidgetsPerUser"
        log.info "Admins:             $numAdmins"
        log.info "Users:              $numUsers"
        log.info "Groups:             $numGroups"
        log.info "Groups Per User:    $numGroupsPerUser"
        log.info "Widgets In Groups:  $numWidgetsInGroups"
        log.info "Dashboards Widgets: $numDashboardsWidgets"
        log.info "Stacks:             $numStacks"
        log.info "Stacks Per User:    $numStacksPerUser"
        log.info "Stack Dashboards:   $numStackDashboards"
        log.info "Preferences:        $numPreferences"


        loadWidgetDefinitions(numWidgets, assignToOWFUsersGroup)

        loadGroups(numGroups)
        loadStacks(numStacks, assignToOWFUsersGroup)
        loadStackDashboards(numStackDashboards, numDashboardsWidgets)

        List<Person> people = []
        people.addAll(loadAdmins(numAdmins, assignToOWFUsersGroup))
        people.addAll(loadPersons(numUsers, assignToOWFUsersGroup))

        if (!assignToOWFUsersGroup && numWidgets > 0) {
            assignWidgetsToGroups(numGroups, numWidgetsInGroups)
        }
        flushAndClearSession()

        assignGroupsToPersons(numGroups, numGroupsPerUser)
        assignStacksToPersons(numStacks, numStacksPerUser)

        loadPersonWidgetDefinitions(numWidgetsPerUser, assignToOWFUsersGroup)
        // loadPreferences(numPreferences)

        if (!assignToOWFUsersGroup) {
            syncPeopleToServices(people)
        }
    }

    private static Role findRole(ERoleAuthority authority) {
        Role.findByAuthority(authority.strVal)
    }

    private void syncPeopleToServices(List<Person> people) {
        int counter = 0
        people.each { Person person ->
            syncService.syncDashboardFor(person)
            syncService.syncWidgetDefinitionsFor(person)
            counter++
            if (counter % 10 == 0) {
                flushAndClearSession()
            }
        }
    }

    private void loadWidgetDefinitions(int numWidgets = 0, boolean assignToOWFUsersGroup = false) {
        WidgetType standardType = WidgetType.findByName('standard')
        int existingWidgetCount = WidgetDefinition.findAllByDisplayNameLike('Test Widget%').size()

        Group owfUsersGroup
        if (assignToOWFUsersGroup) {
            owfUsersGroup = loadOWFUsersGroup()
        }

        for (int i = existingWidgetCount + 1; i <= numWidgets; i++) {
            WidgetDefinition widgetDefinition = save new WidgetDefinition(
                    displayName: 'Test Widget ' + i,
                    height: 440,
                    imageUrlMedium: 'themes/common/images/widget-icons/HTMLViewer.png',
                    imageUrlSmall: 'themes/common/images/widget-icons/HTMLViewer.png',
                    widgetGuid: generateUUID(),
                    widgetUrl: 'examples/walkthrough/widgets/HTMLViewer.gsp',
                    widgetVersion: '1.0',
                    widgetTypes: [standardType],
                    width: 540)

            if (assignToOWFUsersGroup) {
                domainMappingService.createMapping(owfUsersGroup, RelationshipType.owns, widgetDefinition)
            }
        }

        flushAndClearSession()
    }

    private loadGroups(int numGroups) {
        int existingGroupsCount = Group.findAllByNameLike('TestGroup%').size()

        for (int i = existingGroupsCount + 1; i <= numGroups; i++) {
            //create group
            save new Group(
                    name: 'TestGroup' + i,
                    description: 'TestGroup' + i,
                    email: "testgroup$i@group${i}.com",
                    automatic: false,
                    displayName: 'TestGroup' + i)
        }

        flushAndClearSession()
    }

    private loadStacks(int numStacks, boolean assignToOWFUsersGroup = false) {
        Group allUsersGroup

        int existingStacksCount = Stack.findAllByNameLike('TestStack%').size()

        if (assignToOWFUsersGroup) {
            allUsersGroup = loadOWFUsersGroup()
        }

        for (int i = existingStacksCount + 1; i <= numStacks; i++) {

            //create the stack default group
            Group stackDefaultGroup = save new Group(
                    name: "TestStack$i-DefaultGroup",
                    displayName: "TestStack$i-DefaultGroup",
                    stackDefault: true)

            //create stack
            Stack stack = save new Stack(
                    name: 'TestStack' + i,
                    description: 'TestStack' + i,
                    stackContext: 'TestStack' + i,
                    defaultGroup: stackDefaultGroup)

            if (allUsersGroup) {
                stack.addToGroups(allUsersGroup)
            }

            save(stack, true)
        }

        flushAndClearSession()
    }

    private void loadStackDashboards(int numStackDashboards, int numDashboardsWidgets) {
        List<Stack> stacks = Stack.findAllByNameLike('TestStack%')
        stacks.each { stack ->
            log.debug 'generating stack dashboards for stack:' + stack
            assignDashboardsToStackGroup(stack, numStackDashboards, numDashboardsWidgets)
        }

        flushAndClearSession()
    }

    private List<Person> loadAdmins(int numAdmins, boolean assignToOWFUsersGroup = false) {
        int existingAdminsCount = Person.findAllByUsernameLike('testAdmin%').size()

        if (existingAdminsCount >= numAdmins) return Collections.emptyList()

        Date date = new Date()
        Role adminRole = findRole(ERoleAuthority.ROLE_ADMIN)
        Role userRole = findRole(ERoleAuthority.ROLE_USER)

        List<Person> admins = (existingAdminsCount + 1..numAdmins).collect { i ->
            save new Person(
                    description: "Test Administrator $i",
                    email: "testAdmin$i@ozone3.test",
                    emailShow: false,
                    enabled: true,
                    userRealName: "Test Admin $i",
                    username: "testAdmin$i",
                    lastLogin: date,
                    requiresSync: assignToOWFUsersGroup,
                    authorities: [adminRole, userRole])
        }

        flushAndClearSession()

        admins
    }

    private List<Person> loadPersons(int numPersons, boolean assignToOWFUsersGroup = false) {
        int existingUsersCount = Person.findAllByUsernameLike('testUser%').size()

        if (existingUsersCount >= numPersons) return Collections.emptyList()

        Date date = new Date()
        Role userRole = findRole(ERoleAuthority.ROLE_USER)

        def people = (existingUsersCount + 1..numPersons).collect { i ->
            save new Person(
                    description: "Test User $i",
                    email: "testUser$i@ozone3.test",
                    emailShow: false,
                    enabled: true,
                    userRealName: "Test User $i",
                    username: "testUser$i",
                    lastLogin: date,
                    requiresSync: assignToOWFUsersGroup,
                    authorities: [userRole])
        }

        flushAndClearSession()

        people
    }

    private void assignWidgetsToGroup(Group group, int numWidgetsInGroups) {
        List<WidgetDefinition> widgets = WidgetDefinition.findAllByDisplayNameLike("Test Widget%", [max: numWidgetsInGroups])

        widgets.each { widget -> domainMappingService.createMapping(group, RelationshipType.owns, widget) }
    }

    private void assignWidgetsToGroups(int numGroups, int numWidgetsInGroups) {
        for (int i = 1; i <= numGroups; i++) {
            def group = Group.findByName('TestGroup' + i)
            assignWidgetsToGroup(group, numWidgetsInGroups)
        }
    }

    private void assignGroupsToPersons(int numGroups, int numGroupsPerUser) {
        Random random = new Random()

        List<Person> persons = Person.list()
        List<Group> groups = Group.findAllByStackDefaultAndNameLike(false, "TestGroup%")

        int randomOffset = 0
        int offsetMax = numGroups - numGroupsPerUser

        persons.each { person ->
            try {
                randomOffset = random.nextInt(offsetMax)
            } catch (ignored) {
                randomOffset = 0
            }
            for (int i = randomOffset; i < randomOffset + numGroupsPerUser; i++) {
                groups[i].people << person
                save(groups[i])
            }
        }

        flushAndClearSession()
    }

    private assignStacksToPersons(int numStacks, int numStacksPerUser) {
        Random random = new Random()
        List<Person> persons = Person.list()

        List<Group> stackGroups = Group.findAllByStackDefault(false)

        int randomOffset = 0
        int offsetMax = numStacks - numStacksPerUser

        persons.each { person ->
            try {
                randomOffset = random.nextInt(offsetMax)
            } catch (ignored) {
                randomOffset = 0
            }
            for (int i = randomOffset; i < randomOffset + numStacksPerUser; i++) {
                stackGroups[i].people << person
                save(stackGroups[i])
            }
        }

        flushAndClearSession()
    }

    private loadPersonWidgetDefinitions(int numWidgetsPerUser, boolean assignToOWFUsersGroup = false) {
        if (numWidgetsPerUser <= 0 || assignToOWFUsersGroup) return

        // give every person access to standard widget
        def people = Person.findAll()

        // give every person access to extra widgets
        List<WidgetDefinition> widgetDefinitions = WidgetDefinition.findAllByDisplayNameLike('Test Widget %')

        Random rand = new Random()
        def maxOffset = widgetDefinitions.size() - numWidgetsPerUser
        def randomNum

        maxOffset = maxOffset <= 0 ? 1 : maxOffset
        people.each { person ->
            randomNum = rand.nextInt(maxOffset)

            for (int i in randomNum..<(numWidgetsPerUser + randomNum)) {
                save new PersonWidgetDefinition(
                        person: person,
                        widgetDefinition: widgetDefinitions[i],
                        visible: true,
                        pwdPosition: i)
            }
        }

        flushAndClearSession()
    }

    private loadPreferences(int numPreferences) {
        if (numPreferences <= 0) return

        List<Person> persons = Person.list()
        persons.each { person ->
            for (int i = 0; i < numPreferences; i++) {
                save new Preference(
                        namespace: 'foo.bar.' + i,
                        path: 'test path entry ' + i,
                        user: person,
                        value: 'foovalue')
            }
        }

        flushAndClearSession()
    }

    private Group loadOWFUsersGroup() {
        Group.findAllByNameAndAutomatic('OWF Users', true)[0]
    }

    private static <T extends GormEntity<T>> T save(T object, boolean flush = true) {
        assert object != null

        assert validateAndPrintErrors(object)

        T result = object.save(flush: flush)
        assert result != null

        result
    }

    private static boolean validateAndPrintErrors(GormValidateable object) {
        def isValid = object.validate()
        if (!isValid) {
            println "Validation Error: ${object.class.canonicalName}"
            object.errors.fieldErrors.each { FieldError error ->
                println "\tfield: ${error.field}, code: ${error.code}, value: '${error.rejectedValue}'"
            }
        }
        isValid
    }

    private void flushAndClearSession() {
        sessionFactory.currentSession.with {
            flush()
            clear()
        }
    }

    private assignDashboardsToStackGroup(Stack stack, int numDashboards, int numDashboardsWidgets) {
        def allWidgets = WidgetDefinition.list()

        Group group = stack.defaultGroup

        for (int i = 1; i <= numDashboards; i++) {
            def dashboardGuid = generateUUID()
            def paneGuid = generateUUID()

            def dashboard = new Dashboard(
                    name: 'Stack Dashboard ' + i + ' (' + group.name + ')',
                    isdefault: true,
                    stack: stack,
                    guid: dashboardGuid,
                    dashboardPosition: 0,
                    alteredByAdmin: false,
                    publishedToStore: true,
                    layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}')
            def rand = new Random()
            def randomWidget

            //Create JSON string of widgets
            def widgets = '[{'
            for (int j = 0; j < numDashboardsWidgets; j++) {
                if (j != 0) {
                    widgets += ',{'
                }

                def xyPos = 300 + (j * 5)

                //Add a random group widget to the dashboard
                randomWidget = allWidgets[rand.nextInt(allWidgets.size())]

                domainMappingService.createMapping(group, RelationshipType.owns, randomWidget)

                widgets += '"widgetGuid":"' + randomWidget.widgetGuid + '","x":' + xyPos + ',"y":' + xyPos + ',"uniqueId":"' +
                        generateUUID() + '","name":"' + randomWidget.displayName + '","paneGuid":"' + paneGuid + '","height":250,"width":250,"dashboardGuid":"' + dashboardGuid + '"}'
            }
            widgets += ']'

            JSONObject layoutConfig = JSON.parse(dashboard.layoutConfig) as JSONObject
            layoutConfig.widgets = JSON.parse(widgets)
            dashboard.layoutConfig = layoutConfig

            //save and map group dashboard
            save dashboard
            domainMappingService.createMapping(group, RelationshipType.owns, dashboard)

            sessionFactory.currentSession.clear()
        }
    }

    private static String generateUUID() {
        return UUID.randomUUID().toString()
    }

}
