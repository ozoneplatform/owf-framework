package ozone.owf.grails.controllers

import grails.converters.JSON
import org.codehaus.groovy.grails.commons.GrailsApplication


class ThemeController extends BaseOwfRestController {
    
    def themeService
    GrailsApplication grailsApplication

    def getImageURL = {
        def appContext = grailsApplication.mainContext
        def imageURL = themeService.getImageURL(params)
        //redirect(uri:imageURL)

        def image = appContext.getResource(imageURL)
        response.outputStream << image.inputStream
        response.outputStream.flush()
    }

    def getAvailableThemes = { 
        renderResult((themeService.getAvailableThemes()) as JSON, 200)
    }
}
