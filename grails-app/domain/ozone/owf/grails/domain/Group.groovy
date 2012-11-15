package ozone.owf.grails.domain

import org.hibernate.proxy.HibernateProxy

class Group implements Serializable{

    static String TYPE = 'group'
    static final long serialVersionUID = 700L

    String name
    String displayName
    String description = ''
    String email
    Boolean automatic = false
    Boolean stackDefault = false
    String status = 'active'

    static belongsTo = [Stack]
    static hasMany = [people: Person, stacks: Stack]

    static mapping = {
        table 'owf_group'
        cache true
        people(lazy: true, cache: true)
        stacks(lazy: true, cache: true)
    }

    static constraints = {
        name(blank: false, maxSize: 200)
        displayName(nullable: true, blank: true, maxSize: 200)
        description(nullable: true, blank: true)
        email(nullable: true, blank: true)
        automatic(nullable: false, blank: false)
        stackDefault(nullable: false, blank: false)
        status(nullable: false, blank: false, inList:['active','inactive'])
    }

    boolean equals(other) {
        if (other instanceof Group || (other instanceof HibernateProxy && other.instanceOf(Group))) {
            other?.id == id
        }
        else {
            false
        }
    }

    int hashCode() { id ?: 0 }

}
