/* Copyright 2006-2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
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

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

import grails.util.Environment

import java.sql.DriverManager

includeTargets << new File("$databaseMigrationPluginDir/scripts/_DatabaseMigrationCommon.groovy")

target(dbmDiff: 'Writes description of differences to standard out') {
	depends dbmInit

	String otherEnv = argsList[0]
	if (!otherEnv) {
		errorAndDie 'You must specify the environment to diff against'
	}

	if (Environment.getEnvironment(otherEnv) == Environment.current ||
			otherEnv == Environment.current.name) {
		errorAndDie 'You must specify a different environment than the one the script is running in'
	}

	if (!okToWrite(1, true)) return

	def thisDatabase
	def otherDatabase
	try {
		echo "Starting $hyphenatedScriptName against environment '$otherEnv'"

		executeAndWrite argsList[1], { PrintStream out ->
			MigrationUtils.executeInSession {
				thisDatabase = MigrationUtils.getDatabase(defaultSchema)
				otherDatabase = buildOtherDatabase(otherEnv)
				createDiff(thisDatabase, otherDatabase).compare().printChangeLog(out, otherDatabase)
			}
		}

		echo "Finished $hyphenatedScriptName"
	}
	catch (e) {
		printStackTrace e
		exit 1
	}
	finally {
		closeConnection thisDatabase?.connection
		closeConnection otherDatabase?.connection
	}
}

// TODO this will fail with JNDI or encryption codec
buildOtherDatabase = { String otherEnv ->
	
	try {
		// check if it's a full name
		Environment.valueOf otherEnv
	}
	catch (e) {
		// convert it from short name to full (e.g. 'dev' -> 'development')
		String fullName = Environment.getEnvironment(otherEnv)?.name
		if (fullName) {
			otherEnv = fullName
		}
	}
	
	def configSlurper = new ConfigSlurper(otherEnv)
	configSlurper.binding = binding.variables
	def otherDsConfig = configSlurper.parse(classLoader.loadClass('DataSource')).dataSource

	try {
		Class.forName otherDsConfig.driverClassName, true, classLoader
	}
	catch (e) {
		errorAndDie "Driver class $otherDsConfig.driverClassName not found"
	}

	if (!otherDsConfig.url || !otherDsConfig.username) {
		errorAndDie "The comparison DataSource URL and/or username is missing, or the DataSource configuration for environment '$otherEnv' wasn't found"
	}

	def connection = DriverManager.getConnection(
		otherDsConfig.url, otherDsConfig.username, otherDsConfig.password ?: null)

	MigrationUtils.getDatabase connection, defaultSchema, null
}

setDefaultTarget dbmDiff
