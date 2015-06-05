package org.ozoneplatform.appconfig.server.service.impl

import org.ozoneplatform.appconfig.event.ConfigurationSaveEvent
import org.springframework.transaction.annotation.Transactional
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Autowired
import org.ozoneplatform.appconfig.server.persistence.api.ApplicationConfigurationRepository
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.ApplicationEventPublisherAware

@Component
class ApplicationConfigurationServiceImpl implements ApplicationConfigurationService, ApplicationEventPublisherAware {

    ApplicationEventPublisher applicationEventPublisher

    @Autowired
    private ApplicationConfigurationRepository applicationConfigurationRepository

    //Save the config object.  The save happens only if its an existing object as inserting a value does not make sense from here
    @Transactional(readOnly=false)
    public ApplicationConfiguration saveApplicationConfiguration(ApplicationConfiguration item){
        applicationConfigurationRepository.save(item)

        if(item.errors?.errorCount == 0) {
            applicationEventPublisher.publishEvent(new ConfigurationSaveEvent(this, item))
        }

        return item
    }


    //Get the config objects by id
    @Transactional(readOnly=true)
    public ApplicationConfiguration getApplicationConfigurationById(Long id){
        applicationConfigurationRepository.get(id)
    }

    //This is a core method of this class.  It looks up a configuration item by code and cache's it.
    @Transactional(readOnly=true)
    public ApplicationConfiguration getApplicationConfiguration(ApplicationSetting setting){
        applicationConfigurationRepository.findByCode(setting.code)
    }

    //Get all the config objects
    @Transactional(readOnly=true)
    public List<ApplicationConfiguration> getAllApplicationConfigurations(){
        applicationConfigurationRepository.findAll()
    }

    //Get all the config objects
    @Transactional(readOnly=true)
    public List<ApplicationConfiguration> getApplicationConfigurationsByGroupName(String groupName){
        applicationConfigurationRepository.findAllByGroupName(groupName)
    }


    //This method is used to evaluate boolean configuration settings
    @Transactional(readOnly=true)
    public boolean is(ApplicationSetting setting){
        getApplicationConfiguration(setting)?.value ? getApplicationConfiguration(setting)?.value.toBoolean() : false
    }

    //This method is used to evaluate string configuration settings
    @Transactional(readOnly=true)
    public String valueOf(ApplicationSetting setting){
        getApplicationConfiguration(setting)?.value
    }


    // Right now this is here to support backwards compatibility with subclassed config services
    // It should be removed in the future in favor of using the component based config validators
    public void validate(ApplicationConfiguration applicationConfiguration){
        //
    }

}
