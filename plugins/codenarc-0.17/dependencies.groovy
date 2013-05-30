grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir	= "target/test-reports"

grails.project.dependency.resolution = {
	inherits "global"
	log "warn" 
	repositories {
		mavenCentral()
	}

	dependencies {
		provided "org.codenarc:CodeNarc:0.17", {
			excludes "log4j", "groovy-all", "ant"
		}
	}

	plugins {
		build ":release:1.0.0.RC3", {
			export = false
		}
	}
}
