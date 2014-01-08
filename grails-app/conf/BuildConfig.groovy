import grails.util.Environment
import org.apache.ivy.util.url.CredentialsStore
import org.apache.ivy.plugins.resolver.*
import org.apache.ivy.core.settings.IvySettings

System.setProperty "ivy.checksums", ""
grails.project.plugins.dir="${basedir}/plugins"
//grails.work.dir='work'

grails.config.base.webXml="file:///${basedir}/src/resources/web_no_cas.xml"
// cas stuff added via the ozone-deploy plugin

coverage {
	exclusions = [
            "**/org/apache/log4j/**",
            "changelog*/**"
    ]
    xml = true
    enabledByDefault = false
}

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

private org.apache.ivy.plugins.resolver.DependencyResolver createLocalResolver()
{
    def localResolver = new FileSystemResolver()
    localResolver.local = true
    localResolver.name = "localResolver"
    localResolver.m2compatible = false
    localResolver.addIvyPattern("${userHome}/.ivy2/local/[organisation]/[module]/ivy-[revision].xml")
    localResolver.addArtifactPattern("${userHome}/.ivy2/local/[organisation]/[module]/[type]s/[artifact]-[revision].[ext]")
    def ivySettings = new IvySettings()
    ivySettings.defaultInit()
    localResolver.settings = ivySettings
    return localResolver
}
private org.apache.ivy.plugins.resolver.DependencyResolver createOfflineResolver()
{
    def localResolver = new FileSystemResolver()
    def repo_loc = System.getProperty('OFFLINE_REPO')
    localResolver.local = true
    localResolver.name = "offlineResolver"
    localResolver.m2compatible = false
    localResolver.addIvyPattern("${repo_loc}/[organisation]/[module]/ivys/ivy-[revision].xml")
    localResolver.addIvyPattern("${repo_loc}/[organisation]/[module]/ivy-[revision].xml")
    localResolver.addArtifactPattern("${repo_loc}/[organisation]/[module]/[type]s/[artifact]-[revision].[ext]")
    def ivySettings = new IvySettings()
    ivySettings.defaultInit()
    localResolver.settings = ivySettings
    return localResolver
}
private def createIvySvnResolver()
{
    def url = 'https://www.owfgoss.org/svn/repos/ozone/ivy-repo/no-namespace'
    def urlResolver = new URLResolver()
    urlResolver.setName('ivysvnresolver')
    urlResolver.addIvyPattern("${url}/[organisation]/[module]/ivys/ivy-[revision].xml")
    urlResolver.addIvyPattern("${url}/[organisation]/[module]/ivy-[revision].xml")
    urlResolver.addArtifactPattern("${url}/[organisation]/[module]/[type]s/[artifact]-[revision].[ext]")
    def ivySettings = new IvySettings()
    ivySettings.defaultInit()
    urlResolver.settings = ivySettings
    CredentialsStore.INSTANCE.addCredentials("Password Required by Subversion", 'www.owfgoss.org', "owf-build", '0wf-bu1!d')

    //println "OWF USING ivy svn resolver:${urlResolver}"
    return urlResolver
}
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

      exclude(name: "js-lib/ext-4.0.7/ext-all-debug-w-comments.js")
      exclude(name: "js-lib/ext-4.0.7/ext-all-dev.js")
      exclude(name: "js-lib/ext-4.0.7/ext-dev.js")
      exclude(name: "js-lib/ext-4.0.7/build/**")
      exclude(name: "js-lib/ext-4.0.7/builds/**")
      exclude(name: "js-lib/ext-4.0.7/deploy/**")
      exclude(name: "js-lib/ext-4.0.7/docs/**")
      exclude(name: "js-lib/ext-4.0.7/examples/**")
      exclude(name: "js-lib/ext-4.0.7/jsbuilder/**")
      exclude(name: "js-lib/ext-4.0.7/overview/**")
      exclude(name: "js-lib/ext-4.0.7/pkgs/**")
      exclude(name: "js-lib/ext-4.0.7/resources/themes/images/access/**")
      exclude(name: "js-lib/ext-4.0.7/resources/themes/images/gray/**")
      exclude(name: "js-lib/ext-4.0.7/src/**")
      exclude(name: "js-lib/ext-4.0.7/welcome/**")

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
                    'WEB-INF/lib/jetty-6.1.21.jar',
                    'WEB-INF/lib/jetty-naming-6.1.21.jar',
                    'WEB-INF/lib/jetty-plus-6.1.21.jar',
                    'WEB-INF/lib/jetty-util-6.1.21.jar',
                    "WEB-INF/lib/owf-security-extras-${config.owf.security.rev}.zip",
                    "WEB-INF/lib/owf-security-project-${config.owf.security.rev}.zip",
                    'WEB-INF/lib/servlet-api-2.5-20081211.jar',
                    'WEB-INF/lib/jasper-compiler-5.5.15.jar',
                    'WEB-INF/lib/jasper-compiler-jdt-5.5.15.jar',
                    'WEB-INF/lib/jasper-runtime-5.5.15.jar',
                    'WEB-INF/lib/jsp-api-2.0-6.1.21.jar',
                    'WEB-INF/lib/standard-1.1.2.jar',
                    'WEB-INF/lib/core-3.1.1.jar',
                    'WEB-INF/lib/log4j-1.2.9.jar',
                    'WEB-INF/lib/spring-expression-3.0.1.RELEASE.jar',
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
//      grailsCentral()
//
//      mavenLocal()
//      mavenCentral()

	mavenRepo "https://www.owfgoss.org/nexus/content/groups/public"
 	resolver createLocalResolver()
        def offline = System.getProperty('OFFLINE_REPO')
      if (offline) {
            println "OWF USING OFFLINE_REPO ${offline}"
            resolver createOfflineResolver()
        }
      else{
          //println "OWF USING LOCAL REPO"
           // resolver createIvySvnResolver()
        }
    }
    dependencies {
        // specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.

	runtime ('log4j:apache-log4j-extras:1.1', 'net.sf.ehcache:ehcache-jgroupsreplication:1.4')

      //only include these jdbc drivers for non production
      if (Environment.current != Environment.PRODUCTION) {
        runtime 'com.oracle:ojdbc14:10.2.0.1.0'
        runtime 'mysql:mysql-connector-java:5.1.6'
        runtime 'net.sourceforge.jtds:jtds:1.2.4'
        runtime 'postgresql:postgresql:8.4-701.jdbc3'
      }

		// HTTP Client
        compile('org.apache.httpcomponents:httpcore:4.1.1', 'org.apache.httpcomponents:httpclient:4.1.1')
        runtime('org.apache.httpcomponents:httpcore:4.1.1', 'org.apache.httpcomponents:httpclient:4.1.1')

        //need ant for createWebBundles.jar
        runtime 'org.apache.ant:ant:1.7.0'
        compile('access:access:1.0')

        runtime 'com.thetransactioncompany:cors-filter:1.8'
    }
    plugins {
        compile 'org.ozoneplatform:aml-commons-security:3.20'
        compile 'org.ozoneplatform:aml-commons-appconfig:0.1'
        compile 'org.ozoneplatform:aml-commons-auditing:0.1'
    }
}
