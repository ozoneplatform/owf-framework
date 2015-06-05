package grails.buildtestdata.handler

import static grails.buildtestdata.DomainUtil.*
import static grails.buildtestdata.TestDataConfigurationHolder.*
import static org.apache.commons.lang.StringUtils.*

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsDomainClass

class NullableConstraintHandler implements ConstraintHandler {
    private static log = LogFactory.getLog(this)

    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        def value = determineBasicValue(propertyName, constrainedProperty)

        if (value == null) {
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

    def determineBasicValue(propertyName, constrainedProperty) {
        switch(constrainedProperty.propertyType) {
            case String:
                return propertyName
            case Calendar:
                return new GregorianCalendar()
            case Currency:
                return Currency.getInstance(Locale.default)
            case TimeZone:
                return TimeZone.default
            case Locale:
                return Locale.default
            case java.sql.Date:
                return new java.sql.Date(new Date().time)
            case java.sql.Time:
                return new java.sql.Time(new Date().time)
            case Date:
                return new Date()
            case Boolean:
            case boolean:
                return false
            case { it in Number || it.isPrimitive() }:
                return 0
            case Byte[]:
            case byte[]:
                // this is the binary for a tiny little gif image
                byte[] inputBytes = [71, 73, 70, 56, 57, 97, 1, 0, 1, 0, -111, -1, 0, -1, -1, -1, 0, 0, 0, -1, -1, -1, 0, 0, 0, 33, -1, 11, 65, 68, 79, 66, 69, 58, 73, 82, 49, 46, 48, 2, -34, -19, 0, 33, -7, 4, 1, 0, 0, 2, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 84, 1, 0, 59]
                return inputBytes
            case Enum:
                return constrainedProperty.propertyType.values()[0]
            default:
                log.debug "Unable to determine basic value type for ${constrainedProperty.propertyType}"
        }
    }

    void populateDomainProperty(domain, propertyName, appliedConstraint, constrainedProperty, circularCheckList){
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
            addInstanceToOwningObjectCollection(domain, ownedObject, propertyName)
        } else {
            throw new Exception("can't cope with unset non-nullable property $propertyName of ${domain.class.name}")
        }
    }

    def determineNonStandardValue(constrainedProperty) {
        // probably something like JodaTime that can be configured to be saved
        // we don't want to have to have all kinds of jar files in our code, plus we couldn't handle user created classes
        Class propertyType = constrainedProperty.propertyType
        log.debug("Trying to instantiate an instance of $propertyType from the class.newInstance() method")
        def configuredParams = getPropertyValues(propertyType.name, getConfigPropertyNames(propertyType.name))
        if (configuredParams) {
            log.debug "Instantiating with params: ${configuredParams}"
            return propertyType.newInstance(configuredParams)
        } else {
            return propertyType.newInstance()
        }
    }

    static addInstanceToOwningObjectCollection(owningObject, domain, domainProp) {
        def hasManyOfThisPropertyName = findHasManyPropertyName( domainProp.type, domain.class )

        if (hasManyOfThisPropertyName) {
            addInstanceToOwningObjectCollection(owningObject, domain, hasManyOfThisPropertyName)
        } else {
            log.warn "Unable to find hasMany property for $domain on ${domainProp.type}, ${domainProp.name} will only be populated on the belongsTo side"
        }
    }

    static addInstanceToOwningObjectCollection(owningObject, domain, String hasManyOfThisPropertyName) {
        // could have already added it depending on the direction we came from, don't add again
        if (owningObject."$hasManyOfThisPropertyName"?.contains(domain)) return

        owningObject."addTo${capitalize(hasManyOfThisPropertyName)}"(domain)
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
