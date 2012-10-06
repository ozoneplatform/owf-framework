import grails.util.GrailsUtil

class OzoneDeployGrailsPlugin {
    // the plugin version
    def version = "0.1"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.1.1 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    // TODO Fill in these fields
    def author = ""
    def authorEmail = ""
    def title = "Ozone Deploy"
    def description = '''\\
Plugin to configure ozone for deployment.
'''

    // URL to the plugin's documentation
    def documentation = "http://grails.org/OzoneDeploy+Plugin"

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def doWithWebDescriptor = { webXml ->
        // add cas unless environment testUser1 or testAdmin1
        def user = System.properties.user
        if(['testUser1','testAdmin1'].contains(user)) {
            println "\nNot adding CAS config to the web.xml.\n"
        } else {
            println "\nAdding CAS config to the web.xml.  Requires owf-security jar\n"
            //add listener for jasig client
            def contextParam = webXml.'context-param'
            contextParam[contextParam.size() - 1] + {
                /*
                'listener' {
                    'listener-class' ('org.jasig.cas.client.session.SingleSignOutHttpSessionListener')
                }
                */
                'filter' {
                    'filter-name' ('springSecurityFilterChain')
                    'filter-class' ('org.springframework.web.filter.DelegatingFilterProxy')
                }
                /*
                'filter' {
                    'filter-name' ('CAS Single Sign Out Filter')
                    'filter-class' ('org.jasig.cas.client.session.SingleSignOutFilter')
                }
                */
                'filter' {
                    'filter-name' ('AuditLogging')
                    'filter-class' ('ozone.owf.filter.HttpRequestLoggingFilter')
                }
                'filter-mapping' {
                    'filter-name' ('springSecurityFilterChain')
                    'url-pattern' ('/*')
                }
                /*
                'filter-mapping' {
                    'filter-name' ('CAS Single Sign Out Filter')
                    'url-pattern' ('/*')
                }
                */
                'filter-mapping' {
                    'filter-name' ('AuditLogging')
                    'url-pattern' ('/*')
                }
            }
        }
        
        //TODO: move filter mapping stuff in here
    }

    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}
