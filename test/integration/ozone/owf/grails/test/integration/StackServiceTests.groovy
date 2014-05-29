package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.AutoLoginAccountService

@TestMixin(IntegrationTestMixin)
class StackServiceTests {
    def accountService
    def dashboardService
    def stackService
    def stackIds = []
    def userDashboard
    def personId
    def group
    def originalAccountService

    void setUp() {
        def acctService = new AutoLoginAccountService()
        def person = new Person(username: 'testAdmin', userRealName: 'Test Admin', enabled: true)

        person.save()
        personId = person.id

        acctService.autoAccountName = 'testAdmin'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        originalAccountService = accountService
        accountService = acctService
        stackService.accountService = acctService
        stackService.groupService.accountService = acctService
        dashboardService.accountService = acctService

        def stack1 = Stack.build(name: 'Stack One', description: 'Stack One description', stackContext: 'one',
            imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack1.addToGroups(Group.build(name: 'Group1', automatic: false, status: 'active', stackDefault: true))
        def stack2 = Stack.build(name: 'Stack Two', description: 'Stack Two description', stackContext: 'two', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        def stack3 = Stack.build(name: 'Stack Three', description: 'Stack Three description', stackContext: 'three', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stackIds = [stack1.id, stack2.id, stack3.id]

        group = Group.build(name: 'Test Group', automatic: false, status: 'active', stackDefault: false)
        userDashboard = Dashboard.build(alteredByAdmin: false, guid: '12345678-1234-1234-1234-123456789000', user: person,
            locked: false, isdefault: false, name: 'Test Dashboard', layoutConfig: """{
                    "xtype": "desktoppane",
                    "flex": 1,
                    "height": "100%",
                    "items": [
                    ],
                    "paneType": "desktoppane",
                    "widgets": [],
                    "defaultSettings": {}
                }""", stack: stack1, description: 'This is a test user instance of a dashboard')
    }

    void tearDown() {
        // Restore the accountService reference
        stackService.accountService = originalAccountService
        stackService.groupService.accountService = originalAccountService
        dashboardService.accountService = originalAccountService
    }

    void testList() {
        def ret = stackService.list([:])
        assert stackIds.size() == ret.results
    }

    void testCreate() {
        def ret = stackService.createOrUpdate([
            "data": """{
                name: 'The Stack',
                description: 'This is the Stack description',
                stackContext: 'thestack',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        ])
        assert ret.success
        assert 1 == ret.data.size()
    }

    void testUpdate() {
        def ret = stackService.createOrUpdate([
            "data": """{
                id: ${stackIds[1]},
                name: 'The Updated Stack',
                description: 'This is the Stack description',
                stackContext: 'thestack',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        ])
        assert ret.success
        assert 1 == ret.data.size()
        assert 'The Updated Stack' == ret.data[0].name
    }

    void testDelete() {
        def ret = stackService.delete([
            "data": """{
                id: ${stackIds[0]},
            }""",
            adminEnabled: true
        ])
        assert ret.success
        assert stackIds.size() - 1 == stackService.list([:]).results
    }

    void testAddRemoveUserAndListByUserId() {
        //Ensure user has no stacks and the stack has no users to start
        assert 0 == stackService.list(["user_id": "${personId}"]).results
        assert 0 == stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]

        def ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${personId}
            }]""",
            "stack_id": stackIds[0],
            "tab": "users",
            "update_action": "add"
        ])

        assert ret.success
        //Check user was added to stack both ways
        assert 1 == stackService.list(["user_id": "${personId}"]).results
        assert 1 == stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]

        ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${personId}
            }]""",
            "stack_id": stackIds[0],
            "tab": "users",
            "update_action": "remove"
        ])

        assert ret.success
        //Check user was removed from stack both ways
        assert 0 == stackService.list(["user_id": "${personId}"]).results
        assert 0 == stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]
    }

    void testAddGroup() {
        def ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${group.id}
            }]""",
            "stack_id": stackIds[0],
            "tab": "groups",
            "update_action": "add"
        ])

        assert ret.success
        assert 1 == stackService.list(["group_id": "${group.id}"]).results
        assert 1 == stackService.list(["id": "${stackIds[0]}"]).data.totalGroups[0]
    }

    void testDeleteGroup() {
        def ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${group.id}
            }]""",
            "stack_id": stackIds[0],
            "tab": "groups",
            "update_action": "remove"
        ])

        assert ret.success
        assert 0 == stackService.list(["group_id": "${group.id}"]).results
        assert 0 == stackService.list(["id": "${stackIds[0]}"]).data.totalGroups[0]
    }

    void testAddRemoveDashboard() {
        //Ensure stack has no dashboards.
        assert 0 == stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]

        // Update it to add a dashboard.
        def ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${userDashboard.id},
                guid: ${userDashboard.guid}
            }]""",
            "stack_id": stackIds[0],
            "tab": "dashboards",
            "update_action": "add"
        ])

        // Check dashboard was added to stack
        assert ret.success
        assert 1 == stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]

        // TODO:  Use the ret val to delete it from the group.
        ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                guid: ${ret.data.guid[0]}
            }]""",
            "stack_id": stackIds[0],
            "tab": "dashboards",
            "update_action": "remove"
        ])

        assert ret.success
        //Check user was removed from stack both ways
        assert 0 == stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]
    }

    void testShare() {
        def stackId = stackIds[0]
        Stack stack = Stack.get(stackId)

        // Assign owner to stack to enable sharing
        stack.owner = Person.get(personId)

        stackService.share(["id": stackId])

        assert stack.approved
    }

    void testRestore() {

        // add userDashboard to stack
        def addDash = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${userDashboard.id},
                guid: ${userDashboard.guid}
            }]""",
            "stack_id": stackIds[0],
            "tab": "dashboards",
            "update_action": "add"
        ])

        // add user to the stack
        def addUser = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${personId}
            }]""",
            "stack_id": stackIds[0],
            "tab": "users",
            "update_action": "add"
        ])

        // Assign owner to stack to enable creation of a personal dashboard
        Stack.get(stackIds[0])?.owner = Person.get(personId)

        // delete previous user dashboard to ensure only one will return from list in next step
        dashboardService.delete([
            dashboard: Dashboard.findByGuid(userDashboard.guid)
        ])

        // user dashboard instance created
        def dashboards = dashboardService.list([:])

        // there should only be the newly created user instance
        assert 1 == dashboards.count

        def dash = dashboards.dashboardList[0]

        // edit the user instance and ensure it was changed
        dashboardService.update(["guid": dash.guid, "name": "Test Dashboard Edited"])
        assert "Test Dashboard Edited" == Dashboard.findByGuid(dash.guid).name

        // restore stack which reverts user instance and test its success
        def ret = stackService.restore(["id": stackIds[0]])
        assert ret.success
        assert ret.updatedDashboards[0].name == "Test Dashboard"

    }
}
