package ozone.owf.grails.services

import grails.converters.JSON
import ozone.owf.grails.util.OWFDate
import org.apache.log4j.Logger

class AuditService {
	
    def grailsApplication
    def accountService
    static Logger logger = Logger.getLogger('ozone.owf.grails.services.AuditService')
        
    def logMessage(def params) {
//        println " ####  within Audit service"
        def username = accountService.getLoggedInUsername()
        def requestTime = OWFDate.format(new Date())

        def sendingWidget = params.sendingWidget
        def receivingWidget = params.receivingWidget
        def accessLevel = params.accessLevel
        def outcomeCategory = params.outcomeCategory
        def outcomeGood = params.boolean('accessOutcomeGood')

//        println "outcome: " + outcomeGood

        def logMessage = "Sender: [" + sendingWidget + "], Receiver: [" + receivingWidget + "], accessLevel: [" + accessLevel + "]"
        if (outcomeGood) {
//            println "Logging good here..." 
//            println "Log message: " + logMessage
            if (logger.isInfoEnabled()) {
                logger.info(logMessage)        
            } else {
//                println "Info's not on for this logger"
            }
            
        } else {
//            println "Logging fail here..."
//            println "Log message: " + logMessage
            logMessage = logMessage + ", [" + outcomeCategory + "]"
            if (logger.isErrorEnabled()) {
                logger.error(logMessage)
            } else {
//                println "Error's not on for this logger..."
            }
        }
        
        return [success:true, data:[message: logMessage]]
    }

}

