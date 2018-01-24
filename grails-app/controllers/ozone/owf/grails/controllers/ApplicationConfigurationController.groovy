package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.services.OwfApplicationConfigurationService
import org.ozoneplatform.appconfig.client.controller.AbstractApplicationConfigurationController
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration


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
		owfApplicationConfigurationService.validateApplicationConfiguration(applicationConfiguration)
	}

    @Override
    public void doDecorate(configAsMap) {
        if(!configAsMap instanceof Map || !configAsMap.code)
            return

        def prefix = "application.configuration.${configAsMap.code}"
        configAsMap.description = messageSource.getMessage("${prefix}.description", null, Locale.default)
        configAsMap.title = messageSource.getMessage("${prefix}.label", null, Locale.default)
        configAsMap.help = messageSource.getMessage("${prefix}.help", null, Locale.default)
    }
}
