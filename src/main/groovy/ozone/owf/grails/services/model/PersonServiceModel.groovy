package ozone.owf.grails.services.model

class PersonServiceModel extends AbstractServiceModel {
  Long id
  String username
  String userRealName
  String email
  Boolean hasPWD
  Integer totalGroups = 0
  Integer totalWidgets = 0
  Integer totalDashboards = 0
  Integer totalStacks = 0
  Long lastLogin
}
