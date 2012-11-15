package ozone.owf.grails.domain

import org.hibernate.CacheMode

class Stack {
    
    static String TYPE = 'stack'
    static final long serialVersionUID = 700L
    
    String name
    String description
    String stackContext
    String imageUrl
    String descriptorUrl
    Integer uniqueWidgetCount = 0
    
    static hasMany = [groups: Group]
    
    static mapping = {
        cache true
        groups(lazy: true, cache: true)
    }
    
    static constraints = {
        name(nullable: false, blank: false, maxSize: 256)
        description(nullable: true, blank: true)
        stackContext(nullable: false, blank: false, maxSize: 200, unique: true)
        imageUrl(nullable: true, blank: true, maxSize: 2083)
        descriptorUrl(nullable: true, blank: true, maxSize: 2083)
        uniqueWidgetCount(nullable: false, blank: false)
    }

    Group findStackDefaultGroup() {
        def defaultGroup = Group.withCriteria(uniqueResult: true){
            cacheMode(CacheMode.GET)
            eq('stackDefault', true)
            stacks {
                eq('id', this.id)
            }
        }
        
        return defaultGroup;
    }
}
