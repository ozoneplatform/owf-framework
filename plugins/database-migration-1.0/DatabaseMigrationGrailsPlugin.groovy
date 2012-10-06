/* Copyright 2006-2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import grails.plugin.databasemigration.GormDatabaseSnapshotGenerator
import grails.plugin.databasemigration.GormDatabaseTypeConverter
import grails.plugin.databasemigration.GrailsChange
import grails.plugin.databasemigration.GrailsChangeLogParser
import grails.plugin.databasemigration.GrailsClassLoaderResourceAccessor
import grails.plugin.databasemigration.GrailsDiffStatusListener
import grails.plugin.databasemigration.GrailsPrecondition
import grails.plugin.databasemigration.Log4jLogger
import grails.plugin.databasemigration.MigrationRunner
import grails.plugin.databasemigration.MigrationUtils
import grails.plugin.databasemigration.MysqlAwareCreateTableGenerator

import liquibase.change.ChangeFactory
import liquibase.database.typeconversion.TypeConverterFactory
import liquibase.logging.Logger
import liquibase.logging.LogFactory
import liquibase.parser.ChangeLogParserFactory
import liquibase.precondition.PreconditionFactory
import liquibase.resource.FileSystemResourceAccessor
import liquibase.servicelocator.ServiceLocator
import liquibase.snapshot.DatabaseSnapshotGeneratorFactory
import liquibase.sqlgenerator.SqlGeneratorFactory
import liquibase.sqlgenerator.core.CreateTableGenerator

class DatabaseMigrationGrailsPlugin {

	String version = '1.0'
	String grailsVersion = '1.3.0 > *'
	String author = 'Burt Beckwith'
	String authorEmail = 'beckwithb@vmware.com'
	String title = 'Grails Database Migration Plugin'
	String description = 'Grails Database Migration Plugin'
	String documentation = 'http://grails.org/plugin/database-migration'

	List pluginExcludes = [
		'grails-app/domain/**',
		'docs/**',
		'src/docs/**',
		'src/groovy/grails/plugin/databasemigration/test/**'
	]

	String license = 'APACHE'
	def organization = [name: 'SpringSource', url: 'http://www.springsource.org/']
	def developers = [[name: 'Burt Beckwith', email: 'beckwithb@vmware.com']]
	def issueManagement = [system: 'JIRA', url: 'http://jira.grails.org/browse/GPDATABASEMIGRATION']
	def scm = [url: 'https://github.com/grails-plugins/grails-spring-security-core']

	def doWithSpring = {

		MigrationUtils.application = application

		if (application.warDeployed) {
			migrationResourceAccessor(GrailsClassLoaderResourceAccessor)
		}
		else {
			String changelogLocation = MigrationUtils.changelogLocation
			String changelogLocationPath = new File(changelogLocation).path
			migrationResourceAccessor(FileSystemResourceAccessor, changelogLocationPath)
		}

		diffStatusListener(GrailsDiffStatusListener)
	}

	def doWithApplicationContext = { ctx ->
		register ctx

		fixLogging()

		MigrationRunner.autoRun()
	}

	private void register(ctx) {
		// adds support for .groovy extension
		ChangeLogParserFactory.instance.register new GrailsChangeLogParser(ctx)

		// used by gorm-diff and generate-gorm-changelog
		DatabaseSnapshotGeneratorFactory.instance.register new GormDatabaseSnapshotGenerator()

		// adds support for Groovy-based changes in DSL changelogs
		ChangeFactory.instance.register GrailsChange

		// adds support for Groovy-based preconditions in DSL changelogs
		PreconditionFactory.instance.register GrailsPrecondition

		// appends 'ENGINE=InnoDB' to 'create table ...' statements in MySQL if using InnoDB
		SqlGeneratorFactory.instance.unregister CreateTableGenerator
		SqlGeneratorFactory.instance.register new MysqlAwareCreateTableGenerator()

		// fixes changelog errors generated from the GORM scripts
		TypeConverterFactory.instance.register GormDatabaseTypeConverter
	}

	private void fixLogging() {
		// ensure that classesBySuperclass is populated
		LogFactory.getLogger 'NOT_A_REAL_LOGGER_NAME'

		try {
			// register the plugin's logger
			ServiceLocator.instance.classesBySuperclass[Logger] << Log4jLogger
		}
		catch (Throwable t) {
			// ignored, fall back to default logging
		}
	}
}
