package grails.buildtestdata

import static org.codehaus.groovy.grails.commons.ApplicationHolder.getApplication

public class DomainUtil {
    static boolean propertyIsDomainClass(clazz) {
        return propertyIsToOneDomainClass(clazz) || propertyIsToManyDomainClass(clazz)
    }

    static boolean propertyIsToOneDomainClass(clazz) {
        return getDomainArtefact(clazz) != null
    }

    static getDomainArtefact(clazz) {
        return getApplication().getDomainClass(clazz.getName())
    }

    static boolean propertyIsToManyDomainClass(clazz) {
        return clazz.isAssignableFrom( java.util.Set )
    }

}