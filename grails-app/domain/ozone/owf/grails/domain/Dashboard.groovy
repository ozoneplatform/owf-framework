package ozone.owf.grails.domain


@ozone.owf.gorm.AuditStamp
class Dashboard implements Serializable, Comparable {

    static String TYPE = 'dashboard'

    //derived from version number without dots, 
    //so that all domain classes with a given 
    //version are considered compatible and
    //classes between versions are incompatible.
    static final long serialVersionUID = 700L

    String name                 //Added for default JSON
    String guid
    boolean isdefault
    Integer dashboardPosition
    boolean alteredByAdmin
    String description = ''
    String iconImageUrl
    String type = ''
    String layoutConfig = ''
    boolean locked = false
    Stack stack  // The stack in which this dashboard should appear
    static belongsTo = [user:Person]
  
    static mapping = {
        //table 'owf_dashboard'
        cache true
    }
    
    static constraints = {
        guid(nullable: false, blank: false, unique:true, matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/)
        isdefault(nullable: false, blank: false)
        //This regex says does not match any of the characters \"/#={}:;,[] because they make the grails JSON parser die.
        name(nullable:false, blank:false, maxSize: 200)
        dashboardPosition(nullable:false, display:false)
        alteredByAdmin(nullable:false, blank:false)
        iconImageUrl(nullable: true, blank: true, maxSize: 2083)
        description(nullable: true, blank: true)
        type(nullable: true, blank: true)
        user(nullable:true)
        layoutConfig(nullable: true, blank: true)
        stack(nullable:true)
    }
    
    String toString() {
        this.guid
    }
    
    int compareTo(that) {
        this.dashboardPosition <=> that.dashboardPosition
    }

}
