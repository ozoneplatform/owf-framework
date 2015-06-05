package grails.buildtestdata.handler

class UrlConstraintHandler implements ConstraintHandler {
    void handle(domain, propertyName, appliedConstraint, constrainedProperty = null, circularCheckList = null) {
        domain."$propertyName" = 'http://www.example.com'
    }
}
