import grails.util.Environment
import org.apache.ivy.util.url.CredentialsStore
import org.apache.ivy.plugins.resolver.*
import org.apache.ivy.core.settings.IvySettings

System.setProperty "ivy.checksums", ""
grails.project.plugins.dir="${basedir}/plugins"
//grails.work.dir='work'

grails.config.base.webXml="file:${basedir}/src/resources/web_no_cas.xml"
// cas stuff added via the ozone-deploy plugin

grails.project.dependency.resolver = "maven"

codenarc.reports = {
    AmlXmlReport('xml') {
        outputFile = 'target/CodeNarcReport.xml'
        title = 'App Mall OWF CodeNarc Report'
    }

    AmlHtmlReport('html') {
        outputFile = 'target/CodeNarcReport.html'
        title = 'App Mall OWF CodeNarc Report'
    }
}

codenarc.ruleSetFiles="file:grails-app/conf/CodeNarcRules.groovy"

        // Load some of our dependency info from ivy.properties.
    // This way we can keep our ant build and groovy build in sync

def props = new Properties()
new File("application.properties").withInputStream {
    stream -> props.load(stream)
}
def config = new ConfigSlurper().parse(props)

// This closure is passed the command line arguments used to start the
// war process.
grails.war.copyToWebApp = { args ->
  //certain dev files don't need to be in a production war
  if (Environment.current == Environment.PRODUCTION) {
    fileset(dir: "web-app") {

      exclude(name: "js-min/**")

      if (!System.properties.includeJsTests || !System.properties.includeJsTests.toString().toBoolean()) {
        exclude(name: "js-doh/**")
        exclude(name: "js-lib/dojo-release-*/**")
    }
  }
  }
  else {
    //not production include all files
    fileset(dir: "web-app") {
    }
  }
}

//these may be ant file patterns
def warExcludes = [
                    // this class is only used for development to simulate login so we don't need cas
                    // remove it from the war so it doesn't get out
                    'WEB-INF/classes/AutoLoginAccountService.class',

                    'WEB-INF/lib/*-sources.jar',
                    'WEB-INF/lib/*-javadoc.jar',
                    'WEB-INF/lib/jetty-*.jar',
                    'WEB-INF/lib/jetty-naming-*.jar',
                    'WEB-INF/lib/jetty-plus-*.jar',
                    'WEB-INF/lib/jetty-util-*.jar',
                    //"WEB-INF/lib/owf-security-extras-${config.owf.security.rev}.zip",
                    "WEB-INF/lib/owf-security-project-${config.owf.security.rev}.zip",
                    'WEB-INF/lib/servlet-api-*.jar',
                    'WEB-INF/lib/jasper-compiler-*.jar',
                    'WEB-INF/lib/jasper-compiler-jdt-*.jar',
                    'WEB-INF/lib/jasper-runtime-*.jar',
                    'WEB-INF/lib/jsp-api-*.jar',
                    'WEB-INF/lib/standard-*.jar',
                    'WEB-INF/lib/core-*.jar',
                    //'WEB-INF/lib/log4j-*.jar',
                    //'WEB-INF/lib/spring-expression-*.jar',
                    'plugins/**',

                    '**/.gitignore'

]
grails.war.resources = { stagingDir ->
    delete(dir: "${stagingDir}") {
        warExcludes.each {exclude ->
            include(name: "${exclude}")
        }
    }
}

grails.project.dependency.resolution = {

    // inherit Grails' default dependencies
    inherits( "global" ) {
        // uncomment to disable ehcache
        // excludes 'ehcache'
	       excludes 'slf4j'
         excludes 'commons-logging'
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'

    repositories {
        grailsPlugins()
        grailsHome()
        mavenLocal()
        mavenCentral()
        mavenRepo 'http://maven.restlet.org'
        //mavenRepo 'http://nexus.opencast.org/nexus/content/groups/public'
        grailsCentral()
    }
    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.
/*
        runtime ('log4j:apache-log4j-extras:1.1', 'net.sf.ehcache:ehcache-jgroupsreplication:1.4')

        //only include these jdbc drivers for non production
        if (Environment.current != Environment.PRODUCTION) {
            runtime 'com.oracle:ojdbc14:10.2.0.1.0'
            runtime 'mysql:mysql-connector-java:5.1.6'
            runtime 'net.sourceforge.jtds:jtds:1.2.4'
            runtime 'postgresql:postgresql:8.4-701.jdbc3'
        }
*/

        //need ant for createWebBundles.jar
        runtime 'org.apache.ant:ant:1.7.1'

/*
        compile('opensymphony:oscache:2.4') {

            excludes 'commons-logging', 'servlet-api', 'spring-security-core'
        }

        compile('org.springframework.security:spring-security-core:3.2.4.RELEASE',
                'org.springframework.security:spring-security-web:3.2.4.RELEASE') {

            excludes 'commons-logging', 'commons-lang'
        }
*/

        //only include these jdbc drivers for non production
        if (Environment.current != Environment.PRODUCTION) {
            runtime 'mysql:mysql-connector-java:5.1.6'
            runtime 'net.sourceforge.jtds:jtds:1.2.4'
            runtime 'postgresql:postgresql:8.4-701.jdbc3'
        }

        runtime 'hsqldb:hsqldb:1.8.0.10',
                'log4j:apache-log4j-extras:1.1',
                'net.sf.ehcache:ehcache-jgroupsreplication:1.4',
                'net.sourceforge.jtds:jtds:1.2.4'

        //These dependendencies can no longer be found in maven. They are
        //now included directly in the lib folder
        /*
        compile 'org.igniterealtime.smack:smack:3.3.1',
                'org.igniterealtime.smack:smackx:3.3.1'
        */

        compile 'org.apache.httpcomponents:httpcore:4.1.1',
                'org.apache.httpcomponents:httpclient:4.1.1'

        compile("org.ozoneplatform:ozone-security:${config.owf.security.rev}") {
            excludes([group: 'org.springframework'])
        }
    }
    plugins {
        compile ':database-migration:1.4.0'
        compile ':hibernate:3.6.10.14'
        compile 'org.ozoneplatform:ozone-appconfig:0.9'
        compile 'org.ozoneplatform:ozone-auditing:1.3.1'
        compile ':codenarc:0.20'
        compile ':pretty-time:2.1.3.Final-1.0.1'
        build   ':tomcat:8.0.22'
        compile ':ui-performance:1.2.2'
        compile ':build-test-data:2.1.2'
        compile ':quartz:1.0.1'
        runtime ':cors:1.1.8' // OP-3931
        compile ':yammer-metrics:3.0.1-2'

        compile('org.ozoneplatform:ozone-messaging:1.19') {
            excludes([group: 'org.igniterealtime.smack'])
        }
    }
}
