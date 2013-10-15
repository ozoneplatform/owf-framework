grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"

def springSecurityVersion = '3.0.5.RELEASE'

grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // uncomment to disable ehcache
        // excludes 'ehcache'
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsPlugins()
        grailsHome()
        mavenLocal()
        mavenRepo "https://www.owfgoss.org/nexus/content/groups/public"
        grailsCentral()
        mavenCentral()
    }
    dependencies {
        compile('opensymphony:oscache:2.4') {

            excludes 'commons-logging', 'servlet-api', 'spring-security-core'
        }

        compile("org.springframework.security:spring-security-core:${springSecurityVersion}",
            "org.springframework.security:spring-security-cas-client:${springSecurityVersion}",
            "org.springframework.security:spring-security-web:${springSecurityVersion}",
            "org.springframework.security:spring-security-ldap:${springSecurityVersion}",
            "org.springframework.security:spring-security-config:${springSecurityVersion}") {

            excludes 'commons-logging', 'commons-lang'
        }
    }
    plugins {
        compile(':maven-publisher:0.8.1') {
            export = false
        }
    }
}