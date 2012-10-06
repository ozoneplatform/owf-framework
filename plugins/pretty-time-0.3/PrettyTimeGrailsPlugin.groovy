class PrettyTimeGrailsPlugin {

    def version = '0.3'
    def dependsOn = [:]
    def pluginExcludes = [
        'lib/joda-time-1.6.jar',
        'grails-app/conf', 
        'grails-app/views/**', 
        'grails-app/web-app'] 

    def author = 'Cazacu Mihai'
    def authorEmail = 'cazacugmihai@yahoo.com'
    def title = 'Pretty-time plugin'
    def description = 'A plugin that allows you to display human readable, relative timestamps.'
    def documentation = 'http://grails.org/PrettyTime+Plugin'

}
