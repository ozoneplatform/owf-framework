includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmDropCreateProddb: "Convenience script for creating the prodDb sample database") {
    depends dbmInit

    doAndClose {
        liquibase.dropAll()
        liquibase.update 'create'
        liquibase.update 'sampleData'
    }
}

setDefaultTarget(dbmDropCreateProddb)