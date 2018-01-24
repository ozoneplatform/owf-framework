package owf.grails.test.integration.controllers

import spock.lang.IgnoreRest
import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.DomainBuilders
import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.WidgetController
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent

import static owf.grails.test.integration.DomainBuilders.createWidgetDefinition
import static owf.grails.test.integration.DomainBuilders.createWidgetDefinitionWithIntents


@Integration
@Rollback
class WidgetControllerSpec extends Specification
        implements ControllerTestMixin<WidgetController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void show() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        params([widgetGuid: widgetDef.widgetGuid])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        println responseJson.data[0]

        with(responseJson) {
            success

            data.size() == 1
            data[0].path == widgetDef.widgetGuid
            data[0].value.namespace == widgetDef.displayName
        }
    }

    void show_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([widgetGuid: '0c5435cf-4021-4f2a-ba69-dde451d12559'])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString =~ /^"Error during show: The requested entity was not found/
    }

    void list() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDefs = DomainBuilders.createWidgetDefinitions(2)

        when:
        def namePrefix = widgetDefs[0].displayName[0..5]

        params([widgetName: "%$namePrefix%"])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            results == 2

            data.size() == 2
            data*.path == widgetDefs*.widgetGuid
            data*.value.namespace == widgetDefs*.displayName
        }
    }

    void create() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def widget = widgetDefinitionCreationParams()

        params(widget)

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data.size() == 1
            data[0].path == widget.widgetGuid
            data[0].value.namespace == widget.displayName
            data[0].value.universalName == widget.universalName
        }
    }

    void create_withDescriptor_andNullUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def widget = widgetDefinitionCreationParams() +
                [descriptorUrl: '../examples/widgets/widget.json',
                 universalName: null]

        params(widget)

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data.size() == 1
            data[0].path == widget.widgetGuid
            data[0].value.namespace == widget.displayName
            data[0].value.universalName == null
            data[0].value.descriptorUrl == widget.descriptorUrl
        }
    }

    void create_withDescriptor_andEmptyUniversalName() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def widget = widgetDefinitionCreationParams() +
                [descriptorUrl: '../examples/widgets/widget.json',
                 universalName: '']

        params(widget)

        controller.createOrUpdate()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data.size() == 1
            data[0].path == widget.widgetGuid
            data[0].value.namespace == widget.displayName
            data[0].value.universalName == null
            data[0].value.descriptorUrl == widget.descriptorUrl
        }
    }

    void delete() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        assert WidgetDefinition.count() == 1

        when:
        params([id: widgetDef.widgetGuid])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data.size() == 1
            data[0].id == widgetDef.widgetGuid
        }

        and:
        WidgetDefinition.count() == 0
    }

    /** TODO: WidgetDefinitionService just skips missing IDs */
    void delete_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        assert WidgetDefinition.count() == 1

        when:
        def fakeId = randomUUID([widgetDef.widgetGuid])

        params([id: fakeId])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success

            data.size() == 1
            data[0].id == fakeId
        }

        and:
        WidgetDefinition.count() == 1
    }

    void export() {
        given:
        setupUsers()
        loggedInAs admin1

        def widgetDef = createWidgetDefinition()

        when:
        def filename = 'test'

        params([id      : widgetDef.widgetGuid,
                filename: filename])

        controller.export()

        then:
        responseStatus == HttpStatus.OK

        getResponseHeader("Content-disposition") == "attachment; filename=" + filename + ".html"

        responseString != null
    }

    void export_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        def filename = 'test'

        params([id      : randomUUID(),
                filename: filename])

        controller.export()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        with(responseJson) {
            !success

            errorMsg =~ /^The requested entity was not found/
        }
    }


    void update() {
        given:
        setupUsers()
        loggedInAs admin1

        def widget = createWidgetDefinitionWithIntents()

        when:
        def intents = [send   : [[action   : "Graph",
                                 dataTypes: ["application/html"]]],
                       receive: [[action   : "View",
                                 dataTypes: ["text/html"]]]]

        def updates = [id            : widget.widgetGuid,
                       widgetGuid    : widget.widgetGuid,
                       universalName : 'com.example.foo',
                       widgetVersion : '1.1',
                       displayName   : 'Widget Q',
                       widgetUrl     : '../examples/widgets/widget-q.html',
                       imageUrlSmall : '../images/icons/widget-q-small.png',
                       imageUrlMedium: '../images/icons/widget-q-medium.png',
                       descriptorUrl : '../examples/widgets/widget-q.json',
                       intents       : intents]

        params(updates)

        controller.createOrUpdate()

        then: "receive expected response"
        responseStatus == HttpStatus.OK

        def response = responseJson
        with(response) {
            success
            data.size() == 1
        }

        and: "response data matches update params"
        def updatedWidget = response.data[0]
        with(updatedWidget) {
            id == widget.widgetGuid
            path == widget.widgetGuid
            value.namespace == updates.displayName
            value.universalName == updates.universalName
            value.widgetVersion == updates.widgetVersion
            value.url == updates.widgetUrl
            value.smallIconUrl == updates.imageUrlSmall
            value.mediumIconUrl == updates.imageUrlMedium
            value.descriptorUrl == updates.descriptorUrl
            value.intents.receive.size() == 1
            value.intents.send.size() == 1
        }

        and: "new Intents are created"
        // TODO: Verify contents of intents
    }

    private static Map widgetDefinitionCreationParams() {
        [displayName   : 'Widget',
         universalName : 'com.company.widget.uuid',
         widgetGuid    : UUID.randomUUID().toString(),
         widgetVersion : '1.0',
         widgetUrl     : '../examples/widgets/widget.html',
         width         : 980,
         height        : 740,
         imageUrlSmall : '../images/icons/widget-small.png',
         imageUrlMedium: '../images/icons/widget-medium.png']
    }

}
