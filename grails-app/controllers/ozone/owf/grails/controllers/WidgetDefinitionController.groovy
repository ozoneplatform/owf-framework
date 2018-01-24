package ozone.owf.grails.controllers

import javax.servlet.http.HttpServletResponse

import grails.converters.JSON

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.MarketplaceService
import ozone.owf.grails.services.WidgetDefinitionService


class WidgetDefinitionController extends BaseOwfRestController {
	
    AccountService accountService

    WidgetDefinitionService widgetDefinitionService

    MarketplaceService marketplaceService
	
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
            statusCode = HttpServletResponse.SC_OK
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
          statusCode = HttpServletResponse.SC_OK
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
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: createOrUpdate");
        }
        try {
            def result = widgetDefinitionService.createOrUpdate(params)
            jsonResult = [msg: getJsonResult(result, modelName, params), status: HttpServletResponse.SC_OK]
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
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: createOrUpdate");
        }
        try {
            def result
            if (params?.addExternalWidgetsToUser) {
                result = marketplaceService.addExternalWidgetsToUser(params)
            } else {
                result = widgetDefinitionService.createOrUpdate(params)
            }
            jsonResult = [msg: getJsonResult(result, modelName, params), status: HttpServletResponse.SC_OK]
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
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: delete");
        }
        try {
            def result = widgetDefinitionService.delete(params)
            jsonResult = [msg: result as JSON, status: HttpServletResponse.SC_OK]
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
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: bulkDelete");
        }
        try {
            def result = widgetDefinitionService.bulkDelete(params)
            jsonResult = [msg: result as JSON, status: HttpServletResponse.SC_OK]
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
            
            jsonResult = [msg: result as JSON, status: HttpServletResponse.SC_OK]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
            
        }
        
        renderResult(jsonResult)
        
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: dependents in "+stopWatch);
        }
    }

    def hasMarketplace = {

        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: hasMarketplace");
        }
        try
        {
            def result = widgetDefinitionService.hasMarketplace()
            jsonResult = [msg: result as JSON, status: HttpServletResponse.SC_OK]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }

        renderResult(jsonResult)

        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: hasMarketplace in "+stopWatch);
        }

    }
	
	def groupOwnedWidget = {
		def ownedResult = widgetDefinitionService.groupOwnedWidget(params.widgetId, params.personId, params.isAdmin)
		
		render ([isOwnedByGroup:ownedResult] as JSON)
	}
}
