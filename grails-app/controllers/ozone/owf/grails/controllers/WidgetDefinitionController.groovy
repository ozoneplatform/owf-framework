package ozone.owf.grails.controllers

import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch
import ozone.owf.grails.OwfException

class WidgetDefinitionController extends BaseOwfRestController {
	
    def accountService
    def widgetDefinitionService
	
    def modelName = 'widgetDefinition'
	
    def show = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;
	
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: show");
        }
        try {
            def result = widgetDefinitionService.show(params)
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
            log.info("Executed widgetDefinitionService: show in "+stopWatch);
        }
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
          def result = widgetDefinitionService.list(params)
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
            log.info("Executing widgetDefinitionService: createOrUpdate");
        }
        try {
            def result = widgetDefinitionService.createOrUpdate(params)
            jsonResult = [msg: getJsonResult(result, modelName, params), status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }
		
        renderResult(jsonResult)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: createOrUpdate in "+stopWatch);
        }
    }
	
    def update = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: createOrUpdate");
        }
        try {
            def result = widgetDefinitionService.createOrUpdate(params)
            jsonResult = [msg: getJsonResult(result, modelName, params), status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }
		
        renderResult(jsonResult)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: createOrUpdate in "+stopWatch);
        }
    }
	
    def delete = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: delete");
        }
        try {
            def result = widgetDefinitionService.delete(params)
            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e)
        {
            jsonResult = handleError(e)
        }
		
        renderResult(jsonResult)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: delete in "+stopWatch);
        }
    }

    def bulkDelete = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: bulkDelete");
        }
        try {
            def result = widgetDefinitionService.bulkDelete(params)
            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }
		
        renderResult(jsonResult)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: bulkDelete in "+stopWatch);
        }
    }
    
    def dependents = {
        
        def jsonResult
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: dependents");
        }
        try
        {
            def result = widgetDefinitionService.getDependents(params)
            
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
}