package grails.buildtestdata.handler

import static org.apache.commons.lang.StringUtils.*

import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
import org.codehaus.groovy.grails.validation.ConstrainedProperty

class MinSizeConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        switch (domain."$propertyName".class) {
            case String:
            // try not to mangle email addresses and urls
            def appliedConstraints = constrainedProperty?.appliedConstraints
            if (appliedConstraints?.find {it.name == ConstrainedProperty.URL_CONSTRAINT}) {
                domain."$propertyName" = 'http://' + 'a'.padRight(appliedConstraint.minSize - 11, 'a') + '.com'
            } else if (appliedConstraints?.find {it.name == ConstrainedProperty.EMAIL_CONSTRAINT}) {
                domain."$propertyName" = domain."$propertyName".padLeft(appliedConstraint.minSize, 'a')
            } else {
                domain."$propertyName" = domain."$propertyName".padRight(appliedConstraint.minSize, '.')
            }
            break

            default:
            def size = domain."$propertyName".size()
            if (size < appliedConstraint.minSize) {
                def defDomain = new DefaultGrailsDomainClass( domain.class )
                def domainProp = defDomain.properties.find {it.name == constrainedProperty?.propertyName }
                ((size+1)..appliedConstraint.minSize).each {
                    domain."addTo${capitalize(propertyName)}"(domainProp?.referencedPropertyType.buildWithoutSave([:], circularCheckList))
                }
            }
        }
    }
}