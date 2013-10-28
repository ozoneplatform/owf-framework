package ozone.owf.grails.controllers

import grails.converters.JSON
import org.codehaus.groovy.grails.commons.GrailsApplication


class AccessController extends BaseOwfRestController {
    
    def accessService
    GrailsApplication grailsApplication
	
    def checkAccess = {
        renderResult((accessService.checkAccess(params)) as JSON, 200)
    }

    def getConfiguration = {
    	def result = grailsApplication.config.owf.dataguard
    	renderResult(result as JSON, 200)
    }
}
