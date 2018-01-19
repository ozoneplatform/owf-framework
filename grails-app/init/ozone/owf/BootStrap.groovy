package ozone.owf

import grails.converters.JSON
import grails.converters.XML
import grails.core.GrailsApplication
import grails.util.Environment
import grails.util.Holders

import org.springframework.context.ApplicationContext

import org.apache.log4j.helpers.Loader
import org.apache.log4j.xml.DOMConfigurator
import org.grails.web.util.GrailsApplicationAttributes

import ozone.owf.cache.OwfMessageCache
import ozone.owf.devel.DefaultDataLoader
import ozone.owf.devel.DevelopmentDataLoader
import ozone.owf.grails.services.ConfigurationService
import ozone.owf.grails.services.OwfApplicationConfigurationService
import ozone.owf.grails.services.OwfMessagingService
import ozone.owf.grails.web.converters.marshaller.json.ServiceModelObjectMarshaller
import ozone.owf.grails.web.converters.marshaller.xml.ServiceModelObjectMarshaller as ServiceModelObjectMarshallerXML


class BootStrap {

    GrailsApplication grailsApplication

    ConfigurationService configurationService

    DevelopmentDataLoader developmentDataLoader

    DefaultDataLoader defaultDataLoader

    OwfApplicationConfigurationService owfApplicationConfigurationService

    OwfMessageCache owfMessageCache

    OwfMessagingService owfMessagingService

    def init = { servletContext ->
        try {
            setup()
        }
        catch (Exception ex) {
            ex.printStackTrace()
            System.exit(1)
        }
    }

    def destroy = {
    }

    private void setup() {
        println "Starting application bootstrap [${Environment.current.name}]"

        // Register aliases
        grailsApplication.mainContext.registerAlias('owfApplicationConfigurationService', 'ozoneConfiguration')

        // Register custom marshallers
        JSON.registerObjectMarshaller(new ServiceModelObjectMarshaller())
        XML.registerObjectMarshaller(new ServiceModelObjectMarshallerXML())


        if (isDevelopment() || isDbCreationEnabled()) {
            println "Initializing database with default data"
            defaultDataLoader.initialize()
        }

        if (isDevelopment() || (isDbCreationEnabled() && configurationService.isExampleWidgetPluginEnabled())) {
            developmentDataLoader.initializeExampleWidgets()
        }

        if (isDevelopment()) {
            developmentDataLoader.initializeDevelopmentData()
        }

        /*
        if (!isTest()) {
            owfApplicationConfigurationService.checkThatConfigsExist()
            owfApplicationConfigurationService.createRequired()
        }
        */

        // Enable messaging and/or notifications
        if (configurationService.notificationsEnabled) {
            owfMessagingService.startListening()
            owfMessageCache.setExpiration(configurationService.notificationQueryInterval)
        }

        println 'Finished application bootstrap'
    }

    private def initLog4j() {
        def log4jConfigure
        URL url = Loader.getResource('owf-override-log4j.xml')
        String fileName = url.toString()
        if (fileName.startsWith('file:/')) {


            File file
            try {
                file = new File(url.toURI())
            } catch (URISyntaxException e) {
                file = new File(url.getPath())
            }

            //File file = new File(url.toURI())

            //if the file does not exist -- this really shouldn't happen
            //set url to null thus causing the default log4j file to be loaded
            if (!file.exists()) {
                url = null
            }

            log4jConfigure = {
                ApplicationContext apc = servletContext.getAttribute(GrailsApplicationAttributes.APPLICATION_CONTEXT)
                def watchTime = grailsApplication.config.owf.log4jWatchTime
                println "########## Found owf-override-log4j.xml at: ${file.getAbsolutePath()} ${watchTime}"
                DOMConfigurator.configureAndWatch(file.getAbsolutePath(), watchTime ? watchTime : 180000)
            }
        }
        else {
            url = null
        }

        if (!url) {
            url = Loader.getResource('owf-log4j.xml')
            log4jConfigure = {
                println "########## Found owf-log4j.xml at: ${url.toString()}"
                DOMConfigurator.configure(url)
            }
        }

        //execute closure
        if (url) {
            try {
                log4jConfigure()
            } catch (Throwable t) {
                println "########## Error loading log4j configuration ${t.getMessage()}"
                t.printStackTrace()
            }
        }
    }

    private static boolean isTest() {
        Environment.current == Environment.TEST
    }

    private static boolean isDevelopment() {
        Environment.current == Environment.DEVELOPMENT
    }

    private static boolean isProduction() {
        Environment.current == Environment.PRODUCTION
    }

    private static boolean isDbCreationEnabled() {
        System.properties["owf.db.init"] != null
    }

}
