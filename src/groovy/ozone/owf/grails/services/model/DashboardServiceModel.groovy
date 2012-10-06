package ozone.owf.grails.services.model

import ozone.owf.grails.domain.EDashboardLayout

class DashboardServiceModel extends AbstractServiceModel {
  String name
  String guid
  String layout
  Boolean isdefault
  Integer columnCount
  PersonServiceModel user
  String alteredByAdmin
  String EDashboardLayoutList = EDashboardLayout.listAsStrings()
  Boolean isGroupDashboard
  List state = []
  List groups = []
  String description = ''
  String defaultSettings
  Boolean showLaunchMenu
  String createdDate 
  String editedDate
  PersonServiceModel createdBy
  String layoutConfig
  String intentConfig
  Boolean locked = false
  
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