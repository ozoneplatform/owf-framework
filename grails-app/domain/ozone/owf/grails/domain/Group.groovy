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

    static belongsTo = Stack

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
        automatic(nullable: false, blank: false)
        stackDefault(nullable: false, blank: false)
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

    public static List<String> systemGroups () {
        def accountService = new Group().domainClass.grailsApplication.mainContext.accountService
        accountService.getLoggedInUserIsAdmin() ? [USERS, ADMINS]: [USERS]
    }


    public static Set<Group> findSystemGroups() {
        Group.withCriteria {
            and {
                'in' ('name', systemGroups())
                'eq' ('automatic', true)
            }
            cache(true)
        } as Set
    }

    public static Set<Group> findSystemStackDefaultGroups() {
        Stack.withCriteria {
            groups {
                'in' ('name', systemGroups())
                'eq' ('automatic', true)
            }

            fetchMode('defaultGroup', FetchMode.JOIN)
        }*.defaultGroup as Set
    }

    /**
    *
    * Update people that belong to the group for requiring sync when they login next time.
    *
    **/
    public void syncPeople () {
        if (this.name == USERS) {
            Person.executeUpdate('update Person p set p.requiresSync=:value', [value: true])
        }
        else if(this.name == ADMINS) {
            Person.withCriteria {
                authorities {
                    'eq' ('authority', ERoleAuthority.ROLE_ADMIN.strVal)
                }
            }.each { Person p ->
                log.info "~~~~~~~~~~~~~~~~~~~~~~ FOUND A DUDE! ~~~~~~~~~~~~~~~~~~~~~~~~~~"
                p.requiresSync = true
                p.save()
            }

            // Role.findByAuthority(ERoleAuthority.ROLE_ADMIN.strVal).people.each { Person p ->
            //     log.info "Person: " + p.username
            //     p.requiresSync = true
            //     p.save()
            // }
        }
        else {
            this.people.each { Person p ->
                p.requiresSync = true
                p.save()
            }
        }
    }

    int hashCode() { id ?: 0 }

}
