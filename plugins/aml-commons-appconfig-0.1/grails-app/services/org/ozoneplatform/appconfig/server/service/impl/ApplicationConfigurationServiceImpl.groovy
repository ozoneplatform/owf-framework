package org.ozoneplatform.appconfig.server.service.impl


import org.springframework.transaction.annotation.Transactional
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSettingType
import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Autowired
import org.ozoneplatform.appconfig.server.persistence.api.ApplicationConfigurationRepository
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService


@Component
class ApplicationConfigurationServiceImpl implements ApplicationConfigurationService{


	@Autowired
	private ApplicationConfigurationRepository applicationConfigurationRepository
	

	//Save the config object.  The save happens only if its an existing object as inserting a value does not make sense from here
	@Transactional(readOnly=false)
	public ApplicationConfiguration saveApplicationConfiguration(ApplicationConfiguration item){
		applicationConfigurationRepository.save(item)
		item
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
	

	//This will validate the configuration object
	public void validate(ApplicationConfiguration applicationConfiguration){
		
		if(!applicationConfiguration)
			return
		
		if(applicationConfiguration.value =~ "<|>")
			applicationConfiguration.errors.rejectValue('value',"value.contains.illegal.characters", ['< or >'] as Object[], "Invalid characters")
		
		if(applicationConfiguration?.value?.size() > 2000){
			applicationConfiguration.errors.rejectValue('value',"value.too.long", [applicationConfiguration.value.size().toString(), "2000"] as Object[], "The value for this field is too long")
		}
		
		if(applicationConfiguration.type == "Integer" && !applicationConfiguration.value.isInteger()){
			applicationConfiguration.errors.rejectValue('value', "application.configuration.invalid.integer")
		}

		if(applicationConfiguration.type == "Decimal" && !applicationConfiguration.value.isNumber()){
			applicationConfiguration.errors.rejectValue('value', "application.configuration.invalid.number")
		}
	}
		
}
