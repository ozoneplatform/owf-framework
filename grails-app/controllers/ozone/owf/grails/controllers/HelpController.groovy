package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.services.HelpService


class HelpController extends BaseOwfRestController {
	
	HelpService helpService

    def getFiles = { 
    	def tree = helpService.getHelpTree()
    	render tree as JSON
    }
}
