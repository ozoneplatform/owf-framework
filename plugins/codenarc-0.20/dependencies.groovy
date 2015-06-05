grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir	= "target/test-reports"

grails.project.dependency.resolution = {
	inherits "global"
	log "warn" 
	repositories {
		grailsCentral()
		mavenCentral()
	}

	dependencies {
		compile "org.codenarc:CodeNarc:0.20", {
			excludes "log4j", "groovy-all", "ant"
		}
	}

	plugins {
		build ":release:2.2.0", {
			export = false
		}
	}
}
