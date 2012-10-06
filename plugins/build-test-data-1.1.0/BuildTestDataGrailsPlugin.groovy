import grails.util.GrailsUtil
import grails.buildtestdata.TestDataConfigurationHolder
import org.apache.commons.logging.LogFactory
import grails.buildtestdata.BuildTestDataService
import grails.buildtestdata.TestDataConfigurationHolder
import grails.buildtestdata.handler.NullableConstraintHandler

class BuildTestDataGrailsPlugin {
    // the plugin version
    def version = "1.1.0"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.2.0 > *"
    def dependsOn = [:]
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]
    def loadAfter = ['services']

    def author = "Ted Naleid and Joe Hoover"
    def authorEmail = "contact@naleid.com" 
    def title = "Build Test Data Plugin"
    def description = '''\\
Enables the easy creation of test data by automatic inspection of constraints.  Any properties that are required have
their constraints examined and a value is automatically provided for them.

It is intended to be used in integration tests to enable the test creator to specify the values that are under test, but
so that they can ignore the other values not under test and not need to worry about creating dummy data that is not
pertinent.
'''

    def documentation = "http://bitbucket.org/tednaleid/grails-test-data/wiki/Home"

    def doWithDynamicMethods = { applicationContext ->
        def buildTestDataService = new BuildTestDataService()

        log.debug("Loading config file (if present)")
        TestDataConfigurationHolder.loadTestDataConfig()

        if (TestDataConfigurationHolder.isPluginEnabled()) {
            log.debug('build-test-data plugin enabled, decorating domain classes with build methods')

            application.domainClasses.each { domainClass ->
                log.debug("decorating $domainClass with build-test-data 'build' methods")
                buildTestDataService.decorateWithMethods(domainClass)
            }

            log.debug("done decorating domain classes with 'build' methods")
        } else {
            log.warn("build-test-data plugin is disabled in this environment")
        }
    }
}
