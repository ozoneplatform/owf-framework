package ozone.owf.grails.controllers

import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch
import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Person
import ozone.owf.grails.OwfExceptionTypes

class WidgetController extends BaseOwfRestController {
	
    def accountService
    def widgetDefinitionService
    def administrationService
    def personWidgetDefinitionService

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
            def widgetDefinitionList = result.widgetDefinition.collect{ serviceModelService.createServiceModel(it) }
            jsonResult = [success:result.success, data : widgetDefinitionList] as JSON
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
            log.info("Executing WidgetController: list");
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
            log.info("Executed WidgetController: list in "+stopWatch);
        }
    }
	
    def createOrUpdate =
    {
        def jsonResult
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: createOrUpdate");
        }
        try
        {
            def result = widgetDefinitionService.createOrUpdate(params)     
            jsonResult=[msg: result as JSON, status: 200]
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

            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)

        }
		
        renderResult(jsonResult)
		
        if (log.isInfoEnabled()) {
            log.info("Executed widgetDefinitionService: delete in "+stopWatch);
        }
    }

//    def bulkDelete = {
//
//        def jsonResult
//        StopWatch stopWatch = null;
//
//        if (log.isInfoEnabled()) {
//            stopWatch = new StopWatch();
//            stopWatch.start();
//            log.info("Executing widgetDefinitionService: bulkDelete");
//        }
//        try
//        {
//            def result = widgetDefinitionService.bulkDelete(params)
//
//            jsonResult = [msg: result as JSON, status: 200]
//        }
//        catch (Exception e) {
//            jsonResult = handleError(e)
//
//        }
//
//        renderResult(jsonResult)
//
//        if (log.isInfoEnabled()) {
//            log.info("Executed widgetDefinitionService: bulkDelete in "+stopWatch);
//        }
//    }

    def saveWidgetLoadTime = {

      def jsonResult
      StopWatch stopWatch = null;

      if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing widgetDefinitionService: saveWidgetLoadTime");
      }
      try
      {
          def result = widgetDefinitionService.saveWidgetLoadTime(params)

          jsonResult = [msg: result as JSON, status: 200]
      }
      catch (Exception e) {
          jsonResult = handleError(e)

      }

      renderResult(jsonResult)

      if (log.isInfoEnabled()) {
          log.info("Executed widgetDefinitionService: saveWidgetLoadTime in "+stopWatch);
      }
    }
    
    def export = {
        def result
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetDefinitionService: export");
        }
        try {
            def filename = params.filename ? params.filename : "widget_descriptor"

            //Set content-disposition so browser is expecting a file
            response.setHeader("Content-disposition", "attachment; filename=" + filename + ".html")

            def widgetDescriptor = widgetDefinitionService.export(params)
            response.outputStream << widgetDescriptor.newInputStream()
        }
        catch (Exception e) {
            //Set content-disposition back to text to relay the error
            response.setHeader("Content-disposition", "")

            result = handleError(e)
            renderResult(result)
        }
        
        if (log.isInfoEnabled()) {
            stopWatch.stop();
            log.info("Executed widgetDefinitionService: export in " + stopWatch);
        }
    }
}
