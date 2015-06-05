package grails.buildtestdata

import static grails.buildtestdata.DomainUtil.*
import static grails.buildtestdata.TestDataConfigurationHolder.*
import grails.buildtestdata.handler.BlankConstraintHandler
import grails.buildtestdata.handler.ConstraintHandler
import grails.buildtestdata.handler.CreditCardConstraintHandler
import grails.buildtestdata.handler.EmailConstraintHandler
import grails.buildtestdata.handler.InListConstraintHandler
import grails.buildtestdata.handler.MatchesConstraintHandler
import grails.buildtestdata.handler.MaxConstraintHandler
import grails.buildtestdata.handler.MaxSizeConstraintHandler
import grails.buildtestdata.handler.MinConstraintHandler
import grails.buildtestdata.handler.MinSizeConstraintHandler
import grails.buildtestdata.handler.NullableConstraintHandler
import grails.buildtestdata.handler.RangeConstraintHandler
import grails.buildtestdata.handler.SizeConstraintHandler
import grails.buildtestdata.handler.UrlConstraintHandler
import grails.buildtestdata.handler.ValidatorConstraintHandler

import java.lang.reflect.Modifier

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.validation.ConstrainedProperty

class DomainInstanceBuilder {
    private static log = LogFactory.getLog(this)

    static CONSTRAINT_SORT_ORDER = [
        ConstrainedProperty.IN_LIST_CONSTRAINT, // most important
        ConstrainedProperty.EMAIL_CONSTRAINT,
        ConstrainedProperty.CREDIT_CARD_CONSTRAINT,
        ConstrainedProperty.URL_CONSTRAINT,
        ConstrainedProperty.RANGE_CONSTRAINT,
        ConstrainedProperty.SCALE_CONSTRAINT,
        ConstrainedProperty.SIZE_CONSTRAINT,
        ConstrainedProperty.MAX_CONSTRAINT,
        ConstrainedProperty.MIN_CONSTRAINT,
        ConstrainedProperty.MIN_SIZE_CONSTRAINT,
        ConstrainedProperty.MAX_SIZE_CONSTRAINT,
        ConstrainedProperty.MATCHES_CONSTRAINT,     // not implememnted, provide sample data
        ConstrainedProperty.VALIDATOR_CONSTRAINT,   // not implememnted, provide sample data
        ConstrainedProperty.BLANK_CONSTRAINT, // precluded by no '' default value applied in the nullable constraint handling
    ].reverse() // reverse so that when we compare, missing items are -1, then we are orders 0 -> n least to most important

    // TODO: filter to actual list for this class, or possibly each property value?
    def handlers =  [
            (ConstrainedProperty.MIN_SIZE_CONSTRAINT) : new MinSizeConstraintHandler(),
            (ConstrainedProperty.MAX_SIZE_CONSTRAINT) : new MaxSizeConstraintHandler(),
            (ConstrainedProperty.IN_LIST_CONSTRAINT) : new InListConstraintHandler(),
            (ConstrainedProperty.CREDIT_CARD_CONSTRAINT) : new CreditCardConstraintHandler(),
            (ConstrainedProperty.EMAIL_CONSTRAINT) : new EmailConstraintHandler(),
            (ConstrainedProperty.URL_CONSTRAINT) : new UrlConstraintHandler(),
            (ConstrainedProperty.RANGE_CONSTRAINT) : new RangeConstraintHandler(),
            (ConstrainedProperty.SIZE_CONSTRAINT) : new SizeConstraintHandler(),
            (ConstrainedProperty.MIN_CONSTRAINT) : new MinConstraintHandler(),
            (ConstrainedProperty.MAX_CONSTRAINT) : new MaxConstraintHandler(),
            (ConstrainedProperty.NULLABLE_CONSTRAINT) : new NullableConstraintHandler(),
            (ConstrainedProperty.MATCHES_CONSTRAINT) : new MatchesConstraintHandler(),
            (ConstrainedProperty.BLANK_CONSTRAINT) : new BlankConstraintHandler(),
            (ConstrainedProperty.VALIDATOR_CONSTRAINT) : new ValidatorConstraintHandler()
    ]

