package ozone.owf.grails.services.model

class DashboardWidgetStateServiceModel extends AbstractServiceModel implements Comparable {
	String  uniqueId
    String widgetGuid
	String  name
	Boolean active
	Integer width
	Integer height
	Integer x
	Integer y
	Integer zIndex
	Boolean minimized
	Boolean maximized
	Boolean pinned
	Boolean collapsed
	Integer columnPos
	String  buttonId
	Boolean buttonOpened
	String  region  //region = right-north, right-south, accordian
	Integer statePosition

      int compareTo(Object them) {
        return this.statePosition <=> them.statePosition
    }
}
