package ozone.owf.grails.domain

import org.grails.web.json.JSONArray
import org.grails.web.json.JSONObject


class WidgetDefinition implements Serializable {

    static String TYPE = 'widget_definition'
    static final long serialVersionUID = 700L
    static final String GUID_PATTERN = /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/

    String universalName
    String widgetGuid
    String displayName
    String description = ''
    String widgetUrl
    String imageUrlSmall
    String imageUrlMedium
    Integer width
    Integer height
    String widgetVersion
    Boolean visible = true
    Boolean singleton = false
    Boolean background = false
    Boolean mobileReady = false
    String descriptorUrl

    static hasMany = [
            personWidgetDefinitions: PersonWidgetDefinition,
            widgetTypes: WidgetType,
            widgetDefinitionIntents: WidgetDefinitionIntent
    ]

    static transients = ['allRequired', 'directRequired']

    static constraints = {
        universalName nullable: true, blank: true, maxSize: 255
        // TODO: potentially refactor the matches to use java.util.uuid
        widgetGuid nullable: false, matches: GUID_PATTERN, unique: true
        displayName maxSize: 256
        description nullable: true, blank: true
        widgetVersion nullable: true, blank: true, maxSize: 2083
        widgetUrl maxSize: 2083 // see http://support.microsoft.com/kb/208427 and http://www.boutell.com/newfaq/misc/urllength.html
        imageUrlMedium maxSize: 2083
        imageUrlSmall maxSize: 2083
        height min: 200
        width min: 200
        visible nullable: false
        singleton nullable: false
        descriptorUrl nullable: true, blank: true, maxSize: 2083
        mobileReady(nullable:false)
    }

    static mapping = {
        cache true
        //TODO: I don't think "all,delete-orphan" is correct - need to see if this really should be all-delete-orphan
        personWidgetDefinitions lazy: true, cascade: "all,delete-orphan", cache: true
        widgetTypes fetch: 'join'
        widgetDefinitionIntents cascade: 'all-delete-orphan', cache: true, batchSize: 50
    }

    String toString() {
        "${displayName}: " + "(${this.id} - " + "${this.widgetGuid})"
    }

    def intentsAsJSON() {
        def sendIntents = [], receiveIntents = []
        widgetDefinitionIntents.each { widgetDefinitionIntent ->
            if(widgetDefinitionIntent.intent != null) {
                if(widgetDefinitionIntent.send) {
                    sendIntents << new JSONObject(action: widgetDefinitionIntent.intent.action, dataTypes: widgetDefinitionIntent.dataTypes*.toString())
                }
                if(widgetDefinitionIntent.receive) {
                    receiveIntents << new JSONObject(action: widgetDefinitionIntent.intent.action, dataTypes: widgetDefinitionIntent.dataTypes*.toString())
                }
            }
        }

        return new JSONObject(send: sendIntents, receive: receiveIntents)
    }

    JSONArray widgetTypesAsJSON () {
        WidgetType type = this.widgetTypes[0];

        JSONArray types = new JSONArray()
        types.add([
            id: type.id,
            name: type.name,
            displayName: type.displayName
        ])
        return types
    }
}
