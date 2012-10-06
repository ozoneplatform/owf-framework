package ozone.owf.grails.services

import ozone.owf.grails.domain.*

import grails.test.*
import org.codehaus.groovy.grails.commons.ApplicationHolder

class ServiceModelServiceTests extends GrailsUnitTestCase {
    def serviceModelService

    protected void setUp() {
        super.setUp()
        serviceModelService = new ServiceModelService()
        serviceModelService.grailsApplication = [
            mainContext: [
                //for now, just fake a getBean
                //method that always returns a faked WidgetDefinitionService
                //regardless of what was actually asked for
                getBean: { a -> 
                    [ 
                        getDirectRequiredIds: { b -> [] }, 
                        getAllRequiredIds: { c -> [] } 
                    ]
                }
            ]
        ]
    }

    protected void tearDown() {
        super.tearDown()
    }


    /* Dashboard Tests */

    void testDashboardDefinitionToServiceModel() {
        def dashboard = new Dashboard()

		dashboard.guid = '3F2504E0-4F89-11D3-9A0C-0305E82C3301'
		dashboard.isdefault = false
		dashboard.dashboardPosition = 0
		dashboard.name =  "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		dashboard.layout = EDashboardLayout.Accordion.strVal
		dashboard.columnCount = 1
		dashboard.state = [] as SortedSet
		dashboard.user = new Person()
		
        def serviceModel = serviceModelService.createServiceModel(dashboard)
		
		assertEquals serviceModel.name, dashboard.name
		assertEquals serviceModel.isdefault, dashboard.isdefault
		assertEquals serviceModel.layout, dashboard.layout
		assertEquals serviceModel.columnCount, dashboard.columnCount
		assertEquals serviceModel.state as SortedSet, dashboard.state
        
    }

    void testDashboardDefinitionToServiceModelWithApostropheInUsername() {
        def dashboard = new Dashboard()

	    def username = "George Can'tstanza"

		dashboard.guid = '3F2504E0-4F89-11D3-9A0C-0305E82C3301'
		dashboard.isdefault = false
		dashboard.dashboardPosition = 0
		dashboard.name =  "Testing userid with apostrophe"
		dashboard.layout = EDashboardLayout.Accordion.strVal
		dashboard.columnCount = 1
		dashboard.state = [] as SortedSet
		dashboard.user = new Person(username: username)
		
        def serviceModel = serviceModelService.createServiceModel(dashboard)
		
		assertEquals serviceModel.name, dashboard.name
		assertEquals serviceModel.isdefault, dashboard.isdefault
		assertEquals serviceModel.layout, dashboard.layout
		assertEquals serviceModel.columnCount, dashboard.columnCount
		assertEquals serviceModel.state as SortedSet, dashboard.state
        
    }

    void testDashboardWidgetStateToServiceModel() {
        def dashboardWidgetState = new DashboardWidgetState()

	    dashboardWidgetState.dashboard			   = new Dashboard()
		dashboardWidgetState.personWidgetDefinition= new PersonWidgetDefinition(
		    widgetDefinition: new WidgetDefinition(widgetGuid:'3F2504E0-4F89-11D3-9A0C-0305E82C3302',
                    universalName:'3F2504E0-4F89-11D3-9A0C-0305E82C3302',
                    widgetVersion: '1.0')
		)
		dashboardWidgetState.uniqueId              = '3F2504E0-4F89-11D3-9A0C-0305E82C3301'
    	dashboardWidgetState.name                  = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
    	dashboardWidgetState.active                = false
    	dashboardWidgetState.width                 = 0
    	dashboardWidgetState.height                = 0
    	dashboardWidgetState.x                     = 0
    	dashboardWidgetState.y                     = 0
    	dashboardWidgetState.zIndex                = 0
    	dashboardWidgetState.minimized             = false
    	dashboardWidgetState.maximized             = false
    	dashboardWidgetState.pinned                = false
    	dashboardWidgetState.collapsed             = false
    	dashboardWidgetState.columnPos             = 0
    	dashboardWidgetState.buttonId              = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
    	dashboardWidgetState.buttonOpened          = false
    	dashboardWidgetState.region                = EDashboardRegion.None.strVal
		dashboardWidgetState.statePosition         = 0

        def serviceModel = serviceModelService.createServiceModel(dashboardWidgetState)

        assertEquals serviceModel.name, dashboardWidgetState.name     
        assertEquals serviceModel.active, dashboardWidgetState.active     
        assertEquals serviceModel.uniqueId, dashboardWidgetState.uniqueId     
        assertEquals serviceModel.width, dashboardWidgetState.width     
        assertEquals serviceModel.height, dashboardWidgetState.height     
        assertEquals serviceModel.zIndex, dashboardWidgetState.zIndex     
        assertEquals serviceModel.x, dashboardWidgetState.x     
        assertEquals serviceModel.y, dashboardWidgetState.y     
        assertEquals serviceModel.minimized, dashboardWidgetState.minimized     
        assertEquals serviceModel.maximized, dashboardWidgetState.maximized     
        assertEquals serviceModel.collapsed, dashboardWidgetState.collapsed        
        assertEquals serviceModel.region, dashboardWidgetState.region     
    }

