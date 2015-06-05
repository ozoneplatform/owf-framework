package org.ozoneplatform.messaging.service.impl

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.jivesoftware.smack.ConnectionConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class XmppConfigurationService {

    static transactional = false

    @Autowired
    GrailsApplication grailsApplication

    ConnectionConfiguration getConnectionConfiguration() {

        if(!resourceName || !room) {
            log.error("Unable to configure the connection - no XMPP Resource was provided.")
        }
        Integer port = 5222

        try {
            port = Integer.parseInt(this.port)
        } catch(NumberFormatException nfe) {
            log.error("Got an invalid value for the XMPP port: " + this.port + ", from configuration. Attempting to use default port of 5222")
        }

        ConnectionConfiguration connectionConfiguration = new ConnectionConfiguration(resourceName, port)
        connectionConfiguration.setSASLAuthenticationEnabled(true)

        connectionConfiguration
    }

    String getPassword() {
        grailsApplication.config.notifications.xmpp.password ?: ''
    }

    String getUserName() {
        grailsApplication.config.notifications.xmpp.username ?: ''
    }

    String getPort() {
        grailsApplication.config.notifications.xmpp.port ?: '5222'
    }

    String getResourceName() {
        grailsApplication.config.notifications.xmpp.host ?: ''
    }

    String getRoom() {
        grailsApplication.config.notifications.xmpp.room ?: ''
    }

    @Override
    String toString() {
        "XmppConnectionInformation [userName=" + userName + ", password=" + password + ", resourceName=" + resourceName + ", port=" + port + "]"
    }
}
