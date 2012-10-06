package grails.buildtestdata.handler

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.Constraint
import org.codehaus.groovy.grails.validation.ConstrainedProperty
import org.codehaus.groovy.grails.plugins.testing.GrailsMockErrors

public class MatchesConstraintHandler implements ConstraintHandler {
    public void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        // matches isn't supported, if the value we've got in there isn't valid by this point, throw an error letting
        // the user know why we're not passing
        if ( !constrainedProperty?.validate(domain, domain."$propertyName", new GrailsMockErrors(this)) ) {
            String error = "Matches constraint support not implemented in build-test-data, attempted value (${domain."$propertyName"}) does not pass validation: property $propertyName of ${domain.class.name}"
            throw new ConstraintHandlerException(error)
        }
    }
}