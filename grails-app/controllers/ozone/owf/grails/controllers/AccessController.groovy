package ozone.owf.grails.controllers

import static javax.servlet.http.HttpServletResponse.*

import grails.converters.JSON
import org.codehaus.groovy.grails.commons.GrailsApplication


class AccessController extends BaseOwfRestController {

    def accessService
    GrailsApplication grailsApplication

    def checkAccess = {
        renderResult((accessService.checkAccess(params)) as JSON, SC_OK)
    }

    def getConfiguration = {
    	def result = grailsApplication.config.owf.dataguard
    	renderResult(result as JSON, SC_OK)
    }
}
