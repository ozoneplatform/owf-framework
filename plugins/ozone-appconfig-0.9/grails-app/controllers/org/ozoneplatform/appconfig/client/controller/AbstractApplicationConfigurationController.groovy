package org.ozoneplatform.appconfig.client.controller

import grails.validation.ValidationException
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.validate.ConfigurationValidator
import org.ozoneplatform.appconfig.event.ConfigurationSaveFailedEvent
import org.ozoneplatform.appconfig.server.service.api.ApplicationConfigurationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.MessageSource
import org.springframework.stereotype.Component
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.ApplicationEventPublisherAware

@Component
abstract class AbstractApplicationConfigurationController implements ApplicationEventPublisherAware {

    @Autowired
    @Qualifier("applicationConfigurationServiceImpl")
    ApplicationConfigurationService applicationConfigurationService

    @Autowired
    MessageSource messageSource

    @Autowired
    List<ConfigurationValidator> validators

    ApplicationEventPublisher applicationEventPublisher

    abstract void doRender(def model)

    abstract void doSave(ApplicationConfiguration applicationConfiguration)

    //TODO this should be deprecated in favor of the injected validation layer
    abstract void doValidate(ApplicationConfiguration applicationConfiguration)

    abstract void doDecorate(configAsMap)

    static defaultAction = "show"

    //This is the default action and the "show" view is rendered
    def show = {
    }

    def list = {
        //If there is a query string, get rid of it
        String groupName = params.groupName?.tokenize('\\?')?.head()

        //If no group name is specified then return all
        List<ApplicationConfiguration> configs = groupName ? applicationConfigurationService.getApplicationConfigurationsByGroupName(groupName) :
                applicationConfigurationService.getAllApplicationConfigurations()

        def model = []
        configs.each { config ->
            def map = config.asMap()
            validate(config)
            def errors = collectErrors(config)
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
        def errors

        //Parse the json
        def json = request?.JSON

        //Grab the applicationConfiguration item to save
        def applicationConfiguration = applicationConfigurationService.getApplicationConfigurationById(params.id as Long)

        //Set the value of the object
        applicationConfiguration.value = json?.value?.trim()

        validate(applicationConfiguration)
        errors = collectErrors(applicationConfiguration)

        if(errors) {
            doRender(['success' : false, 'message' : errors])
            return
        }

        try {
            doSave(applicationConfiguration)
        } catch(ValidationException re) {
            log.error re.message
        }

        errors = collectErrors(applicationConfiguration)

        if(errors) {
            applicationEventPublisher.publishEvent(new ConfigurationSaveFailedEvent(this, applicationConfiguration))
            doRender(['success' : false, 'message' : errors])
        } else {
            def map = applicationConfiguration?.asMap()
            if (map) {
                doDecorate(map)
            }
            doRender(map)
        }
    }

    private List<String> collectErrors(ApplicationConfiguration applicationConfiguration) {
        applicationConfiguration.errors.fieldErrors.collect {
            messageSource.getMessage(it.code, it.arguments, it.defaultMessage, Locale.getDefault())
        }
    }

    private void validate(applicationConfiguration) {
        //TODO this step should be deprecated in favor of the injected validation layer
        //Validate the updates to this configuration object
        doValidate(applicationConfiguration)

        validators*.validateConfiguration(applicationConfiguration)
    }
}
