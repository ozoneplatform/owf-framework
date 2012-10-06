package ozone.owf.grails.controllers

import grails.converters.JSON

class HelpController extends BaseOwfRestController {
	
	def helpService

    def getFiles = { 
    	def tree = helpService.getHelpTree()
    	render tree as JSON
    }
}
