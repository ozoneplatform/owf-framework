package ozone.owf.grails.services


import org.ozoneplatform.messaging.payload.AmlMessage
import org.ozoneplatform.messaging.service.api.MessageService
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CFG
import ozone.owf.cache.OwfMessageCache
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService
class OwfMessagingService {

    MessageService messageService
    
    OwfMessageCache owfMessageCache
    
    AccountService accountService
    
    public void listen(){
        
        log.info "Establisting a message listener"
                
        //For now this is invoked in bootstrap but in reality this will be from a controller
        messageService.listenForMessage(CFG.config.xmpp.roomName, new Date(), { message ->
            log.info "Message recieved.  The contents are: ${message}."
            owfMessageCache.add(message)
        });
    }
    
    
    public List getMessages(Date start){
        def messages = []      
        def room = CFG.config.xmpp.roomName
        String loggedInUserName = accountService.getLoggedInUsername()
        if(!start){
            Person currentUser = Person.findByUsername(loggedInUserName)
            start = currentUser.getLastLogin() 
        }
        
        //If the message is in the cache return it
        if(owfMessageCache.contains(start)){
            messages = owfMessageCache.getMessages(start)
        } else{
            if(start < new Date())
                messages =  messageService.getMessages(room, start)
        }        
        
        messages.findAll{ AmlMessage message ->
            message.recipients?.contains(loggedInUserName)
        }
    }
    
    
}
