package ozone.owf.grails.domain

import spock.lang.Specification


class StackSpec extends Specification
        implements DomainConstraintsUnitTest<Stack> {

    void "successful validation"() {
        given:
        domain.with {
            name = "the name"
            description = "the description"
            stackContext = "the context"
            imageUrl = "the url"
            descriptorUrl = "the url"
        }

        expect:
        domain.validate()
    }

    void "required properties"() {
        expect:
        propertyIsRequired('name')
        propertyIsRequired('stackContext')
    }

    void "max size properties"() {
        expect:
        propertyHasMaxSize('name', 256)
        propertyHasMaxSize('stackContext', 200)
        propertyHasMaxSize('imageUrl', 2083)
        propertyHasMaxSize('descriptorUrl', 2083)
    }

}
