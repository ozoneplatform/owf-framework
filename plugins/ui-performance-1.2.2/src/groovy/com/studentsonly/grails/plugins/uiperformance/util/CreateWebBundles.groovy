package com.studentsonly.grails.plugins.uiperformance.util

import grails.util.GrailsUtil
import org.codehaus.groovy.grails.commons.ConfigurationHolder
import org.codehaus.groovy.grails.commons.cfg.ConfigurationHelper

class CreateWebBundles {

  static def versionResources = { dir ->
//    println "config:$config"
//    println "dir:$dir"

    def helper = new com.studentsonly.grails.plugins.uiperformance.ResourceVersionHelper()
    helper.version dir, dir

    //keep old owf bundle name for compatibility
    def ant = new AntBuilder()
    ant.copy(todir: "${dir}/js-min") {
      fileset(dir: "${dir}/js") {
        include(name: "owf-widget__v*.js")
        exclude(name: "owf-widget__v*gz.js")
      }
      regexpmapper(from: '^(.*)$', to: "owf-widget-min.js")
    }
    ant.copy(file : "${dir}/js/owf-widget.js", tofile: "${dir}/js-min/owf-widget-debug.js")

  }

  static void main(String[] args) {
    def cli = new CliBuilder(usage: 'java -jar createWebBundles.jar -[h]', header: 'Options:')
    cli.with {
      h longOpt: 'help', 'Show help'
//      c longOpt: 'config_file', 'Specifiy location of the groovy config file.'
//      s longOpt: 'webapp_directory', 'Specifiy location of the directory of where the OWF webapp was extracted'
    }

    def options = cli.parse(args)

    if (!options) {
      return
    }

    if (options.h) {
      println "Description:"
      println " createWebBundles is a command line tool which executes same the JavaScript and CSS compression "
      println " and bundling originally used when the OWF war was created. "
      println "Instructions:"
      println " 1) Extract the OWF war to a temporary directory "
      println " 2) Make desired modifications to source JavaScript and CSS files "
      println " 3) If you have external themes, for example in the tomcat/lib/themes folder, copy them into a"
      println "    new folder within the unzipped war named themes-tmp"
      println " 4) If you have external JavaScript files, for example in the tomcat/lib/js-plugins folder, copy them into a new folder within the unzipped war named js-plugin"
      println " 5) Change directory to the WEB-INF/tools (the next command must be executed from this directory)"
      println " 6) Execute java -jar createWebBundles.jar "
      println " 7) If you created themes-tmp in step 3, move the (newly bundled) themes out of themes-tmp and"
      println "    back into the directory where they were originally located. Delete the themes-tmp directory"
      println " 8) Repackage the temporary directory as a new OWF war file"
      println " 9) Deploy the war to the web server"
      println " 10) Inform any existing users they need to clear their browser cache"
      cli.usage()
      return
    }

//    if (options.c) {
//
//    }
//    else {
//      //default
//    }
//
//    if (options.d) {
//
//    }
//    else {
//      //default
//    }

    println "CreateWebBundles Starting ..."
    println ''
    println "Current Directory:${new File('.').absolutePath}"

    def classLoader = Thread.currentThread().contextClassLoader
//    def config = new ConfigSlurper(GrailsUtil.environment).parse(classLoader.loadClass('Config'))
    ConfigurationHelper.loadConfigFromClasspath()
    def config = ConfigurationHolder.config

    //ConfigurationHelper.initConfig(config, null, classLoader)

    def uiProp = new File('../classes/uiperformance.properties')
    //println('uiProp:'+uiProp)
    if (uiProp.exists()) {
        def properties = new Properties()
        properties.load(new FileReader(uiProp))
        def _applicationVersion = properties.getProperty('version')

        //println('currentVersionString:'+_applicationVersion)
        config.uiperformance.determineVersion = { ->
           _applicationVersion
        }
        config.uiperformance.exclusions << "**/*${_applicationVersion}*"
    }

    //ConfigurationHolder.config = config
    println ''
    versionResources('../../')
    println "CreateWebBundles Finished"
  }
}
