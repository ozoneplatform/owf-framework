package ozone.owf.devel

import grails.compiler.GrailsCompileStatic

import org.hibernate.SessionFactory

import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.WidgetType


@GrailsCompileStatic
class ExampleWidgetLoader {

    SessionFactory sessionFactory

    String baseUrl

    private WidgetType standardWidgetType

    void loadAndAssignExamplesWidgets() {
        standardWidgetType = WidgetType.findByName('standard')

        def graphIntent = createIntent('Graph', ['application/vnd.owf.sample.price'])
        def viewIntent = createIntent('View', ['text/html'])

        List<WidgetDefinition> widgets = []

        widgets << createChannelShouter()
        widgets << createChannelListener()

        widgets << createColorServer()
        widgets << createColorClient()

        widgets << createWidgetLog()

        widgets << createWidgetChrome()

        widgets << createPreferences()

        widgets << createEventMonitor()

        widgets << createHtmlViewer(viewIntent)

        widgets << createNyse(graphIntent, viewIntent)
        widgets << createStockChart(graphIntent)

        assignWidgetsToAllPersons(widgets)

        flushAndClearSession()
    }

    private static void assignWidgetsToAllPersons(List<WidgetDefinition> widgets) {
        Person.findAll().each { person ->
            widgets.eachWithIndex { widget, i ->
                new PersonWidgetDefinition(
                        person: person,
                        widgetDefinition: widget,
                        visible: true,
                        pwdPosition: i).save(failOnError: true)
            }
        }
    }

    private WidgetDefinition createChannelShouter() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.ChannelShouter',
                displayName: 'Channel Shouter',
                description: 'Broadcast a message on a specified channel.',
                widgetUrl: "${baseUrl}/channel_shouter",
                imageUrlMedium: 'static/themes/common/images/widget-icons/ChannelShouter.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/ChannelShouter.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 295,
                height: 250).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createChannelListener() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.ChannelListener',
                displayName: 'Channel Listener',
                description: 'Receive a message on a specified channel.',
                widgetUrl: "${baseUrl}/channel_listener",
                imageUrlMedium: 'static/themes/common/images/widget-icons/ChannelListener.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/ChannelListener.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 540,
                height: 440).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createColorServer() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.ColorServer',
                displayName: 'Color Server',
                description: 'Simple eventing example that works in tandem with Color Client.',
                widgetUrl: "${baseUrl}/color_server",
                imageUrlMedium: 'static/themes/common/images/widget-icons/ColorServer.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/ColorServer.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 300,
                height: 300).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createColorClient() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.ColorClient',
                displayName: 'Color Client',
                description: 'Simple eventing example that works in tandem with Color Server.',
                widgetUrl: "${baseUrl}/color_client",
                imageUrlMedium: 'static/themes/common/images/widget-icons/ColorClient.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/ColorClient.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 300,
                height: 300).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createWidgetLog() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.WidgetLog',
                displayName: 'Widget Log',
                description: 'Display log messages from widgets with logging enabled.',
                widgetUrl: "${baseUrl}/widget_log",
                imageUrlMedium: 'static/themes/common/images/widget-icons/WidgetLog.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/WidgetLog.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 540,
                height: 440).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createWidgetChrome() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.WidgetChrome',
                displayName: 'Widget Chrome',
                description: 'Example that utilizes the Widget Chrome API',
                widgetUrl: "${baseUrl}/widget_chrome",
                imageUrlMedium: 'static/themes/common/images/widget-icons/WidgetChrome.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/WidgetChrome.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 540,
                height: 440).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createPreferences() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.Preferences',
                displayName: 'Preferences',
                description: 'Example that utilizes the Preferences API',
                widgetUrl: "${baseUrl}/preferences",
                imageUrlMedium: 'static/themes/common/images/widget-icons/Preferences.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/Preferences.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 450,
                height: 300).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createEventMonitor() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.EventMonitor',
                displayName: 'Event Monitor Widget',
                description: 'Example that utilizes the Eventing API.',
                widgetUrl: "${baseUrl}/event_monitor",
                imageUrlMedium: 'static/themes/common/images/widget-icons/EventMonitor.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/EventMonitor.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 500,
                height: 600).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createNyse(Intent graphIntent, Intent viewIntent) {
        def nyseWidget = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.NYSE',
                displayName: 'NYSE Widget',
                description: 'This app component displays the end of day report for the New York Stock Exchange.',
                widgetUrl: "${baseUrl}/nyse",
                imageUrlMedium: 'static/themes/common/images/widget-icons/NYSEStock.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/NYSEStock.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 825,
                height: 437).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(nyseWidget, graphIntent, IntentFlow.SEND)
        createWidgetDefinitionIntent(nyseWidget, viewIntent, IntentFlow.SEND)

        nyseWidget.refresh()

        nyseWidget
    }

    private WidgetDefinition createStockChart(Intent graphIntent) {
        def stockChartWidget = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.StockChart',
                displayName: 'Stock Chart',
                description: 'This app component charts stock prices.',
                widgetUrl: "${baseUrl}/stock_chart",
                imageUrlMedium: 'static/themes/common/images/widget-icons/PriceChart.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/PriceChart.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 800,
                height: 600).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(stockChartWidget, graphIntent, IntentFlow.RECEIVE)

        stockChartWidget.refresh()

        stockChartWidget
    }

    private WidgetDefinition createHtmlViewer(Intent viewIntent) {
        def htmlViewer = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.HTMLViewer',
                displayName: 'HTML Viewer',
                description: 'This app component displays HTML.',
                widgetUrl: "${baseUrl}/html_viewer",
                imageUrlMedium: 'static/themes/common/images/widget-icons/HTMLViewer.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/HTMLViewer.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 600).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(htmlViewer, viewIntent, IntentFlow.RECEIVE)

        htmlViewer.refresh()

        htmlViewer
    }

    private static Intent createIntent(String action, List<String> mimeTypes) {
        def dataTypes = mimeTypes.collect { getOrCreateIntentDataType(it) }

        new Intent(action: action, dataTypes: dataTypes).save(flush: true, failOnError: true)
    }

    private static WidgetDefinitionIntent createWidgetDefinitionIntent(WidgetDefinition widgetDef,
                                                                       Intent intent, IntentFlow flow)
    {
        new WidgetDefinitionIntent(
                [widgetDefinition: widgetDef,
                 intent          : intent,
                 dataTypes       : intent.dataTypes.collect(),
                 send            : flow.canSend(),
                 receive         : flow.canReceive()]).save(flush: true, failOnError: true)
    }

    private static IntentDataType getOrCreateIntentDataType(String type) {
        IntentDataType.findByDataType(type) ?: new IntentDataType(dataType: type).save(flush: true, failOnError: true)
    }

    private static String generateUUID() {
        return UUID.randomUUID().toString()
    }

    private void flushAndClearSession() {
        sessionFactory.currentSession.with {
            flush()
            clear()
        }
    }

    enum IntentFlow {

        SEND,
        RECEIVE,
        SEND_AND_RECEIVE

        boolean canSend() {
            this == SEND || this == SEND_AND_RECEIVE
        }

        boolean canReceive() {
            this == RECEIVE || this == SEND_AND_RECEIVE
        }

    }

}
