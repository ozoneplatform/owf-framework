package grails.buildtestdata

class BuildTestDataService {

    static transactional = false

    private domainInstanceBuilders = [:]

    void decorateWithMethods(domainArtefact) {
        addBuildMethods(domainArtefact)
    }

    void addBuildMethods(domainArtefact) {
        log.debug "Adding build methods to $domainArtefact"

        def domainInstanceBuilder = new DomainInstanceBuilder(domainArtefact)

        domainInstanceBuilders[domainArtefact] = domainInstanceBuilder

        def domainClass = domainArtefact.clazz

        // call build() if you want the plugin to generate all of the missing required constraints for you
        domainClass.metaClass.'static'.build = {->
            domainInstanceBuilder.build([:])
        }

        // call buildLazy() if you want any instance that already exists, if there aren't any, just build one
        domainClass.metaClass.'static'.buildLazy = {->
            domainInstanceBuilder.findExisting() ?: domainInstanceBuilder.build([:])
        }

        // call buildWithoutSave() if you want to manually save the object yourself (possibly to tweak some values)
        // this is likely more useful internal to the plugin than to plugin users, but there could be uses
        domainClass.metaClass.'static'.buildWithoutSave = {->
            domainInstanceBuilder.buildWithoutSave([:])
        }

        // call buildLazy(Map) if you want to find or create an object with a specific subset of property values
        domainClass.metaClass.'static'.buildLazy = { Map propValues ->
            domainInstanceBuilder.findExisting(propValues) ?: domainInstanceBuilder.build(propValues)
        }

        // call build(Map) if you want to set values for some of the required constraints, but autogenerate others
        domainClass.metaClass.'static'.build = { Map propValues ->
            domainInstanceBuilder.build(propValues)
        }

        domainClass.metaClass.'static'.buildWithoutSave = { propValues ->
            domainInstanceBuilder.buildWithoutSave(propValues)
        }

        // I'm not happy with how I had to copy circularCheckList into a ton of method signatures,
        // this might get refactored but I need to think on it more.
        domainClass.metaClass.'static'.build = { propValues, CircularCheckList circularCheckList ->
            domainInstanceBuilder.build(propValues, circularCheckList)
        }

        domainClass.metaClass.'static'.buildWithoutSave = { propValues, CircularCheckList circularCheckList ->
            domainInstanceBuilder.buildWithoutSave(propValues, circularCheckList)
        }

        domainClass.metaClass.buildCascadingSave = { circularTrap ->
            domainInstanceBuilder.save(delegate, circularTrap)
        }
    }

    def getDomainInstanceBuilder(domainArtefact) {
        return domainInstanceBuilders[domainArtefact]
    }
}
