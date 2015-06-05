includeTargets << grailsScript("_GrailsInit")

target(installBuildTestDataConfigTemplate: "This space intentionally left information-free") {
    targetConfigFile = new File(basedir, "grails-app/conf/TestDataConfig.groovy")
    if (targetConfigFile.exists()) {
        ant.input(addProperty: "replace.existing.testDataConfig",
            message: "There is an existing grails-app/conf/TestDataConfig.groovy file, replace with plugin template? [y/n]")

        if (ant.antProject.properties."replace.existing.testDataConfig" != "y") { return }
    }

    sourceConfigFile = new File(buildTestDataPluginDir, "grails-app/conf/TestDataConfigTemplate.groovy")
    ant.copy(file: sourceConfigFile, tofile: targetConfigFile, overwrite: true)
}

setDefaultTarget(installBuildTestDataConfigTemplate)
