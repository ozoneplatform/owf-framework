package org.ozoneplatform.appconfig.event

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.springframework.context.ApplicationEvent


class ConfigurationSaveFailedEvent extends ApplicationEvent {

    ApplicationConfiguration configItem

    public ConfigurationSaveFailedEvent(Object source, ApplicationConfiguration item) {
        super(source)
        configItem = item
    }
}
