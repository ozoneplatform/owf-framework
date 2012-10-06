package ozone.owf.grails.controllers

class ContextController {

    def index = {
        render text: request.contextPath
    }
}
