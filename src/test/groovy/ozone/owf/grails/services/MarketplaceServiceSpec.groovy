package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest

import org.grails.web.json.JSONArray

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.*

import static ozone.owf.grails.services.SampleWidgetDefinitions.*


class MarketplaceServiceSpec extends Specification
        implements ServiceUnitTest<MarketplaceService>, DataTest {

    Class[] getDomainClassesToMock() {
        [
                WidgetType,
                WidgetDefinition,
                WidgetDefinitionIntent,
                Intent,
                IntentDataType,
                PersonWidgetDefinition,
                Stack
        ]
    }

    DomainMappingService domainMappingService = Mock()

    WidgetDefinitionService widgetDefinitionService = Mock() {
        canUseUniversalName(*_) >> true
    }

    void setup() {
        service.domainMappingService = domainMappingService
        service.widgetDefinitionService = widgetDefinitionService

        new WidgetType(name: 'standard', displayName: 'Standard').save()
        new WidgetType(name: 'marketplace', displayName: 'Marketplace').save()
        new WidgetType(name: 'metric', displayName: 'Metric').save()
        new WidgetType(name: 'administration', displayName: 'Administration').save()

        assert WidgetType.standard != null
    }

    def singleSimpleWidget = new JSONArray("[${SIMPLE_WIDGET}]")
    def singleSimpleWidgetWithUniversalName = new JSONArray("[${SIMPLE_WIDGET_WITH_UNIVERSAL_NAME}]")
    def singleSimpleWidgetWithNullUniversalName = new JSONArray("[${SIMPLE_WIDGET_WITH_NULL_UNIVERSAL_NAME}]")
    def singleWidgetWithIntents = new JSONArray("[${WIDGET_WITH_INTENTS}]")
    def withAndWithoutIntents = new JSONArray("[${SIMPLE_WIDGET},${WIDGET_WITH_INTENTS}]")
    def widgetWithInterestingTypes = new JSONArray("[${WIDGET_WITH_INTERESTING_TYPES}]")
    def singleSimpleStack = new JSONArray("[${SIMPLE_STACK}]")

    // just make sure that it actually parses a basic widget
    void testSimplestWidget() {
        when:
        def widgets = service.addListingsToDatabase(singleSimpleWidget);

        then:
        widgets.size() == 1

        with(widgets[0], WidgetDefinition) {
            displayName == 'name'
            description == 'description'
            imageUrlMedium == 'largeImage'
            imageUrlSmall == 'smallImage'
            widgetGuid == '086ca7a6-5c53-438c-99f2-f7820638fc6f'
            widgetUrl == 'http://wikipedia.com'
            widgetVersion == '1'
            !singleton
            visible
            !background
            !mobileReady
            height == 200
            width == 300
            widgetTypes*.name == ['standard']
        }
    }

    // just make sure that it actually parses a basic widget
    void testWidgetWithNullUniversalName() {
        when:
        def widgets = service.addListingsToDatabase(singleSimpleWidgetWithNullUniversalName);

        then:
        widgets.size() == 1

        with(widgets[0], WidgetDefinition) {
            displayName == 'name'
            description == 'description'
            imageUrlMedium == 'largeImage'
            imageUrlSmall == 'smallImage'
            widgetGuid == '086ca7a6-5c53-438c-99f2-f7820638fc6f'
            widgetUrl == 'http://wikipedia.com'
            widgetVersion == '1'
            !singleton
            visible
            !background
            !mobileReady
            height == 200
            width == 300
            widgetTypes*.name == ['standard']
        }
    }

    void testSimplestWidgetWithExistingUniversalNameFails() {
        given:
        service.widgetDefinitionService = Mock(WidgetDefinitionService) {
            canUseUniversalName(*_) >> false
        }

        when:
        service.addListingsToDatabase(singleSimpleWidgetWithUniversalName)

        then:
        thrown(OwfException)
    }

    void testProcessesIntentsOnOneWidget() {
        when:
        def widgets = service.addListingsToDatabase(singleWidgetWithIntents);

        then:
        widgets.size() == 1

        with(widgets[0], WidgetDefinition) {
            widgetDefinitionIntents*.intent.action.sort() == ['send', 'receive'].sort()
            widgetDefinitionIntents.each {
                it.dataTypes*.dataType.sort() == ['text/plain', 'text/html'].sort()
            }

            widgetTypes*.name == ['metric']
        }
    }

    void testMultipleWidgets() {
        when:
        def widgets = service.addListingsToDatabase(withAndWithoutIntents)

        then:
        widgets.size() == 2

        with(widgets[0], WidgetDefinition) {
            displayName == 'name'
        }
        with(widgets[1], WidgetDefinition) {
            displayName == 'nameIntents'
        }
    }

    void testAllWidgetTypesProperlyConverted() {
        when:
        def widgets = service.addListingsToDatabase(widgetWithInterestingTypes);
        WidgetDefinition resultWidget = (WidgetDefinition) widgets[0]

        then:
        widgets.size() == 1

        with(widgets[0], WidgetDefinition) {
            widgetTypes*.name.sort() == ['administration', 'marketplace', 'metric', 'standard']
        }
    }

    // just make sure that it recognizes a stack and passes it to the StackService
    void testSimplestStack() {
        given:
        service.accountService = Mock(AccountService) {
            runAsAdmin(_) >> { Closure closure -> closure.call() }
        }

        StackService stackService = Mock()
        service.stackService = stackService

        when:
        service.addListingsToDatabase(singleSimpleStack);

        then:
        1 * stackService.importStack({ it == [data: singleSimpleStack[0].toString()] })
    }


}
