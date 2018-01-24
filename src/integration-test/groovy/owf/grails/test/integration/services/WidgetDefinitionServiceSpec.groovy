package owf.grails.test.integration.services

import spock.lang.Specification

import grails.converters.JSON
import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.DomainBuilders
import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*
import ozone.owf.grails.services.DomainMappingService
import ozone.owf.grails.services.WidgetDefinitionService
import ozone.owf.grails.services.model.WidgetDefinitionServiceModel

import static WidgetDefinitionPostParams.generatePostParamsA
import static WidgetDefinitionPostParams.generatePostParamsB
import static owf.grails.test.integration.DomainBuilders.createWidgetDefinitionWithIntents
import static owf.grails.test.integration.JsonUtil.restringify


@Integration
@Rollback
class WidgetDefinitionServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    private static final SAMPLE_WIDGETS_DISPLAY_NAMES = ["A", "D", "C", "AA", "B", "BB"]

    @Autowired
    WidgetDefinitionService widgetDefinitionService

    @Autowired
    DomainMappingService domainMappingService

    Person admin1
    Person user1

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    private void setupWidgetData() {
        SAMPLE_WIDGETS_DISPLAY_NAMES.each { displayName ->
            save new WidgetDefinition(
                    universalName: UUID.randomUUID(),
                    widgetGuid: UUID.randomUUID(),
                    widgetVersion: '1.0',
                    displayName: displayName,
                    width: 200,
                    height: 200,
                    widgetUrl: 'http://example.com/widget',
                    imageUrlSmall: 'http://example.com/small.png',
                    imageUrlMedium: 'http://example.com/medium.png')
        }
    }

    void testCreate_whenNotAdmin_shouldThrowException() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        widgetDefinitionService.create([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testCreate() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def params = generatePostParamsA()
        def result = widgetDefinitionService.create(params)
        def widgetDefinition = WidgetDefinition.findByWidgetGuid(params.widgetGuid)

        then:
        result.success

        result.data.size() == 1
        with(result.data[0], WidgetDefinitionServiceModel) {
            widgetGuid == params.widgetGuid
            widgetGuid == widgetDefinition.widgetGuid
        }
    }

    void testUpdate_whenNotAdmin_shouldThrowException() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        widgetDefinitionService.update([:])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testUpdate() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def postParamsA = generatePostParamsA()
        widgetDefinitionService.create(postParamsA)

        def postParamsB = generatePostParamsB()
        postParamsB.id = postParamsB.widgetGuid
        def result = widgetDefinitionService.update(postParamsB)
        def widgetDefinition = WidgetDefinition.findByWidgetGuid("12345678-1234-1234-1234-1234567890a0")

        then:
        result.success

        WidgetDefinition.findAll().size() == 1

        widgetDefinition.displayName == "My Widget Updated"
    }

    void testListWithStartAndLimit() {
        given:
        setupWidgetData()

        when:
        def widgets = widgetDefinitionService.list([offset: "4", max: "1"])

        then:
        widgets.data.size() == 1
        widgets.data[0].displayName == SAMPLE_WIDGETS_DISPLAY_NAMES[4]
    }

    void testListWithSortAndDir() {
        given:
        setupWidgetData()

        when:
        def widgets = widgetDefinitionService.list([sort: 'value.namespace', order: 'desc'])

        then:
        widgets.data.size() == 6
        widgets.data*.displayName == ["D", "C", "BB", "B", "AA", "A"]
    }

    void testListWithSortAndDirAndStartAndLimit() {
        given:
        setupWidgetData()

        def expectedOrder = ["A", "AA", "B", "BB", "C", "D"]

        def widgets = widgetDefinitionService.list([offset: "4", max: "1", sort: 'value.namespace', order: 'asc'])

        assert expectedOrder[4] == widgets.data[0].displayName
    }

    void testListWithNoParams() {
        given:
        setupWidgetData()

        expect:
        widgetDefinitionService.list().data.size() == SAMPLE_WIDGETS_DISPLAY_NAMES.size()
    }

    void testListCount() {
        given:
        setupWidgetData()

        expect:
        widgetDefinitionService.list().results == WidgetDefinition.count()
    }

    void testListWithOnlySortParameter() {
        given:
        setupWidgetData()

        when:
        def widgets = widgetDefinitionService.list([sort: 'value.namespace'])

        then:
        widgets.data.size() == 6
        widgets.data*.displayName == ["A", "AA", "B", "BB", "C", "D"]
    }

    void testListWithWidgetTypesParameter() {
        given:
        setupWidgetData()

        and: "create a 'store' WidgetType and add it to the sample WidgetDefinitions"
        def storeWidgetType = save(new WidgetType(name: 'store', displayName: 'store'))

        WidgetDefinition storeWidgetA = WidgetDefinition.findByDisplayName('A')
        storeWidgetA.addToWidgetTypes(storeWidgetType)
        storeWidgetA.save()

        WidgetDefinition storeWidgetB = WidgetDefinition.findByDisplayName('B')
        storeWidgetB.addToWidgetTypes(storeWidgetType)
        storeWidgetB.save()

        flushSession()

        when:
        def widgets = widgetDefinitionService.list([widgetTypes: 'store'])

        then:
        widgets.results == 2
    }

    void testListWithStackId() {
        given:
        setupWidgetData()
        def stack = createStackAndDashboards()

        when:
        def result = widgetDefinitionService.list([stack_id: stack.id])

        then:
        result.success
        result.results == 3
    }

    void testListSuccess() {
        given:
        setupWidgetData()

        expect:
        widgetDefinitionService.list().success
    }

    void testListWithNoWidgetDefinitions() {
        when:
        def list = widgetDefinitionService.list()

        then:
        list.success
        list.data.size() == 0
        list.results == 0
    }

    void testListWithBadJSONNameParameter() {
        when:
        widgetDefinitionService.list([sort: 'youneverfindmeindomain'])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.JsonToDomainColumnMapping
    }

    void testGetWidgetDescriptorJson() {
        given:
        def widget = createWidgetDefinitionWithIntents()

        def widgetDefinitionIntent1 = widget.widgetDefinitionIntents.find { it.send }
        def widgetDefinitionIntent2 = widget.widgetDefinitionIntents.find { it.receive }
        assert widgetDefinitionIntent1 != null
        assert widgetDefinitionIntent2 != null

        when:
        def widgetDescriptor = JSON.parse(widgetDefinitionService.getWidgetDescriptorJson(widget))

        then:
        with(widgetDescriptor) {
            displayName == widget.displayName
            universalName == widget.universalName
            widgetUrl == widget.widgetUrl
            imageUrlMedium == widget.imageUrlMedium
            imageUrlSmall == widget.imageUrlSmall
            description == widget.description
            widgetVersion == widget.widgetVersion
            height == widget.height
            width == widget.width
            visible == widget.visible
            background == widget.background
            mobileReady == widget.mobileReady
            singleton == widget.singleton
            widgetTypes.toList() == widget.widgetTypes*.name
        }

        with(widgetDescriptor.intents) {
            send.size() == 1
            send[0].action == widgetDefinitionIntent1.intent.action
            send[0].dataTypes.toList() == widgetDefinitionIntent1.dataTypes*.dataType

            receive.size() == 1
            receive[0].action == widgetDefinitionIntent2.intent.action
            receive[0].dataTypes.toList() == widgetDefinitionIntent2.dataTypes*.dataType
        }
    }

    void testExport_whenNotAdmin_shouldThrowException() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        widgetDefinitionService.export('')

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.Authorization
    }

    void testExport() {
        given:
        setupUsers()
        loggedInAs admin1

        def widget = createWidgetDefinitionWithIntents()

        and:
        def widgetTypeName = widget.widgetTypes.first()?.name
        assert widgetTypeName != null

        when:
        def widgetDescriptor = widgetDefinitionService.export(widget.widgetGuid)

        then:
        with(widgetDescriptor) {
            contains('"displayName": "' + widget.displayName + '"')
            contains('"universalName": "' + widget.universalName + '"')
            contains('"widgetUrl": "' + widget.widgetUrl + '"')
            contains('"imageUrlMedium": "' + widget.imageUrlMedium + '"')
            contains('"imageUrlSmall": "' + widget.imageUrlSmall + '"')
            contains('"description": "' + widget.description + '"')
            contains('"widgetVersion": "' + widget.widgetVersion + '"')
            contains('"widgetTypes": ["' + widgetTypeName + '"]')
            contains('"height": ' + widget.height)
            contains('"width": ' + widget.width)
            contains('"visible": ' + widget.visible)
            contains('"background": ' + widget.background)
            contains('"mobileReady": ' + widget.mobileReady)
            contains('"singleton": ' + widget.singleton)
            contains('"intents":')
            contains('"send":')
            contains('"receive":')
        }
    }

    private Stack createStackAndDashboards() {
        def widget1 = WidgetDefinition.findByDisplayName(SAMPLE_WIDGETS_DISPLAY_NAMES[0])
        def widget2 = WidgetDefinition.findByDisplayName(SAMPLE_WIDGETS_DISPLAY_NAMES[1])
        def widget3 = WidgetDefinition.findByDisplayName(SAMPLE_WIDGETS_DISPLAY_NAMES[2])

        def defaultGroup = save new Group(name: 'Group1', automatic: false, status: 'active', stackDefault: true)

        def stack1 = save new Stack(
                name: 'Stack One',
                description: 'Stack One description',
                stackContext: 'one',
                imageUrl: 'http://www.images.com/theimage.png',
                descriptorUrl: 'http://www.descriptors.com/thedescriptor',
                defaultGroup: defaultGroup)

        def stackDashboard1 = save new Dashboard(
                alteredByAdmin: false,
                guid: '12345678-1234-1234-1234-123456789000',
                locked: false,
                isdefault: false,
                name: 'Stack Dashboard1',
                description: 'This is a stack dashboard.',
                dashboardPosition: 0,
                layoutConfig: restringify("""{
                    "cls": "hbox",
                    "items":[{
                        "xtype": "tabbedpane",
                        "flex": 1,
                        "height": "100%",
                        "items": [],
                        "paneType": "desktoppane",
                        "widgets": [{ "widgetGuid":"${widget3.widgetGuid}" },
                                    { "widgetGuid":"${widget2.widgetGuid}" }],
                        "defaultSettings": {}
                    },{
                        "xtype": "desktoppane",
                        "flex": 1,
                        "height": "100%",
                        "items": [],
                        "paneType": "desktoppane",
                        "widgets": [{ "widgetGuid":"${widget1.widgetGuid}" },
                                    { "widgetGuid":"${widget2.widgetGuid}" },
                                    { "widgetGuid":"${widget1.widgetGuid}" }],
                        "defaultSettings": {}
                    }],
                    "xtype":"container",
                    "layout":[{
                        "align":"stretch",
                        "type":"hbox"
                    }],
                    "flex":3
                }"""))

        def stackDashboard2 = save new Dashboard(
                alteredByAdmin: false,
                guid: '12345678-1234-1234-1234-123456789001',
                locked: false,
                isdefault: false,
                name: 'Stack Dashboard2',
                description: 'This is a stack dashboard.',
                dashboardPosition: 0,
                layoutConfig: """{
                    "xtype": "tabbedpane",
                    "flex": 1,
                    "height": "100%",
                    "items": [],
                    "paneType": "desktoppane",
                    "widgets": [{ "widgetGuid":"${widget2.widgetGuid}" }],
                    "defaultSettings": {}
                }""")

        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard1)
        domainMappingService.createMapping(stack1.defaultGroup, RelationshipType.owns, stackDashboard2)

        stack1
    }

}

