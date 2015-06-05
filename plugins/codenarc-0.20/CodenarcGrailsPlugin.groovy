/*
 * Copyright 2010 the original author or authors.
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
class CodenarcGrailsPlugin {

	String version = '0.20'

  	def grailsVersion = '1.3 > *'

	Map dependsOn = [:]

	String license = "APACHE"
	String author = 'Chris Mair'                            // ORIGINAL: 'Burt Beckwith'
	String authorEmail = 'chrismair@users.sourceforge.net'  // ORIGINAL: 'burt@burtbeckwith.com'
	String title = 'CodeNarc plugin'
	String description = 'Runs CodeNarc static analysis rules for Groovy source.'
	String documentation = 'http://grails.org/plugin/codenarc'

	List developers = [
			[name: "Burt Beckwith", email: "burt@burtbeckwith.com"],
			[name: "Peter Ledbrook", email: "peter@cacoethes.co.uk"] ]

	Map issueManagement = [ system: "JIRA", url: "http://jira.grails.org/browse/GPCODENARC" ] 
	Map scm = [ url: "https://github.com/chrismair/GrailsCodeNarcPlugin" ]

	def doWithSpring = {}

	def doWithApplicationContext = { applicationContext -> }

	def doWithWebDescriptor = { xml -> }

	def doWithDynamicMethods = { ctx -> }

	def onChange = { event -> }

	def onConfigChange = { event -> }
}
