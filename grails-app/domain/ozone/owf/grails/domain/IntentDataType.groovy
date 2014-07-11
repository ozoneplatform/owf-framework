package ozone.owf.grails.domain

/**
 * IntentDataType domain class. Stores the unique data types of an
 * intent or widgetDefinitionIntent.
 */
class IntentDataType implements Serializable {

    static String TYPE = 'intent_data_type'
    static final long serialVersionUID = 700L

    String dataType

    static belongsTo = [Intent, WidgetDefinitionIntent]

    //TODO: Are these needed?
    static hasMany = [intents: Intent, widgetDefinitionIntents: WidgetDefinitionIntent]

    static constraints = {
        dataType nullable: false, maxSize: 256, unique: true
    }

    static mapping = {
        //TODO: is this supposed to be widgetDefinitionIntents?
        widgetDefinitions lazy: true, cache: true
        intents lazy: true, cache: true
    }

    String toString() {
        return dataType
    }
}
