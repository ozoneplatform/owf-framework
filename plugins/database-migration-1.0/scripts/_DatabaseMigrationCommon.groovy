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

/**
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */

import grails.util.GrailsNameUtils
import grails.util.GrailsUtil

import java.text.SimpleDateFormat

import liquibase.diff.Diff

import org.apache.log4j.Logger
import org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsAnnotationConfiguration

includeTargets << grailsScript('_GrailsBootstrap')

DAY_DATE_FORMAT = 'yyyy-MM-dd'
FULL_DATE_FORMAT = DAY_DATE_FORMAT + ' HH:mm:ss'

target(dbmInit: 'General initialization, also creates a Liquibase instance') {
	depends(classpath, checkVersion, configureProxy, enableExpandoMetaClass, bootstrap, loadApp)

	try {
		hyphenatedScriptName = GrailsNameUtils.getScriptName(scriptName)
		log = Logger.getLogger('grails.plugin.databasemigration.Scripts')
		MigrationUtils = classLoader.loadClass('grails.plugin.databasemigration.MigrationUtils')

		argsList = argsMap.params
		contexts = argsMap.contexts
		diffTypes = argsMap.diffTypes
		defaultSchema = argsMap.defaultSchema
	}
	catch (e) {
		printStackTrace e
		throw e
	}
}

printStackTrace = { e ->
	GrailsUtil.deepSanitize e
	e.printStackTrace()
}

calculateDestination = { Integer argIndex = 0, boolean relativeToMigrationDir = false ->
	if (!argsList[argIndex]) {
		return System.out
	}

	String destination = argsList[argIndex]
	if (relativeToMigrationDir) {
		destination = MigrationUtils.changelogLocation + '/' + destination
	}
	new PrintStream(destination)
}

newPrintWriter = { Integer argIndex = 0, boolean relativeToMigrationDir = false ->
	new PrintWriter(calculateDestination(argIndex, relativeToMigrationDir))
}

newOutputStreamWriter = { Integer argIndex = 0, boolean relativeToMigrationDir = false ->
	new OutputStreamWriter(calculateDestination(argIndex, relativeToMigrationDir))
}

doAndClose = { Closure c ->
	try {
		MigrationUtils.executeInSession {
			database = MigrationUtils.getDatabase(defaultSchema)
			liquibase = MigrationUtils.getLiquibase(database)

			def dsConfig = config.dataSource
			String dbDesc = dsConfig.jndiName ? "JNDI $dsConfig.jndiName" : "$dsConfig.username @ $dsConfig.url"
			echo "Starting $hyphenatedScriptName for database $dbDesc"
			c()
			echo "Finished $hyphenatedScriptName"
		}
	}
	catch (e) {
		printStackTrace e
		exit 1
	}
	finally {
		closeConnection database
	}
}

// run a script (called by the closure) which generates changelog XML, and
// write it to STDOUT if no filename was specified, to an XML file if the
// extension is .xml, and convert to the Groovy DSL and write to a Groovy
// file if the extension is .groovy
executeAndWrite = { String filename, Closure c ->
	PrintStream out
	ByteArrayOutputStream baos
	if (filename) {
		filename = MigrationUtils.changelogLocation + '/' + filename
		if (filename.toLowerCase().endsWith('groovy')) {
			baos = new ByteArrayOutputStream()
			out = new PrintStream(baos)
		}
		else {
			out = new PrintStream(filename)
		}
	}
	else {
		out = System.out
	}

	c(out)

	if (baos) {
		String xml = new String(baos.toString('UTF-8'))
		ChangelogXml2Groovy = classLoader.loadClass('grails.plugin.databasemigration.ChangelogXml2Groovy')
		String groovy = ChangelogXml2Groovy.convert(xml)
		new File(filename).withWriter { it.write groovy }
	}

	if (argsMap.add) {
		registerInclude filename
	}
}

registerInclude = { String filename ->
	def fullPath = new File(filename).absolutePath
	def fullMigrationFolderPath = new File(MigrationUtils.changelogLocation).absolutePath
	String relativePath = (fullPath - fullMigrationFolderPath).substring(1)
	appendToChangelog new File(filename), "\n\tinclude file: '$relativePath'"
}

