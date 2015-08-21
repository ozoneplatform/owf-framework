package ozone.owf.grails.domain
/**
 * Authority domain class.
 */

class Role implements Serializable {

    static final long serialVersionUID = 700L

    static final String ADMIN = 'ROLE_ADMIN'

	// static hasMany = [people: Person]

	/** description */
	String description
	/** ROLE String */
	String authority

	static constraints = {
		authority(blank: false, unique: true)
		description()
	}

    static mappings = {
      //table 'owf_role'

      cache true
      people cache:true
      batchSize: 25
    }
    
}
