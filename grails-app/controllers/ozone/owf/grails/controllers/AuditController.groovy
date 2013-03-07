package ozone.owf.grails.controllers

import grails.converters.JSON


class AuditController extends BaseOwfRestController {
    
    def auditService

    def logMessage = {
        renderResult((auditService.logMessage(params)) as JSON, 200)
    }
}
