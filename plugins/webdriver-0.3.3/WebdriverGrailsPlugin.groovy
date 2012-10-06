class WebdriverGrailsPlugin {
    // the plugin version
    def version = "0.3.3"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.3.0 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]

    def loadAfter = ['functional-test']

    def scopes = [excludes: 'war']

    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/**,web-app/**,scripts/GeneratePages.groovy"
    ]

    def author = "Rob Nielsen"
    def authorEmail = "rob@refactor.com.au"
    def title = "WebDriver Functional Testing Plugin"
    def description = '''Integrates WebDriver with grails to allow functional testing in both HtmlUnit and real browsers.'''

    // URL to the plugin's documentation
    def documentation = "https://bitbucket.org/refactor/grails-webdriver/wiki/Home"
}