appendToChangelog = { File sourceFile, String content ->

	def changelog = new File(MigrationUtils.changelogLocation, MigrationUtils.changelogFileName)
	if (changelog.absolutePath.equals(sourceFile.absolutePath)) {
		return
	}

	def asLines = changelog.text.readLines()
	int count = asLines.size()
	int index = -1
	for (int i = count - 1; i > -1; i--) {
		if (asLines[i].trim() == '}') {
			index = i
			break
		}
	}

	if (index == -1) {
		// TODO
		return
	}

	// TODO backup
	changelog.withWriter {
		index.times { i -> it.write asLines[i]; it.newLine() }

		it.write content; it.newLine()

		(count - index).times { i -> it.write asLines[index + i]; it.newLine() }
	}
}

echo = { String message -> ant.echo message: message }

closeConnection = { try { it?.close() } catch (ignored) {} }

errorAndDie = { String message ->
	echo "\nERROR: $message"
	exit 1
}

calculateDate = { ->
	String dateFormat
	String dateString
	binding.calculateDateFileNameIndex = null

	switch (argsList.size()) {
		case 1:
			dateFormat = DAY_DATE_FORMAT
			dateString = argsList[0].trim()
			break
		case 2:
			dateFormat = FULL_DATE_FORMAT
			dateString = argsList[0] + ' ' + argsList[1]
			try {
				new SimpleDateFormat(dateFormat).parse(dateString)
			}
			catch (e) {
				// assume that 2nd param is filename
				dateFormat = DAY_DATE_FORMAT
				dateString = argsList[0]
				calculateDateFileNameIndex = 1
			}
			break
		case 3:
			dateFormat = FULL_DATE_FORMAT
			dateString = argsList[0] + ' ' + argsList[1]
			calculateDateFileNameIndex = 2
	}

	if (dateString) {
		try {
			return new SimpleDateFormat(dateFormat).parse(dateString)
		}
		catch (e) {
			errorAndDie "Problem parsing '$dateString' as a Date: $e.message"
		}
	}

	errorAndDie 'Date must be specified as two strings with the format "yyyy-MM-dd HH:mm:ss"' +
	            'or as one strings with the format "yyyy-MM-dd"'
}

createGormDatabase = { ->
	def dialect = config.dataSource.dialect
	if (dialect) {
		if (dialect instanceof Class) {
			dialect = dialect.name
		}
	}
	else {
		dialect = appCtx.dialectDetector
	}

	def configuration = new GrailsAnnotationConfiguration(
		grailsApplication: appCtx.grailsApplication,
		properties: ['hibernate.dialect': dialect.toString()] as Properties)
	configuration.buildMappings()

	GormDatabase = classLoader.loadClass('grails.plugin.databasemigration.GormDatabase')
	GormDatabase.newInstance configuration
}

createDiff = { referenceDatabase, targetDatabase ->
	def diff = new Diff(referenceDatabase, targetDatabase)
	diff.diffTypes = diffTypes
	diff.addStatusListener appCtx.diffStatusListener
	diff
}

okToWrite = { destinationOrIndex = 0, boolean relativeToMigrationDir = false ->

	String destination
	if (destinationOrIndex instanceof Number) {
		destination = argsList[destinationOrIndex]
		if (!destination) {
			return true // stdout
		}
	}
	else {
		destination = destinationOrIndex
	}

	if (relativeToMigrationDir) {
		destination = MigrationUtils.changelogLocation + '/' + destination
	}

	def file = new File(destination)
	if (!file.exists()) {
		return true
	}

	String propertyName = "file.overwrite.$file.name"
	ant.input(addProperty: propertyName, message: "$destination exists, ok to overwrite?",
	          validargs: 'y,n', defaultvalue: 'y')

	if (ant.antProject.properties."$propertyName" == 'n') {
		return false
	}

	true
}

target(enableExpandoMetaClass: "Calls ExpandoMetaClass.enableGlobally()") {
	ExpandoMetaClass.enableGlobally()
}
