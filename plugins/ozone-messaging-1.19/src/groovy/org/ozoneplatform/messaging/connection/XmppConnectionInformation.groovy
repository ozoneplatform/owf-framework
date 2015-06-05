package org.ozoneplatform.messaging.connection

import org.jivesoftware.smack.ConnectionConfiguration

class XmppConnectionInformation {
    
    String userName, password, serviceName
   
    int port = 5222 //Default
    
    
    public void validate(){
        if(!userName || !password || !serviceName){
            throw new IllegalArgumentException("userName, password and resourceName must be non null")
        }
    }

    public ConnectionConfiguration getConnectionConfiguration(){
        ConnectionConfiguration  connectionConfiguration = new ConnectionConfiguration(this.serviceName, this.port)
        connectionConfiguration.setSASLAuthenticationEnabled(true)
        connectionConfiguration
    }

    @Override
    public String toString() {
        return "XmppConnectionInformation [userName=" + userName
                + ", password=" + password + ", resourceName=" + serviceName
                + ", port=" + port + "]";
    }
    
    
}
