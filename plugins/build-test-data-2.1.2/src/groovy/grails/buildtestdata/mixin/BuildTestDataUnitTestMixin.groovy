package grails.buildtestdata.mixin

import grails.buildtestdata.BuildTestDataService
import grails.buildtestdata.DomainUtil
import grails.buildtestdata.TestDataConfigurationHolder
import grails.test.mixin.domain.DomainClassUnitTestMixin
import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
import org.codehaus.groovy.grails.commons.GrailsClassUtils
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty
import org.codehaus.groovy.grails.plugins.DomainClassGrailsPlugin
import org.codehaus.groovy.grails.plugins.web.ControllersGrailsPlugin
import org.codehaus.groovy.grails.validation.ConstrainedProperty
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.core.type.filter.AssignableTypeFilter
import org.springframework.beans.factory.config.BeanDefinition
import org.junit.After

import java.lang.reflect.Modifier

/**
 * This mixin replaces the use of the Grails @Mock annotation. The list of
 * classes given to @Build is used in a few ways:
 *
 * 1. The given classes are directly included for mocking
 * 2. Any non-nullable classes referenced by the initial class are found and included
 * 3. If any of the classes are abstract, a (random) concrete subclass is included for mocking
 * 4. If any of the classes have a parent class, the parent is included for mocking
 *
 * In Grails 2.2.1/2.1.4 and later, all of the classes to mock are aggregated into a single
 * list and mockDomains() is called once. For earlier versions, mockDomain is called for each
 * individual class.
 *
 * Since @Build necessarily includes additional classes in the graph (even if those classes are
 * not used by the test), it may perform worse than @Mock for complex object graphs.
 */
class BuildTestDataUnitTestMixin extends DomainClassUnitTestMixin {
    static Map<String, List<GrailsDomainClass>> subClassCache = [:]
    static {
        TestDataConfigurationHolder.loadTestDataConfig()
    }

    private BuildTestDataService buildTestDataService

    @After
    void cleanupBuildTestData() {
        buildTestDataService = null
    }

    /**
     * Mock the given classes for use by Grails and build-test-data.
     *
     * @param classesToMock
     */
    void mockForBuild(List<Class> classesToMock) {
        DomainUtil.setApplication(grailsApplication)

        if (!buildTestDataService) {
            buildTestDataService = new BuildTestDataService()
        }

        // Convert the list of classes given to GrailsDomainClass instances. We want to do this without
        // fully mocking so that we can get the full list of classes to mock and make a single
        // call to mockDomains() later with all the of the needed classes.
        List<GrailsDomainClass> initialDomainClassesToMock = classesToMock.collect {
            getGrailsDomainClass(it)
        }

        // Resolve additional classes to mock
        List<GrailsDomainClass> domainClassesToMock = findDomainClassesToMock(initialDomainClassesToMock)
        // println "*** Resolved domains to mock: ${domainClassesToMock*.name}"

        // Do the actual Grails mocking
        mockGrailsDomainClasses( domainClassesToMock.collect { it.clazz } )

        // Decorate with build*() methods
        domainClassesToMock.each {
            buildTestDataService.decorateWithMethods(it)
        }
    }

    /**
     * Takes an initial list of domain classes and resolves the full list of domain classes
     * to be mocked. This includes required objects, subclasses, & parent classes.
     *
     * @param domainClassesToMock
     */
    private List<GrailsDomainClass> findDomainClassesToMock(List<GrailsDomainClass> domainClassesToMock) {
        addAdditionalBuildClasses(domainClassesToMock)

        // Recursively find all the associated domain classes which are non-nullable
        Map<String, GrailsDomainClass> requiredDomains = [:]
        domainClassesToMock.each {
            findRequiredDomainTypes(it, requiredDomains)
        }
        domainClassesToMock.addAll(requiredDomains.values())

        // Subclasses
        List<GrailsDomainClass> subClasses = []
        domainClassesToMock.each {
            if( it.isAbstract() ) {
                subClasses.addAll(findDomainSubclasses(it))
            }
        }
        // Superclasses
        List<GrailsDomainClass> superClasses = []
        domainClassesToMock.each {
            superClasses.addAll(findDomainSuperclasses(it))
        }

        domainClassesToMock.addAll(subClasses)
        domainClassesToMock.addAll(superClasses)

        // One last pass to pick up other transitive dependenices
        addAdditionalBuildClasses(domainClassesToMock)

        // Make sure we don't have any duplicates, only want to mock once
        domainClassesToMock.unique { GrailsDomainClass gdc ->
            gdc.fullName
        }
    }

    /**
     * Mock the domain class for use by Grails. This methods should handle older versions of Grails
     * for backward compatibility.
     *
     * @param clazz
     */
    private mockGrailsDomainClasses(List<Class> classes) {
        // Use the single method version if available, older Grails versions will fall back to the single mock method
        if ( this.respondsTo("mockDomains") ) {
            mockDomains(classes as Class[])
        }
        else {
           classes.each {
               // Pre 2.2.1, you mock each domain individually and you can't mock abstract classes
               if( !Modifier.isAbstract(it.getModifiers()) ) {
                   mockDomain(it)
               }
           }
        }
    }

