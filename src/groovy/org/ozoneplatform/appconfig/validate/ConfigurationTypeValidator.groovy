package org.ozoneplatform.appconfig.validate

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.validate.ConfigurationValidator
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

@Component
class ConfigurationTypeValidator implements ConfigurationValidator {

    @Autowired
    @Qualifier("applicationConfigurationServiceImpl")
    ApplicationConfigurationService applicationConfigurationService

    @Override
    void validateConfiguration(ApplicationConfiguration applicationConfiguration) {

        def rejectValue = { String code ->
            applicationConfiguration.errors.rejectValue('value', code)
        }

        if(applicationConfiguration.type == "Integer"){
            def val = applicationConfiguration.value
            if(!val.isInteger() || Integer.valueOf(val) < 0){
                rejectValue('application.configuration.invalid.integer.gt.zero')
                return
            }
        }

        if(applicationConfiguration.type == "Decimal"){
            def val = applicationConfiguration.value
            if(!val.isNumber() || Double.valueOf(val) < 0){
                rejectValue('application.configuration.invalid.number.gt.zero')
            }
        }
    }
}
