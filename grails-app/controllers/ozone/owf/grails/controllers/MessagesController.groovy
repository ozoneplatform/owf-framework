package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.services.OwfMessagingService

class MessagesController {

    OwfMessagingService owfMessagingService
    
    
    def list = {
        
        Calendar calendar = new GregorianCalendar(2014,0,21)
        def start = calendar.getTime()
        def messages = owfMessagingService.getMessages(start)
        
        
        render messages as JSON
        
    }
    
}
