import grails.util.GrailsUtil

includeTargets << grailsScript("_GrailsPackage")

target ('default': "creates bundles")   {
  depends(packageApp)

	baseWebAppDir = basedir + '/web-app'
	destDir = baseWebAppDir + '/js-min'
	ant.mkdir(dir:destDir)

	createJsBundles new File(baseWebAppDir), new File(destDir)
}


void createJsBundles(baseWebAppDir, stagingDir) {
	def classLoader = Thread.currentThread().contextClassLoader
	classLoader.addURL(new File(classesDirPath).toURL())

	def enabled = true

	if (!enabled) {
		println "\nUiPerformance not enabled, not processing resources\n"
		return
	}

	println "\nUiPerformance: versioning resources ...\n"

	String className = 'com.studentsonly.grails.plugins.uiperformance.ResourceVersionHelper'
	def helper = Class.forName(className, true, classLoader).newInstance()

    helper.versionJsBundles  baseWebAppDir, stagingDir
}
