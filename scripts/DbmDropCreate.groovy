includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmCreateDrop: "Convenience script to drop and create a new schema for the current environment") {

    def filesToDelete = ['prodDb.log', 'prodDb.properties', 'prodDb.script'];
    filesToDelete.each { new File(it).delete() }

    depends dbmInit

    doAndClose {
        liquibase.dropAll()
        liquibase.update 'create'
        liquibase.update 'sampleData'
    }

}

setDefaultTarget(dbmCreateDrop)
