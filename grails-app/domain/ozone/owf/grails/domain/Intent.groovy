package ozone.owf.grails.domain

/**
 * Intent domain class. Used to store the unique, aggregated intents
 * implemented by widgets.
 */
class Intent implements Serializable {

    static String TYPE = 'intent'
    static final long serialVersionUID = 700L

    String action

    static hasMany = [dataTypes: IntentDataType, widgetDefinitionIntents: WidgetDefinitionIntent]

    static constraints = {
        action blank: false, nullable: false, maxSize: 256, unique: true
    }

    static mapping = {
        cache true
        dataTypes cache: true
        widgetDefinitionIntents lazy: true, cascade: 'all-delete-orphan', cache: true
    }
}
