scriptEnv = "prod" //default environment is prod, can be overridden with grails dev maven-deploy

includeTargets << grailsScript ('Init')
includeTargets << new File("${basedir}/scripts/MavenUtils.groovy")

target ( default : 'A target to deploy a war to remote maven repository.' ) {
	mvndeploy() //see MavenUtils
}