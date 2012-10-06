package ozone.owf.grails.controllers

import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch
import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.OwfException

class WidgetTypeController extends BaseOwfRestController {
	def modelName = 'widgetType'
	def widgetTypeService
	def list = {
		def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetTypeService: list");
        }
        try {
          def result = widgetTypeService.list(params)
          statusCode = 200
          jsonResult = result as JSON
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
        }
		
        renderResult(jsonResult, statusCode)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetTypeService: list in "+stopWatch);
        }
	}
}