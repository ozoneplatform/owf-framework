package ozone.owf.grails.domain

/**
 * Authority domain class.
 **/
class Role implements Serializable {

    static final long serialVersionUID = 700L

    static final String ADMIN = ERoleAuthority.ROLE_ADMIN.strVal
    static final String USER = ERoleAuthority.ROLE_USER.strVal

    static constraints = {
        authority(blank: false, unique: true)
        description()
    }

    static mappings = {
        cache true
        people cache: true
        batchSize: 25
    }

    String authority
    String description

}
