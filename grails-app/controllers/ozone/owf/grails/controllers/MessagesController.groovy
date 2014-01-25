package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.services.OwfMessagingService

class MessagesController {

    OwfMessagingService owfMessagingService
    
    
    def list = {

        def start = session.last_message_timestamp as Date ?: null
        def messages = owfMessagingService.getMessages(start)
        session.last_message_timestamp = new Date()
        
        render messages as JSON
        
    }
    
}
