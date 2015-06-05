package org.ozoneplatform.messaging.payload

import org.jivesoftware.smack.packet.Message
import org.jivesoftware.smackx.XHTMLManager
import org.jivesoftware.smackx.XHTMLText


class OzoneMessage {

    OzoneMessage(){
        
    }
    
    public OzoneMessage(String sender, String body) {
        super();
        this.sender = sender
        this.body = body
    }

    public static final String MESSAGE_SENT_FROM = "messageSenderId"
    
    public static final String MESSAGE_TIMESTAMP = "messageTimeStamp"

    public static final String MESSAGE_RECIPIENTS = "messageRecipients"

    public static final String MESSAGE_SOURCE_URL = "messageSourceURL"
    
    String body
    
    String subject
    
    String sender
    
    //This is the room address
    String to

    String href
    
    String classification
    
    Date timestamp
    
    String sourceURL
    
    //This is the list of id's that the message should be distributed too
    List recipients = []
    
    //Copies internal details into a Xmpp Message from a OzoneMessage
    public final void copyInto(Message message){
        message.setSubject(this.subject)
        
        StringBuilder body = new StringBuilder()
        if(this.classification)
            body.append(this.classification).append(":  ")
            
        body.append(this.body)
        
        message.setBody(body.toString())
        message.setProperty(MESSAGE_SENT_FROM, this.sender)
        message.setProperty(MESSAGE_TIMESTAMP, new Date().time)
        message.setProperty(MESSAGE_RECIPIENTS, this.recipients)
        message.setProperty(MESSAGE_SOURCE_URL, this.sourceURL)
        
        if(href){
            //Put contents in HTML text as well in case the cliend supports that
            XHTMLText xhtmlText = new XHTMLText(null, null);
            xhtmlText.append(body.toString())
            xhtmlText.appendBrTag()
            xhtmlText.append(this.href)
            XHTMLManager.addBody(message, xhtmlText.toString());
        }

    }
    
    //Creates a OzoneMessage from a Xmpp Message
    public static OzoneMessage create(Message message){
        OzoneMessage ozMessage = new OzoneMessage()
        ozMessage.body = message.getBody()
        ozMessage.subject = message.getSubject()
        ozMessage.sender = message.getProperty(MESSAGE_SENT_FROM)
        ozMessage.recipients = message.getProperty(MESSAGE_RECIPIENTS)
        ozMessage.sourceURL = message.getProperty(MESSAGE_SOURCE_URL)
        
        def sentDt = message.getProperty(MESSAGE_TIMESTAMP) as Long
        if(sentDt)
            ozMessage.timestamp = new Date(sentDt)

        ozMessage.to = message.getTo()
        ozMessage
    }

    @Override
    public String toString() {
        return "OzoneMessage [body=" + body + ", sender=" + sender + ", to=" + to
                + ", classification=" + classification + ", timestamp="
                + timestamp + ", sourceURL=" + sourceURL + ", recipients="
                + recipients + "]";
    }

    public boolean isValid(){
        return this.sender && this.subject
    }    
    
    public void addRecipients(def recipients){
        this.recipients.addAll(recipients)
    }
}
