grails.project.dependency.resolution = {
    inherits "global" // inherit Grails' default dependencies
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'

    repositories {
        grailsHome()
        mavenCentral()
    }

    dependencies {
        test('org.seleniumhq.selenium:selenium-java:2.8.0') {
            excludes 'xml-apis' // GROOVY-3356
        }
    }
}
