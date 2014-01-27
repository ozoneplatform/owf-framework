package ozone.owf.grails.services


import org.ozoneplatform.messaging.payload.AmlMessage
import org.ozoneplatform.messaging.service.api.MessageService
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CFG
import ozone.owf.cache.OwfMessageCache
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService
import org.springframework.transaction.annotation.Transactional


@Transactional(readOnly=true)
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
    
    
    @Transactional(readOnly=false)
    public List pollMessages(){            

        String loggedInUserName = accountService.getLoggedInUsername()
        Person currentUser = Person.findByUsername(loggedInUserName)
        
        //Since date is the last notification date if it exists otherwise the last login date then fall back to now
        Date since = currentUser.getLastNotification() ?: currentUser.getLastLogin() ?: new Date()
        since = new Date(since.time)  //Make our own copy and also ensure its of type Date as opposed to Timestamp   
             
        //If the 'since' date is greater than the last received date then there are no new messages
        if(owfMessageCache.getLastReceivedTimeStamp() && since > owfMessageCache.getLastReceivedTimeStamp())
            return []
        
        def messages = owfMessageCache.getMessages(since)
        //If the message is in the cache return it
        if(messages.size() == 0){
            def room = CFG.config.xmpp.roomName
            messages =  messageService.getMessages(room, since)
        }        
        
        //Remove messages that are earlier than the since date and where the recipient list does not include the current user
        messages.removeAll{ AmlMessage message ->
            message.timestamp <= since && message.recipients?.contains(loggedInUserName)
        }
        
        currentUser.lastNotification = new Date()
        currentUser.save()
        
        return messages
    }
    
    
}
