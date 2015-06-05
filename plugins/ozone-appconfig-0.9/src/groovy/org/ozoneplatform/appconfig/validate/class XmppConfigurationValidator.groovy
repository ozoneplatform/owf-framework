package org.ozoneplatform.appconfig.validate

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.springframework.stereotype.Component

@Component
class BaseConfigurationValidator implements ConfigurationValidator {

    public void validateConfiguration(ApplicationConfiguration applicationConfiguration) {
        if(!applicationConfiguration)
            return

        if(applicationConfiguration.value =~ '<|>') {
            applicationConfiguration.errors.rejectValue('value', 'application.configuration.validation.illegal.characters', ['< or >'] as Object[], 'Invalid characters')
        }

        if(applicationConfiguration?.value?.size() > 2000){
            applicationConfiguration.errors.rejectValue('value', 'application.configuration.validation.max.length', [applicationConfiguration.value.size().toString(), '2000'] as Object[], 'The value for this field is too long')
        }

        if(applicationConfiguration.type == 'Integer' && !applicationConfiguration.value.isInteger()) {
            applicationConfiguration.errors.rejectValue('value', 'application.configuration.validation.not.integer')
        }

        if(applicationConfiguration.type == 'Decimal' && !applicationConfiguration.value.isNumber()) {
            applicationConfiguration.errors.rejectValue('value', 'application.configuration.validation.not.number')
        }

        if(applicationConfiguration.type == 'Boolean' && !(applicationConfiguration.value in ['false', 'true'])) {
            applicationConfiguration.errors.rejectValue('value', 'application.configuration.validation.not.boolean')
        }
    }
}
