package ozone.owf.grails.services

import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.GrailsApplication

import org.ozoneplatform.messaging.payload.AmlMessage
import org.ozoneplatform.messaging.service.api.MessageService
import org.ozoneplatform.messaging.exception.MessagingException
import ozone.owf.cache.OwfMessageCache
import ozone.owf.grails.domain.Person

class OwfMessagingService {

    MessageService messageService

    OwfMessageCache owfMessageCache

    AccountService accountService

    PersonService personService

    GrailsApplication grailsApplication

    static transactional = false

    private static final Logger log = Logger.getLogger(OwfMessagingService)

    public void startListening(){
        try {
            messageService.listenForMessage(new Date(), { message ->
                log.info "Message recieved.  The contents are: ${message}."
                owfMessageCache.add(message)
            });
            log.info "OWF is now listening for messages"
        }
        catch (MessagingException e) {
            log.error "Notifications messaging system could not be started", e
        }
    }

    public void stopListening() {
        messageService.stopListening()
    }

    public List pollMessages(){

        if(grailsApplication.config.notifications.enabled == false) {
            return []
        }

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
}
