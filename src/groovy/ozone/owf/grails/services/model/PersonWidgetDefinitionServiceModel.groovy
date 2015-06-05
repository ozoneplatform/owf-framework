package ozone.owf.grails.services.model

class PersonWidgetDefinitionServiceModel extends AbstractServiceModel implements Comparable {

    Long id
    PersonServiceModel person
    WidgetDefinitionServiceModel widgetDefinition
    Integer pwdPosition
    Boolean groupWidget
    String displayName
    Boolean favorite
    Boolean visible = true
    Boolean editable = true
    Boolean disabled = false
    List groups = []

    Map toDataMap() {
        return [
            id: this.id,
            namespace: "widget",
            value: [
                originalName: this.widgetDefinition?.displayName,
                universalName: this.widgetDefinition?.universalName,
                editable: this.editable,
                disabled: this.disabled,
                visible: this.visible,
                favorite: this.favorite,
                groupWidget: this.groupWidget,
                position: this.pwdPosition,
                userId: this.person?.username,
                userRealName: this.person?.userRealName,
                namespace: this.displayName?: this.widgetDefinition?.displayName,
                description: this.widgetDefinition?.description,
                url: this.widgetDefinition?.widgetUrl,
                headerIcon: this.widgetDefinition?.imageUrlSmall,
                image: this.widgetDefinition?.imageUrlMedium,
                smallIconUrl: this.widgetDefinition?.imageUrlSmall,
                largeIconUrl: this.widgetDefinition?.imageUrlMedium,
                width: this.widgetDefinition?.width,
                height: this.widgetDefinition?.height,
                x: 0,
                y: 0,
                minimized: false,
                maximized: false,
                widgetVersion: this.widgetDefinition.widgetVersion,
                groups: groups*.toDataMap(),
                definitionVisible: this.widgetDefinition?.visible,
                singleton: this.widgetDefinition?.singleton,
                background: this.widgetDefinition?.background,
                mobileReady: this.widgetDefinition?.mobileReady,
                descriptorUrl: this.widgetDefinition?.descriptorUrl,
                allRequired: this.widgetDefinition?.allRequired,
                directRequired: this.widgetDefinition?.directRequired,
                intents: this.widgetDefinition.arrangeIntents(),
                widgetTypes: this.widgetDefinition?.widgetTypes*.toDataMap()
            ],
            path: this.widgetDefinition?.widgetGuid
        ]
    }

    int compareTo(that) {
        this.pwdPosition <=> that.pwdPosition
    }
}
