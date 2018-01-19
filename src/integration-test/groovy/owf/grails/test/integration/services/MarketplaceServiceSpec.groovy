package owf.grails.test.integration.services

import spock.lang.Specification

import grails.converters.JSON
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import grails.web.servlet.mvc.GrailsParameterMap

import org.springframework.beans.factory.annotation.Autowired

import org.grails.web.json.JSONArray
import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.services.MarketplaceService
import ozone.owf.grails.services.PersonWidgetDefinitionService
import ozone.owf.grails.services.WidgetDefinitionService


@Integration
@Rollback
class MarketplaceServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    MarketplaceService service

    @Autowired
    WidgetDefinitionService widgetDefinitionService

    @Autowired
    PersonWidgetDefinitionService personWidgetDefinitionService

    Person user1

    private void setupData() {
        user1 = createUser('user1')
    }

    void testAddSimpleStack() {
        given:
        setupData()
        loggedInAs user1

        def singleSimpleStack = new JSONArray("[${SIMPLE_STACK_JSON}]")

        when:
        def listings = service.addListingsToDatabase(singleSimpleStack)
        def stack = listings[0]

        then:
        with(stack, Stack) {
            name == singleSimpleStack[0].name
            description == singleSimpleStack[0].description
            stackContext == singleSimpleStack[0].stackContext
        }

        Stack.findByName(singleSimpleStack[0].name) == stack
    }

    void testAddingWidgetFromMarketplace() {
        given:
        setupData()
        loggedInAs user1

        when:
        def result = service.addExternalWidgetsToUser([widgets: createWidgetJsonData()])

        then:
        result.success
        result.data*.displayName == ['Widget1', 'Widget2', 'Widget3']
    }

    // check to make sure that widget is in the admin widgetlist
    void testAddingWidgetFromMarketplace_addedToWidgetDefinitionService() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.addExternalWidgetsToUser([widgets: createWidgetJsonData()])

        def result = widgetDefinitionService.list()

        then:
        result.success
        result.data*.displayName == ['Widget1', 'Widget2', 'Widget3']
    }

    // check that the widgets are in the launch menu for the current user
    void testAddingWidgetFromMarketplace_addedToPersonWidgetDefinitionService() {
        given:
        setupData()
        loggedInAs user1

        when:
        service.addExternalWidgetsToUser([widgets: createWidgetJsonData()])

        def result = personWidgetDefinitionService.list(new GrailsParameterMap([:], null))

        then:
        result.success
        result.personWidgetDefinitionList*.widgetDefinition.displayName == ['Widget1', 'Widget2', 'Widget3']
    }

    private static final String SIMPLE_STACK_JSON = '''
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

    private static String createWidgetJsonData() {
        def widget1 = [
                displayName    : 'Widget1',
                imageUrlMedium : 'http://widget1.com',
                imageUrlSmall  : 'http://widget1.com',
                widgetGuid     : '9bd3e9ad-366d-4fda-8ae3-2b269f72e059',
                widgetUrl      : 'http://widget1.com',
                widgetVersion  : '1',
                singleton      : false,
                visible        : true,
                background     : false,
                mobileReady    : false,
                isSelected     : true,
                height         : 200,
                width          : 200,
                isExtAjaxFormat: true,
                directRequired : (['79ae9905-ce38-4de6-ad89-fe598d497703'] as JSON).toString()
        ]

        def widget2 = [
                displayName    : 'Widget2',
                imageUrlMedium : 'http://widget2.com',
                imageUrlSmall  : 'http://widget2.com',
                widgetGuid     : '79ae9905-ce38-4de6-ad89-fe598d497703',
                widgetUrl      : 'http://widget2.com',
                widgetVersion  : '1',
                singleton      : false,
                visible        : true,
                background     : false,
                mobileReady    : false,
                isSelected     : false,
                height         : 200,
                width          : 200,
                isExtAjaxFormat: true,
                directRequired : (['6aca40aa-1b9e-4044-8bbe-d628e6d4518f'] as JSON).toString()
        ]

        def widget3 = [
                displayName    : 'Widget3',
                imageUrlMedium : 'http://widget3.com',
                imageUrlSmall  : 'http://widget3.com',
                widgetGuid     : '6aca40aa-1b9e-4044-8bbe-d628e6d4518f',
                widgetUrl      : 'http://widget3.com',
                widgetVersion  : '1',
                singleton      : false,
                visible        : true,
                background     : false,
                mobileReady    : false,
                isSelected     : false,
                height         : 200,
                width          : 200,
                isExtAjaxFormat: true
        ]

        ([widget1, widget2, widget3] as JSON).toString()
    }
}
