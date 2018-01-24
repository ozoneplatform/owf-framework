package ozone.owf.grails.controllers

import groovy.transform.CompileStatic

import grails.converters.JSON

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.WidgetTypeService


@CompileStatic
class WidgetTypeController extends BaseOwfRestController {

    WidgetTypeService widgetTypeService

    def modelName = 'widgetType'

    def list() {
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing widgetTypeService: list");
        }

        int statusCode
        Object jsonResult

        try {
            def result = widgetTypeService.list(params)
            statusCode = 200
            jsonResult = result as JSON
        } catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during list: $owe.exceptionType.generalMessage $owe.message"
        }

        renderResult(jsonResult, statusCode)

        if (log.isInfoEnabled()) {
            log.info("Executed widgetTypeService: list in " + stopWatch);
        }
    }

}
