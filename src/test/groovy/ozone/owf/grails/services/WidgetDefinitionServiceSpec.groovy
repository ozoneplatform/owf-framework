package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.services.ServiceUnitTest

import ozone.owf.grails.OwfException


class WidgetDefinitionServiceSpec extends Specification
        implements ServiceUnitTest<WidgetDefinitionService> {

    void testConvertJsonParamToDomainField() {
        expect:
        service.convertJsonParamToDomainField('value.namespace') == 'displayName'
    }

    void testConvertJsonParamToDomainFieldException() {
        when:
        service.convertJsonParamToDomainField('iwillneverexist')

        then:
        thrown(OwfException)
    }

}
