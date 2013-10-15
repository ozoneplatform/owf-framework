package org.ozoneplatform.appconfig.client.controller

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.MessageSource
import org.springframework.stereotype.Component

@Component
abstract class AbstractApplicationConfigurationController {
	
    @Autowired
    @Qualifier("applicationConfigurationServiceImpl")
    ApplicationConfigurationService applicationConfigurationService

    @Autowired
    MessageSource messageSource

    abstract void doRender(def model)

    abstract void doSave(ApplicationConfiguration applicationConfiguration)

    abstract void doValidate(ApplicationConfiguration applicationConfiguration)

    abstract void doDecorate(configAsMap)

    static defaultAction = "show"

    //This is the default action and the "show" view is rendered
    def show = {
    }

    def list = {
        def configs

        //If no group name is specified then return all
        if(!params?.groupName){
            configs = applicationConfigurationService.getAllApplicationConfigurations()
        } else {
            //If there is a query string, get rid of it
            def groupName = params?.groupName.split("\\?")[0]
            configs = applicationConfigurationService.getApplicationConfigurationsByGroupName(groupName)
        }

        def model = []
        configs.each { config ->
            def map = config.asMap()
            def errors = getGetConfigErrors(config)
            if (errors) map.errors = errors
            doDecorate(map)
            model << map
        }
        doRender(model)
    }

    //This is invoked when a GET  to /applicationConfiguration/{id}
    def get = {

        //Get the object
        def applicationConfiguration = applicationConfigurationService.getApplicationConfigurationById(params.id as Long);
        def map = applicationConfiguration?.asMap()
        if (map) {
            doDecorate(map)
        }
        doRender(map)
    }

    //This is invoked when there is a PUT to /applicationConfiguration/{id}
    //The value is parsed from the json string and the applicationConfiguration object is updated and saved
    def update = {

        //Parse the json
        def json = request?.JSON

        //Grab the applicationConfiguration item to save
        def applicationConfiguration = applicationConfigurationService.getApplicationConfigurationById(params.id as Long)

        //Set the value of the object
        applicationConfiguration.value = json?.value?.trim()

        //Validate the updates to this configuration object
        def errors = getGetConfigErrors(applicationConfiguration)

        //If the config item is toggling franchise store, the value is moving to true, then do isValidStoreSetting checks
        if(errors) {
            def map = ['success' : false, 'message' : errors]
            doRender(map)
        } else {

            //Do the save
            doSave(applicationConfiguration)

            //Now render
            def map = applicationConfiguration?.asMap()
            if (map) {
                doDecorate(map)
            }
            doRender(map)
        }
    }

    def getGetConfigErrors(applicationConfiguration) {
        doValidate(applicationConfiguration)
        def errors
        if(applicationConfiguration.errors.hasErrors()) {
            errors = applicationConfiguration.errors.getFieldErrors().collect {
                messageSource.getMessage(it.code, it.arguments, it.defaultMessage, Locale.getDefault())
            }
        }
        errors
    }
}
