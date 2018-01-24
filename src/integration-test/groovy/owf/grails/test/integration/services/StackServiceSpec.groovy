package owf.grails.test.integration.services

import spock.lang.Ignore
import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.DashboardService
import ozone.owf.grails.services.StackService
import ozone.owf.grails.services.model.StackServiceModel

import static groovy.json.JsonOutput.toJson


@Integration
@Rollback
class StackServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    StackService service

    @Autowired
    DashboardService dashboardService

    List<Stack> testStacks = []
    List<Group> testGroups = []

    Person admin1

    private void setupUsers() {
        admin1 = createAdmin('admin1')
    }

    private void setupStacks() {
        testGroups << save(new Group(
                name: 'Group1',
                automatic: false,
                status: 'active',
                stackDefault: true))

        testGroups << save(new Group(
                name: 'Group2',
                automatic: false,
                status: 'active',
                stackDefault: true))

        testGroups << save(new Group(
                name: 'Group3',
                automatic: false,
                status: 'active',
                stackDefault: false))

        testStacks << save(new Stack(
                name: 'Stack One',
                description: 'Stack One description',
                stackContext: 'one',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor',
                owner: admin1,
                defaultGroup: testGroups[0]))

        testStacks << save(new Stack(
                name: 'Stack Two',
                description: 'Stack Two description',
                stackContext: 'two',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor',
                owner: admin1,
                defaultGroup: testGroups[1]))
    }

    private Dashboard createDashboard(Person user, Stack stack) {
        save new Dashboard(
                guid: UUID.randomUUID().toString(),
                name: 'Test Dashboard',
                user: user,
                stack: stack,
                locked: false,
                isdefault: false,
                dashboardPosition: 0,
                alteredByAdmin: false,
                layoutConfig: DASHBOARD_LAYOUT_CONFIG)
    }

    void testList() {
        given:
        setupUsers()
        setupStacks()

        when:
        def result = service.list()

        then:
        result.results == testStacks.size()

        result.data.size() == testStacks.size()
        with(result.data[0], StackServiceModel) {
            id == testStacks[0].id
        }
    }

    void testCreate() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def params = [data: toJson([name         : 'The Stack',
                                    description  : 'This is the Stack description',
                                    stackContext : 'thestack',
                                    imageUrl     : 'http://www.images.com/theimage.png',
                                    descriptorUrl: 'http://www.descriptors.com/thedescriptor'])]

        def ret = service.createOrUpdate(params)

        then:
        ret.success
        ret.data.size() == 1
    }

    void testUpdate() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        when:
        def params = [data: toJson([id           : testStacks[1].id,
                                    name         : 'The Updated Stack',
                                    description  : 'This is the Stack description',
                                    stackContext : 'thestack',
                                    imageUrl     : 'http://www.images.com/theimage.png',
                                    descriptorUrl: 'http://www.descriptors.com/thedescriptor'])]

        def result = service.createOrUpdate(params)

        then:
        result.success
        result.data.size() == 1

        with(result.data[0], StackServiceModel) {
            name == 'The Updated Stack'
        }
    }

    /**
     * FIXME: Need to figure out why this throws an exception
     * <br/><br/>
     * Referential integrity constraint violation:<br/>
     * "PUBLIC.STACK FOREIGN KEY(DEFAULT_GROUP_ID) REFERENCES PUBLIC.OWF_GROUP(ID)"
     */
    @Ignore
    void testDelete() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        flushSession()

        when:
        def params = [data        : /{ "id": ${testStacks[0].id} }/,
                      adminEnabled: true]

        def result = service.delete(params)

        then:
        result.success

        Stack.count() == testStacks.size() - 1
    }

    void testAddUserAndListByUserId() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "id": ${admin1.id} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "users",
                      "update_action": "add"]

        def result = service.createOrUpdate(params)

        flushSession()

        then:
        result.success

        and: "user was added to the Stack both ways"
        totalStacksForUser(admin1) == 1
        totalUsersForStack(testStacks[0]) == 1
    }

    void testRemoveUserAndListByUserId() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        and: "Person has been added to the Group"
        save admin1.addToGroups(testStacks[0].defaultGroup)

        assert totalStacksForUser(admin1) == 1
        assert totalUsersForStack(testStacks[0]) == 1

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "id": ${admin1.id} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "users",
                      "update_action": "remove"]

        def result = service.createOrUpdate(params)

        flushSession()

        then:
        result.success

        and: "Person was removed from the Stack both ways"
        totalStacksForUser(admin1) == 0
        totalUsersForStack(testStacks[0]) == 0
    }

    void testAddGroup() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        assert totalStacksInGroup(testGroups[2]) == 0
        assert totalGroupsForStack(testStacks[0]) == 0

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "id": ${testGroups[2].id} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "groups",
                      "update_action": "add"]

        def result = service.createOrUpdate(params)

        flushSession()

        then:
        result.success

        totalStacksInGroup(testGroups[2]) == 1
        totalGroupsForStack(testStacks[0]) == 1
    }

    void testDeleteGroup() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        and: "Stack has been added to the Group"
        testStacks[0].addToGroups(testGroups[2]).save(flush: true)

        assert totalStacksInGroup(testGroups[2]) == 1
        assert totalGroupsForStack(testStacks[0]) == 1

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "id": ${testGroups[2].id} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "groups",
                      "update_action": "remove"]

        def result = service.createOrUpdate(params)

        flushSession()

        then:
        result.success

        totalStacksInGroup(testGroups[2]) == 0
        totalGroupsForStack(testStacks[0]) == 0
    }

    void testAddDashboardToStack() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        def dashboard = createDashboard(admin1, testStacks[0])

        assert totalDashboardsForStack(testStacks[0]) == 0

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "id": ${dashboard.id}, "guid": ${dashboard.guid} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "dashboards",
                      "update_action": "add"
        ]

        def result = service.createOrUpdate(params)

        then:
        result.success

        totalDashboardsForStack(testStacks[0]) == 1
    }

    void testRemoveDashboardFromStack() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        def dashboard = createDashboard(admin1, testStacks[0])

        and: "Dashboard has been added to the Stack"
        def params1 = ["_method"      : "PUT",
                       "data"         : /[{ "id": ${dashboard.id}, "guid": ${dashboard.guid} }]/,
                       "stack_id"     : testStacks[0].id,
                       "tab"          : "dashboards",
                       "update_action": "add"]

        def result1 = service.createOrUpdate(params1)
        assert result1.success

        def copyGuid = result1.data.guid[0]
        assert copyGuid != null && copyGuid != dashboard.guid

        assert totalDashboardsForStack(testStacks[0]) == 1

        when:
        def params = ["_method"      : "PUT",
                      "data"         : /[{ "guid": ${copyGuid} }]/,
                      "stack_id"     : testStacks[0].id,
                      "tab"          : "dashboards",
                      "update_action": "remove"]

        def result = service.createOrUpdate(params)

        then:
        result.success

        totalDashboardsForStack(testStacks[0]) == 0
    }

    void testShare() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        when:
        service.share(testStacks[0].id)

        then:
        testStacks[0].approved
    }


    void testRestore() {
        given:
        setupUsers()
        setupStacks()
        loggedInAs admin1

        def dashboard = createDashboard(admin1, testStacks[0])

        and: "Dashboard added to the Stack"
        service.createOrUpdate(["_method"      : "PUT",
                                "data"         : /[{ "id": ${dashboard.id}, "guid": ${dashboard.guid} }]/,
                                "stack_id"     : testStacks[0].id,
                                "tab"          : "dashboards",
                                "update_action": "add"])

        and: "User added to the Stack"
        service.createOrUpdate(["_method"      : "PUT",
                                "data"         : /[{ "id": ${admin1.id} }]/,
                                "stack_id"     : testStacks[0].id,
                                "tab"          : "users",
                                "update_action": "add"])

        and: "delete previous user dashboard to ensure only one will return from list in next step"
        dashboardService.delete([dashboard: Dashboard.findByGuid(dashboard.guid)])
        def dashboards = dashboardService.list([:])
        assert dashboards.count == 1

        def userDashboardGuid = dashboards.dashboardList[0].guid

        and: "the user dashboard instance has been renamed"
        dashboardService.update(["guid": userDashboardGuid, "name": "Test Dashboard Edited"])
        assert Dashboard.findByGuid(userDashboardGuid).name == "Test Dashboard Edited"

        when: "restore stack which reverts user instance and test its success"
        def result = service.restore(["id": testStacks[0].id])

        then:
        result.success
        result.updatedDashboards[0].name == "Test Dashboard"

    }

    private static final String DASHBOARD_LAYOUT_CONFIG = """{
                    "xtype": "desktoppane",
                    "flex": 1,
                    "height": "100%",
                    "items": [],
                    "paneType": "desktoppane",
                    "widgets": [],
                    "defaultSettings": {} }"""

    private Integer totalDashboardsForStack(Stack stack) {
        service.list([id: "${stack.id}"]).data.totalDashboards[0] as Integer
    }

    private Integer totalStacksForUser(Person user) {
        Stack.withCriteria {
            defaultGroup {
                people { idEq(user.id) }
            }
        }.size()
    }

    private Integer totalUsersForStack(Stack stack) {
        Person.withCriteria {
            groups { idEq(stack.defaultGroup.id) }
        }.size()
    }

    private Integer totalGroupsForStack(Stack stack) {
        Group.withCriteria {
            eq('stackDefault', false)
            stacks { idEq(stack.id) }
        }.size()
    }

    private Integer totalStacksInGroup(Group group) {
        (service.list([group_id: "${group.id}"]).results) as Integer
    }

}
