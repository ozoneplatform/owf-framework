package ozone.owf.grails.test.integration

import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.AutoLoginAccountService
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.ERoleAuthority

/**
 * Created by IntelliJ IDEA.
 * User: tpanning
 * Date: 5/14/13
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */
class MarketplaceServiceTests extends GroovyTestCase {
    def marketplaceService
    def stackService
    def dashboardService
    def personWidgetDefinitionService
    def widgetDefinitionService

    protected void setUp() {
        super.setUp()

        def acctService = new AutoLoginAccountService()
        def person = Person.build(username:'testUserMarketplaceServiceTesting', userRealName: 'foo', enabled:true)
        person.save()
        acctService.autoAccountName = 'testUserMarketplaceServiceTesting'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        stackService.accountService = acctService
        dashboardService.accountService = acctService
        personWidgetDefinitionService.accountService = acctService
        widgetDefinitionService.accountService = acctService

    }

    protected void tearDown() {
      super.tearDown()
    }

    void testAddSimpleStack() {
        def singleSimpleStackJson='''
        {
            "name": "Me",
            "stackContext": "myveryown",
            "description": "My description",
            "widgets": [],
            "dashboards": [{
                "guid": "739961c3-8900-442b-94e0-88ec1bc89e22",
                "layoutConfig": {
                    "widgets": [],
                    "defaultSettings": {},
                    "height": "100%",
                    "items": [],
                    "xtype": "tabbedpane",
                    "flex": 1,
                    "paneType": "tabbedpane"
                },
                "isdefault": true,
                "dashboardPosition": 1,
                "description": "The flash",
                "name":"Dash",
                "locked":false
            }]
        }
        '''
        def singleSimpleStack=new JSONArray("[${singleSimpleStackJson}]")

        def listings = marketplaceService.addListingsToDatabase(singleSimpleStack)
        def stack = listings[0]
        assertNotNull(stack)
        assertEquals(stack.name, singleSimpleStack[0].name)
        assertEquals(stack.description, singleSimpleStack[0].description)
        assertEquals(stack.stackContext, singleSimpleStack[0].stackContext)
        def foundStack = Stack.findByName(singleSimpleStack[0].name)
        assertEquals(stack, foundStack)
    }
}
