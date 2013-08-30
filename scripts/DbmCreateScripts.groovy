import groovy.sql.Sql

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmCreateScripts: "Convenience script to generate the sql scripts for current environment") {
    depends dbmInit
    if (!okToWrite()) return

    def dsConfig = config.dataSource
    def sql = Sql.newInstance(dsConfig.url, dsConfig.username, dsConfig.password, dsConfig.driverClassName)
    def createFile = 'create.sql'
    def upgradeFile = 'upgrade.sql'
    def sampleData = 'sample.sql'
    def upgradeVersion = metadata['app.base.version']
    ant.delete(file: createFile, quiet: true)
    ant.delete(file: sampleData, quiet: true)
    ant.delete(file: upgradeFile, quiet: true)

    doAndClose {
        liquibase.dropAll()
        sql.execute('drop table DATABASECHANGELOG')
        sql.execute('drop table DATABASECHANGELOGLOCK')
        liquibase.update 'create', new PrintWriter(new PrintStream(createFile))
        liquibase.clearCheckSums() //regenerates the liquibase tables
        liquibase.update "${upgradeVersion}", new PrintWriter(new PrintStream(upgradeFile))
        liquibase.update 'sampleData', new PrintWriter(new PrintStream(sampleData))
    }
}

setDefaultTarget(dbmCreateScripts)