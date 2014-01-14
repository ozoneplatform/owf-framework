package ozone.owf.grails.services

import org.ozoneplatform.messaging.service.api.MessageService

class OwfMessagingService {

    MessageService messageService
    
    
    public void listen(){
        println "REgistering the listening service...."
        messageService.listenForMessage("amlnotify_owfuser", "amlnotify@conference.goss.owfgoss.org", { message ->
            println "Got some message in OWF from the chat it looks like : " + message
        });
    
    }
}
