package ozone.owf.grails.controllers

import grails.converters.JSON
import org.grails.web.json.JSONArray

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.ConfigurationService
import ozone.owf.grails.services.PreferenceService


class PreferenceController extends BaseOwfRestController {

    PreferenceService preferenceService

    ConfigurationService configurationService

    def modelName = 'preference'

    def show = {
        def statusCode = 200
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing preferenceService: show");
        }
        try {
            params.namespace = params.prefNamespace

            def result = preferenceService.show(params)
            if (result?.success == true) {
                jsonResult = getJsonResult(result, modelName, params)
            }
            else {
                // Currently success always = true to the users
                jsonResult = [success: true, data: null] as JSON
            }
		}
		catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during show " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: show in " + stopWatch);
        }
    }

    def doesPreferenceExist = {
        def preferenceExist
        def statusCode

        try {
            params.namespace = params.prefNamespace
            def result = preferenceService.show(params)
            if (result.preference) {
                statusCode = 200
                preferenceExist = true
            }
            else {
                statusCode = 200
                preferenceExist = false
            }
		}
		catch(OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            preferenceExist = false
        }

        def jsonResult = [preferenceExist: preferenceExist, statusCode: statusCode] as JSON

        renderResult(jsonResult, statusCode)
    }

    def serverResources = {
        def result = [serverVersion: configurationService.applicationVersion]
        renderResult(result as JSON, 200)
    }

    def list = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing preferenceService: list");
        }
        try {
            params.namespace = params.prefNamespace
            def result = preferenceService.list(params)
            statusCode = 200
            def preferenceList = new JSONArray()
            result.preference.each { preferenceList.add(serviceModelService.createServiceModel(it)) }
			if (result.count != null)
			{
                jsonResult = [success: result.success, results: result.count, rows: preferenceList] as JSON
            }
			else
			{
                jsonResult = preferenceList as JSON
            }
		}
		catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: list in " + stopWatch);
        }
    }

    def create = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing preferenceService: create");
        }
        try {
            params.namespace = params.prefNamespace
            def result = preferenceService.create(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
		}
		catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during create: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: create in " + stopWatch);
        }
    }

    def update = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing preferenceService: update");
        }
        try {
            params.namespace = params.prefNamespace
            def result = preferenceService.update(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
		}
		catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during update: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: update in " + stopWatch);
        }
    }

    def delete = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing preferenceService: delete");
        }
        try {
            params.namespace = params.prefNamespace
            def result = preferenceService.delete(params)
            statusCode = 200
            jsonResult = getJsonResult(result, modelName, params)
		}
		catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during delete: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: delete in " + stopWatch);
        }
    }

//  	def bulkDelete = {
//		def statusCode
//		def jsonResult
//        StopWatch stopWatch = null;
//
//        if (log.isInfoEnabled()) {
//          stopWatch = new StopWatch();
//          stopWatch.start();
//          log.info("Executing preferenceService: bulkDelete");
//        }
//		try {
//			def result = preferenceService.bulkDelete(params)
//			statusCode = 200
//			jsonResult = getJsonResult(result, modelName, params)
//		}
//		catch (OwfException owe) {
//			handleError(owe)
//			statusCode = owe.exceptionType.normalReturnCode
//			jsonResult = "Error during bulkDelete: " + owe.exceptionType.generalMessage + " " + owe.message
//		}
//
//		renderResult(jsonResult, statusCode)
//
//		if (log.isInfoEnabled()) {
//        	log.info("Executed preferenceService: bulkDelete in "+stopWatch);
//		}
//  	}
}
