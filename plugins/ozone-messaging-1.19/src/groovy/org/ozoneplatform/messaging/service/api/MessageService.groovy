package org.ozoneplatform.messaging.service.api


import org.ozoneplatform.messaging.payload.OzoneMessage

interface MessageService {

    void sendGroupMessage(OzoneMessage message)

    void sendGroupMessages(Collection<OzoneMessage> messages)
    
    void listenForMessage(Date start, Closure callback)

    void stopListening()

    List getMessages(Date start)

    boolean isListening()
}