    def domainArtefact
    def domainClass
    def constrainedProperties
    def requiredPropertyNames
    def domainProperties
    def requiredDomainPropertyNames
    def propsToSaveFirst

    Map<Class, Boolean> keyTypeCache = [:]

    DomainInstanceBuilder(domainArtefact) {

        // If this is an abstract class, what we really want to do is find a concrete subclass since
        // we can't actually do anything with this base class. This happens when a class has an association
        // to an abstract base class in the object graph.
        if( (domainArtefact instanceof GrailsDomainClass) && domainArtefact.isAbstract() ) {
            domainArtefact = findConcreteSubclass(domainArtefact)
        }

        this.domainArtefact = domainArtefact
        this.domainClass = domainArtefact.clazz
        this.constrainedProperties = domainArtefact.constrainedProperties
        this.requiredPropertyNames = findRequiredPropertyNames(domainArtefact)
        this.domainProperties = findDomainProperties(domainArtefact)
        this.requiredDomainPropertyNames = findRequiredDomainPropertyNames(domainProperties, requiredPropertyNames)
        this.propsToSaveFirst = findPropsToSaveFirst()
    }

    def findRequiredPropertyNames(domainArtefact) {
        def constrainedProperties = domainArtefact.constrainedProperties
        def allPropertyNames = constrainedProperties.keySet()
        return allPropertyNames.findAll { propName ->
            !constrainedProperties."$propName".isNullable()
        }
    }

    def findDomainProperties(domainArtefact) {
        domainArtefact.constrainedProperties.values().findAll { constrainedProperty ->
            propertyIsToOneDomainClass(constrainedProperty.propertyType)
        }
    }

    def findRequiredDomainPropertyNames(domainProperties, requiredPropertyNames) {
        return domainProperties*.propertyName.intersect(requiredPropertyNames)
    }

    def findPropsToSaveFirst() {
        if (domainClass.metaClass.properties.name.contains('hasOne') && domainClass.hasOne in Map) {
            // this class is the owning side of the hasOne and should be saved before it
            return requiredDomainPropertyNames.findAll { domainClass.hasOne[it] == null }
        }
        requiredDomainPropertyNames
    }

    def findExisting() {
        // findWhere doesn't find any elements with an empty param map so we use list instead
        def list = domainClass.list(limit: 1)
        return list ? list.first() : null
    }

    def findExisting(propValues) {
        return domainClass.findWhere(propValues)
    }

    def buildWithoutSave(propValues, CircularCheckList circularCheckList = new CircularCheckList()) {
        def domainInstance = populateInstance(domainClass.create(), propValues, circularCheckList)
        circularCheckList.update(domainInstance, domainInstance.validate())
        return domainInstance
    }

    def build(propValues, CircularCheckList circularCheckList = new CircularCheckList()) {
        def domainInstance = populateInstance(domainClass.create(), propValues, circularCheckList)
        domainInstance = save(domainInstance)

        // TODO: do we really need to validate here?  What does that add?
        circularCheckList.update(domainInstance, domainInstance.validate())
        return domainInstance
    }

    def populateInstance(domainInstance, Map propValues, CircularCheckList circularCheckList) {
        propValues = findMissingConfigValues(propValues) + propValues

        for (property in propValues.keySet()) {
            setDomainPropertyValue(domainInstance, property, propValues[property])
        }

        def requiredMissingPropertyNames = (requiredPropertyNames - propValues.keySet()).findAll { propName ->
            !domainInstance."$propName"
        }

        if (log.debugEnabled) log.debug "requiredMissingPropertyNames for ${domainClass.name} = ${requiredMissingPropertyNames}"

        for (propName in requiredMissingPropertyNames) {
            createMissingProperty(domainInstance, propName, constrainedProperties["$propName"], circularCheckList)
        }

        return domainInstance
    }

