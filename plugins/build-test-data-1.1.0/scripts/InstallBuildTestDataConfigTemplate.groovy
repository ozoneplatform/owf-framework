includeTargets << grailsScript("Init")

target(main: "The description of the script goes here!") {
    targetConfigFile = new File("${basedir}/grails-app/conf/TestDataConfig.groovy")
    if (targetConfigFile.exists()) {
        Ant.input(addProperty: "replace.existing.testDataConfig",
            message: "There is an existing grails-app/conf/TestDataConfig.groovy file, replace with plugin template? [y/n]")

        if (Ant.antProject.properties."replace.existing.testDataConfig" != "y") { return }
    }

    sourceConfigFile = new File("${buildTestDataPluginDir}/grails-app/conf/TestDataConfigTemplate.groovy")
    Ant.copy(file: sourceConfigFile, tofile: targetConfigFile, overwrite: true)
}

setDefaultTarget(main)
