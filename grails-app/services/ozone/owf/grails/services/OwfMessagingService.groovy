package ozone.owf.grails.services


import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService
import org.ozoneplatform.messaging.payload.AmlMessage
import org.ozoneplatform.messaging.service.api.MessageService
import org.springframework.context.ApplicationListener
import ozone.owf.cache.OwfMessageCache
import ozone.owf.grails.domain.Person
import static ozone.owf.enums.OwfApplicationSetting.NOTIFICATIONS_ENABLED
import org.ozoneplatform.appconfig.server.eventing.ConfigurationSaveEvent
import org.springframework.transaction.annotation.Transactional

class OwfMessagingService implements ApplicationListener<ConfigurationSaveEvent> {

    ApplicationConfigurationService owfApplicationConfigurationService

    MessageService messageService
    
    OwfMessageCache owfMessageCache
    
    AccountService accountService
    
    PersonService personService
    
    static transactional = false
    
    public void listen(){
        
        log.info "Establishing a message listener"

        messageService.listenForMessage(new Date(), { message ->
            log.info "Message recieved.  The contents are: ${message}."
            owfMessageCache.add(message)
        });
    }

    public void stopListening() {
        //TODO: What happens here?
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
        if(!messages.size()){
            messages = messageService.getMessages(since)
        }        
        
        //Remove messages that are earlier than the since date and where the recipient list does not include the current user
        messages.removeAll{ AmlMessage message ->
            message.timestamp <= since && message.recipients?.contains(loggedInUserName)
        }
        
        currentUser.lastNotification = new Date()
        personService.save(currentUser)
                
        return messages
    }
    
    void onApplicationEvent(ConfigurationSaveEvent event) {
        if(event.configCode == NOTIFICATIONS_ENABLED.code) {
            event.configValue.toBoolean() ? listen() : stopListening()
        }
    }
}
