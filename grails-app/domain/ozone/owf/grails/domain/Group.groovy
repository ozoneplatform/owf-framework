package ozone.owf.grails.domain

import org.hibernate.FetchMode
import org.hibernate.proxy.HibernateProxy


class Group implements Serializable{

    static String TYPE = 'group'
    static final long serialVersionUID = 700L

    static final String USERS = 'OWF Users'
    static final String ADMINS = 'OWF Administrators'

    String name
    String displayName
    String description = ''
    String email
    Boolean automatic = false
    String status = 'active'
    Boolean stackDefault = false
    Stack stack

    static hasMany = [
        people: Person,
        stacks: Stack
    ]

    static belongsTo = [stack: Stack]

    static mapping = {
        table 'owf_group'
        cache true
        people lazy: true, cache: true
        batchSize: 25
    }

    static constraints = {
        name(blank: false, maxSize: 200)
        displayName(nullable: true, blank: true, maxSize: 200)
        description(nullable: true, blank: true)
        email(nullable: true, blank: true)
        automatic(nullable: false)
        stackDefault(nullable: false)
        stack(nullable: true)
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
