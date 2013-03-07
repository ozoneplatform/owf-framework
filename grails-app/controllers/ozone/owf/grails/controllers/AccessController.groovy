package ozone.owf.grails.controllers

import grails.converters.JSON


class AccessController extends BaseOwfRestController {
    
    def accessService
	
    def checkAccess = {
        renderResult((accessService.checkAccess(params)) as JSON, 200)
    }
}
