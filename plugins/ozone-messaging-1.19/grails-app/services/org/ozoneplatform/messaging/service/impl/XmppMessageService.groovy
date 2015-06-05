package org.ozoneplatform.messaging.service.impl

import org.ozoneplatform.messaging.payload.OzoneMessage
import org.ozoneplatform.messaging.service.XmppAgent
import org.ozoneplatform.messaging.service.XmppListenerAgent
import org.ozoneplatform.messaging.service.api.MessageService

class XmppMessageService implements MessageService {

    static transactional = false
    
    XmppAgent xmppAgent
    
    XmppListenerAgent xmppListenerAgent
    
    
    @Override
    public void sendGroupMessage(OzoneMessage message){
        this.sendGroupMessages([message])
    }

    void sendGroupMessages(Collection<OzoneMessage> messages){
        String sender = xmppAgent.xmppConfigurationService.userName
        messages.each{ message ->
            message.sender = sender
            if(!message.isValid()){
                throw new RuntimeException("Malformed message. Please make sure all fields are populated: ${message}.")
            }
        }
        xmppAgent.sendGroupMessages(xmppAgent.xmppConfigurationService.room, messages)
    }
    
    @Override
    public void listenForMessage(Date start, Closure callback){

        xmppListenerAgent.listenForMessage(xmppAgent.xmppConfigurationService.room, start, callback)
    }

    @Override
    public List getMessages(Date start){
        def sortedMessages = xmppAgent.getMessages(xmppAgent.xmppConfigurationService.room, start).sort{a, b ->
            return a.timestamp <=> b.timestamp
        }
        sortedMessages
    }

    @Override
    public void stopListening() {
        xmppListenerAgent.disconnect()
    }

    @Override
    public boolean isListening() {
        xmppListenerAgent.listening
    }
}
