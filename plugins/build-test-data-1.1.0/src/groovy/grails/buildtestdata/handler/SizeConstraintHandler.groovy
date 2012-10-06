package grails.buildtestdata.handler

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.Constraint
import org.codehaus.groovy.grails.validation.ConstrainedProperty

public class SizeConstraintHandler implements ConstraintHandler {
    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        def range = appliedConstraint.range
        new MinSizeConstraintHandler().handle(domain, propertyName, [minSize:range.from], null, circularCheckList)
        new MaxSizeConstraintHandler().handle(domain, propertyName, [maxSize:range.to], null, circularCheckList)
    }
}