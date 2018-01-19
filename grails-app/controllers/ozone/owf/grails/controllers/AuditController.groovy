package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.services.AuditService


class AuditController extends BaseOwfRestController {
    
    AuditService auditService

    def logMessage = {
        renderResult((auditService.logMessage(params)) as JSON, 200)
    }
}
