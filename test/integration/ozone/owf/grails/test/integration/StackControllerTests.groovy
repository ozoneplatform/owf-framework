package ozone.owf.grails.test.integration

import grails.converters.JSON;
import ozone.owf.grails.controllers.StackController
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Stack

class StackControllerTests extends OWFGroovyTestCase {
    
    def stackService
    def stackController
    def stackId
    
    protected void setUp() {
        super.setUp()
        
        def theStack
        theStack = ozone.owf.grails.domain.Stack.build(name: 'Stack One', stackPosition: 1, description: 'Stack One description', stackContext: 'one', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        theStack = ozone.owf.grails.domain.Stack.build(name: 'Stack Two', stackPosition: 2, description: 'Stack Two description', stackContext: 'two', imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stackId = theStack.id
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testList() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.list()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        
        assertEquals 2, resp.results
        assertEquals 'Stack One', resp.data[0].name
        assertEquals 1, resp.data[0].stackPosition
        assertEquals 'Stack One description', resp.data[0].description
        assertEquals 'one', resp.data[0].stackContext
        assertEquals 'http://www.images.com/theimage.png', resp.data[0].imageUrl
        assertEquals 'http://www.descriptors.com/thedescriptor', resp.data[0].descriptorUrl
    }
    
    void testCreate() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                name: 'Stack Three',
                description: 'Stack Three description',
                stackContext: 'three',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        stackController.createOrUpdate()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
        assertEquals 'Stack Three', resp.data[0].name
        assertEquals 3, resp.data[0].stackPosition
        assertEquals 'Stack Three description', resp.data[0].description
        assertEquals 'three', resp.data[0].stackContext
        assertEquals 'http://www.images.com/theimage.png', resp.data[0].imageUrl
    }
    
    void testUpdate() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                id: ${stackId},
                name: 'The Updated Stack',
                stackPosition: 2,
                description: 'This is the Stack description',
                stackContext: 'thestack',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor'
            }"""
        stackController.createOrUpdate()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
        assertEquals 'The Updated Stack', resp.data[0].name
    }
    
    void testDelete() {
        
        loginAsUsernameAndRole('testAdmin', ERoleAuthority.ROLE_ADMIN.strVal)
        
        stackController = new StackController()
        stackController.stackService = stackService
        stackController.request.contentType = "text/json"
        stackController.params.data = """{
                id: ${stackId}
            }"""
        stackController.delete()
        
        def resp = JSON.parse(stackController.response.contentAsString)
        assertTrue resp.success
    }
}