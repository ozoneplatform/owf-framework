package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.services.ServiceUnitTest

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration


class CustomHeaderFooterServiceSpec extends Specification implements ServiceUnitTest<CustomHeaderFooterService> {

    def configValue1 = "20"
    def configValue2 = "config2"

    OwfApplicationConfigurationService configService = Mock()

    void setup() {
        service.owfApplicationConfigurationService = configService
    }

    void testEmptyStringInJsImportConfigReturnsAnEmptyList() {
        given:
        configReturnsEmptyValue()

        expect:
        service.getJsImportsAsList() == []
    }

    void testEmptyStringInCssImportConfigReturnsAnEmptyList() {
        given:
        configReturnsEmptyValue()

        expect:
        service.getCssImportsAsList() == []
    }

    void testNullConfigInJsImportReturnsAnEmptyList() {
        given:
        configReturnsNullValue()

        expect:
        service.getJsImportsAsList() == []
    }

    void testNullConfigInCssImportReturnsAnEmptyList() {
        given:
        configReturnsNullValue()

        expect:
        service.getCssImportsAsList() == []
    }

    void testSingleValueJsImport() {
        given:
        configReturnsSingleValue()

        expect:
        service.getJsImportsAsList() == [configValue1]
    }

    void testSingleValueCssImport() {
        given:
        configReturnsSingleValue()

        expect:
        service.getCssImportsAsList() == [configValue1]
    }

    void testMultiValueJsImport() {
        given:
        configReturnsMultipleValues()

        expect:
        service.getJsImportsAsList() == [configValue1, configValue2]
    }

    void testMultiValueCssImport() {
        given:
        configReturnsMultipleValues()

        expect:
        service.getCssImportsAsList() == [configValue1, configValue2]
    }

    void testNullHeaderHeightReturnsZero() {
        given:
        configReturnsNullValue()

        expect:
        service.getCustomHeaderHeight() == 0
    }

    void testEmptyHeaderHeightReturnsZero() {
        given:
        configReturnsEmptyValue()

        expect:
        service.getCustomHeaderHeight() == 0
    }

    void testNullFooterHeightReturnsZero() {
        given:
        configReturnsNullValue()

        expect:
        service.getCustomFooterHeight() == 0
    }

    void testEmptyFooterHeightReturnsZero() {
        given:
        configReturnsEmptyValue()

        expect:
        service.getCustomFooterHeight() == 0
    }

    private void configReturnsEmptyValue() {
        configService.getApplicationConfiguration(*_) >>
                new ApplicationConfiguration(value: "")
    }

    private void configReturnsNullValue() {
        configService.getApplicationConfiguration(*_) >>
                new ApplicationConfiguration(value: null)
    }

    private void configReturnsSingleValue() {
        configService.getApplicationConfiguration(*_) >>
                new ApplicationConfiguration(value: "$configValue1")
    }

    private void configReturnsMultipleValues() {
        configService.getApplicationConfiguration(*_) >>
                new ApplicationConfiguration(value: "$configValue1,$configValue2")
    }

}
