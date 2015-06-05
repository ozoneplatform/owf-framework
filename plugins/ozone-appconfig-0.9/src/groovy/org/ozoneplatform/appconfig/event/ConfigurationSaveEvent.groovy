package org.ozoneplatform.appconfig.event

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.springframework.context.ApplicationEvent


class ConfigurationSaveEvent extends ApplicationEvent {

    ApplicationConfiguration configItem

    public ConfigurationSaveEvent(Object source, ApplicationConfiguration item) {
        super(source)
        configItem = item
    }
}
