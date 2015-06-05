import com.codahale.metrics.servlets.MetricsServlet
import grails.util.Holders
import org.grails.plugins.metrics.groovy.HealthCheckServletContextInitializer
import org.grails.plugins.metrics.groovy.MetricsServletContextInitializer

import javax.servlet.ServletContextEvent

/*
 * Copyright 2013 Jeff Ellis
 */
class YammerMetricsGrailsPlugin {

	// the plugin version
    def version = "3.0.1-2"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.0.3 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views",
            "web-app/**"
    ]

    def author = "Jeff Ellis"
    def authorEmail = "codemonkey@ellises.us"
    def title = "Grails plugin to package Coda Hale's metrics jars"
    def description = '''\\
This plugin provides an easy way for grails apps to create application health checks and
metrics (timers, meters, counters, histograms, etc) from Coda Hale's metrics package

Pulls in the following metrics jars :
   * metrics-core
   * metrics-healthchecks
   * metrics-servlets (wired to the /metrics end point for the app).

See the source code documentation on Github for more details.
'''

    // URL to the plugin's documentation
    def documentation = "http://github.com/jeffellis/grails-yammer-metrics"

    def doWithWebDescriptor = { xml ->

        if(application.config.metrics.servletEnabled!=false){
            def count

            // It doesn't seem like context-params are where Coda meant for these to be defined based on the
            // MetricsServlet.ContextListener, but this is where MetricsServlet actually reads them from.  Need to
            // file an issue or at least verify this is what he meant.

            count = xml.'context-param'.size()
            if(count > 0) {

                def contextParamElement = xml.'context-param'[count - 1]

                def unit = Holders.getConfig().metrics.servlet.rateUnit
                if(unit instanceof String) {
                    contextParamElement + {
                        'context-param' {
                            'param-name'(MetricsServlet.RATE_UNIT)
                            'param-value'(unit)
                        }
                    }
                }

                unit = Holders.getConfig().metrics.servlet.durationUnit
                if(unit instanceof String) {
                    contextParamElement + {
                        'context-param' {
                            'param-name'(MetricsServlet.DURATION_UNIT)
                            'param-value'(unit)
                        }
                    }
                }

            }

            count = xml.'servlet'.size()
            if(count > 0) {

                def servletElement = xml.'servlet'[count - 1]

                servletElement + {
                    'servlet' {
                        'servlet-name'("Metrics")
                        'servlet-class'("com.codahale.metrics.servlets.AdminServlet")
                    }
                }
                println "***\nMetrics servlet injected into web.xml"
            }

            count = xml.'servlet-mapping'.size()
            if(count > 0) {
                def servletUrlPattern = application.config.metrics.servletUrlPattern
                if (servletUrlPattern.isEmpty()) {
                    servletUrlPattern = '/metrics/*'
                }
                def servletMappingElement = xml.'servlet-mapping'[count - 1]
                servletMappingElement + {

                    'servlet-mapping' {
                        'servlet-name'("Metrics")
                        'url-pattern'(servletUrlPattern)
                    }
                }
                println "Metrics Admin servlet-mapping (for $servletUrlPattern) injected into web.xml\n***"
            }
        } else{
            println "Skipping Metrics Admin servlet mapping\n***"
        }
    }

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def doWithApplicationContext = { applicationContext ->

        // Create registries for HealthChecks and Metrics here, and stuff them into the servlet context.  Don't
        // wait for the regular listener lifecycle because that happens after application BootStrap.groovy. Since
        // we're doing this here, there is no need to wire them as real listeners.

        ServletContextEvent event = new ServletContextEvent(applicationContext.servletContext)
        HealthCheckServletContextInitializer healthCheckServletContextInitializer = new HealthCheckServletContextInitializer()
        healthCheckServletContextInitializer.contextInitialized(event)

        MetricsServletContextInitializer metricsServletContextInitializer = new MetricsServletContextInitializer()
        metricsServletContextInitializer.contextInitialized(event)

    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}