    def setDomainPropertyValue(domainInstance, propertyName, value) {
        if (log.debugEnabled) log.debug "Setting ${domainClass.name}.$propertyName to $value"

        if (propertyName.contains('.')) {
            setValueOnNestedProperty(domainInstance, propertyName, value)
        } else {
            domainInstance."$propertyName" = value
        }

        GrailsDomainClass defDomain = getDomainArtefact(domainInstance.class) as GrailsDomainClass
        def domainProp = defDomain.propertyMap[propertyName]

        if (domainProp?.isManyToOne()) {
            // value is an Author and we're a Book, add us to the Author's set of books if there is one
            NullableConstraintHandler.addInstanceToOwningObjectCollection(value, domainInstance, domainProp)
        }
    }

    def setValueOnNestedProperty(domainInstance, propertyName, value) {
        // this is an embedded property, i.e. 'bar.foo' = 23
        def props = propertyName.split(/\./)
        props[0..-2].inject(domainInstance) { current, next -> current[next] }[props[-1]] = value
    }

    def findMissingConfigValues(propValues) {
        def missingProperties = getConfigPropertyNames(domainClass.name) - propValues.keySet()
        return getPropertyValues(domainClass.name, missingProperties, propValues)
    }

    def createMissingProperty(domainInstance, propertyName, constrainedProperty, circularCheckList) {
        if (log.debugEnabled) log.debug "creating missing property domain ${domainInstance?.class?.name}, propname $propertyName"
        // first check if the default value satisfies the constraint
        // we could handle this like any other constraint except transient properties appear to be
        // non-nullable without actually having the nullable constraint
        new NullableConstraintHandler().handle(domainInstance, propertyName, null, constrainedProperty, circularCheckList)

        if (getErrors(constrainedProperty, domainInstance, propertyName).errorCount && !createProperty(domainInstance, propertyName, constrainedProperty, circularCheckList)) {
            if (log.warnEnabled) log.warn "failed to generate a valid value for $propertyName: ${domainInstance."$propertyName"} check for unsupported matches or custom validator constraint and supply a default value or may use a custom validator referencing other as yet unset properties on this domain - still trying"
        } else {
            if (log.debugEnabled) log.debug "${constrainedProperty.propertyName} - created value = ${domainInstance."$propertyName"}"
        }
    }

    def createProperty(domainInstance, propertyName, constrainedProperty, circularCheckList) {
        if (log.debugEnabled) log.debug "building value for ${domainInstance?.class?.name}.${constrainedProperty?.propertyName}"
        return sortedConstraints(constrainedProperty.appliedConstraints).find { appliedConstraint ->
            if (log.debugEnabled) log.debug "${domainInstance?.class?.name}.${appliedConstraint?.name} constraint, field before adjustment: ${domainInstance?."$propertyName"}"
            ConstraintHandler handler = handlers[appliedConstraint.name]
            if (handler) {
                handler.handle(domainInstance, propertyName, appliedConstraint, constrainedProperty, circularCheckList)
                if (log.debugEnabled) log.debug "${domainInstance?.class?.name}.$propertyName field after adjustment for ${appliedConstraint?.name}: ${domainInstance?."$propertyName"}"
            } else {
                if (log.warnEnabled) log.warn "Unable to find property generator handler for constraint ${appliedConstraint?.name}!"
            }

            if (!getErrors(constrainedProperty, domainInstance, propertyName).errorCount) {
                return true
            }
        }
    }

    def getErrors(constrainedProperty, domain, propertyName) {
        def errors = new MockErrors(this)
        constrainedProperty.validate(domain, domain."$propertyName", errors)
        return errors
    }

