package ozone.owf.grails.controllers

import grails.converters.JSON
import org.apache.commons.lang.time.StopWatch
import ozone.owf.grails.OwfException

/**
 * User controller.
 */
class IndexController {
    def dashboardService;
    def personWidgetDefinitionService;
    def preferenceService;

    def index = {
        render(view: "index")
    }
}
