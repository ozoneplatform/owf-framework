package ozone.owf.grails.services

import grails.converters.JSON
import custom.access.AccessLevel
import custom.access.CustomAccessChecker
import ozone.owf.grails.domain.WidgetDefinition

class AccessService {
	
    def accountService
    def customAccessChecker

    
    def checkAccess(def params) {
    	def username = accountService.getLoggedInUsername()
        def widgetId = params.widgetId
    	def receivingWidget = WidgetDefinition.findByWidgetGuid(widgetId)

    	def formalAccesses = []
    	
    	// Define formal access levels to check
    	if (params.accessLevel == null) {
			// Check all access levels sending widget is permitted to accept.
			// Receiving widget must be permitted to accept all these access levels. 
    		def sendingWidget = WidgetDefinition.findByWidgetGuid(params.senderId)
    		formalAccesses = customAccessChecker.getFormalAccesses(sendingWidget.widgetUrl)
    	} else {
   			// Only check specified access level
    		def accessLevel = new AccessLevel(params.accessLevel)
    		formalAccesses.push(accessLevel)
		}
    	
    	def userHasAccess = customAccessChecker.checkAccess(username, formalAccesses)
		def widgetHasAccess = customAccessChecker.checkAccess(receivingWidget.widgetUrl, formalAccesses)
		def hasAccess = (userHasAccess && widgetHasAccess)
			
        return [success:true, data:[widgetId: params.widgetId, accessLevel: params.accessLevel?.toUpperCase(), hasAccess: hasAccess]]
    }

}

