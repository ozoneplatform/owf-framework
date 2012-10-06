package ozone.owf.grails.domain

class DashboardWidgetState implements Serializable, Comparable {

    static String TYPE = 'dashboard_widget_state'
    static final long serialVersionUID = 600L

	String  uniqueId
    String widgetGuid
	String  name
	Boolean active
	Integer width
	Integer height
	Integer x
	Integer y
	Integer zIndex
	Boolean minimized
	Boolean maximized
	Boolean pinned
	Boolean collapsed
	Integer columnPos
	String  buttonId
	Boolean buttonOpened
	String  region  //region = right-north, right-south, accordian
	Integer statePosition

    static belongsTo = [dashboard : Dashboard, personWidgetDefinition : PersonWidgetDefinition]


    Dashboard dashboard
	
	static mapping = {
        //table 'owf_dashboard_widget_state'
        cache true
		personWidgetDefinition lazy:true
		dashboard lazy:true
	}
	
    static constraints = {
        //TODO: this unique is not quite right.  Should be unique across each person
		//Comment from Jeremy - Why? It's a UUID, it should be unique, period.
		//Comment from Jay - Stop fighting! Are you guys getting a divorce?
    	uniqueId(nullable:false, blank:false, unique:true, matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/)
        widgetGuid(nullable:true, blank:true, matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/)
    	name(nullable:false, blank:false, maxSize: 200)
    	active(nullable:false)
    	width(nullable:false, min:0)
    	height(nullable:false, min:0)
    	x(nullable:false, min: 0)
    	y(nullable:false, min: 0)
    	zIndex(nullable:false)
    	minimized(nullable:false)
    	maximized(nullable:false)
    	pinned(nullable:false)
    	collapsed(nullable:false)
    	columnPos(nullable:false, min:0, max:3)
    	buttonId(nullable:true, matches: /^[(\\)(\u0000-\uFFFD)]{0,200}.{1,200}$/)
    	buttonOpened(nullable:false)
    	region(nullable:false, inList:EDashboardRegion.listAsStrings())
		statePosition(nullable:false, display:false)
        personWidgetDefinition(nullable:true,blank:true)
    } 

    int compareTo(Object them) {
        return this.statePosition <=> them.statePosition
    }
	
    private def guid() {
    	UUID.randomUUID() as String
    }

//    def toServiceModel() {
//      if (!uniqueId)
//      {
//          //TODO: see if this is really necessary
//          uniqueId = guid()
//          save(flush:true)
//      }
//      ServiceModelUtil.createServiceModel(this)
//    }

	String toString() {
		"${this.uniqueId}"
	}
	
}
