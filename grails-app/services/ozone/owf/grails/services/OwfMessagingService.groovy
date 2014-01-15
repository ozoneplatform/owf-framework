package ozone.owf.grails.services

import org.ozoneplatform.messaging.service.api.MessageService

class OwfMessagingService {

    MessageService messageService
    
    
    public void listen(){
        //For now this is invoked in bootstrap but in reality this will be from a controller
        messageService.listenForMessage("amlnotify_owfuser", "amlnotify@conference.goss.owfgoss.org", { message ->
            log.info "Message recieved.  The contents are: ${message}."
        });
    
    }
}
