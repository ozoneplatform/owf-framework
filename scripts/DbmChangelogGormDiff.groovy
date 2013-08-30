includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmChangelogGormDiff: "Convenience script to generate the diff between the schema represented by the changesets and GORM") {
    depends dbmInit
    if (!okToWrite()) return

    doAndClose {
        liquibase.dropAll()
        liquibase.update 'create'
    }

    def realDatabase
    try {
        echo "Starting $hyphenatedScriptName"

        executeAndWrite argsList[0], { PrintStream out ->
            MigrationUtils.executeInSession {
                realDatabase = MigrationUtils.getDatabase(defaultSchema)
                def gormDatabase = createGormDatabase()
                MigrationUtils.fixDiffResult(createDiff(gormDatabase, realDatabase).compare()).printChangeLog(out, gormDatabase)
            }
        }

        echo "Finished $hyphenatedScriptName"
    }
    catch (e) {
        printStackTrace e
        exit 1
    }
    finally {
        closeConnection realDatabase
    }
}

setDefaultTarget(dbmChangelogGormDiff)