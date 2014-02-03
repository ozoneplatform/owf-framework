package org.ozoneplatform.appconfig.event

import org.apache.log4j.Logger
import org.ozoneplatform.messaging.exception.MessagingException
import static org.ozoneplatform.appconfig.NotificationsSetting.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationListener
import org.springframework.stereotype.Component
import ozone.owf.grails.services.OwfApplicationConfigurationService
import ozone.owf.grails.services.OwfMessagingService

@Component
class NotificationConfigRollbackListener implements ApplicationListener<ConfigurationSaveFailedEvent> {

    @Autowired
    OwfApplicationConfigurationService owfApplicationConfigurationService

    @Autowired
    OwfMessagingService owfMessagingService

    static final Logger log = Logger.getLogger(NotificationConfigRollbackListener.class)

    @Override
    void onApplicationEvent(ConfigurationSaveFailedEvent event) {
        String code = event.configItem.code
        Boolean enabled = owfApplicationConfigurationService.is(NOTIFICATIONS_ENABLED)

        // If a connection setting failed to save, and notifications are enabled,
        // restart the connection with the previous, presumably correct settings
        if(enabled && code in [NOTIFICATIONS_XMPP_SERVER_HOSTNAME.code,
                NOTIFICATIONS_XMPP_USERNAME.code,
                NOTIFICATIONS_XMPP_SERVER_PORT.code,
                NOTIFICATIONS_XMPP_PASSWORD.code]){
            try {
                owfMessagingService.startListening()
            } catch(MessagingException me) {
                log.error "Could not start the message listener: " + me.message
            }
        }
    }
}
