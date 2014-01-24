package ozone.owf.grails.services


import org.ozoneplatform.messaging.service.api.MessageService
import org.ozoneplatform.messaging.payload.AmlMessage
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CFG
import ozone.owf.cache.OwfMessageCache
class OwfMessagingService {

    MessageService messageService
    
    OwfMessageCache owfMessageCache
    
    public void listen(){
        
        //Calendar with start date = now
        def calendar = new GregorianCalendar()
        calendar.add(GregorianCalendar.DAY_OF_MONTH, -7)
        def date = calendar.getTime()
        
        log.info "Establisting a listner going back to ${date} for messages"
                
        //For now this is invoked in bootstrap but in reality this will be from a controller
        messageService.listenForMessage(CFG.config.xmpp.roomName, date, { message ->
            log.info "Message recieved.  The contents are: ${message}."
            owfMessageCache.add(message)
        });
    }
    
    
    public List getMessages(Date start){
        messageService.getMessages(CFG.config.xmpp.roomName, start)
    }
    
    
}
