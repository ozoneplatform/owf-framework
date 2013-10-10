package org.ozoneplatform.appconfig.server.service.impl

import org.apache.commons.logging.Log; 
import org.apache.commons.logging.LogFactory;

import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.annotation.Propagation

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSettingType
import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.MessageSource
import org.ozoneplatform.appconfig.server.persistence.api.ApplicationConfigurationRepository
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService


@Component
class ApplicationConfigurationServiceImpl implements ApplicationConfigurationService{

	private final Log log = LogFactory.getLog(ApplicationConfigurationServiceImpl.class);

	@Autowired
	private ApplicationConfigurationRepository applicationConfigurationRepository
	
	
	@Autowired
	private MessageSource messageSource
	

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
	
	//Helper method which will set various properties on a ApplicationConfiguration object via a naming convention.
	protected void setAppConfigFields(ApplicationConfiguration applicationConfiguration, int subGroupOrder, def subGroupName, def groupName, def type){
		def APP_CGF_PREFIX = "application.configuration."
		applicationConfiguration.title 		   =  	getMessage(APP_CGF_PREFIX + applicationConfiguration.code + ".label")
		applicationConfiguration.description   = 	getMessage(APP_CGF_PREFIX + applicationConfiguration.code + ".description")
		applicationConfiguration.help		   = 	getMessage(APP_CGF_PREFIX + applicationConfiguration.code + ".help")
		applicationConfiguration.subGroupName  = 	subGroupName
		applicationConfiguration.subGroupOrder = 	subGroupOrder
		applicationConfiguration.groupName	   = 	groupName
		applicationConfiguration.type          =    type
	}

	//This method checks for the existence of a ApplicationConfiguration object.  If it exists then it will update
	//fields, other than value, with defaults.  If the object does not exist then it creates it setting all default values.
	@Transactional(readOnly=false)
	protected ApplicationConfiguration createOrUpdateApplicationConfig(ApplicationSetting code, 
            ApplicationSettingType group, String type, def configValue, int positionInGroup, 
            String subGroup) {
		// Get the application configuration if it exists
		ApplicationConfiguration applicationConfiguration = this.getApplicationConfiguration(code)
		if (!applicationConfiguration) {
			// Create it
			applicationConfiguration = ApplicationConfiguration."build${type}Instance"(code, group)
			applicationConfiguration.value = configValue
		}
		this.setAppConfigFields(applicationConfiguration, positionInGroup, subGroup, group, type)
		this.saveApplicationConfiguration(applicationConfiguration)
	}

	protected String getMessage(String code){
		return this.messageSource.getMessage(code, null, Locale.getDefault())
	}
		
}
