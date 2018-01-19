package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*
import ozone.owf.grails.services.DashboardService
import ozone.owf.grails.services.WidgetDefinitionService

import static owf.grails.test.integration.services.DashboardPostParams.*


@Integration
@Rollback
class DashboardServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    DashboardService dashboardService

    @Autowired
    WidgetDefinitionService widgetDefinitionService

    int widgetDefinitionCounter = 0

    Person user1

    Stack stack

    private void setupData() {
        user1 = createUser('user1')

        stack = save new Stack(
                name: 'Test Stack',
                description: 'This is a test stack',
                stackContext: 'testStack',
                imageUrl: 'testStack.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor')
    }

    void testCreate() {
        given: "create 3 PersonWidgetDefinitions so the state objects match up"
        setupData()
        loggedInAs user1

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA2())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA3())

        assert PersonWidgetDefinition.list().size() == 3

        when:
        def result = dashboardService.create(generatePostParamsA())

        then:
        with(result) {
            success
            dashboard != null
        }
    }

    void testCreateWithStack() {
        given: "create 3 PersonWidgetDefinitions so the state objects match up"
        setupData()
        loggedInAs user1

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD1())

        assert PersonWidgetDefinition.list().size() == 3

        when:
        def result = dashboardService.create(generatePostParamsTestDBWithStack(stack))

        then:
        with(result) {
            success
            dashboard != null
        }
    }

    void testCloneNonexisting() {
        given: "create 3 Person Widget Definitions so the state objects match up"
        setupData()
        loggedInAs user1

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB2())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsI3())

        when:
        def result = dashboardService.deepClone(generatePostParamsJ())

        then:
        result.success
        result.dashboard != null
    }

    void testBulkUpdate() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        def result = dashboardService.bulkUpdate(generatePostParamsBulkUpdate())

        then:
        result.success

        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_1), Dashboard) {
            !isdefault
            name == "NEW NAME Accordion Window Manager (USER 3)"
        }

        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_2), Dashboard) {
            !isdefault
            name == "NEW NAME Tabbed Window Manager (USER 3)"
        }

        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_3), Dashboard) {
            !isdefault
            name == "NEW Tabbed Window Manager (USER 3)"
        }

        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_4), Dashboard) {
            isdefault
            name == "UPDATED Tabbed Window Manager (USER 3)"
        }
    }

    void testBulkUpdate_withBadGuid_throwsException() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        dashboardService.bulkUpdate(generatePostParamsBulkUpdateBadGuid())

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.NotFound
    }

    void testBulkUpdate_withNoViews_throwsException() {
        when:
        dashboardService.bulkUpdate([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testBulkDelete() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        def result = dashboardService.bulkDelete(generatePostParamsBulkDelete())

        then:
        result.success

        Dashboard.findByGuid(BULK_DASHBOARD_GUID_1) == null
        Dashboard.findByGuid(BULK_DASHBOARD_GUID_2) == null
        Dashboard.findByGuid(BULK_DASHBOARD_GUID_3) == null
        Dashboard.findByGuid(BULK_DASHBOARD_GUID_4) == null
    }

    void testBulkDelete_withBadGuid_throwsException() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        dashboardService.bulkDelete(generatePostParamsBulkDeleteBadGuid())

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.NotFound
    }

    void testBulkDelete_withNoViews_throwsException() {
        when:
        dashboardService.bulkDelete([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    void testBulkDeleteAndUpdate() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        def result = dashboardService.bulkDeleteAndUpdate(generatePostParamsBulkDeleteAndUpdate())

        then:
        result.success

        Dashboard.findByGuid(BULK_DASHBOARD_GUID_2) == null
        Dashboard.findByGuid(BULK_DASHBOARD_GUID_3) == null

        //Did it update?
        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_1), Dashboard) {
            !isdefault
            name == "NEW NAME Accordion Window Manager (USER 3)"
        }

        with(Dashboard.findByGuid(BULK_DASHBOARD_GUID_4), Dashboard) {
            isdefault
            name == "UPDATED Tabbed Window Manager (USER 3)"
        }
    }

    void testBulkDeleteAndUpdate_withBadGuid_throwsException() {
        given:
        setupData()
        loggedInAs user1

        createDashboardsForBulkTests()

        when:
        dashboardService.bulkDeleteAndUpdate(generatePostParamsBulkDeleteAndUpdateBadGuid())

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.NotFound
    }

    void testBulkDeleteAndUpdate_withNoViews_throwsException() {
        when:
        dashboardService.bulkDeleteAndUpdate([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Validation
    }

    /** A default dashboard exists. A new dashboard is created that is "set as default" */
    void testCreateNewDefault() {
        given:
        setupData()
        loggedInAs user1

        and: "the original 'default' Dashboard"
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB2())

        def originalDashboard = createDashboardFromParams(generatePostParamsC())
        assert originalDashboard.isdefault

        when: "create a new Dashboard that is set as 'default'"
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD2())

        def newDashboard = createDashboardFromParams(generatePostParamsD())

        then: "the new Dashboard is 'default'"
        newDashboard.isdefault

        and: "the original Dashboard is no longer 'default'"
        !originalDashboard.isdefault
    }

    /** A default dashboard exists. A different dashboard is updated to be "set as default" */
    void testUpdateNewDefault() {
        given:
        setupData()
        loggedInAs user1

        and: "the original 'default' Dashboard"
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD2())

        def originalDashboard = createDashboardFromParams(generatePostParamsD())
        assert originalDashboard.isdefault

        and: "a target Dashboard that is not 'default'"
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB2())

        def targetDashboard = createDashboardFromParams(generatePostParamsB())
        assert !targetDashboard.isdefault

        when: "update the target Dashboard to set as the new 'default'"
        def updatedDashboard = updateDashboardFromParams(generatePostParamsC())

        then: "the target Dashboard is 'default'"
        updatedDashboard.isdefault

        and: "the original Dashboard is no longer 'default'"
        !originalDashboard.isdefault

    }

    void testOrderCorrectOnCreate() {
        given:
        setupData()
        loggedInAs user1

        and:
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB2())

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD2())

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsEF1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsEF2())

        when: "create 3 Dashboards not ordered by GUID"
        def dashboardA2 = createDashboardFromParams(generatePostParamsE())
        def dashboardA0 = createDashboardFromParams(generatePostParamsC())
        def dashboardA1 = createDashboardFromParams(generatePostParamsD())

        then:
        listDashboardGuids() == [dashboardA2.guid, dashboardA0.guid, dashboardA1.guid]
    }

    void testUpdateDashboardPosition() {
        given:
        setupData()
        loggedInAs user1

        and: "initial Dashboards"
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsD2())
        Dashboard dashboardD = createDashboardFromParams(generatePostParamsD())

        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsEF1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsEF2())
        Dashboard dashboardE = createDashboardFromParams(generatePostParamsE())

        and: "verify that the dashboards are in the correct, initial create order"
        assert listDashboardGuids() == [dashboardD.guid, dashboardE.guid]

        when: "set Dashboard E's position to 0"
        updateDashboardFromParams(generatePostParamsF())

        and: "set Dashboard D's position to 1"
        updateDashboardFromParams(generatePostParamsG())

        then: "the dashboards have been reversed and are positioned correctly"
        listDashboardGuids() == [dashboardE.guid, dashboardD.guid]
    }

    private List<String> listDashboardGuids() {
        dashboardService.list([:])?.dashboardList*.guid
    }

    private PersonWidgetDefinition createPersonWidgetDefinition(postParams) {
        assert user1 != null

        runAsAdmin {
            widgetDefinitionService.create(postParams)
        }

        def widgetDefinition = verifyNotNull { WidgetDefinition.findByWidgetGuid(postParams.widgetGuid) }

        save new PersonWidgetDefinition(
                widgetDefinition: widgetDefinition,
                person: user1,
                visible: true,
                pwdPosition: widgetDefinitionCounter)

        widgetDefinitionCounter++

        return verifyNotNull { PersonWidgetDefinition.findByWidgetDefinition(widgetDefinition) }
    }


    private Dashboard updateDashboardFromParams(Map params) {
        def result = dashboardService.update(params)

        assert result.success
        assert result.dashboard != null

        result.dashboard
    }

    private Dashboard createDashboardFromParams(Map params) {
        def result = dashboardService.create(params)

        assert result.success
        assert result.dashboard != null

        result.dashboard
    }

    /** TODO: Rewrite; intent config data is now inside of layoutConfig within the widgets array. */
    private void createDashboardsForBulkTests() {
        //Create all dashboards first...

        //Create 3 Person Widget Definitions so the state objects match up.
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA2())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsA3())

        def resultOfCreateA = dashboardService.create(generatePostParams_BULK_A())
        assert resultOfCreateA.success

        def dashboardA = Dashboard.findByGuid(BULK_DASHBOARD_GUID_1)
        assert "Accordion Window Manager (USER 3)" == dashboardA.name
        assert !dashboardA.isdefault

        //Create 2 Person Widget Definitions so the state objects match up.
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB1())
        createPersonWidgetDefinition(WidgetDefinitionPostParams.generateDSTPostParamsB2())

        def resultOfCreateB = dashboardService.create(generatePostParams_BULK_B())
        assert resultOfCreateB.success

        def dashboardB = Dashboard.findByGuid(BULK_DASHBOARD_GUID_2)
        assert dashboardB.name == "Tabbed Window Manager (USER 3)"
        assert !dashboardB.isdefault

        //It appears that C uses the same PersonWidgetDefinitions as B.
        def resultOfCreateC = dashboardService.create(generatePostParams_BULK_C())
        assert resultOfCreateC.success

        def dashboardC = Dashboard.findByGuid(BULK_DASHBOARD_GUID_3)
        assert dashboardC.name == "Tabbed Window Manager (USER 3)"
        assert !dashboardC.isdefault

        //It appears that D uses the same PersonWidgetDefinitions as B.
        def resultOfCreateD = dashboardService.create(generatePostParams_BULK_D())
        assert resultOfCreateD.success

        def dashboardD = Dashboard.findByGuid(BULK_DASHBOARD_GUID_4)
        assert dashboardD.name == "Tabbed Window Manager (USER 3)"
        assert !dashboardD.isdefault
    }

}
