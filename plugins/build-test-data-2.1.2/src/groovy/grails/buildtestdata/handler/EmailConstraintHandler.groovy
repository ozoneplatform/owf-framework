package grails.buildtestdata.handler

class EmailConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = 'a@b.com'
    }
}
