package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.services.OwfMessagingService


class MessagesController {

    OwfMessagingService owfMessagingService
    
    def list = {

        def messages = owfMessagingService.pollMessages()

        header "Cache-Control", "no-cache, no-store"
        header "Pragma", "no-cache"
        header "Expires", "0"
        
        render messages as JSON
        
    }
    
}
