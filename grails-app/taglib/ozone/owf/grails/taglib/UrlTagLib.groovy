package ozone.owf.grails.taglib

class UrlTagLib {

    static namespace = 'owfUrl'
    
    def fullUrlWithContext = { attrs ->
        // just add slashes where we need them and replace doubles, but not have the http:
        out << "${request.scheme}://" + "${request.serverName}:${request.serverPort}/${request.contextPath ?: ''}/".replaceAll(/\/{2,}/,'/')
    }
}
