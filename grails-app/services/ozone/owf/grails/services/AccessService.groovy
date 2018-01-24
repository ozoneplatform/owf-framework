package ozone.owf.grails.services

import custom.access.AccessLevel
import custom.access.CustomAccessChecker

import ozone.owf.grails.domain.WidgetDefinition


class AccessService {

    AccountService accountService

    CustomAccessChecker customAccessChecker

    def checkAccess(def params) {
    	def username = accountService.getLoggedInUsername()
        def widgetId = params.widgetId
    	def receivingWidget = WidgetDefinition.findByWidgetGuid(widgetId)

        //OP-1065 - When widgets on different dashboards use the same channel to publish the widgetId
        //is the instance id, not the guid, so the above expression returns a null object. This happens
        //because the pubsub_router checks access on all channel subscribers even if the subscriber
        //is not on the current dashboard but hasAccess only checks widgets in getOpenedWidgets
        if (!receivingWidget) {
            log.info("Failed to find receiving widget, must be on another dashboard")
            return [success:true, data: [hasAccess: false]]
        }

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

