package grails.buildtestdata.handler

class BlankConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        // shouldn't get here, as nullableHandler fires first and does not assign a blank value
        // though user could provide blank sample data
        domain."$propertyName" = 'x'
    }
}
