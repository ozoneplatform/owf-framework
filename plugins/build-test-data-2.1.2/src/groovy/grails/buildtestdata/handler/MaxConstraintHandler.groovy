package grails.buildtestdata.handler

class MaxConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = appliedConstraint.maxValue
    }
}