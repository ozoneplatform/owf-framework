package ozone.owf.grails.services.model

class StackServiceModel extends AbstractServiceModel {
    Long id
    String name
    Integer stackPosition
    String description
    String stackContext
    String imageUrl
    String descriptorUrl
    Integer totalDashboards = 0
    Integer totalUsers = 0
    Integer totalGroups = 0
    Integer totalWidgets = 0
}

