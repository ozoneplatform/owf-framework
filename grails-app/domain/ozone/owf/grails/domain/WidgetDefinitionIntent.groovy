package ozone.owf.grails.domain

import org.codehaus.groovy.grails.web.json.JSONObject

/**
 * WidgetDefinitionIntent domain class. Represents the many-to-many relationship
 * between a WidgetDefinition and an Intent.
 */
class WidgetDefinitionIntent implements Serializable {

    static final long serialVersionUID = 700L

    Boolean send
    Boolean receive

    static belongsTo = [widgetDefinition: WidgetDefinition, intent: Intent]
    static hasMany = [dataTypes: IntentDataType]

    static constraints = {
        send nullable: false, blank: false
        receive nullable: false, blank: false
    }

    static mapping = {
        cache true
        table 'widget_def_intent' //Shortened due to 30 char identifier limit in Oracle
        dataTypes cache: true, batchSize: 50
        intent fetch: 'join'
    }
}