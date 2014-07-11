package ozone.owf.grails.domain

//TODO: Does this need to be a domain class?
class WidgetType implements Serializable {

    static String TYPE = 'widget_type'
    static final long serialVersionUID = 700L

    String name
    String displayName

    static belongsTo = WidgetDefinition

    //TODO: Is this needed
    static hasMany = [widgetDefinitions: WidgetDefinition]

    static constraints = {
        name nullable: false, blank: false
        displayName nullable: false, blank: false
    }
    static mapping = {
        widgetDefinitions lazy: true
    }

    static WidgetType getStandard() {
        return findByName('standard')
    }
}
