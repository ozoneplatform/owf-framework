package grails.buildtestdata.handler

class CreditCardConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = '378282246310005'
    }
}
