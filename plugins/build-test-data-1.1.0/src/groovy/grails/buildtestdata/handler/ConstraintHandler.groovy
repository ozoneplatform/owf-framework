package grails.buildtestdata.handler;

public interface ConstraintHandler {
    public void handle( domain, propertyName, appliedConstraint, constrainedProperty, circularCheckList);
}
