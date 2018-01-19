package ozone.owf.grails.controllers

import org.springframework.core.io.Resource

import org.apache.commons.io.IOUtils
import org.apache.http.HttpStatus

import ozone.owf.grails.services.MergedDirectoryResourceService

/**
 * This controller looks for the specified resource in two places.
 * First, it looks in the external directory specified in params.fileRoot.
 * If not found, it then looks where the file would be if it were static
 * content from the war.
 * If neither location are successful, it returns a 404
 */
class MergedDirectoryResourceController {

    MergedDirectoryResourceService mergedDirectoryResourceService

    def findThemeResource(String subPath) {
        if (errors.hasErrors()) {
            render status: HttpStatus.SC_NOT_FOUND,
                    text: "Resource not found: ${request.requestURI}".encodeAsHTML()
            return
        }

        renderResource(mergedDirectoryResourceService.findThemeResource(subPath), subPath)
    }

    def findJavascriptPluginResource(String subPath) {
        if (errors.hasErrors()) {
            render status: HttpStatus.SC_NOT_FOUND,
                    text: "Resource not found: ${request.requestURI}".encodeAsHTML()
            return
        }

        renderResource(mergedDirectoryResourceService.findPluginResource(subPath), subPath)
    }

    def findHelpResource(String subPath) {
        if (errors.hasErrors()) {
            render status: HttpStatus.SC_NOT_FOUND,
                    text: "Resource not found: ${request.requestURI}".encodeAsHTML()
            return
        }

        renderResource(mergedDirectoryResourceService.findHelpResource(subPath), subPath)
    }

    private void renderResource(Resource resource, String subPath) {
        if (!resource) {
            render status: HttpStatus.SC_NOT_FOUND,
                    text: "Resource not found: ${request.requestURI}".encodeAsHTML()
            return
        }

        response.contentType = servletContext.getMimeType(subPath)

        int cachePeriod = grailsApplication.config.getProperty('grails.resources.cachePeriod', Integer, 600)
        response.setHeader('Cache-Control', "max-age=$cachePeriod")

        IOUtils.copy(resource.inputStream, response.outputStream)
        response.outputStream.flush()
    }

}
