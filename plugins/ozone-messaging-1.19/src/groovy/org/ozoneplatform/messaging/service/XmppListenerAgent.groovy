package org.ozoneplatform.messaging.service

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock

import javax.annotation.PreDestroy;

import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.jivesoftware.smack.ConnectionConfiguration
import org.jivesoftware.smack.PacketListener
import org.jivesoftware.smack.XMPPConnection
import org.jivesoftware.smack.XMPPException
import org.jivesoftware.smack.packet.Message
import org.jivesoftware.smack.packet.Packet
import org.jivesoftware.smackx.muc.DiscussionHistory
import org.jivesoftware.smackx.muc.MultiUserChat
import org.ozoneplatform.messaging.exception.MessagingException
import org.ozoneplatform.messaging.payload.OzoneMessage
import org.ozoneplatform.messaging.service.impl.XmppConfigurationService
import org.springframework.beans.factory.annotation.Autowired

class XmppListenerAgent {

    final Log log = LogFactory.getLog(XmppListenerAgent.class);
        
    @Autowired
    XmppConfigurationService xmppConfigurationService
                 
    private XMPPConnection connection = null
    
    private final Lock lock = new ReentrantLock()
    
    @PreDestroy
    public void disconnect(){
        log.info("Disconnecting from XMPP server")
        this.connection?.disconnect()
        this.connection = null
    }

    public void connect(){
        
        ConnectionConfiguration connectionConfiguration = this.xmppConfigurationService.getConnectionConfiguration()
        String userName = this.xmppConfigurationService.userName
        String password = this.xmppConfigurationService.password
        
        lock.lock()
        
        disconnect()

        try {
            this.connection = new XMPPConnection(connectionConfiguration)
            
            log.info("Estabilishing XMPP connection with user name ${userName}.")
            this.connection.connect()
            log.info("Successfully established XMPP connection.")

            log.info("Logging in with user: '" + userName + "'.")
            this.connection.login(userName, password, getConnectionName())
            
        } catch(XMPPException xe) {
            log.error("Error creating xmpp connection:" + xe.message)
            throw xe
        } finally {
            lock.unlock()
        }
    }

    public void listenForMessage(String multiUserChatId, Date start, def callback){
        try{      
            
            log.info "Request to listen for message on ${multiUserChatId} with starting date ${start}."
                  
            this.connect()

            MultiUserChat muc = new MultiUserChat(this.connection, multiUserChatId)

            DiscussionHistory history = new DiscussionHistory()
            history.setSince(start)

            String connectionName = getConnectionName()
            muc.join(connectionName, null, history, 30000)
            
            muc.addMessageListener(new PacketListener(){
                public void processPacket(Packet packet) {
                    Message message = (Message) packet
                    OzoneMessage ozMessage = OzoneMessage.create(message)
                    log.debug "Received a message: ${ozMessage}"
                    callback(ozMessage)
                }
            })
            
            log.info "Successfully joined multi user chat '${multiUserChatId}' as '${connectionName}' and now listening for messages."
            
        } catch (XMPPException e){
            String errMessage = "Error while listening for a message on ${multiUserChatId} with connection info ${xmppConfigurationService}:  ${e.message}"
            throw new MessagingException(errMessage, e)
        }
    }
    
    private String getConnectionName(){
        return this.xmppConfigurationService.userName + "_" + new Date().time
    }
    
    public boolean isListening() {
        return connection?.authenticated
    }
}
