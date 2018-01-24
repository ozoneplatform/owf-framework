package ozone.owf.grails.services

import grails.core.GrailsApplication

import org.apache.log4j.Logger

import ozone.owf.grails.util.OWFDate


class AuditService {
	
    GrailsApplication grailsApplication

    AccountService accountService

    static Logger logger = Logger.getLogger('ozone.owf.grails.services.AuditService')
        
    def logMessage(def params) {
        def username = accountService.getLoggedInUsername()
        def requestTime = OWFDate.format(new Date())

        def sendingWidget = params.sendingWidget
        def receivingWidget = params.receivingWidget
        def accessLevel = params.accessLevel
        def outcomeCategory = params.outcomeCategory
        def outcomeGood = params.boolean('accessOutcomeGood')

        def logMessage = "Sender: [" + sendingWidget + "], Receiver: [" + receivingWidget + "], accessLevel: [" + accessLevel + "]"
        if (outcomeGood) {
            logger.info(logMessage)
        } else {
            logMessage = logMessage + ", [" + outcomeCategory + "]"
            logger.error(logMessage)
        }
        
        return [success:true, data:[message: logMessage]]
    }

}

