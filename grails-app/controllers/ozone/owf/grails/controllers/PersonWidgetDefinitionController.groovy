package ozone.owf.grails.controllers

import grails.converters.JSON
import grails.core.GrailsApplication

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.PersonWidgetDefinitionService
import ozone.owf.grails.services.WidgetDefinitionService


class PersonWidgetDefinitionController extends BaseOwfRestController {

    GrailsApplication grailsApplication

    PersonWidgetDefinitionService personWidgetDefinitionService

    WidgetDefinitionService widgetDefinitionService

    AccountService accountService

    def modelName = 'personWidgetDefinition'

    def show = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.show(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during show: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def list = {
        def statusCode
        def jsonResult
        try {
          def result = personWidgetDefinitionService.list(params)
          statusCode = 200
          jsonResult = result.personWidgetDefinitionList as JSON
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def listUserAndGroupWidgets = {
        def statusCode
        def jsonResult
        try {
          def result = widgetDefinitionService.listUserAndGroupWidgets(params)
          statusCode = 200
          jsonResult = result as JSON

          log.info("JSON Result: " + jsonResult);
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def create = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.create(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during create: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def update = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.update(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during update: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def delete = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.delete(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during delete: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def bulkDeleteAndUpdate = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.bulkDeleteAndUpdate(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during bulkDeleteAndUpdate: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def bulkUpdate = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.bulkUpdate(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during bulkUpdate: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def bulkDelete = {
        def statusCode
        def jsonResult
        try {
            def result = personWidgetDefinitionService.bulkDelete(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during bulkDelete: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def dependents = {

        def jsonResult
        try {
            def result = personWidgetDefinitionService.getDependents(params)

            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)

        }

        renderResult(jsonResult)
    }

    def listPersonWidgetDefinitions = {
        def statusCode
        def jsonResult
        try {

            def result = personWidgetDefinitionService.listForAdminPendingWidgets(params)
            statusCode = 200
            jsonResult = [success:result.success, results: result.results, data : result.data] as JSON
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during listPersonWidgetDefinitions: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def myWidgets() {
        def user = accountService.getLoggedInUser()
        def models = personWidgetDefinitionService.myWidgets(user)
        render ([success: true, results: models.size(), data : models*.asJSON()] as JSON)
    }
}
