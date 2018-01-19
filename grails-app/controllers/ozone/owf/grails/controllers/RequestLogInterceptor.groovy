package ozone.owf.grails.controllers

import groovy.transform.CompileStatic

import grails.artefact.Interceptor


@CompileStatic
class RequestLogInterceptor implements Interceptor {

    RequestLogInterceptor() {
        matchAll()
    }

    boolean before() { true }

    boolean after() {
        if (log.isInfoEnabled()) {
            String method = getRequest().getMethod()
            String uri = getRequest().getRequestURI()

            String controller = getControllerName()
            String action = getActionName()

            int status = getResponse().getStatus()

            String message = "$status $method $uri"
            if (controller && action) {
                message += " : $controller - $action"
            }

            Throwable throwable = getThrowable()
            if (throwable)
                log.info("$message Error: ", throwable)
            else
                log.info(message)
        }

        true
    }

    void afterView() { }

}
