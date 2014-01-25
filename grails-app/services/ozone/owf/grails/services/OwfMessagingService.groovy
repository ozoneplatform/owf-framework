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

        String loggedInUserName = accountService.getLoggedInUsername()
        
        //If there is no start date then get it from the last logged in date TODO get it from preferences
        if(!start){
            Person currentUser = Person.findByUsername(loggedInUserName)
            start = new Date(currentUser.getLastLogin().time) 
        }
        
        //If the start date is greater than the last received date then there are no new messages
        if(start > owfMessageCache?.getLastReceivedTimeStamp())
            return []
                
        def messages = []
        //If the message is in the cache return it
        if(owfMessageCache.contains(start)){
            messages = owfMessageCache.getMessages(start)
        } else{
            def room = CFG.config.xmpp.roomName
            messages =  messageService.getMessages(room, start)
        }        
        
        messages.findAll{ AmlMessage message ->
            message.timestamp >= start && message.recipients?.contains(loggedInUserName)
        }
    }
    
    
}
