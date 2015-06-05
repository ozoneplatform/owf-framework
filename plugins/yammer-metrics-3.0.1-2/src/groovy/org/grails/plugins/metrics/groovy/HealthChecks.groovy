package org.grails.plugins.metrics.groovy

import com.codahale.metrics.health.HealthCheck
import com.codahale.metrics.health.HealthCheckRegistry

class HealthChecks {

    private static final HealthCheckRegistry registry = new HealthCheckRegistry()

    /**
     * Register the supplied healthcheck with the supplied name.
     */
    static void register( String name, HealthCheck healthCheck ) {
        registry.register(name, healthCheck)
    }

}
