import org.codehaus.groovy.grails.commons.ConfigurationHolder as CH

//main changelog file
//includes other changelog files which are organized by version
databaseChangeLog = {

    //previous version change logs go here
    include file: 'changelog_3.7.0.groovy'
    include file: 'changelog_3.8.0.groovy'
    include file: 'changelog_3.8.1.groovy'
    include file: 'changelog_4.0.0.groovy'
    include file: 'changelog_5.0.0.groovy'
    include file: 'changelog_6.0.0.groovy'
    include file: 'changelog_6.0.1.groovy'
    include file: 'changelog_6.0.2.groovy'
    include file: 'changelog_7.0.0.groovy'

    //include/exclude current version's change log based on existence of dbmBuildPreviousVersion
    if (!System.properties.dbmBuildPreviousVersion) {
      include file: "changelog_${CH.config?.server.baseVersion}.groovy"
    }
    else {
      println "Building up to the previous version of the database"
    }

}
