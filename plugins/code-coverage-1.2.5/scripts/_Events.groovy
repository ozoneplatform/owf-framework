dataFile = "cobertura.ser"

forkedJVMDebugPort = ''//'5005'

codeCoverageExclusionList = [
        "**/*BootStrap*",
        "Config*",
        "BuildConfig*",
        "**/*DataSource*",
        "**/*resources*",
        "**/*UrlMappings*",
        "**/*Tests*",
        "**/grails/test/**",
        "**/org/codehaus/groovy/grails/**",
        "**/PreInit*",
        "*GrailsPlugin*"]


eventCreateWarStart = { warName, stagingDir ->
    ant.delete(includeemptydirs: true) {
        fileset(dir: "$stagingDir") {
            include(name: '**/code-coverage*/**')
            include(name: '**/code-coverage*')
            if (new File("$stagingDir/WEB-INF/classes/application.properties").text.indexOf('code-coverage') == -1) {
                include(name: '**/CodeCoverageGrailsPlugin*')
            }
        }
    }
}

eventTestPhasesStart = {
    if (isCoverageEnabled()) {
        event("StatusUpdate", ["Instrumenting classes for coverage"])

        if (isAppendCoverageResultsEnabled() && new File("${dataFile}").exists()) {
            println "Appending coverage results to existing Cobertura ser file ${dataFile}."
        } else {
            ant.delete(file: "${dataFile}")
        }

        if (buildConfig.coverage.exclusionListOverride) {
            codeCoverageExclusionList = buildConfig.coverage.exclusionListOverride
        }

        if (buildConfig.coverage.exclusions) {
            codeCoverageExclusionList += buildConfig.coverage.exclusions
        }

        defineCoberturaPathAndTasks()
        instrumentClasses()
    }
}

eventTestPhasesEnd = {
    if (isCoverageEnabled()) {
        defineCoberturaPathAndTasks()
        flushReportData()
        createCoverageReports()
        replaceClosureNamesInReports()

        //clear out the instrumented classes
        cleanCompiledSources()

        event("StatusFinal", ["Cobertura Code Coverage Complete (view reports in: ${coverageReportDir})"])
    }
}

def createCoverageReports() {
    coverageReportDir = "${config.grails.testing.reports.destDir ?: testReportsDir}/cobertura"

    ant.mkdir(dir: "${coverageReportDir}")

    coverageReportFormats = ['html']
    if (argsMap.xml || buildConfig.coverage.xml) {
        coverageReportFormats << 'xml'
    }

    coverageReportFormats.each {reportFormat ->
        ant.'cobertura-report'(destDir: "${coverageReportDir}", datafile: "${dataFile}", format: reportFormat) {
            //load all these dirs independently so the dir structure is flattened,
            //otherwise the source isn't found for the reports
            fileset(dir: "${basedir}/grails-app/controllers")
            fileset(dir: "${basedir}/grails-app/domain")
            fileset(dir: "${basedir}/grails-app/services")
            fileset(dir: "${basedir}/grails-app/taglib")
            fileset(dir: "${basedir}/grails-app/utils")
            fileset(dir: "${basedir}/src/groovy")
            fileset(dir: "${basedir}/src/java")
            if (buildConfig.coverage?.sourceInclusions) {
                buildConfig.coverage.sourceInclusions.each {
                    fileset(dir: "${basedir}/${it}")
                }
            }
        }
    }
}

def defineCoberturaPathAndTasks() {
    ant.taskdef(classpathRef: 'grails.test.classpath', resource: "tasks.properties")
}

def replaceClosureNamesInReports() {
    if (!argsMap.nopost || !buildConfig.coverage.noPost) {
        def startTime = new Date().time
        replaceClosureNames(grailsApp?.controllerClasses)
        replaceClosureNamesInXmlReports(grailsApp?.controllerClasses)
        def endTime = new Date().time
        println "Done with post processing reports in ${endTime - startTime}ms"
    }
}

def replaceClosureNames(artefacts) {
    artefacts?.each {artefact ->
        def closures = [:]
        artefact.reference.propertyDescriptors.each {propertyDescriptor ->
            def closureClassName = artefact.getPropertyOrStaticPropertyOrFieldValue(propertyDescriptor.name, Closure)?.class?.name
            if (closureClassName) {
                // the name in the reports is sans package; subtract the package name
                def nameToReplace = closureClassName - "${artefact.packageName}."

                ant.replace(dir: "${coverageReportDir}",
                        token: ">${nameToReplace}<",
                        value: ">${artefact.shortName}.${propertyDescriptor.name}<") {
                    include(name: "**/*${artefact.fullName}.html")
                    include(name: "frame-summary*.html")
                }
            }
        }
    }
}

def replaceClosureNamesInXmlReports(artefacts) {
    def xml = new File("${coverageReportDir}/coverage.xml")
    if (xml.exists()) {
        def p = new XmlParser()
        p.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        def parser = p.parse(xml)

        artefacts?.each {artefact ->
            def closures = [:]
            artefact.reference.propertyDescriptors.each {propertyDescriptor ->
                def closureClassName = artefact.getPropertyOrStaticPropertyOrFieldValue(propertyDescriptor.name, Closure)?.class?.name
                if (closureClassName) {
                    def node = parser['packages']['package']['classes']['class'].find {it.@name == closureClassName}
                    if (node) {
                        node.@name = "${artefact.fullName}.${propertyDescriptor.name}"
                    }
                }
            }
        }

        xml.withPrintWriter {writer ->
            new XmlNodePrinter(writer).print(parser)
        }
    }
}

def instrumentClasses() {
    try {
        ant.'cobertura-instrument'(datafile: "${dataFile}") {
            fileset(dir: classesDir.absolutePath) {
                include(name: "**/*.class")
                codeCoverageExclusionList.each {pattern ->
                    exclude(name: pattern)
                }
            }
        }
    }
    catch (Exception e) {
        event("StatusFinal", ["Error instrumenting classes: ${e.message}"])
        exit(1)
    }
}

boolean isCoverageEnabled() {
    if (argsMap.containsKey('nocoverage')) {
        return false
    } else if (argsMap.containsKey('coverage')) {
        return true
    } else {
        return buildConfig.coverage.enabledByDefault
    }
}

boolean isAppendCoverageResultsEnabled() {
    if (argsMap.containsKey('noappend')) {
        return false
    } else if (argsMap.containsKey('append')) {
        return true
    } else {
        return buildConfig.coverage.appendCoverageResults
    }
}

def flushReportData() {
    try {
        net.sourceforge.cobertura.coveragedata.ProjectData.saveGlobalProjectData()
    } catch (Exception e) {
        event("StatusError", ["""
--------------------------------------------
***********WARNING*************
Unable to flush code coverage data.  
This usually happens when tests don't actually test anything;
e.g. none of the instrumented classes were exercised by tests!
--------------------------------------------
"""])
    }
}
