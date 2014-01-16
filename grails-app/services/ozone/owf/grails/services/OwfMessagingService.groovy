package ozone.owf.grails.services

import org.ozoneplatform.messaging.service.api.MessageService
import org.ozoneplatform.messaging.payload.AmlMessage
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CFG
class OwfMessagingService {

    MessageService messageService
    
    
    public AmlMessage listen(){
        //For now this is invoked in bootstrap but in reality this will be from a controller
        messageService.listenForMessage(CFG.config.xmpp.roomName, { message ->
            log.info "Message recieved.  The contents are: ${message}."
            return message
        });
    }
}
