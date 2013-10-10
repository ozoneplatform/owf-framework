//
// This script is executed by Grails after plugin was installed to project.
// This script is a Gant script so you can use all special variables provided
// by Gant (such as 'baseDir' which points on project base dir). You can
// use 'ant' to access a global instance of AntBuilder
//
// For example you can create directory under project tree:
//
//    ant.mkdir(dir:"${basedir}/grails-app/jobs")
//

import java.io.File

copyFilesAfterInstall()


def copyFilesAfterInstall(){
	
	String sourceDir, destinationDir
	sourceDir = "${basedir}/plugins/aml-commons-appconfig-0.1/web-app/js/applicationConfiguration"
	destinationDir = "${basedir}/web-app/js/applicationConfiguration"
	
	File destExists = new File(destinationDir)
	
	//This is for OWF..yeah not pretty but its so easy to do it this way
	if(!destExists.exists()){
		destinationDir = "${basedir}/web-app/js/components/admin/applicationConfiguration"
	}
	
	println "Copying files from ${sourceDir} to  ${destinationDir}"
		
	new AntBuilder().copy(todir: destinationDir) {
		fileset(dir: sourceDir)
	}	
}

