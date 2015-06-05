class PrettyTimeGrailsPlugin {
    // the plugin version
    def version = "2.1.3.Final-1.0.1"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.0 > *"
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    // TODO Fill in these fields
    def title = "Pretty-time plugin" // Headline display name of the plugin
    def author = "Cazacu Mihai"
    def authorEmail = "cazacugmihai@gmail.com"
    def description = 'A plugin that allows you to display human readable, relative timestamps.'

    // URL to the plugin's documentation
    def documentation = "https://github.com/cazacugmihai/grails-pretty-time/blob/master/README.md"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
    def license = "APACHE"

    // Any additional developers beyond the author specified above.
    def developers = [
        [ name: "Janusz Slota", email: "janusz.slota@nixilla.com" ]
    ]

    // Location of the plugin's issue tracker.
    def issueManagement = [ system: "Github", url: "https://github.com/cazacugmihai/grails-pretty-time/issues" ]

    // Online location of the plugin's browseable source code.
    def scm = [ url: "https://github.com/cazacugmihai/grails-pretty-time" ]
}
