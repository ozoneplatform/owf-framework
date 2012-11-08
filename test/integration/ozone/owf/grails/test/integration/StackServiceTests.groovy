package ozone.owf.grails.test.integration

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.AutoLoginAccountService

class StackServiceTests extends GroovyTestCase {
    
    def accountService
    def stackService
    def stackIds = []
    def userDashboard 
    def personId
    def group
        
    protected void setUp() {
        super.setUp()
        
        def acctService = new AutoLoginAccountService()
        def person = new Person(username: 'testAdmin', userRealName: 'Test Admin', enabled: true)
        
        person.save()
        personId = person.id

        acctService.autoAccountName = 'testAdmin'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        accountService = acctService
        stackService.accountService = acctService
        
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

    protected void tearDown() {
        super.tearDown()
    }
    
    void testList() {
        def ret = stackService.list([:])
        //assertEquals stackIds.size(), ret.results
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
        assertTrue ret.success
        assertEquals 1, ret.data.size()
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
        assertTrue ret.success
        assertEquals 1, ret.data.size()
        assertEquals 'The Updated Stack', ret.data[0].name
    }
    
    void testDelete() {
        def ret = stackService.delete([
            "data": """{
                id: ${stackIds[0]}
            }"""
        ])
        assertTrue ret.success
        //assertEquals stackIds.size() - 1, stackService.list([:]).results
    }
    
    void testAddRemoveUserAndListByUserId() {
        //Ensure user has no stacks and the stack has no users to start
        assertEquals 0, stackService.list(["user_id": "${personId}"]).results
        assertEquals 0, stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]

        def ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${personId}
            }]""",
            "stack_id": stackIds[0],
            "tab": "users",
            "update_action": "add"
        ])

        assertTrue ret.success
        //Check user was added to stack both ways
        assertEquals 1, stackService.list(["user_id": "${personId}"]).results
        assertEquals 1, stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]

        ret = stackService.createOrUpdate([
            "_method": "PUT",
            "data": """[{
                id: ${personId}
            }]""",
            "stack_id": stackIds[0],
            "tab": "users",
            "update_action": "remove"
        ])

        assertTrue ret.success
        //Check user was removed from stack both ways
        assertEquals 0, stackService.list(["user_id": "${personId}"]).results
        assertEquals 0, stackService.list(["id": "${stackIds[0]}"]).data.totalUsers[0]
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
    
        assertTrue ret.success
        assertEquals 1, stackService.list(["group_id": "${group.id}"]).results
        assertEquals 1, stackService.list(["id": "${stackIds[0]}"]).data.totalGroups[0]
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
    
        assertTrue ret.success
        assertEquals 0, stackService.list(["group_id": "${group.id}"]).results
        assertEquals 0, stackService.list(["id": "${stackIds[0]}"]).data.totalGroups[0]
    }
    
    void testAddRemoveDashboard() {
        //Ensure stack has no dashboards.
        assertEquals 0, stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]

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
        assertTrue ret.success
        assertEquals 1, stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]

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

        assertTrue ret.success
        //Check user was removed from stack both ways
        assertEquals 0, stackService.list(["id": "${stackIds[0]}"]).data.totalDashboards[0]
    }
}