    def save(domainInstance, circularTrap = []) {
        if (circularTrap.contains(domainInstance) || domainInstance instanceof Enum) return

        if (propsToSaveFirst) {
            if (log.debugEnabled) log.debug "${domainInstance.class.name} found domainProps that we need to save first: ${propsToSaveFirst}"
            for (propertyName in propsToSaveFirst) {
                domainInstance."$propertyName".buildCascadingSave(circularTrap + domainInstance)
            }
        }

        boolean hasAssignedKey = isAssignedKey(domainInstance.getClass())
        if ((hasAssignedKey || domainInstance.ident() == null) && !domainInstance.save()) {
            throw new Exception("Unable to build valid ${domainInstance.class.name} instance, errors: [${domainInstance.errors.collect {'\t' + it + '\n'}}]")
        }

        if (!(hasAssignedKey || domainInstance.ident() == null)) {
            if (log.infoEnabled) log.info "After ${domainInstance.class.name}.save() $domainInstance, skipped because it already has a key and isn't assigned"
        }
        else {
            if (log.infoEnabled) log.info "After ${domainInstance.class.name}.save() $domainInstance, success!"
        }

        return domainInstance
    }

    def sortedConstraints(appliedConstraints) {
        return appliedConstraints.sort { a, b ->
            CONSTRAINT_SORT_ORDER.indexOf(b.name) <=> CONSTRAINT_SORT_ORDER.indexOf(a.name)
        }
    }

    /**
     * See if the given class (presumably a domain class) has an assigned key. We do this
     * by looking for and evaluating the static mapping block. This can come from the
     * GrailsDomainBinder, but that introduces a hibernate dependency.
     *
     * @param clazz
     * @return true if the class has a mapping block with an id(generator: '...') defined
     */
    private boolean isAssignedKey(Class clazz) {
        boolean assigned = false

        // See if we've already check this instance
        if( keyTypeCache.containsKey(clazz) ) {
            assigned = keyTypeCache[clazz]
        }
        else {
            // If the instance has a mapping property, evaluate the closure to see if it has an id
            // property which is assigned. This is done generically to avoid needing hibernate dependencies.
            def hasMapping = clazz.declaredFields.find { it.name == 'mapping' && Modifier.isStatic(it.modifiers) }
            if( hasMapping && clazz.mapping instanceof Closure) {
                MappingDelegate mappingDelegate = new MappingDelegate()

                // Evaluate the mapping block
                def mappingBlock = clazz.mapping.clone() as Closure
                mappingBlock.delegate = mappingDelegate
                mappingBlock.call()

                assigned = mappingDelegate.isAssigned
            }
        }

        // Sometimes the mapping block is in a parent class, we'll check those as well
        if( !assigned && clazz.superclass ) {
            assigned = isAssignedKey(clazz.superclass)
        }

        // Remember this class so we don't have to check again
        keyTypeCache[clazz] = assigned
        assigned
    }

    def findConcreteSubclass(GrailsDomainClass domainArtefact) {
        if (domainArtefact.isAbstract()) {
            // First see if we have a default defined for this domain class. If so,
            // we will use this. This is handy if you have alot of polymorphic associations to a
            // base class and want them to default to a certain type.
            def abstractDefault = getAbstractDefaultFor(domainArtefact.fullName)
            if (abstractDefault) {
                return grailsApplication.getArtefact(
                        "Domain",
                        abstractDefault instanceof Class ? abstractDefault.name : abstractDefault.toString()
                )
            }

            // Otherwise, let's see if we can just find a concrete subclass
            List<GrailsDomainClass> subclasses = domainArtefact.subClasses?.toList()
            if (subclasses) {
                // Sort to make the selection deterministic, this helps prevent random test failures from choosing
                // different concrete classes.
                GrailsDomainClass firstSubClass = subclasses.sort { it.fullName }.first()
                if (log.debugEnabled) {
                    log.debug("Getting first subclass ${firstSubClass.name} for abstract class ${domainArtefact.name}")
                }
                return findConcreteSubclass(firstSubClass)
            }

            throw new UnsupportedOperationException("Unable to create concreate instance for ${domainArtefact.name}")
        }
        else {
            return domainArtefact
        }
    }

    // Evaluate the mapping block to see if there is an id mapping with a generator defined
    // This is just a quick and dirty way to determine assigned keys without using hibernate
    static class MappingDelegate {
        boolean isAssigned = false
        def invokeMethod(String name, args) {
            if ( name == "id" && args && (args[0] instanceof Map) && args[0].generator ) {
                isAssigned = true
            }
        }
    }
}
