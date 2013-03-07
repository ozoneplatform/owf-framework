package ozone.owf.grails.services

import grails.converters.JSON
import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.util.OWFDate

class AuditService {
	
    def grailsApplication
    def accountService
    def loggingService = new AuditOWFWebRequestsLogger()
    
    def logMessage(def params) {
        def username = accountService.getLoggedInUsername()
        def requestTime = OWFDate.format(new Date())
        def logMessage = requestTime + " - " + params.message + " [username:" + username + "]"
        loggingService.log(logMessage)
        return [success:true, data:[message: logMessage]]
    }

}

