package grails.buildtestdata.handler

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.Constraint
import org.codehaus.groovy.grails.validation.ConstrainedProperty

public class MinConstraintHandler implements ConstraintHandler {
    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = appliedConstraint.minValue
    }
}