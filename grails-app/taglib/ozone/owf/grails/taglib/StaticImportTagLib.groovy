package ozone.owf.grails.taglib

class StaticImportTagLib {
    
    static namespace = 'owfImport'
    
    // TODO: DRY up these calls, lots of duplication
    
    // javascript from an external library, stored in js-lib    
    def jsLibrary = { attrs ->
        if (attrs['lib'] == null || attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a lib and resource attribute to use this tag")
        def version = (attrs['version'] == null) ? '' : "-"+attrs['version']
        def link = g.createLinkTo(dir: "js-lib/${attrs['lib']}${version}", file: attrs['resource']+".js", base: '.')
        out << "<script type='text/javascript' src='${link}'></script>"
    }
    
    // external css included with a javascript library
    def cssLibrary = {attrs ->
        if (attrs['lib'] == null || attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a lib and resource attribute to use this tag")
        def version = (attrs['version'] == null) ? '' : "-"+attrs['version']
        def link = g.createLinkTo(dir: "js-lib/${attrs['lib']}${version}", file: attrs['resource']+".css")
        out << "<link rel='stylesheet' type='text/css' href='${link}' />"
        
    }
    
    // external files included with a javascript library
    def fileLibrary = {attrs -> 
        if (attrs['lib'] == null || attrs['resource'] == null || attrs['version'] == null) 
            throw new UnsupportedOperationException("You must have a lib, version and resource attribute to use this tag")
        def dir = "js-lib/${attrs['lib']}-${attrs['version']}"
        out << g.createLinkTo(dir:dir, file: attrs['resource'])
    }
    
    def fileLibraryOwf = {attrs -> 
    	if (attrs['resource'] == null) 
    		throw new UnsupportedOperationException("You must have a resource attribute to use this tag")
    	def path = (attrs['path']  == null) ? '' : "/" + attrs['path']
	    def dir = g.createLinkTo(dir: "${path}", file: attrs['resource'])
	    out << dir
	}
    
    // css files developed for owf, in the /css folder
    def cssOwf = {attrs ->
        if (attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a resource attribute to use this tag")
        def path = (attrs['path']  == null) ? '' : "/" + attrs['path']
        def link = g.createLinkTo(dir: "css${path}", file: attrs['resource']+".css")
        out << "<link rel='stylesheet' type='text/css' href='${link}' />"
    }
    
    // javascript files developed for owf, in the /js folder
    def jsOwf = { attrs ->
        def pathToRoot = attrs['pathToRoot'] == null ? '.' : attrs['pathToRoot']
        if(pathToRoot.size() > 1) {

            if(pathToRoot.getAt( pathToRoot.size() - 1 ) == '/') {
                pathToRoot = pathToRoot.substring(0, pathToRoot.size() - 1);
            }
        }
        if (attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a resource attribute to use this tag")

        def path = (attrs['path']  == null) ? '' : "/" + attrs['path']
        def link = g.createLinkTo(dir: "js${path}", file: attrs['resource']+".js", base: pathToRoot)
        out << "<script type='text/javascript' src='${link}'></script>"
    }
    
    // to get javascript files stored under a specific dashboard directory
    def jsDashboard = { attrs ->
        if (attrs['dashboard'] == null || attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a dashboard and resource attribute to use this tag")
        def path = (attrs['path']  == null) ? '' : "/" + attrs['path']
        def link = g.createLinkTo(dir: "${attrs['dashboard']}/js${path}", file: attrs['resource']+".js")
        out << "<script type='text/javascript' src='${link}'></script>"
    }
    
    // for any javascript in owf
    def js = { attrs ->
        if (attrs['resource'] == null) 
            throw new UnsupportedOperationException("You must have a resource attribute to use this tag")
        def path = (attrs['path']  == null) ? '' : "/" + attrs['path']
        def link = g.createLinkTo(dir: path, file: attrs['resource']+".js")
        out << "<script type='text/javascript' src='${link}'></script>"
    }

}
