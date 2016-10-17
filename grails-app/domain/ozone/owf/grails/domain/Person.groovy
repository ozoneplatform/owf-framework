package ozone.owf.grails.domain

import org.codehaus.groovy.grails.web.json.JSONObject
import org.grails.plugins.metrics.groovy.Timed
import org.hibernate.CacheMode
import org.hibernate.FetchMode
import org.hibernate.proxy.HibernateProxy
/**
 * User domain class.
 */

class Person implements Serializable {

    static String TYPE = 'person'
    static final long serialVersionUID = 700L

    static final String NEW_USER = "DEFAULT_USER"
    static final String SYSTEM = "SYSTEM"

    String username
    String userRealName
    Boolean enabled = true
    String email
    Boolean emailShow = false
    String description = ''
    Date lastLogin
    Date prevLogin
    Date lastNotification
    Boolean requiresSync = false

    static hasMany = [
        authorities: Role,
        dashboards: Dashboard,
        personWidgetDefinitions: PersonWidgetDefinition,
        preferences:Preference,
        groups: Group
    ]

    static belongsTo = [Group]

    static mappedBy = [dashboards: 'user']

    //TODO: I think delete-orphan is supposed to be all-delete-orphan
    static mapping = {
        cache true
        authorities cache: true,
            joinTable: [name: 'person_role', key: 'person_authorities_id', column: 'role_id']
        groups cache: true
        dashboards lazy: true, cascade : "delete-orphan", cache: true
        personWidgetDefinitions lazy: true, cascade : "delete-orphan", cache: true
        preferences lazy: true, cascade : "delete-orphan", cache: true
    }

    static constraints = {
        username blank: false, unique: true, maxSize: 200
        userRealName blank: false, maxSize: 200
        description nullable: true, blank: true
        email nullable: true, blank: true
        lastLogin nullable: true
        prevLogin nullable: true
        lastNotification nullable: true
    }

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

    public Set<Group> getStackDefaultGroups() {
        Group.withCriteria(uniqueResult: true) {
            eq('stackDefault', true)
            people {
                eq('id', this.id)
            }
        } as Set
    }

    public Set<Group> getNonStackDefaultGroups() {
        Group.withCriteria {
            people {
                eq('id', this.id)
            }
            eq('status','active')
            eq('stackDefault', false)
            cache(true)

            //turn cache mode to GET which means don't use instances from this query for the 2nd level cache
            //seems to be a bug where the people collection is cached with only one person due to the people association filter above
            cacheMode(CacheMode.GET)
        } as Set ?: new HashSet<Group>()
    }

    public Set<Stack> getStacks() {
        def stacks = Stack.findAllByOwner(this)
        stacks as Set ?: new HashSet<Group>()
    }

    @Timed
    public Set<Group> getGroupsToSync() {
        Set<Group> groups = this.groups as Set
        groups.addAll(this.groups*.stacks*.defaultGroup?.flatten())
        groups.addAll(Group.findSystemGroups())
        groups.addAll(Group.findSystemStackDefaultGroups())

        groups = groups - null

        return groups ?: new HashSet<Group>()
    }

    public Date getLastNotification(){
        if(!lastNotification)
            return null
        return new Date(this.lastNotification.time)
    }

    public Person sync (Boolean sync = true) {
        this.requiresSync = sync
        this.save()
    }

    JSONObject asJSON() {
        new JSONObject(
            id: id,
            username: username,
            userRealName: userRealName,
            email: email ?: '',
            lastLogin: lastLogin ? lastLogin.getTime() : null
        )
    }
}
