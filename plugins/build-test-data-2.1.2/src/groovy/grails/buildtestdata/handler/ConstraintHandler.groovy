package grails.buildtestdata.handler

interface ConstraintHandler {
    void handle( domain, propertyName, appliedConstraint, constrainedProperty, circularCheckList)
}
