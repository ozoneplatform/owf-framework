package ozone.owf.grails.test.integration

import ozone.owf.grails.services.AutoLoginAccountService
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.OwfException
import grails.converters.JSON
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

class WidgetDefinitionServiceTests extends GroovyTestCase {

    def domainMappingService
    def grailsApplication
    def widgetDefinitionService
    def personWidgetDefinitionService

    private final samplesArray = ["A","D","C","AA","B","BB"]
    
    protected void setUp() {
        super.setUp()
        def acctService = new AutoLoginAccountService()
        Person p = new Person(username:'testUserWidgetDefinitionServiceTesting', userRealName: 'foo', passwd: 'foo', enabled:true)
        p.save()
        acctService.autoAccountName = 'testUserWidgetDefinitionServiceTesting'
        acctService.autoRoles = [ERoleAuthority.ROLE_ADMIN.strVal]
        widgetDefinitionService.accountService = acctService
        personWidgetDefinitionService.accountService = acctService
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testCreate()
    {
        def resultOfCreate = widgetDefinitionService.create(WidgetDefinitionPostParams.generatePostParamsA())
        assertTrue resultOfCreate.success
        assertEquals "12345678-1234-1234-1234-1234567890a0", resultOfCreate.data[0].widgetGuid
        def widgetDefinition = WidgetDefinition.findByWidgetGuid("12345678-1234-1234-1234-1234567890a0")
        assertEquals widgetDefinition.widgetGuid, resultOfCreate.data[0].widgetGuid
    }
    
    void testUpdate()
    {
        def postParamsA = WidgetDefinitionPostParams.generatePostParamsA()
        def resultOfCreate = widgetDefinitionService.create(postParamsA)

        def postParamsB = WidgetDefinitionPostParams.generatePostParamsB()
        postParamsB.id = postParamsB.widgetGuid
        def resultOfUpdate = widgetDefinitionService.update(postParamsB)
        
        assertTrue resultOfUpdate.success
        assertEquals 1, WidgetDefinition.findAll().size()
        
        def widgetDefinition = WidgetDefinition.findByWidgetGuid("12345678-1234-1234-1234-1234567890a0")
        assertEquals "My Widget Updated", widgetDefinition.displayName
    }

    void testListWithStartAndLimit() {
        createDataForListTests()
        def expectedOrder = samplesArray

        def widgets = widgetDefinitionService.list([offset: "4", max: "1"])
        assertEquals expectedOrder[4], widgets.data[0].displayName
    }

    void testListWithSortAndDir() {
        createDataForListTests()
        def expectedOrder = ["D","C","BB","B","AA","A"]

        def widgets = widgetDefinitionService.list([sort: 'value.namespace', order: 'desc'])

        assertEquals expectedOrder, widgets.data*.displayName
    }

    void testListWithSortAndDirAndStartAndLimit() {
        createDataForListTests()
        def expectedOrder = ["A", "AA", "B", "BB", "C", "D"]

        def widgets = widgetDefinitionService.list([offset: "4", max: "1", sort: 'value.namespace', order: 'asc'])

        assertEquals expectedOrder[4], widgets.data[0].displayName
    }

    void testListWithNoParams() {
        createDataForListTests()
        assertEquals samplesArray.size(), widgetDefinitionService.list().data.size()
    }

    void testListCount() {
        createDataForListTests()
        assertEquals WidgetDefinition.count(), widgetDefinitionService.list().results
    }

    void testListWithOnlySortParameter() {
        createDataForListTests()
        def expectedOrder = ["A", "AA", "B", "BB", "C", "D"]

        def widgets = widgetDefinitionService.list([sort: 'value.namespace'])

        assertEquals expectedOrder, widgets.data*.displayName
    }

    void testListWithStackId() {
        createDataForListTests()

        def widget1 = WidgetDefinition.findByDisplayName(samplesArray[0])
        def widget2 = WidgetDefinition.findByDisplayName(samplesArray[1])
        def widget3 = WidgetDefinition.findByDisplayName(samplesArray[2])
        
        def stack1 = Stack.build(name: 'Stack One', stackPosition: 2, description: 'Stack One description', stackContext: 'one', 
            imageUrl: 'http://www.images.com/theimage.png', descriptorUrl: 'http://www.descriptors.com/thedescriptor')
        stack1.addToGroups(Group.build(name: 'Group1', automatic: false, status: 'active', stackDefault: true))

        def stackDashboard1 = Dashboard.build(alteredByAdmin: false, guid: '12345678-1234-1234-1234-123456789000',
            locked: false, isdefault: false, name: 'Stack Dashboard1', layoutConfig: """{
                    "xtype": "desktoppane",
                    "flex": 1,
                    "height": "100%",
                    "items": [
                    ],
                    "paneType": "desktoppane",
                    "widgets": [{
                        "widgetGuid":"${widget1.widgetGuid}"
                    },{
                        "widgetGuid":"${widget2.widgetGuid}"
                    },{
                        "widgetGuid":"${widget1.widgetGuid}"
                    }],
                    "defaultSettings": {}
                }""", description: 'This is a stack dashboard.')

        def stackDashboard2 = Dashboard.build(alteredByAdmin: false, guid: '12345678-1234-1234-1234-123456789001',
            locked: false, isdefault: false, name: 'Stack Dashboard2', layoutConfig: """{
                    "xtype": "tabbedpane",
                    "flex": 1,
                    "height": "100%",
                    "items": [
                    ],
                    "paneType": "desktoppane",
                    "widgets": [{
                        "widgetGuid":"${widget3.widgetGuid}"
                    },{
                        "widgetGuid":"${widget2.widgetGuid}"
                    }],
                    "defaultSettings": {}
                }""", description: 'This is a stack dashboard.')

        domainMappingService.createMapping(stack1.findStackDefaultGroup(), RelationshipType.owns, stackDashboard1)
        domainMappingService.createMapping(stack1.findStackDefaultGroup(), RelationshipType.owns, stackDashboard2)

        def result = widgetDefinitionService.list([stack_id: stack1.id])
        assertTrue result.success
        assertEquals 3, result.results
    }

    void testListSuccess() {
        createDataForListTests()
        assertTrue widgetDefinitionService.list().success
    }

    void testListWithNoWidgetDefinitions() {
        def list = widgetDefinitionService.list()
        assertTrue list.success
        assertEquals 0, list.data.size()
        assertEquals 0, list.results
    }

    void testListWithBadJSONNameParameter() {
        shouldFail (OwfException,
                { widgetDefinitionService.list([sort: 'youneverfindmeindomain']) }
        )
        
    }

  void testAddingWidgetFromMarketplaceWithApproval() {
    grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup = true
    testAddExternalWidgetsToUser()
  }

  void testAddingWidgetFromMarketplaceWithAutoApproval() {
    grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup = false
    testAddExternalWidgetsToUser()
  }

  private void testAddExternalWidgetsToUser() {
    //add a dummy widgets that would be from marketplace

    //todo someday fix this crazy json string embedded structure
    def widget1 = ([
            displayName: 'Widget1',
            imageUrlLarge: 'http://widget1.com',
            imageUrlSmall: 'http://widget1.com',
            widgetGuid: '9bd3e9ad-366d-4fda-8ae3-2b269f72e059',
            widgetUrl: 'http://widget1.com',
            widgetVersion: '1',
            singleton: false,
            visible: true,
            background: false,
            isSelected: true,
            height: 200,
            width: 200,
            isExtAjaxFormat: true,
            tags: (
              grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup ?
              [[
                      name: 'pending approval',
                      visible: true,
                      position: -1
              ]] as JSON : [] as JSON
            ).toString(),
            directRequired: (['79ae9905-ce38-4de6-ad89-fe598d497703'] as JSON).toString()
    ] as JSON).toString()
    def widget2 = ([
            displayName: 'Widget2',
            imageUrlLarge: 'http://widget2.com',
            imageUrlSmall: 'http://widget2.com',
            widgetGuid: '79ae9905-ce38-4de6-ad89-fe598d497703',
            widgetUrl: 'http://widget2.com',
            widgetVersion: '1',
            singleton: false,
            visible: true,
            background: false,
            isSelected: false,
            height: 200,
            width: 200,
            isExtAjaxFormat: true,
            tags: (
              grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup ?
              [[
                      name: 'pending approval',
                      visible: true,
                      position: -1
              ]] as JSON : [] as JSON
            ).toString(),
            directRequired: (['6aca40aa-1b9e-4044-8bbe-d628e6d4518f'] as JSON).toString()
    ] as JSON).toString()
    def widget3 = ([
            displayName: 'Widget3',
            imageUrlLarge: 'http://widget3.com',
            imageUrlSmall: 'http://widget3.com',
            widgetGuid: '6aca40aa-1b9e-4044-8bbe-d628e6d4518f',
            widgetUrl: 'http://widget3.com',
            widgetVersion: '1',
            singleton: false,
            visible: true,
            background: false,
            isSelected: false,
            height: 200,
            width: 200,
            isExtAjaxFormat: true,
            tags: (
              grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup ?
              [[
                      name: 'pending approval',
                      visible: true,
                      position: -1
              ]] as JSON : [] as JSON
            ).toString(),
    ] as JSON).toString()

    def params = [
            addExternalWidgetsToUser: true,
            widgets: ([widget1, widget2, widget3] as JSON).toString()
    ]

    //println("params:${params}")
    def result = widgetDefinitionService.createOrUpdate(params)
    def data = result.data

    //check for success
    assertTrue result.success

    //check that widget1, widget2 and widget3 are in the return data
    assertEquals data[0].displayName, "Widget1"
    assertEquals data[1].displayName, "Widget2"
    assertEquals data[2].displayName, "Widget3"
    assertEquals data.size(), 3

    //check to make sure that widget is in the admin widgetlist
    result = widgetDefinitionService.list()
    data = result.data

    //check for success
    assertTrue result.success

    //check that widget1, widget2 and widget3 are in the return data
    assertEquals data[0].displayName, "Widget1"
    assertEquals data[1].displayName, "Widget2"
    assertEquals data[2].displayName, "Widget3"
    assertEquals data.size(), 3

    //check to see if that widget1 is in the approval list depending on the config param
    if (grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup) {
      result = personWidgetDefinitionService.listForAdminByTags(
              new GrailsParameterMap([tags: 'pending approval', sort: 'name', order: 'ASC'], null))
      data = result.data

      //check for success
      assertTrue result.success

      //check that only widget1
      assertEquals data[0].widgetDefinition.displayName, "Widget1"
      assertEquals data.size(), 1

      //approve
      result = personWidgetDefinitionService.approveForAdminByTags([
              toApprove: ([
                      [
                              userId: 'testUserWidgetDefinitionServiceTesting',
                              widgetGuid: '9bd3e9ad-366d-4fda-8ae3-2b269f72e059'
                      ],
                      [
                              userId: 'testUserWidgetDefinitionServiceTesting',
                              widgetGuid: '79ae9905-ce38-4de6-ad89-fe598d497703'
                      ],
                      [
                              userId: 'testUserWidgetDefinitionServiceTesting',
                              widgetGuid: '6aca40aa-1b9e-4044-8bbe-d628e6d4518f'
                      ]
              ] as JSON).toString(),
              toDelete: ([
              ] as JSON).toString()
      ])
      data = result

      //check for success
      assertTrue result.success

      //check that the widgets are in the launch menu for the current user
      result = personWidgetDefinitionService.list(new GrailsParameterMap([:],null))
      data = result.personWidgetDefinitionList

      //check for success
      assertTrue result.success

      //check that widget1, widget2 and widget3 are in the return data
      assertEquals data[0].widgetDefinition.displayName, "Widget1"
      assertEquals data[1].widgetDefinition.displayName, "Widget2"
      assertEquals data[2].widgetDefinition.displayName, "Widget3"
      assertEquals data.size(), 3

    }
    else {
      //widgets are auto approved thus nothing should show in the approval widget
      result = personWidgetDefinitionService.listForAdminByTags(
              new GrailsParameterMap([tags: 'pending approval', sort: 'name', order: 'ASC'], null))
      data = result.data

      //check for success
      assertTrue result.success

      //check that only widget1
      //println("data:${data}")
      assertEquals data.size(), 0

      //check that the widgets are in the launch menu for the current user
      result = personWidgetDefinitionService.list(new GrailsParameterMap([:],null))
      data = result.personWidgetDefinitionList

      //check for success
      assertTrue result.success

      //check that widget1, widget2 and widget3 are in the return data
      assertEquals data[0].widgetDefinition.displayName, "Widget1"
      assertEquals data[1].widgetDefinition.displayName, "Widget2"
      assertEquals data[2].widgetDefinition.displayName, "Widget3"
      assertEquals data.size(), 3
    }

  }

  private void createDataForListTests() {
        // just some sample data, must be called in each test, spring transactions clean up the db
        samplesArray.eachWithIndex { obj, i ->
            WidgetDefinition.build(universalName: java.util.UUID.randomUUID(), widgetGuid: java.util.UUID.randomUUID(), widgetVersion: '1.0', displayName: obj )
        }
    }
}