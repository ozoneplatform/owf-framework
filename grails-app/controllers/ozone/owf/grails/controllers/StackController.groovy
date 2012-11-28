package ozone.owf.grails.controllers

import ozone.owf.grails.OwfException
import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch

class StackController extends BaseOwfRestController {
    
    def stackService

    def list = {
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing stackService: list - params:$params");
        }
        try {
            def result = stackService.list(params)
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
            stopWatch.stop();
            log.info("Executed stackService: list in " + stopWatch);
        }
    }
    
    def createOrUpdate = {
        def jsonResult
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing stackService: createOrUpdate");
        }
        try {
            def result = stackService.createOrUpdate(params)
            jsonResult = [msg: result as JSON, status: 200 ]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }
        
        renderResult(jsonResult)
        
        if (log.isInfoEnabled()) {
            stopWatch.stop();
            log.info("Executed stackService: createOrUpdate in " + stopWatch);
        }
        
    }
    
    def delete = {
        def jsonResult
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing stackService: delete");
        }
        try {
            def result = stackService.delete(params)
            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }
        
        renderResult(jsonResult)
        
        if (log.isInfoEnabled()) {
            stopWatch.stop();
            log.info("Executed stackService: delete in " + stopWatch);
        }
    }
    
    def export = {
        def result
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing stackService: export");
        }
        try {
            def filename = params.filename ? params.filename :"stack_descriptor"

            //Set content-disposition so browser is expecting a file
            response.setHeader("Content-disposition", "attachment; filename=" + filename + ".html")

            def stackDescriptor = stackService.export(params)
            response.outputStream << stackDescriptor.newInputStream()
        }
        catch (Exception e) {
            //Set content-disposition back to text to relay the error
            response.setHeader("Content-disposition", "")

            result = handleError(e)
            renderResult(result)
        }
        
        if (log.isInfoEnabled()) {
            stopWatch.stop();
            log.info("Executed stackService: export in " + stopWatch);
        }
    }

    def importStack = {
        def jsonResult
        StopWatch stopWatch = null;
        
        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing stackService: import");
        }
        try {
            def result = stackService.importStack(params)
            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }

        renderResult(jsonResult)
        
        if (log.isInfoEnabled()) {
            stopWatch.stop();
            log.info("Executed stackService: import in " + stopWatch);
        }
    }
}
