package grails.buildtestdata.handler

class InListConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = appliedConstraint.list[0]
    }
}
