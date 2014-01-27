package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.services.OwfMessagingService

class MessagesController {

    OwfMessagingService owfMessagingService
    
    
    def list = {

        def messages = owfMessagingService.pollMessages()
        
        render messages as JSON
        
    }
    
}
