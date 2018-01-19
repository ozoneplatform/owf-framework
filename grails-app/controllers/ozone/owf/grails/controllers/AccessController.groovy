package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.services.AccessService
import ozone.owf.grails.services.ConfigurationService

import static javax.servlet.http.HttpServletResponse.SC_OK


class AccessController extends BaseOwfRestController {

    AccessService accessService

    ConfigurationService configurationService

    def checkAccess = {
        renderResult((accessService.checkAccess(params)) as JSON, SC_OK)
    }

    def getConfiguration = {
        def result = configurationService.getDataguardConfig()
        renderResult(result as JSON, SC_OK)
    }

}
