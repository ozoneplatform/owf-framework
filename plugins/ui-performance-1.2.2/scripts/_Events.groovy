import grails.util.GrailsUtil

/**
 * In 1.0.x this is called after the staging dir is prepared but before the war is packaged.
 */
eventWarStart = { name ->
	if (name instanceof String || name instanceof GString) {
		versionResources name, stagingDir
	}
}

/**
 * In 1.1 this is called after the staging dir is prepared but before the war is packaged.
 */
eventCreateWarStart = { name, stagingDir ->
    def ant = new AntBuilder()
    def baseWebDir = "${basedir}/web-app"

    //delete previous minified version of external css and js-plugins
    ant.delete {
        fileset(dir: "${basedir}/themes/") {
            include(name: "*/css/*__*")
        }
    }

    //copy external themes into the war folder
    //so that uiperformance will run on them
    ant.copy(todir:"${stagingDir}/themes-tmp") {
        fileset(dir: "${basedir}/themes") {
            include(name: "*/css/*.css")
        }
    }

	versionResources name, stagingDir

    //now that versioning is complete, move external
    //themes back out
    ant.move(todir: "${basedir}/themes", failonerror: false) {
        fileset(dir: "${stagingDir}/themes-tmp") {
            include(name: "*/css/*.css")
        }
    }
    ant.delete(dir: "${stagingDir}/themes-tmp")

    //keep old owf bundle name for compatibility
    ant.copy(todir: "${stagingDir}/js-min") {
      fileset(dir: "${stagingDir}/js") {
        include(name: "owf-widget__v*.js")
        exclude(name: "owf-widget__v*gz.js")
      }
      regexpmapper(from: '^(.*)$', to: "owf-widget-min.js")
    }
    ant.copy(file : "${stagingDir}/js/owf-widget.js", tofile: "${stagingDir}/js-min/owf-widget-debug.js")

    //copy back into our webapp for grails run mode
    ant.copy(todir: "${baseWebDir}/js-min") {
      fileset(dir: "${stagingDir}/js") {
        include(name: "owf-widget__v*.js")
        exclude(name: "owf-widget__v*gz.js")
      }
      regexpmapper(from: '^(.*)$', to: "owf-widget-min.js")
    }
    ant.copy(file : "${stagingDir}/js/owf-widget.js", tofile: "${baseWebDir}/js-min/owf-widget-debug.js")

    //build classpath for our jar
    ant.path(id:"classpath") {
      fileset(dir:"${stagingDir}/WEB-INF/lib") {
        include(name:"*.*")
      }
      fileset(dir:"${stagingDir}/WEB-INF/tools") {
        include(name:"*.*")
      }
    }

    //convert to string
    ant.pathconvert(property:"classpath.string",pathsep:" ") {
      path(refid:'classpath')
      map(from:"${stagingDir}/WEB-INF/tools", to:"./")
      map(from:"${stagingDir}/WEB-INF/lib/", to:"../lib/")
    }

    //create createBundles.jar
    ant.mkdir(dir:"${stagingDir}/WEB-INF/tools")
    ant.jar(destfile:"${stagingDir}/WEB-INF/tools/createWebBundles.jar") {
      manifest {
        attribute(name:"Main-Class",value:"com.studentsonly.grails.plugins.uiperformance.util.CreateWebBundles")
          attribute(name:"Class-Path",value:'${classpath.string} ./ ../classes/')
      }
      zipfileset(src:"${stagingDir}/WEB-INF/lib/owf-all.jar") {
        include(name:"com/studentsonly/grails/plugins/uiperformance/util/CreateWebBundles*.*")
      }
    }
}

void versionResources(name, stagingDir) {
	def classLoader = Thread.currentThread().contextClassLoader
	classLoader.addURL(new File(classesDirPath).toURL())

	def config = new ConfigSlurper(GrailsUtil.environment).parse(classLoader.loadClass('Config')).uiperformance
	def enabled = config.enabled
	enabled = enabled instanceof Boolean ? enabled : true

	if (!enabled) {
		println "\nUiPerformance not enabled, not processing resources\n"
		return
	}

	println "\nUiPerformance: versioning resources ...\n"

	String className = 'com.studentsonly.grails.plugins.uiperformance.ResourceVersionHelper'
	def helper = Class.forName(className, true, classLoader).newInstance()
	helper.version stagingDir, basedir
}
