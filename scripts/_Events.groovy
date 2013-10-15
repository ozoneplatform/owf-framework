import groovy.xml.MarkupBuilder
import groovy.xml.NamespaceBuilder

//import grails.util.Metadata
//import org.mortbay.jetty.webapp.*
//import org.mortbay.jetty.handler.*

private compileStyleSheets = { dir ->
  def ant = new AntBuilder()   // create an antbuilder
  if (System.properties['os.name'].toLowerCase().contains('windows')) {
    ant.exec(
            failonerror: "true",
            dir: "${dir}/themes",
            executable: 'cmd') {

      arg(value: "/c")
      arg(value: "compile_all_themes.bat")
    }
  }
  else {
    ant.exec(
            failonerror: "true",
            dir: "${dir}/themes",
            executable: 'bash') {

      arg(value: "-l")
      arg(value: "compile_all_themes.sh")
    }
  }

  //delete cache files
  ant.delete(includeemptydirs:true) {
    fileset(dir:"${dir}") {
      include(name:"**/.sass-cache/**")
    }
  }

  println "finished compiling sass stylesheets"
}

private copyAppConfigFiles = {

    def libDir = "${basedir}/lib"
    def extractDest = "${libDir}/temp"
    def rev = metadata['appconfig.webclient.rev']
    def module = metadata['appconfig.webclient.module']
    def org = metadata['appconfig.webclient.org']
    def moduleFile = "${libDir}/${module}-${rev}.zip"
    def ivyFile = "${basedir}/temp-ivy.xml"

    def ant = new AntBuilder()
    ant.delete(file: ivyFile, quiet: true)
    new File(ivyFile).withWriter { writer ->
        def builder = new MarkupBuilder(writer)
        builder.'ivy-module'(version: '2.0') {
            info(organisation: 'ozone', module: 'owf')
            dependencies() {
                dependency(org: org, name: module, rev: rev, transitive: 'false') {
                    artifact(name: module, type: 'zip')
                }
            }
        }
    }

    def ivy = NamespaceBuilder.newInstance(ant, 'antlib:org.apache.ivy.ant')
    ivy.resolve(file: ivyFile, transitive: false)
    ivy.retrieve()

    ant.unzip(
        src: moduleFile,
        dest: extractDest,
        overwrite: "true"
    )

    ant.copy( todir: "${basedir}/web-app/js/components/admin/applicationConfiguration", overwrite: "true" ) {
        fileset( dir: "${extractDest}/js" )
    }

    ant.delete(includeemptydirs: true) {
        fileset(dir: extractDest)
        file(file: ivyFile)
        file(file: moduleFile)
    }
}

eventRunAppHttpsStart = {
  def baseWebDir = "${basedir}/web-app"

  if (!System.properties.skipSassCompile) {
    println "compiling sass stylesheets - ruby, compass, and sass must be installed"
    println "compiling stylesheets in web-app"
    compileStyleSheets(baseWebDir)

    println "compiling stylesheets in external themes dir"
    compileStyleSheets(basedir)
  }

    if(!System.properties.skipCopyAppConfig) {
        println "Retrieving the Application Configuration Client Files from Ivy"
        println "Use -DskipCopyAppConfig=true to omit this step"
        copyAppConfigFiles()
        println "finished copying app configuration files"
    }
}

eventRunAppStart = {
    def baseWebDir = "${basedir}/web-app"

    if (!System.properties.skipSassCompile) {
        println "compiling sass stylesheets - ruby, compass, and sass must be installed"
        println "compiling stylesheets in web-app"
        compileStyleSheets(baseWebDir)

        println "compiling stylesheets in external themes dir"
        compileStyleSheets(basedir)
    }

    if(!System.properties.skipCopyAppConfig) {
        println "Retrieving the Application Configuration Client Files from Ivy"
        println "Use -DskipCopyAppConfig=true to omit this step"
        copyAppConfigFiles()
        println "finished copying app configuration files"
    }
}

eventCreateWarStart = { name, stagingDir ->
//  compileStyleSheets(stagingDir)
  copyAppConfigFiles()

  // AppConfig files copied above will not be included in the WAR if this is
  // the first time the above command was called on this system. (All static
  // files for the WAR are resolved before eventCreateWarStart is called.)
  // Must copy them to staging dir to ensure they get in the WAR.
  def appConfigPath = "js/components/admin/applicationConfiguration"

  ant.copy( todir: "${stagingDir}/${appConfigPath}", overwrite: "true" ) {
    fileset( dir: "${basedir}/web-app/${appConfigPath}" )
  }

  println "copying help for help into war"

    def baseWebDir = "${basedir}/web-app"
    ant.copy(todir: "${baseWebDir}/help") {
      fileset(dir: "${basedir}/docs-internal") {
        include(name: "Instructions_for_configuring_Help_content.pdf")
        include(name: "Keyboard Navigation.pdf")
      }
    }
    ant.copy(todir: "${stagingDir}/help") {
      fileset(dir: "${basedir}/docs-internal") {
        include(name: "Instructions_for_configuring_Help_content.pdf")
        include(name: "Keyboard Navigation.pdf")
      }
    }

  println "finished help for help into war"

  println "making owf-all.jar"

      //jar up all files in WEB-INF/classes and put into WEB-INF/lib/owf-all.jar
      ant.jar(destfile:"${stagingDir}/WEB-INF/lib/owf-all.jar", update:false) {
        fileset(dir:"${stagingDir}/WEB-INF/classes") {
          exclude(name:"**/gsp_*.*")
          exclude(name:"**/*.properties")
          exclude(name:"**/*.xml")
          exclude(name:"**/.gitignore")
        }
      }

      ant.delete(includeemptydirs:true) {
        fileset(dir:"${stagingDir}/WEB-INF/classes") {
          exclude(name:"**/gsp_*.*")
          exclude(name:"**/*.properties")
          exclude(name:"**/*.xml")
        }
      }

  println "finished making owf-all.jar"

  // Copy descriptor template into war stage in such a way that it will
  // always be in the CLASSPATH when deployed
  ant.copy(file: "${basedir}/src/resources/empty_descriptor.html",
           todir: "${stagingDir}/WEB-INF/classes")
}
