includeTargets << grailsScript("_GrailsInit")
includeTargets << grailsScript("_PluginDependencies")
includeTargets << grailsScript("_GrailsCreateArtifacts")

pluginHome = getPluginDirForName("webdriver").path

target('default': "Creates a skeleton of a Webdriver Test Application") {
    depends(checkVersion, parseArguments)

    createArtifact(name: "~.pages.BasePage", suffix: "", type: "BasePage", path: "test/functional")
    createArtifact(name: "~.pages.HomePage", suffix: "", type: "HomePage", path: "test/functional")
    createArtifact(name: "~.tests.HomeTests", suffix: "", type: "HomeTests", path: "test/functional")
}
