package grails.buildtestdata.handler

class SizeConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        def range = appliedConstraint.range
        new MinSizeConstraintHandler().handle(domain, propertyName, [minSize:range.from], null, circularCheckList)
        new MaxSizeConstraintHandler().handle(domain, propertyName, [maxSize:range.to], null, circularCheckList)
    }
}
