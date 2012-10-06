package ozone.owf.grails.domain


@ozone.owf.gorm.AuditStamp
class Dashboard implements Serializable, Comparable {

    static String TYPE = 'dashboard'

    //derived from version number without dots, 
    //so that all domain classes with a given 
    //version are considered compatible and
    //classes between versions are incompatible.
    static final long serialVersionUID = 600L

    String name					//Added for default JSON
    String layout		//Added for default JSON
    Integer columnCount			//Added for default JSON
    String guid
    boolean isdefault
	Integer dashboardPosition
	boolean alteredByAdmin
	String description = ''
	String defaultSettings
	boolean showLaunchMenu = false
	String layoutConfig = ''
	String intentConfig = ''
	boolean locked = false

    static belongsTo = [user:Person]

    static hasMany = [state : DashboardWidgetState]
    SortedSet state //to provide consistent ordering, see compareTo in DashboardWidgetState
    
	static mapping = {
        //table 'owf_dashboard'
        cache true
		state(lazy:true, cascade : "all,delete-orphan", cache:true)
        defaultSettings(type:'text')
	}
	
	static constraints = {
		guid(nullable: false, blank: false, unique:true, matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/)
		isdefault(nullable: false, blank: false)
		//This regex says does not match any of the characters \"/#={}:;,[] because they make the grails JSON parser die.
		name(nullable:false, blank:false, maxSize: 200)
        layout(nullable:true, blank:true)
		columnCount(nullable:false, blank:false, min:0, max: 3)
		state(nullable:false)
		dashboardPosition(nullable:false, display:false)
		alteredByAdmin(nullable:false, blank:false)
		description(nullable: true, blank: true)
        user(nullable:true)
		defaultSettings(nullable: true, blank: true)
		showLaunchMenu(nullable: true, blank: true)
		layoutConfig(nullable: true, blank: true)
		intentConfig(nullable: true, blank: true)
	}
    
	String toString() {
		this.guid
	}
	
    int compareTo(that) {
        this.dashboardPosition <=> that.dashboardPosition
    }

}
