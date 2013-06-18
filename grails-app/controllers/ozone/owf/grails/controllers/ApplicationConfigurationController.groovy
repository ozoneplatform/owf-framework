package ozone.owf.grails.controllers
import grails.converters.JSON
import org.ozoneplatform.appconfig.client.controller.AbstractApplicationConfigurationController
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration;

import ozone.owf.grails.services.OwfApplicationConfigurationService


class ApplicationConfigurationController extends AbstractApplicationConfigurationController{

	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	@Override
	void doRender(def model){
		render model as JSON
	}

	@Override
	public void doSave(ApplicationConfiguration applicationConfiguration) {
		owfApplicationConfigurationService.saveApplicationConfiguration(applicationConfiguration)
	}

	@Override
	public void doValidate(ApplicationConfiguration applicationConfiguration) {
		owfApplicationConfigurationService.validate(applicationConfiguration)
	}
	
}