    private def createPerson() {
	    def userRealName = "Mike O'Leary"
	    def username = "MO'Leary"

        new Person(
	        username: username,
	        userRealName: userRealName,
	        enabled: true
	    )

    }

    void testPersonToServiceModel() {
	    def person = createPerson()
        def serviceModel = serviceModelService.createServiceModel(person)

        assertEquals serviceModel.username, person.username
        assertEquals serviceModel.userRealName, person.userRealName
    }

    void testPreferenceToServiceModelWithSingleTinckInValue() {
		def val = "I can't do it"
		def namespace = "com.company.widget"
		def path = "status"
		def user = createPerson()
        def preference = new Preference()
		preference.namespace = namespace
		preference.path = path
		preference.value = val
		preference.user = user			
		
		def serviceModel = serviceModelService.createServiceModel(preference)
		assertEquals serviceModel.namespace, namespace 
		assertEquals serviceModel.value , val
		assertEquals serviceModel.path ,path
		assertEquals serviceModel.user.username, user.username;
    }
    
    void testPreferenceToJsonWithJsonInValue() {
		def val = 	
		'''
		{ 
			"a": "apple", 
			"b": "banana"
		}
		'''
		def namespace = "com.company.widget"
		def path = "abc"
		def user = createPerson()
        def preference = new Preference()
		preference.namespace = namespace
		preference.path = path
		preference.value = val
		preference.user = user			
		
		def json = serviceModelService.createServiceModel(preference).toDataMap()
		assertEquals json.get("namespace"), namespace 
		assertEquals json.get("path") ,path
		assertEquals json.get("user").get("userId"), user.username;
		assertEquals json.get("value"), val
    }

    void testWidgetDefinitionToServiceModel() {
        def widgetDefinition = new WidgetDefinition()

	    widgetDefinition.universalName = "3F2504E0-4F89-11D3-9A0C-0305E82C3301"
	    widgetDefinition.widgetGuid = "3F2504E0-4F89-11D3-9A0C-0305E82C3301"
        widgetDefinition.widgetVersion = "1.0"
	    widgetDefinition.displayName = "Hello World 1234567890!@\$'%^&*()_+-|?><`~."
	    widgetDefinition.widgetUrl = "https://localhost/"
    	widgetDefinition.imageUrlSmall = "https://localhost/"
    	widgetDefinition.imageUrlLarge = "https://localhost/"
    	widgetDefinition.width = 200
    	widgetDefinition.height = 200
    	widgetDefinition.personWidgetDefinitions = []
        widgetDefinition.metaClass.getTags = { [] }

	    def serviceModel = serviceModelService.createServiceModel(widgetDefinition)
	    
	    assertEquals serviceModel.displayName, widgetDefinition.displayName
	    assertEquals serviceModel.widgetGuid, widgetDefinition.widgetGuid
	    assertEquals serviceModel.widgetUrl, widgetDefinition.widgetUrl
	    assertEquals serviceModel.imageUrlSmall, widgetDefinition.imageUrlSmall
	    assertEquals serviceModel.imageUrlLarge, widgetDefinition.imageUrlLarge
	    assertEquals serviceModel.width, widgetDefinition.width
	    assertEquals serviceModel.height, widgetDefinition.height
	    assertEquals serviceModel.widgetVersion, widgetDefinition.widgetVersion
    }
}
