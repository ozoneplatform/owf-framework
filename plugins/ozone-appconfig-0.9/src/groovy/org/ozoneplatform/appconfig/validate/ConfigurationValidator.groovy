package org.ozoneplatform.appconfig.validate

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration

public interface ConfigurationValidator {
    void validateConfiguration(ApplicationConfiguration applicationConfiguration)
}