    /**
     * Get and/or register the given class. Mock registers the domain classes, but we need
     * to be able to work with them as domain classes prior to calling mock. Thus the need to
     * repeat this bit of the test code.
     *
     * @param clazz
     * @return
     */
    private GrailsDomainClass getGrailsDomainClass(Class clazz) {
        boolean isAbstract = Modifier.isAbstract(clazz.getModifiers())

        // If this isn't an abstract class,
        GrailsDomainClass domainClass = null
        if( !isAbstract ) {
            domainClass = grailsApplication.getDomainClass(clazz.name) as GrailsDomainClass
        }

        if ( !domainClass || isAbstract ) {
            // Grails 2.2.1 and later split registration into a method which we can use. For older versions,
            // we can just do the bare minimum to get an instance of the domain class.
            if ( this.respondsTo("registerGrailsDomainClass") ) {
                domainClass = registerGrailsDomainClass(clazz)
            }
            else {
                domainClass = grailsApplication.addArtefact(DomainClassArtefactHandler.TYPE, clazz) as GrailsDomainClass
                final mc = GrailsClassUtils.getExpandoMetaClass(clazz)
                ControllersGrailsPlugin.enhanceDomainWithBinding(applicationContext, domainClass, mc)
                DomainClassGrailsPlugin.registerConstraintsProperty(mc, domainClass)
            }
        }
        domainClass
    }

    /**
     * Recursively find all of the required domain classes for domain artefact and add to the _requiredDomains_ list.
     *
     * @param domainArtefact
     * @param requiredDomains running list of domain classes required so far
     */
    private void findRequiredDomainTypes(GrailsDomainClass domainArtefact, Map<String, GrailsDomainClass> requiredDomains) {
        List<GrailsDomainClass> domains = domainArtefact.constrainedProperties.values().findResults { ConstrainedProperty constrainedProperty ->
            GrailsDomainClassProperty property = domainArtefact.getPersistentProperty(constrainedProperty.propertyName)

            if (property?.association && !constrainedProperty.nullable) {
                Class type = property.referencedPropertyType ?: property.type

                // If this is a domain class and it's not already been registered, register it and add to the list
                if (type && DomainClassArtefactHandler.isDomainClass(type)) {
                    return getGrailsDomainClass(type)
                }
            }

            return null
        } as List<GrailsDomainClass>

        // Recursively find all required. Make sure we only look at each domain once
        domains.each {
            if( !requiredDomains.containsKey(it.fullName) ) {
                requiredDomains[it.fullName] = it
                findRequiredDomainTypes(it, requiredDomains)
            }
        }
    }

    /**
     * Find subclasses and return them for mocking. We can't really use the built-in
     * Grails way of doing this since it relies on building a map of all the domain objects and their superclasses.
     *
     * @param domainClass
     * @return list of subclasses for this parent
     */
    private List<GrailsDomainClass> findDomainSubclasses(GrailsDomainClass domainClass) {
        // Finding subclasses is expensive, only do this once if possible for the whole run
        List<GrailsDomainClass> subClassList = []
        if( subClassCache.containsKey(domainClass.fullName) ) {
            subClassList = subClassCache[domainClass.fullName]
        }
        else {
            ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(true)
            provider.addIncludeFilter(new AssignableTypeFilter(domainClass.getClazz()))

            // Scan all packages
            Set<BeanDefinition> components = provider.findCandidateComponents("")
            for(BeanDefinition it in components) {
                Class subClass = grailsApplication.classLoader.loadClass(it.beanClassName)

                // If this is a domain class and it's not been registered, register it and setup subclasses
                if ( DomainClassArtefactHandler.isDomainClass(subClass) ) {
                    GrailsDomainClass domainSubClass = getGrailsDomainClass(subClass)
                    subClassList << domainSubClass
                }
            }
        }

        // Add to the domain class so that the domain instance builder can use it later
        domainClass.getSubClasses().addAll(subClassList)
        subClassCache[domainClass.fullName] = subClassList
        subClassList
    }

    /**
     * Find all domain superclasses for the given domain class
     *
     * @param domainClass
     * @return list of superclasses
     */
    private List<GrailsDomainClass> findDomainSuperclasses(GrailsDomainClass domainClass) {
        List<GrailsDomainClass> list = []

        Class superClass = domainClass.clazz.superclass
        while( superClass ) {
            if ( DomainClassArtefactHandler.isDomainClass(superClass ) ) {
                list << getGrailsDomainClass(superClass)
                superClass = superClass.superclass
            }
            else {
                superClass = null
            }
        }

        list
    }

    /**
     * Take the given list of domain classes and add an additional classes specified
     * in the unitAdditionalBuild configuration.
     *
     * @param domainClasses this collection is modified to add additional classes
     */
    private void addAdditionalBuildClasses(List<GrailsDomainClass> domainClasses) {
        def additionalClasses = []
        domainClasses.each {
            additionalClasses.addAll resolveAdditionalBuildClasses(it.fullName)
        }
        domainClasses.addAll(additionalClasses)
    }

    private List<GrailsDomainClass> resolveAdditionalBuildClasses(String domainName, List<GrailsDomainClass> circularList = []) {
        def classes = []
        def eagerLoad = TestDataConfigurationHolder.getUnitAdditionalBuildFor(domainName)
        if (eagerLoad) {
            for(eagerDomain in eagerLoad) {
                // Prevent looping forever
                String eagerDomainName = eagerDomain instanceof Class ? eagerDomain.name : eagerDomain.toString()
                if (!circularList.find { it.fullName == eagerDomainName } ) {
                    classes.addAll resolveAdditionalBuildClasses(eagerDomainName, classes)
                }
            }
            classes.addAll( eagerLoad.collect { property ->
                if (!(property instanceof Class)) {
                    property = grailsApplication.classLoader.loadClass(property as String)
                }
                getGrailsDomainClass(property as Class)
            })
        }
        classes
    }
}
