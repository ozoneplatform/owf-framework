package ozone.owf.grails.domain

import org.hibernate.proxy.HibernateProxy
/**
 * User domain class.
 */

class Person implements Serializable {

     static String TYPE = 'person'
    static final long serialVersionUID = 700L

    static final String NEW_USER = "DEFAULT_USER"
	static final String SYSTEM = "SYSTEM"

//	static transients = ['pass']
	static hasMany = [authorities: Role, dashboards: Dashboard,  personWidgetDefinitions: PersonWidgetDefinition, preferences:Preference, groups:Group]
	static belongsTo = [Role, Group]
	
	static mappedBy = [dashboards: 'user']

    static mapping = {
        //table 'owf_person'
        cache true
        authorities(lazy:true, cascade : "delete-orphan", cache:true)
        groups(lazy:true, cache:true)
        dashboards(lazy:true, cascade : "delete-orphan", cache:true)
		personWidgetDefinitions(lazy:true, cascade : "delete-orphan", cache:true)
        preferences(lazy:true, cascade : "delete-orphan", cache:true)
    }

    static constraints = {
        username(blank: false, unique: true, maxSize: 200)
        userRealName(blank: false, maxSize: 200)
//        passwd(blank: false)
        enabled()
        description(nullable: true, blank: true)
        email(nullable: true, blank: true)
        lastLogin(nullable: true)
        prevLogin(nullable: true)
    }

	/** Username */
	String username
	/** User Real Name*/
	String userRealName
//	/** MD5 Password */
//	String passwd
	/** enabled */
	boolean enabled

	String email
	boolean emailShow

	/** description */
	String description = ''

	/** plain password to create a MD5 password */
//	String pass = '[secret]'
	
	Date lastLogin
    /** Retains previous lastLogin date */
	Date prevLogin

	String toString() {
      "$userRealName:  ($username)"
    }

    boolean equals(other) {
      if (other instanceof Person || (other instanceof HibernateProxy && other.instanceOf(Person))) {
        other?.username == username
      }
      else {
        false
      }
    }

    int hashCode() {
      username ? username.hashCode() : 0
    }

}
