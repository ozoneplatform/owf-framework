package grails.buildtestdata

import grails.util.Environment
import grails.util.Holders
import org.apache.commons.logging.LogFactory

class TestDataConfigurationHolder {
    static log = LogFactory.getLog("grails.buildtestdata.TestDataConfigurationHolder")

    private static ConfigObject configFile
    private static Map sampleData

    static Map unitAdditionalBuild
    static Map abstractDefault

    private static ConfigSlurper configSlurper = new ConfigSlurper(Environment.current.name)

    static sampleDataIndexer = [:]

    static reset() {
        loadTestDataConfig()
    }

    static loadTestDataConfig() {
        Class testDataConfigClass = getDefaultTestDataConfigClass()

        if (testDataConfigClass) {
            configFile = configSlurper.parse(testDataConfigClass)
            setSampleData( configFile?.testDataConfig?.sampleData as Map )

            unitAdditionalBuild = configFile?.testDataConfig?.unitAdditionalBuild ?: [:]
            abstractDefault = configFile?.testDataConfig?.abstractDefault ?: [:]

            // If we have abstract defaults, automatically add transitive dependencies
            // for them since they may need to be built.
            abstractDefault?.each { key, value ->
                if (unitAdditionalBuild.containsKey(key)) {
                    unitAdditionalBuild[key] << value
                }
                else {
                    unitAdditionalBuild[key] = [value]
                }
            }

            log.debug "configFile loaded: ${configFile}"
        } else {
            setSampleData( [:] )
            unitAdditionalBuild = [:]
            abstractDefault = [:]
        }
    }

    static Class getDefaultTestDataConfigClass() {
        GroovyClassLoader classLoader = new GroovyClassLoader(TestDataConfigurationHolder.classLoader)
        String testDataConfig = Holders.config?.grails?.buildtestdata?.testDataConfig ?: 'TestDataConfig'
        try {
            return classLoader.loadClass(testDataConfig)
        } catch (ClassNotFoundException ignored) {
            log.warn "${testDataConfig}.groovy not found, build-test-data plugin proceeding without config file"
            return null
        }
    }

    static boolean isPluginEnabled() {
        return !(configFile?.testDataConfig?.enabled == false)
    }

    static Map getSampleData() {
        if (sampleData == null) loadTestDataConfig()
        return sampleData
    }

    static setSampleData(String configObjectText) {
        setSampleData( configSlurper.parse(configObjectText) )
    }

    static setSampleData(Map configObjectMap) {
        sampleData = configObjectMap
        sampleDataIndexer = [:]
    }

    static getConfigFor(String domainName) {
        return sampleData."$domainName"
    }

    static getUnitAdditionalBuildFor(String domainName) {
        unitAdditionalBuild."$domainName"
    }

    static getAbstractDefaultFor(String domainName) {
        abstractDefault."${domainName}"
    }

    static getConfigPropertyNames(String domainName) {
        return getConfigFor(domainName)?.keySet() ?: []
    }

    static getSuppliedPropertyValue(propertyValues, domainName, propertyName) {
        return retrievePropertyValue(propertyValues, sampleData."$domainName"?."$propertyName")
    }

    private static retrievePropertyValue(propertyValues, Closure closure) {
        return closure.maximumNumberOfParameters > 0 ? closure.call(propertyValues) : closure.call()
    }

    private static retrievePropertyValue(propertyValues, value) {
        return value
    }

    static getPropertyValues(domainName, propertyNames, Map propertyValues = [:]) {
        for (propertyName in propertyNames) {
            propertyValues[propertyName] = getSuppliedPropertyValue(propertyValues, domainName, propertyName)
        }
        return propertyValues
    }
}
