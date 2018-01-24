package ozone.owf.grails.controllers

import grails.compiler.GrailsCompileStatic

import ozone.owf.grails.services.ConfigurationService


@GrailsCompileStatic
class AboutController {

    ConfigurationService configurationService

    def index() {
        Map model = [description: configurationService.aboutDescription,
                     notice     : configurationService.aboutNotice,
                     version    : configurationService.applicationVersion]

        render view: "/about", model: model
    }

}
