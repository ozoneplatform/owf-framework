package ozone.owf.grails.controllers
import grails.converters.JSON
import org.ozoneplatform.appconfig.client.controller.AbstractApplicationConfigurationController
import ozone.owf.grails.services.OwfApplicationConfigurationService


class ApplicationConfigurationController extends AbstractApplicationConfigurationController{

	
	@Override
	void doRender(def model){
		render model as JSON
	}
}
