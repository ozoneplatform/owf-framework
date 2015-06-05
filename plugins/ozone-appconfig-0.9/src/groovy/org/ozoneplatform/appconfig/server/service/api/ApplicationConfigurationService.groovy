package org.ozoneplatform.appconfig.server.service.api
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting

interface ApplicationConfigurationService {

	ApplicationConfiguration saveApplicationConfiguration(ApplicationConfiguration item)

	ApplicationConfiguration getApplicationConfigurationById(Long id)

	ApplicationConfiguration getApplicationConfiguration(ApplicationSetting setting)
		
	List<ApplicationConfiguration> getAllApplicationConfigurations()

	List<ApplicationConfiguration> getApplicationConfigurationsByGroupName(String groupName)
				
	//This method is used to evaluate boolean configuration settings
	boolean is(ApplicationSetting setting)
	
	//This method is used to evaluate string configuration settings
	String valueOf(ApplicationSetting setting)

	//This will validate the configuration object
	void validate(ApplicationConfiguration applicationConfiguration)
	
}
