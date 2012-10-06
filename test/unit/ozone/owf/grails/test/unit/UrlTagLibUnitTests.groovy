package ozone.owf.grails.test.unit

import grails.test.*
import ozone.owf.grails.taglib.UrlTagLib

class UrlTagLibUnitTests extends TagLibUnitTestCase {
      public UrlTagLibUnitTests() {
        super(UrlTagLib.class)
      }

       protected void setUp() {
           super.setUp()
           mockTagLib(UrlTagLib)
       }

       protected void tearDown() {
           super.tearDown()
       }

       void testFullUrlWithContextWithNoSlashAtEnd() {
           def scheme = "blah"
           def serverName = "googley"
           def serverPort = "34543"
           def contextPath = "/moogley"
           def myRequest = new Expando(scheme: scheme, serverName: serverName, serverPort: serverPort, contextPath : contextPath)
           tagLib.metaClass.request = myRequest
           
           def expectedUrlString = "${scheme}://${serverName}:${serverPort}${contextPath}/"
           
           assertEquals expectedUrlString, tagLib.fullUrlWithContext([:]).toString()
       }
       
       void testFullUrlWithContextWithSlashAtEnd() {
           def scheme = "blah"
           def serverName = "googley"
           def serverPort = "34543"
           def contextPath = "/moogley/"
           def myRequest = new Expando(scheme: scheme, serverName: serverName, serverPort: serverPort, contextPath : contextPath)
           tagLib.metaClass.request = myRequest
           
           def expectedUrlString = "${scheme}://${serverName}:${serverPort}${contextPath}"
           
           assertEquals expectedUrlString, tagLib.fullUrlWithContext([:]).toString()
           
       }
       
       void testFullUrlWithContextNoContext() {
           def scheme = "blah"
           def serverName = "googley"
           def serverPort = "34543"
           def contextPath = null
           def myRequest = new Expando(scheme: scheme, serverName: serverName, serverPort: serverPort, contextPath : contextPath)
           tagLib.metaClass.request = myRequest
           
           def expectedUrlString = "${scheme}://${serverName}:${serverPort}/"
           
           assertEquals expectedUrlString, tagLib.fullUrlWithContext([:]).toString()
       }
       
       void testFullUrlWithContextWhereContextIsSlash() {
           def scheme = "blah"
           def serverName = "googley"
           def serverPort = "34543"
           def contextPath = "/"
           def myRequest = new Expando(scheme: scheme, serverName: serverName, serverPort: serverPort, contextPath : contextPath)
           tagLib.metaClass.request = myRequest
           
           def expectedUrlString = "${scheme}://${serverName}:${serverPort}/"
           
           assertEquals expectedUrlString, tagLib.fullUrlWithContext([:]).toString()
       }
       
       void testFullUrlWithContextWhereContextDoesNotStartWithSlash() {
           def scheme = "blah"
           def serverName = "googley"
           def serverPort = "34543"
           def contextPath = "moogley"
           def myRequest = new Expando(scheme: scheme, serverName: serverName, serverPort: serverPort, contextPath : contextPath)
           tagLib.metaClass.request = myRequest
           
           def expectedUrlString = "${scheme}://${serverName}:${serverPort}/${contextPath}/"
           
           assertEquals expectedUrlString, tagLib.fullUrlWithContext([:]).toString()
       }
}
