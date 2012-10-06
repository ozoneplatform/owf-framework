package grails.buildtestdata.handler

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.Constraint
import org.codehaus.groovy.grails.validation.ConstrainedProperty

public class MaxSizeConstraintHandler implements ConstraintHandler {
    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        if (domain."$propertyName".size() > appliedConstraint.maxSize) {
            domain."$propertyName" = domain."$propertyName"[0..appliedConstraint.maxSize-1]
        }
    }
}