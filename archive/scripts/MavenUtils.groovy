includeTargets << grailsScript ( "War" )

final antlibXMLns = 'antlib:org.apache.maven.artifact.ant'
final tempPomFile = "pom.xml"
final tempSettingsFile = "settings.xml"

target (preparePom : "Generate a temporary pom file") {
	depends(packageApp)  //so config.maven properties are loaded
	//TODO, create a customer builder for pom files
	def writer = new StringWriter()
	def builder = new groovy.xml.MarkupBuilder(writer)
	builder.project(xmlns:"http://maven.apache.org/POM/4.0.0",
			'xmlns:xsi':"http://www.w3.org/2001/XMLSchema-instance",
			'xsi:schemaLocation':"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd") {
		'modelVersion' '4.0.0'
		'groupId' 'ozone'
		'artifactId' grailsAppName
		'packaging' 'war'
		'version' grailsAppVersion
		'distributionManagement' {
			'repository' {
				'id' 'releases'
				'name' 'Internal Releases'
				'url' config.maven.remoteReleaseUrl //defined in Config.groovy
			}
			'snapshotRepository' {
				'id' 'snapshots'
				'name' 'Internal Snapshots'
				'url' config.maven.remoteSnapshotUrl //defined in Config.groovy
				'uniqueVersion' 'true'
			}
		}
	}

	File temp = new File(tempPomFile)
	temp.write writer.toString()
	def pom =ant."${antlibXMLns}:pom" ( file : tempPomFile , id : tempPomFile )
	echo("Temporary pom file written to ${tempPomFile}, don't forget to clean up")
	return tempPomFile
}

target (deletePom : "Clean up the temporary pom file") {
	new File(tempPomFile).delete()
}

target (prepareSettings : "Create a temporary settings.xml file") {
	// You should be able to use your real settings.xml file without defining anything
	// but we were running into a issue where the settings.xml file was overwriting the
	// remote snapshot location
	def writer = new StringWriter()
	def builder = new groovy.xml.MarkupBuilder(writer)
	builder.settings {
		servers {
			server {
				id 'releases'
				username 'deployment'
				password 'deployment123'
			}
			server {
				id 'snapshots'
				username 'deployment'
				password 'deployment123'
			}
			server {
				id 'thirdparty'
				username 'deployment'
				password 'deployment123'
			}
		}
	}

	File temp = new File(tempSettingsFile)
	temp.write writer.toString()
	echo("Temporary settings file written to ${tempSettingsFile}, don't forget to clean up")
	return tempSettingsFile
}

target (deleteSettings : "Clean up the temporary settings.xml file") {
	new File(tempSettingsFile).delete()
}

target (getWarName : "Return the war name defined by the app configs") {
	depends(war)
	// TODO: update this to use to use grails.war.destFile if defined
	// bug in grails clean, doesn't seem to delete war from a custom location defined by grails.war.destFile
	return warName
}

target (mvninstall : "Install to local maven repository") {
	depends(war)
	def tempPom = preparePom()
	ant."${antlibXMLns}:install" ( file : getWarName() ) { pom ( refid : tempPom ) }
	deletePom()
}

target (mvndeploy : "Deploy to a remote maven repository") {
	depends ( war )
	def tempPom = preparePom()
	def tempSettings = prepareSettings()
	ant."${antlibXMLns}:deploy" ( file : getWarName(), settingsFile : tempSettings ) { pom ( refid : tempPom ) }
	deletePom()
	deleteSettings()
}


target (default : "Default target in case someone runs grails maven-utils") {
	//TODO, move this file out of the scripts directory
	echo("This is a helper file, not intended to be run by itself.  See MavenInstall or MavenDeploy for examples of how to use it")
}