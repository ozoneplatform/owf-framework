package owf.grails.test.integration

import ozone.owf.grails.domain.*

import static owf.grails.test.integration.GormUtil.save


abstract class DomainBuilders {

    static Group createGroup(Map customArgs = [:]) {
        def presetArgs = [name        : 'Group',
                          displayName : 'Group',
                          description : 'Group Description',
                          automatic   : false,
                          status      : 'active',
                          stackDefault: false]

        save new Group(presetArgs + customArgs)
    }

    static Stack createStack(Person owner, Map customArgs = [:]) {
        def presetArgs = [name        : 'Stack',
                          description : 'Stack Description',
                          stackContext: 'stack1',
                          owner       : owner,
                          defaultGroup: null]

        save new Stack(presetArgs + customArgs)
    }

    static Stack createStackWithGroup(Person owner, String name) {
        def group = createGroup([name: "Group $name", displayName: "Group $name", stackDefault: true])

        createStack(owner, [name: "Stack $name", stackContext: "stack_$name", defaultGroup: group])
    }

    static List<Dashboard> createDashboards(Person user, int num, int start = 0) {
        (start..<num + start).collect { n ->
            createDashboard(user, [name: "Dashboard $n", dashboardPosition: n])
        }
    }

    static Dashboard createDashboard(Person user, Map customArgs = [:]) {
        def presetArgs = [name             : "Dashboard",
                          guid             : UUID.randomUUID().toString(),
                          user             : user,
                          dashboardPosition: 0,
                          isdefault        : false]

        save new Dashboard(presetArgs + customArgs)
    }

    static WidgetDefinition createWidgetDefinitionWithPWD(Person user, Map customArgs = [:]) {
        def widgetDefinition = createWidgetDefinition(customArgs)

        createPersonWidgetDefinition(user, widgetDefinition)

        widgetDefinition
    }

    static List<WidgetDefinition> createWidgetDefinitions(int num) {
        (0..<num).collect { n ->
            createWidgetDefinition([displayName   : "Widget $n",
                                    universalName : "com.example.widget.widget_$n",
                                    widgetUrl     : "../examples/widgets/widget-${n}.html",
                                    imageUrlSmall : "../images/icons/widget-$n-small.png",
                                    imageUrlMedium: "../images/icons/widget-$n-medium.png",])
        }
    }

    static WidgetDefinition createWidgetDefinition(Map customArgs = [:]) {
        def presetArgs = [widgetGuid    : UUID.randomUUID().toString(),
                          displayName   : 'Widget',
                          universalName : 'com.company.widget.uuid',
                          description   : 'My Widget Description',
                          widgetVersion : '1.0',
                          widgetUrl     : '../examples/widgets/widget.html',
                          width         : 980,
                          height        : 740,
                          imageUrlSmall : '../images/icons/widget-small.png',
                          imageUrlMedium: '../images/icons/widget-medium.png']

        save new WidgetDefinition(presetArgs + customArgs)
    }

    static WidgetType createWidgetType(String name, String displayName) {
        save new WidgetType(name: name, displayName: displayName)
    }

    static IntentDataType createIntentDataType(String dataType) {
        save new IntentDataType(dataType: dataType)
    }

    static Intent createIntent(String action, List<IntentDataType> dataTypes) {
        save new Intent(action: action, dataTypes: dataTypes)
    }

    static WidgetDefinitionIntent createWidgetDefinitionIntent(WidgetDefinition widgetDef,
                                                               Intent intent, List<IntentDataType> dataTypes,
                                                               boolean send, boolean receive) {
        save new WidgetDefinitionIntent([widgetDefinition: widgetDef,
                                         intent          : intent,
                                         dataTypes       : dataTypes,
                                         send            : send,
                                         receive         : receive])
    }

    static PersonWidgetDefinition createPersonWidgetDefinition(Person user,
                                                               WidgetDefinition widgetDefinition,
                                                               Map customArgs = [:]) {
        def presetArgs = [person          : user,
                          widgetDefinition: widgetDefinition,
                          visible         : true,
                          pwdPosition     : 1]

        save new PersonWidgetDefinition(presetArgs + customArgs)
    }

    static Preference createPreference(Person user, Map customArgs = [:]) {
        def presetArgs = [namespace: 'com.foo.bar',
                          path     : 'fizz buzz',
                          value    : '123',
                          user     : user]

        save new Preference(presetArgs + customArgs)
    }

    static WidgetDefinition createWidgetDefinitionWithIntents() {
        def standardWidgetType = createWidgetType('standard', 'standard')

        def widget = createWidgetDefinition([widgetTypes: [standardWidgetType]])

        def type1 = createIntentDataType('Address')
        def type2 = createIntentDataType('City')
        def type3 = createIntentDataType('LongLat')

        def intent1 = createIntent('Pan', [type1, type2])
        def intent2 = createIntent('Plot', [type1, type2, type3])

        createWidgetDefinitionIntent(widget, intent1, [type1, type2], true, false)
        createWidgetDefinitionIntent(widget, intent2, [type1, type3], false, true)

        // flushSession()
        widget.refresh()

        assert widget.widgetDefinitionIntents.size() == 2

        widget
    }

}
