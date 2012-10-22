package ozone.owf.grails.test.integration

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.AutoLoginAccountService

class StackServiceTests extends GroovyTestCase {
    
    def accountService
    def stackService
    def stackId
        
    protected void setUp() {
        super.setUp()
        
        def acctService = new AutoLoginAccountService()
        def person = new Person(username: 'testAdmin', userRealName: 'Test Admin', enabled: true)
        def theStack
        
        person.save()
	acctService.autoAccountName = 'testAdmin'
	acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
	accountService = acctService
	stackService.accountService = acctService
        
        theStack = ozone.owf.grails.domain.Stack.build(name: 'Stack One', stackPosition: 1, description: 'Stack One description', stackContext: 'one', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        theStack = ozone.owf.grails.domain.Stack.build(name: 'Stack Two', stackPosition: 2, description: 'Stack Two description', stackContext: 'two', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stackId = theStack.id

    }

    protected void tearDown() {
        super.tearDown()
    }
    
    void testList() {
        def ret = stackService.list([:])
        assertEquals 2, ret.results
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
                id: ${stackId},
                name: 'The Updated Stack',
                stackPosition: 2,
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
                id: ${stackId}
            }"""
        ])
        assertTrue ret.success
    }
}