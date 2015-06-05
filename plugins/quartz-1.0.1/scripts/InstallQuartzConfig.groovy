/*
 * Copyright 2006-2008 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Gant script that installs Quartz config file into /grails-app/conf/ directory.
 *
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 *
 * @since 0.3
 */

includeTargets << grailsScript("_GrailsInit")
includeTargets << grailsScript("_GrailsCreateArtifacts")

target(installQuartzConfig: "Installs Quartz config in the /grails-app/conf/ directory") {
    depends(checkVersion)
    def configFile = "${basedir}/grails-app/conf/QuartzConfig.groovy"
    if(!(configFile as File).exists() || confirmInput("Quartz config file already exists in your project. Overwrite it?")) {
        ant.copy(
                file:"${quartzPluginDir}/grails-app/conf/DefaultQuartzConfig.groovy",
                tofile:configFile,
                overwrite: true
        )
        event("CreatedFile", [configFile])
        event("StatusFinal", ["Quartz configuration file was installed into /grails-app/conf/QuartzConfig.groovy"])
    }
}

confirmInput = {String message ->
    ant.input(message: message, addproperty: "confirm.message", validargs: "y,n")
    ant.antProject.properties."confirm.message" == "y"
}

setDefaultTarget 'installQuartzConfig'
