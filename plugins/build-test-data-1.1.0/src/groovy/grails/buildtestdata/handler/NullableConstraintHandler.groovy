package grails.buildtestdata.handler

import static org.apache.commons.lang.StringUtils.*
import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import static grails.buildtestdata.DomainUtil.*

public class NullableConstraintHandler implements ConstraintHandler {
    private static log = LogFactory.getLog(this)

    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        def value = determineBasicValue(propertyName, constrainedProperty)

        if (!value) {
            if (propertyIsDomainClass(constrainedProperty.propertyType)) {
                populateDomainProperty(domain, propertyName, appliedConstraint, constrainedProperty, circularCheckList)
                return
            } 
            value = determineNonStandardValue(constrainedProperty)
        }

        if (domain.hasProperty(propertyName)?.setter) {
           domain."$propertyName" = value
        } else {
          log.warn "$domain property $propertyName is readOnly (could not find a setter)"
        }
    }

    public determineBasicValue(propertyName, constrainedProperty) {
        switch(constrainedProperty.propertyType) {
            case String.class:
                return propertyName
            case Calendar.class:
                return new GregorianCalendar()
            case Currency.class:
                return Currency.getInstance(Locale.default)
            case TimeZone.class:
                return TimeZone.default
            case Locale.class:
                return Locale.default
            case java.sql.Date.class:
                return new java.sql.Date(new Date().time)
            case java.sql.Time.class:
                return new java.sql.Time(new Date().time)
            case Date.class:
                return new Date()
            case Boolean.class:
            case boolean.class:
                return true
            case { it in Number || it.isPrimitive() }:
                return 1
            case Byte[].class:
            case byte[].class:
                // this is the binary for a tiny little gif image
                byte[] inputBytes = [71, 73, 70, 56, 57, 97, 1, 0, 1, 0, -111, -1, 0, -1, -1, -1, 0, 0, 0, -1, -1, -1, 0, 0, 0, 33, -1, 11, 65, 68, 79, 66, 69, 58, 73, 82, 49, 46, 48, 2, -34, -19, 0, 33, -7, 4, 1, 0, 0, 2, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 84, 1, 0, 59]
                return inputBytes
            case Enum.class:
                return constrainedProperty.propertyType.values()[0]
            default:
                log.debug "Unable to determine basic value type for ${constrainedProperty.propertyType}"
        }
    }

    public void populateDomainProperty(domain, propertyName, appliedConstraint, constrainedProperty, circularCheckList){
        GrailsDomainClass defDomain = getDomainArtefact(domain.class)
        def domainProp = defDomain.propertyMap[propertyName]

        circularCheckList.update(domain)
        if (domainProp?.isOneToOne()
            || (domain.metaClass.properties.name.contains('embedded')
                && domain.embedded.contains(propertyName))) {
            if (circularCheckList."${constrainedProperty?.propertyType.name}") {
                domain."$propertyName" = circularCheckList."${constrainedProperty?.propertyType.name}"
            } else {
                domain."$propertyName" = domainProp.type.buildWithoutSave([:], circularCheckList)
            }
        } else if (domainProp?.isManyToOne()) {
            // book has an author, and author isManyToOne to book
            def owningObject
            if (circularCheckList."${constrainedProperty?.propertyType.name}") {
                owningObject = circularCheckList."${constrainedProperty?.propertyType.name}"
            } else {
                owningObject = domainProp.type.build([:], circularCheckList)
            }
            domain."$propertyName" = owningObject

            addInstanceToOwningObjectCollection(owningObject, domain, domainProp)
        } else if (domainProp?.isOneToMany() || domainProp?.isManyToMany()) {
            // author has many books, and author isOneToMany books
            // the build invocation below will set the books author on build, by getting it from the cirularChecklist
            def ownedObject
            if (circularCheckList."${constrainedProperty?.propertyType.name}") {
                ownedObject = circularCheckList."${domainProp?.referencedPropertyType.name}"
            } else {
                ownedObject = domainProp?.referencedPropertyType.buildWithoutSave([:], circularCheckList)
            }
            domain."addTo${capitalize(propertyName)}"(ownedObject)
        } else {
            throw new Exception("can't cope with unset non-nullable property $propertyName of ${domain.class.name}")
        }
    }

    public determineNonStandardValue(constrainedProperty) {
        // probably something like JodaTime that can be configured to be saved
        // we don't want to have to have all kinds of jar files in our code, plus we couldn't handle user created classes
        // TODO: do we want to check to ensure that there's a zero arg constructor on this class?
        Class propertyType = constrainedProperty.propertyType
        log.info("Trying to instantiate an instance of $propertyType from the class.newInstance() method")
        return propertyType.newInstance()
    }

    static addInstanceToOwningObjectCollection(owningObject, domain, domainProp) {
        def hasManyOfThisPropertyName = findHasManyPropertyName( domainProp.type, domain.class )
        if (hasManyOfThisPropertyName) {
            owningObject."addTo${capitalize(hasManyOfThisPropertyName)}"(domain)
        } else {
            log.warn "Unable to find hasMany property for $domain on ${domainProp.type}, ${domainProp.name} will only be populated on the belongsTo side"
        }
    }

    static findHasManyPropertyName(domain, Class hasManyOfClass) {
        def hasManyPropertyName = domain.hasMany.find{ it.value == hasManyOfClass }?.key

        if (!hasManyPropertyName && hasManyOfClass.superclass != Object ) {
            // walk up the inheritance tree to see if one of our superclasses is
            // actually in the hasMany instead of the current object
            hasManyPropertyName = findHasManyPropertyName(domain, hasManyOfClass.superclass)
        }

        return hasManyPropertyName
    }

}
