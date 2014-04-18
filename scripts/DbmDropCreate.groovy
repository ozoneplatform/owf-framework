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

    def replaceDatabaseChangeLogLockLines = { fileName ->
        def file = new File(fileName) 
        def lines = file.withReader { it.readLines() }
        file.delete()

        def regex = /INSERT INTO DATABASECHANGELOGLOCK VALUES(1,[TRUE|FALSE],'(.*)','(.*)')/;
        def valuesRegex = /\((.*)\)/

        new File(fileName).withWriter { out ->
            lines.each() { line ->
                if(line.indexOf('INSERT INTO DATABASECHANGELOGLOCK VALUES') == 0) {
                    def matcher = (line =~ valuesRegex)
                    def params = matcher[0][1].split(',')
                    params[params.size() - 1] = null

                    out.writeLine('INSERT INTO DATABASECHANGELOGLOCK VALUES(' + params.join(',') + ')')
                }
                else {
                    out.writeLine(line)
                }
            }
        }
    }

    replaceDatabaseChangeLogLockLines('prodDb.log');
}

setDefaultTarget(dbmCreateDrop)
