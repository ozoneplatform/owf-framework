package grails.buildtestdata

class CircularCheckList extends LinkedHashMap {
    // TODO: look to see if we still need to force, if that adds anything
    def update(domain, force = false) {
        if (force || !this[domain.class.name]) {
            this[domain.class.name] = domain // should short circuit circular references
        }
    }
}
