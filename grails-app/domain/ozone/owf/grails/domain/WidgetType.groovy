package ozone.owf.grails.domain

class WidgetType implements Serializable {

	static String TYPE = 'widget_type'
    static final long serialVersionUID = 600L

	String name
 	
 	static belongsTo = WidgetDefinition
	
	static hasMany = [ widgetDefinitions: WidgetDefinition ]

	static constraints = {
		name(nullable: false, blank: false)
	}
	static mapping = {
		widgetDefinitions (lazy:true, cache: true)
	}
}
