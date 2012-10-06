package ozone.owf.grails.services.model

class GroupServiceModel extends AbstractServiceModel {
  Long id

  String name
  String description = ''
  String displayName
  String email
  Boolean automatic = false
  String status
  Integer totalWidgets = 0
  Integer totalUsers = 0

  List tagLinks = []
  

}
