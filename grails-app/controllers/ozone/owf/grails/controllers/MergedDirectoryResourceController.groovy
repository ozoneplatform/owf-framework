package ozone.owf.grails.controllers

/*
 * This controller looks for the specified resource in two places.  
 * First, it looks in the external directory specified in params.fileRoot.
 * If not found, it then looks where the file would be if it were static
 * content from the war.
 * If neither location are successful, it returns a 404
 */
class MergedDirectoryResourceController {

    def mergedDirectoryResourceService

    def get = {
        def resource = mergedDirectoryResourceService.getResource(
            params.fileRoot, 
            params.urlRoot,
            params.subPath)

        log.debug("Got Resource: ${resource}")

        if (resource) {
            log.debug("Resource Exists")

            def contentType = servletContext.getMimeType(params.subPath)


            //hack to get around GRAILS-1223
            if (contentType == "text/html") {
                render(contentType: contentType, text: resource.file.text)
            }
            else {
                response.contentType = contentType
                
                response.outputStream << resource.file.readBytes()
                response.outputStream.flush()
            }
        }
        else
            render(status: 404, 
             text: "Resource not found: ${params.urlRoot}${params.subPath}".encodeAsHTML())
    }

}
