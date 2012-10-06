package ozone.owf.grails.services.model

class PersonServiceModel extends AbstractServiceModel {
  Long id
  String username
  String userRealName
  String email
  Boolean hasPWD
  List tagLinks = []
  Integer totalWidgets = 0
  Integer totalGroups = 0
  Integer totalDashboards = 0
  Long lastLogin
}
