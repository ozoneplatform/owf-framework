import grails.util.Holders as CH

//main changelog file
//includes other changelog files which are organized by version
databaseChangeLog = {

    //versions for which there are DB changes
    def versions = ['3.7.0', '3.8.0', '4.0.0', '5.0.0', '6.0.0', '7.0.0', '7.2.0', '7.3.0', '7.10.0', '7.15.1', '7.16.0', '7.16.1', '7.17.0']

    // On MS SQL Server, we use numeric(19, 0) for the person id, but we use bigint everywhere else. Use this property like:
    // 	    column(name: "edited_by_id", type: '${owf.personIdType}')
    // but only use SINGLE QUOTES around the ${}, because Spring needs to do the interpretation, not Groovy.
    property([name:"owf.personIdType", value:"java.sql.Types.BIGINT", dbms:"h2, hsqldb, postgresql, mysql, oracle"])
    property([name:"owf.personIdType", value:"numeric(19,0)", dbms:"mssql"])

    property([name:"appconfig.valColumn", value:"VALUE", dbms:"hsqldb"])
    property([name:"appconfig.valColumn", value:"value", dbms:"h2, mysql, oracle, postgresql, mssql"])

    include file: "changelog_h2.groovy"

    versions.each {
        include file: "changelog_${it}.groovy"
    }

    //include/exclude current version's change log based on existence of dbmBuildPreviousVersion
    if (!System.properties.dbmBuildPreviousVersion) {
      include file: "changelog_${CH.config?.server.baseVersion}.groovy"
    }
    else {
      println "Building up to the previous version of the database"
    }

}
