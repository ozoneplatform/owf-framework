/* Copyright 2004-2013 the original author or authors.
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
import grails.plugin.hibernate3.HibernatePluginSupport

import org.codehaus.groovy.grails.commons.AnnotationDomainClassArtefactHandler

/**
 * Handles the configuration of Hibernate within Grails.
 *
 * @author Graeme Rocher
 */
class HibernateGrailsPlugin {
    def author = "Graeme Rocher"
    def title = "Hibernate 3 for Grails"
    def description = "Provides integration between Grails and Hibernate 3 through GORM"

    def grailsVersion = "2.3.2 > *"
    def version = "3.6.10.14"
    def observe = ['domainClass']
    def loadAfter = ['controllers', 'domainClass']
    def watchedResources = ["file:./grails-app/conf/hibernate/**.xml"]
    def artefacts = [AnnotationDomainClassArtefactHandler]
    def pluginExcludes = ['src/templates/**']

    def license = 'APACHE'
    def organization = [name: 'SpringSource', url: 'http://www.springsource.org/']
    def issueManagement = [system: 'JIRA', url: 'http://jira.grails.org/browse/GPHIB']
    def scm = [url: 'https://github.com/grails-plugins/grails-hibernate-plugin']

    def doWithSpring = HibernatePluginSupport.doWithSpring
    
    def doWithApplicationContext = HibernatePluginSupport.doWithApplicationContext

    def doWithDynamicMethods = HibernatePluginSupport.doWithDynamicMethods

    def onChange = HibernatePluginSupport.onChange
}
