package ozone.owf.grails.test.unit

import grails.test.*
import ozone.owf.grails.taglib.StaticImportTagLib

class StaticImportTagLibUnitTests extends TagLibUnitTestCase {
    
    def g //grails namespace for createLinkTo tag
    def context = "ctx"
    def lib
    def version
    def resource
    def path
    def dashboard

    public StaticImportTagLibUnitTests() {
      super(StaticImportTagLib.class)
    }

    protected void setUp() {
        super.setUp()
        
        lib = "ilib"
        version = "iversion"
        resource = "resource"
        path = "ipath"
        dashboard = "idashboard"
        
        g = new Expando(createLinkTo : {map -> return context+"/"+map.dir+"/"+map.file }) // default implementation of createLinkTo
        
        tagLib.metaClass.g = g
    }
    
    protected void tearDown() {
        super.tearDown()
    }
    
    void testJsLibraryWithVersion() {
        // should add /js-lib and .js plus handle the hyphen version
        assertEquals javascriptTag("${context}/js-lib/${lib}-${version}/${resource}.js"),
                     tagLib.jsLibrary(lib: lib, version: version, resource: resource).toString()
    }
    
    void testJsLibraryWithoutVersion() {
        // should add /js-lib and .js with no hyphen after the lib
        assertEquals javascriptTag("${context}/js-lib/${lib}/${resource}.js"),
                     tagLib.jsLibrary(lib: lib, resource: resource).toString()
    }
    
    void testJsLibraryWithoutLibThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.jsLibrary(resource: "nomatter")
        })
    }
    
    void testJsLibraryWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.jsLibrary(lib: "nomatter")
        })
    }
    
    void testCssLibraryWithVersion() {
        // should add /js-lib and .js plus handle the hyphen version
        assertEquals cssTag("${context}/js-lib/${lib}-${version}/${resource}.css"),
                     tagLib.cssLibrary(lib: lib, version: version, resource: resource).toString()
    }
    
    void testCssLibraryWithoutVersion() {
        // should add /js-lib and .js plus handle the hyphen version
        assertEquals cssTag("${context}/js-lib/${lib}/${resource}.css"),
                     tagLib.cssLibrary(lib: lib, resource: resource).toString()
    }
    
    void testCssLibraryWithoutLibThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.cssLibrary(resource: "nomatter")
        })
    }
    
    void testCssLibraryWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.cssLibrary(lib: "nomatter")
        })
    }
    
    void testFileLibrary() {
        assertEquals "${context}/js-lib/${lib}-${version}/${resource}", 
            tagLib.fileLibrary(lib: lib, version: version, resource: resource).toString()
    }
    
    void testFileLibraryWithoutLibThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.fileLibrary(version: version, resource: resource)
        })
    }
    
    void testFileLibraryWithoutVersionThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.fileLibrary(lib: lib, resource: resource)
        })
    }
    
    void testFileLibraryWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.fileLibrary(lib: lib, version: version)
        })
    }
    
    void testCssOwfWithPath() {
        assertEquals cssTag("${context}/css/${path}/${resource}.css"),
           tagLib.cssOwf(path: path, resource: resource).toString()
    }
    
    void testCssOwfWithoutPath() {
        assertEquals cssTag("${context}/css/${resource}.css"),
           tagLib.cssOwf(resource: resource).toString()
    }
    
    void testCssOwfWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.cssOwf(path: path)
        })
    }
    
    void testJsOwfWithPath() {
        assertEquals javascriptTag("${context}/js/${path}/${resource}.js"),
            tagLib.jsOwf(path: path, resource: resource).toString()
    }
    
    void testJsOwfWithoutPath() {
        assertEquals javascriptTag("${context}/js/${resource}.js"),
            tagLib.jsOwf(resource: resource).toString()
    }
    
    void testJsOwfWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.jsOwf(path: path)
        })
    }
    
    void testJsDashboardWithPath() {
        assertEquals javascriptTag("${context}/${dashboard}/js/${path}/${resource}.js"),
            tagLib.jsDashboard(dashboard: dashboard, path: path, resource: resource).toString()
    }
    
    void testJsDashboardWithoutPath() {
        assertEquals javascriptTag("${context}/${dashboard}/js/${resource}.js"),
            tagLib.jsDashboard(dashboard: dashboard, resource: resource).toString()
    }
    
    void testJsDashboardWithoutDashboardThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.jsDashboard(resource: resource)
        })
    }
    
    void testJsDashboardWithoutResourceThrowsError() {
        shouldFail(UnsupportedOperationException, {
            tagLib.jsDashboard(dashboard: dashboard)
        })
    }
    
    // Used to construct the expected script tag.  Doesn't make the test less fragile but does make it easier to refactor.
    private def javascriptTag(src) {
        "<script type='text/javascript' src='${src}'></script>"
    }

    // Used to construct the expected script tag.  Doesn't make the test less fragile but does make it easier to refactor.
    private def cssTag(href) {
        "<link rel='stylesheet' type='text/css' href='${href}' />"
    }
}
