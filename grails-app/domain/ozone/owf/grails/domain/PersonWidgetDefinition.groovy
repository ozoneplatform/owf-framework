package ozone.owf.grails.domain

import org.grails.taggable.*

class PersonWidgetDefinition implements Serializable, Comparable, Taggable {

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
        displayName(nullable:true, maxSize: 256)
		visible(nullable:false)
        userWidget(nullable:true)
		groupWidget(nullable:true)
		favorite(nullable:true)
        disabled(nullable:true)
		pwdPosition(nullable:false, display:false)
		widgetDefinition(unique:'person')
    }
	
	static mapping = {
        cache true
		widgetDefinition lazy:true
		person lazy:true
	}
	
	
	String toString() {
		"${this.id}: ${this.widgetDefinition} - ${this.person} - visible=${this.visible}"
		
	}
	
	int compareTo(that) {
        this.pwdPosition <=> that.pwdPosition
    }
}
