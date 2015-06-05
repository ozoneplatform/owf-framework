package grails.buildtestdata.handler

class MaxSizeConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        if (domain."$propertyName".size() > appliedConstraint.maxSize) {
            domain."$propertyName" = domain."$propertyName"[0..appliedConstraint.maxSize-1]
        }
    }
}
