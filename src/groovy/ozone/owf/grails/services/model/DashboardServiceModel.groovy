package ozone.owf.grails.services.model

import ozone.owf.grails.domain.EDashboardLayout

class DashboardServiceModel extends AbstractServiceModel {
  String name
  String guid
  Boolean isdefault
  Integer dashboardPosition
  PersonServiceModel user
  String alteredByAdmin
  String EDashboardLayoutList = EDashboardLayout.listAsStrings()
  Boolean isGroupDashboard
  List groups = []
  String description = ''
  String createdDate 
  String prettyCreatedDate
  String editedDate
  String prettyEditedDate
  PersonServiceModel createdBy
  String layoutConfig
  Boolean locked = false
  StackServiceModel stack
  
  Map toDataMap() {
    Map dataMap = [:]
	
    this.properties.each {
      //ignore lame default class properties don't need these polluting our model
      if (it.key != 'class' && it.key != 'metaClass') {

        //todo some day fix this inconsistency
        if (it.key.equals('user')) {
          dataMap[it.key] = [userId: it.value?.username]
        }else if (it.key.equals('createdBy')) {
          dataMap[it.key] = [userId: it.value?.username,
			  				 userRealName: it.value?.userRealName]
        }
        else {			
          dataMap[it.key] = it.value
        }
      }
    }

    return dataMap
  }

}