package ozone.owf.grails.controllers

import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch
import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.OwfException

class PersonWidgetDefinitionController extends BaseOwfRestController {

    GrailsApplication grailsApplication
  	def personWidgetDefinitionService
  	def widgetDefinitionService
	def modelName = 'personWidgetDefinition'

	def show = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: show");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: show in "+stopWatch);
		}
	}

	def widgetList = {
		def jsonResult
		def statusCode
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: widgetList");
        }
		try {
			def result = personWidgetDefinitionService.list(params)
			statusCode = 200
			jsonResult = [success:result.success, results: result.count, rows : result.personWidgetDefinitionList] as JSON
		}
		catch(OwfException owe) {
			handleError(owe)
			statusCode = owe.exceptionType.normalReturnCode
			jsonResult = "Error during widgetList: " + owe.exceptionType.generalMessage + " " + owe.message
		}

		renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed personWidgetDefinitionService: widgetList in "+stopWatch);
        }
	}

	def list = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: list");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: list in "+stopWatch);
		}
	}

	def listUserAndGroupWidgets = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: listUserAndGroupWidgets");
        }
        try {
          def result = widgetDefinitionService.listUserAndGroupWidgets(params)
          statusCode = 200
          jsonResult = result as JSON

          log.info("JSON Result: " + jsonResult);

//		  jsonResult = jsonResult.data
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed preferenceService: list in "+stopWatch);
        }
	}

	def create = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: create");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: create in "+stopWatch);
		}
	}

	def update = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: update");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: update in "+stopWatch);
		}
	}

	def delete = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: delete");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: delete in "+stopWatch);
		}
	}

 	def bulkDeleteAndUpdate = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: bulkDeleteAndUpdate");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: bulkDeleteAndUpdate in "+stopWatch);
		}
  	}

  	def bulkUpdate = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: bulkUpdate");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: bulkUpdate in "+stopWatch);
		}
  	}

  	def bulkDelete = {
		def statusCode
		def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing personWidgetDefinitionService: bulkDelete");
        }
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

		if (log.isInfoEnabled()) {
        	log.info("Executed personWidgetDefinitionService: bulkDelete in "+stopWatch);
		}
  	}

    def dependents = {

        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing PersonwidgetDefinitionService: dependents");
        }
        try
        {
            def result = personWidgetDefinitionService.getDependents(params)

            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)

        }

        renderResult(jsonResult)

        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: dependents in "+stopWatch);
        }
    }

    def listPersonWidgetDefinitions = {
      def statusCode
      def jsonResult
      StopWatch stopWatch = null;

      if (log.isInfoEnabled()) {
        stopWatch = new StopWatch();
        stopWatch.start();
        log.info("Executing personWidgetDefinitionService: listPersonWidgetDefinitions");
      }
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

      if (log.isInfoEnabled()) {
          log.info("Executed personWidgetDefinitionService: listPersonWidgetDefinitions in "+stopWatch);
      }
    }
}
