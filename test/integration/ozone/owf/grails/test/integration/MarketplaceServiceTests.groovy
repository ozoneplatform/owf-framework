package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.AutoLoginAccountService
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.ERoleAuthority
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap
import grails.converters.JSON


/**
 * Created by IntelliJ IDEA.
 * User: tpanning
 * Date: 5/14/13
 * Time: 10:24 AM
 * To change this template use File | Settings | File Templates.
 */

@TestMixin(IntegrationTestMixin)
class MarketplaceServiceTests extends OWFGroovyTestCase {
    def marketplaceService
    def stackService
    def dashboardService
    def personWidgetDefinitionService
    def widgetDefinitionService
    def grailsApplication

    void setUp() {
        super.setUp()
        def acctService = new AutoLoginAccountService()
        Person p = new Person(username:'testUserWidgetDefinitionServiceTesting', userRealName: 'foo', passwd: 'foo', enabled:true)
        p.save()
        acctService.autoAccountName = 'testUserWidgetDefinitionServiceTesting'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        widgetDefinitionService.accountService = acctService
        personWidgetDefinitionService.accountService = acctService
        marketplaceService.accountService = acctService
    }

    void tearDown() {
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

        loginAsAdmin()
        def listings = marketplaceService.addListingsToDatabase(singleSimpleStack)
        def stack = listings[0]
        assert stack != null
        assert stack.name == singleSimpleStack[0].name
        assert stack.description == singleSimpleStack[0].description
        assert stack.stackContext == singleSimpleStack[0].stackContext
        def foundStack = Stack.findByName(singleSimpleStack[0].name)
        assert stack == foundStack
    }

    void testAddingWidgetFromMarketplace() {
      //add a dummy widgets that would be from marketplace

      //todo someday fix this crazy json string embedded structure
      def widget1 = [
              displayName: 'Widget1',
              imageUrlMedium: 'http://widget1.com',
              imageUrlSmall: 'http://widget1.com',
              widgetGuid: '9bd3e9ad-366d-4fda-8ae3-2b269f72e059',
              widgetUrl: 'http://widget1.com',
              widgetVersion: '1',
              singleton: false,
              visible: true,
              background: false,
              mobileReady: false,
              isSelected: true,
              height: 200,
              width: 200,
              isExtAjaxFormat: true,
              directRequired: (['79ae9905-ce38-4de6-ad89-fe598d497703'] as JSON).toString()
      ]
      def widget2 = [
              displayName: 'Widget2',
              imageUrlMedium: 'http://widget2.com',
              imageUrlSmall: 'http://widget2.com',
              widgetGuid: '79ae9905-ce38-4de6-ad89-fe598d497703',
              widgetUrl: 'http://widget2.com',
              widgetVersion: '1',
              singleton: false,
              visible: true,
              background: false,
              mobileReady: false,
              isSelected: false,
              height: 200,
              width: 200,
              isExtAjaxFormat: true,
              directRequired: (['6aca40aa-1b9e-4044-8bbe-d628e6d4518f'] as JSON).toString()
      ]
      def widget3 = [
              displayName: 'Widget3',
              imageUrlMedium: 'http://widget3.com',
              imageUrlSmall: 'http://widget3.com',
              widgetGuid: '6aca40aa-1b9e-4044-8bbe-d628e6d4518f',
              widgetUrl: 'http://widget3.com',
              widgetVersion: '1',
              singleton: false,
              visible: true,
              background: false,
              mobileReady: false,
              isSelected: false,
              height: 200,
              width: 200,
              isExtAjaxFormat: true,
      ]

      def params = [
              widgets: ([widget1, widget2, widget3] as JSON).toString()
      ]

      //println("params:${params}")
      def result = marketplaceService.addExternalWidgetsToUser(params)
      def data = result.data

      //check for success
      assert result.success

      //check that widget1, widget2 and widget3 are in the return data
      assert data[0].displayName == "Widget1"
      assert data[1].displayName == "Widget2"
      assert data[2].displayName == "Widget3"
      assert data.size() == 3

      //check to make sure that widget is in the admin widgetlist
      result = widgetDefinitionService.list()
      data = result.data

      //check for success
      assert result.success

      //check that widget1, widget2 and widget3 are in the return data
      assert data[0].displayName == "Widget1"
      assert data[1].displayName == "Widget2"
      assert data[2].displayName == "Widget3"
      assert data.size() == 3

      //check that the widgets are in the launch menu for the current user
      result = personWidgetDefinitionService.list(new GrailsParameterMap([:],null))
      data = result.personWidgetDefinitionList

      //check for success
      assert result.success

      //check that widget1, widget2 and widget3 are in the return data
      assert data[0].widgetDefinition.displayName == "Widget1"
      assert data[1].widgetDefinition.displayName == "Widget2"
      assert data[2].widgetDefinition.displayName == "Widget3"
      assert data.size() == 3

    }
}
