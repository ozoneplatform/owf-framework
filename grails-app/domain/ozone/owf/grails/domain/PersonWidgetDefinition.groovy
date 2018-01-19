package ozone.owf.grails.domain

import org.grails.web.json.JSONObject


class PersonWidgetDefinition implements Serializable, Comparable {

    static final long serialVersionUID = 700L

	Person person
	WidgetDefinition widgetDefinition
	Integer pwdPosition
    String displayName
	Boolean groupWidget = false  // True if the PWD was added to a user because of their group membership
    Boolean userWidget = false // True if the PWD was added directly to a widget.
	Boolean favorite = false
	Boolean visible = true
	Boolean disabled = false

	static belongsTo = [person: Person, widgetDefinition: WidgetDefinition]

    static constraints = {
        displayName nullable: true, maxSize: 256
        visible nullable: false
        userWidget nullable: true
        groupWidget nullable: true
        favorite nullable: true
        disabled nullable: true
        pwdPosition nullable: false, display: false
        widgetDefinition unique: 'person'
    }

    static mapping = {
        cache true
        widgetDefinition fetch: 'join'
    }


    String toString() {
        "${this.id}: ${this.widgetDefinition} - ${this.person} - visible=${this.visible}"

    }

    int compareTo(that) {
        this.pwdPosition <=> that.pwdPosition
    }

    JSONObject asJSON() {
        new JSONObject(
                id: id,
                namespace: 'widget',
                value: [
                        originalName: widgetDefinition?.displayName,
                        universalName: widgetDefinition?.universalName,
                        editable: true,
                        disabled: disabled,
                        visible: visible,
                        favorite: favorite,
                        groupWidget: groupWidget,
                        position: pwdPosition,
                        userId: person?.username,
                        userRealName: person?.userRealName,
                        namespace: displayName?: widgetDefinition?.displayName,
                        description: widgetDefinition?.description,
                        url: widgetDefinition?.widgetUrl,
                        headerIcon: widgetDefinition?.imageUrlSmall,
                        image: widgetDefinition?.imageUrlMedium,
                        smallIconUrl: widgetDefinition?.imageUrlSmall,
                        largeIconUrl: widgetDefinition?.imageUrlMedium,
                        width: widgetDefinition?.width,
                        height: widgetDefinition?.height,
                        x: 0,
                        y: 0,
                        minimized: false,
                        maximized: false,
                        widgetVersion: widgetDefinition.widgetVersion,
                        //TODO: Do we need this?
                        //groups: groups*.toDataMap(),
                        definitionVisible: widgetDefinition?.visible,
                        singleton: widgetDefinition?.singleton,
                        background: widgetDefinition?.background,
                        mobileReady: widgetDefinition?.mobileReady,
                        descriptorUrl: widgetDefinition?.descriptorUrl,
                        //TODO: Do we need this?
                        //allRequired: widgetDefinition?.allRequired,
                        //directRequired: widgetDefinition?.directRequired,
                        intents: widgetDefinition.intentsAsJSON(),
                        widgetTypes: widgetDefinition?.widgetTypesAsJSON()
                ],
                path: widgetDefinition?.widgetGuid
        )
    }
}
