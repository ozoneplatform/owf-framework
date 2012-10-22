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

    def index = {
        
        def dashboardsResult,
            widgetsResult,
            dashboards = [],
            widgets = [];
        StopWatch stopWatch = null;

        if (log.isInfoEnabled()) {
          stopWatch = new StopWatch();
          stopWatch.start();
          log.info("Executing dashboardService: list");
        }

        try {
            dashboardsResult =  dashboardService.list(params)
            dashboards =  dashboardsResult.dashboardList;
        }
        catch (OwfException owe) {
            handleError(owe)
        }

        if (log.isInfoEnabled()) {
            log.info("Executed dashboardService: list in " + stopWatch);
            stopWatch.reset();
            log.info("Executing personWidgetDefinitionService: widgetList");
        }

        try {
            widgetsResult = personWidgetDefinitionService.list(params);
            widgets = widgetsResult.personWidgetDefinitionList;
        }
        catch(OwfException owe) {
            handleError(owe)
        }
        
        if (log.isInfoEnabled()) {
            log.info("Executed personWidgetDefinitionService: widgetList in " + stopWatch);
        }

        render(view: "index", model: [
            dashboards: dashboards,
            widgets: widgets
        ]);



    }
}
