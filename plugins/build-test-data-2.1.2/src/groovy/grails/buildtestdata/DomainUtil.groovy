package grails.buildtestdata

class DomainUtil {
    static def grailsApplication 

    static void setApplication(application) {
        grailsApplication = application
    }

    static boolean propertyIsDomainClass(clazz) {
        return propertyIsToOneDomainClass(clazz) || propertyIsToManyDomainClass(clazz)
    }

    static boolean propertyIsToOneDomainClass(clazz) {
        return getDomainArtefact(clazz) != null
    }

    static getDomainArtefact(clazz) {
        return grailsApplication.getDomainClass(clazz.getName())
    }

    static boolean propertyIsToManyDomainClass(clazz) {
        // if it's a Set, List, or Collection (bag), it's a hasMany
        return Collection.isAssignableFrom( clazz )
    }

}
