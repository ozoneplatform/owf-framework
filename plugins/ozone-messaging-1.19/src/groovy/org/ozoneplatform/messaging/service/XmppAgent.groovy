package org.ozoneplatform.messaging.service

import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.jivesoftware.smack.XMPPConnection
import org.jivesoftware.smack.packet.Message
import org.jivesoftware.smackx.muc.MultiUserChat
import org.ozoneplatform.messaging.payload.OzoneMessage
import org.ozoneplatform.messaging.service.impl.XmppConfigurationService
import org.jivesoftware.smack.XMPPException
import org.ozoneplatform.messaging.exception.MessagingException
import org.jivesoftware.smackx.muc.DiscussionHistory
import org.springframework.beans.factory.annotation.Autowired



class XmppAgent {

    final Log log = LogFactory.getLog(XmppAgent.class);

    @Autowired
    XmppConfigurationService xmppConfigurationService
            
    public void sendGroupMessages(String multiUserChatId, Collection<OzoneMessage> messages){
        
        def connection
        def muc
        
        try{
            log.info "Request to send message(s) to ${multiUserChatId}."
            
            connection = createConnection()
            muc = new MultiUserChat(connection, multiUserChatId)
            
            String connectionName = getConnectionName()
            muc.join(connectionName)

            log.info "Successfully joined multi user chat as:  ${connectionName}"
            
            messages.each{ ozMessage ->
                Message message = muc.createMessage()
                ozMessage.copyInto(message)
                
                log.info "Attempting to send message."
                muc.sendMessage(message)
                log.info "Message was successfully sent."
            }
                        
            muc.leave()
            connection.disconnect()
            
        } catch (XMPPException e){
            String errMessage = "Error sending message with connection info ${xmppConfigurationService}:  ${e.message}"
            log.error (errMessage)
            throw new MessagingException(errMessage, e)
        }  
        
    }
        
    
    //Gets messages on a new connection
    public List getMessages(String multiUserChatId, Date start){
        
        List messages = []
        def connection
        def muc
        
        try{

            log.info "Request to retrieve message from ${multiUserChatId} with starting date ${start}."
            
            connection = createConnection()
            
            muc = new MultiUserChat(connection, multiUserChatId)
            
            DiscussionHistory history = new DiscussionHistory()
            history.setSince(start)
            
            String connectionName = getConnectionName()
            muc.join(connectionName, null, history, 30000)
            
            log.info "Successfully joined multi user chat as:  ${connectionName}"
                        
            Message message

            while((message = muc.nextMessage(250)) !=null){
                if(message.getProperty(OzoneMessage.MESSAGE_TIMESTAMP))
                    messages << OzoneMessage.create(message)
            }
            
            log.info "Successfully retrieved messages."
                       
            muc.leave()
            connection.disconnect()

        } catch (XMPPException e){
            String errMessage = "Error while listening for a message on ${multiUserChatId} with connection info ${xmppConfigurationService}:  ${e.message}"
            log.error errMessage
            throw new MessagingException(errMessage, e)
        } 
            
        return messages
    }

    private XMPPConnection createConnection() {
        XMPPConnection connection = new XMPPConnection(this.xmppConfigurationService.getConnectionConfiguration())
        log.info "Attempting to connect to XMPP server."
        connection.connect()
        log.info "Successfully connected to XMPP server.  Logging in now."
        connection.login(this.xmppConfigurationService.userName, this.xmppConfigurationService.password, getConnectionName())
        log.info "Successfully logged in to XMPP server."
        return connection
    }

    
    
    
    private String getConnectionName(){
        return this.xmppConfigurationService.userName + "_" + new Date().time
    }
}

