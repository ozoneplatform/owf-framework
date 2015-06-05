package org.grails.plugins.metrics.groovy

import com.codahale.metrics.health.HealthCheckRegistry
import com.codahale.metrics.servlets.HealthCheckServlet

class HealthCheckServletContextInitializer extends HealthCheckServlet.ContextListener {

    @Override
    protected HealthCheckRegistry getHealthCheckRegistry() {
        return HealthChecks.registry
    }
}
