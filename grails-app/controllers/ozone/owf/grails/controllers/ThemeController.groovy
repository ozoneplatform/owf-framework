package ozone.owf.grails.controllers

import grails.converters.JSON


class ThemeController extends BaseOwfRestController {
	
	def themeService

	def getImageURL = {
		def imageURL = themeService.getImageURL(params)
		redirect(uri:imageURL)
	}

    def getAvailableThemes = { 
        renderResult((themeService.getAvailableThemes()) as JSON, 200)
    }
}
