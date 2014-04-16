package org.ozoneplatform.appconfig.event

import grails.validation.ValidationException
import org.apache.log4j.Logger
import org.ozoneplatform.messaging.exception.MessagingException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationListener
import org.springframework.stereotype.Component
import ozone.owf.grails.services.OwfApplicationConfigurationService
import ozone.owf.grails.services.OwfMessagingService

import static org.ozoneplatform.appconfig.NotificationsSetting.*

@Component
class NotificationConfigListener implements ApplicationListener<ConfigurationSaveEvent> {

    @Autowired
    OwfMessagingService owfMessagingService

    @Autowired
    OwfApplicationConfigurationService owfApplicationConfigurationService

    static final Logger log = Logger.getLogger(NotificationConfigListener.class)

    /**
     * Handles the response to an application configuration save event.
     *
     * @param event
     */
    @Override
    void onApplicationEvent(ConfigurationSaveEvent event) {

        String value = event.configItem.value
        String code = event.configItem.code

        Boolean enabled = owfApplicationConfigurationService.is(NOTIFICATIONS_ENABLED)

        if(code == NOTIFICATIONS_QUERY_INTERVAL.code){
            if(value)
                owfMessagingService.owfMessageCache.setExpiration(value as Integer)
        }

        if(code == NOTIFICATIONS_ENABLED.code) {
            if(value.toBoolean()) {
                try {
                    owfMessagingService.startListening()
                } catch(MessagingException me) {
                    log.error "Could not start the message listener: " + me.message
                    event.configItem.errors.rejectValue('value', 'application.configuration.notifications.connection.failed')
                    throw new ValidationException("Could not enable notifications - the connection to the messaging server failed", event.configItem.errors)
                }
            } else {
                owfMessagingService.stopListening()
            }
        }

        //If a connection related setting is changed and notifications are enabled, test the connection
        if(enabled && code in [NOTIFICATIONS_XMPP_SERVER_HOSTNAME.code,
                NOTIFICATIONS_XMPP_USERNAME.code,
                NOTIFICATIONS_XMPP_SERVER_PORT.code,
                NOTIFICATIONS_XMPP_PASSWORD.code]){
            try {
                owfMessagingService.startListening()
            } catch(MessagingException me) {
                log.error "Could not start the message listener: " + me.message
                event.configItem.errors.rejectValue('value', 'application.configuration.notifications.connection.failed')
                throw new ValidationException("Could not save connection settings - the connection to the messaging server failed", event.configItem.errors)
            }
        }
    }
}
