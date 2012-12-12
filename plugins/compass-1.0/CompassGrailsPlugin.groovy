class CompassGrailsPlugin {
    // the plugin version
    def version = "1.0"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "1.3.7 > *"
    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging

    def author = "Jason Wagner"
    def authorEmail = "jason@tensorwrench.com"
    def title = "Compass Plugin for Grails"
    def description = '''\\
Provides access to the compass plugin for grails using the jruby-complete environment.
'''

 // URL to the plugin's documentation
    def documentation = "http://grails.org/Compass+Plugin"

    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def doWithWebDescriptor = { webXml -> }

    def doWithDynamicMethods = { ctx ->}

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
