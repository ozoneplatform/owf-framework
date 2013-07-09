package ozone.owf.grails.services

import grails.test.*
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration

class CustomHeaderFooterServiceTests extends GrailsUnitTestCase {

    def service, mockConfigService, multiConfig, singleConfig, emptyConfig, nullConfig
    def configValue1 = "20"
    def configValue2 = "config2"
    def multiConfigCode = "multiCode"
    def singleConfigCode = "singleCode"

    @Override
    protected void setUp() {
        super.setUp()

        mockConfigService = mockFor(OwfApplicationConfigurationService)
        multiConfig = new ApplicationConfiguration(code: multiConfigCode, value: "$configValue1,$configValue2")
        singleConfig = new ApplicationConfiguration(code: singleConfigCode, value: "$configValue1")
        emptyConfig = new ApplicationConfiguration(code: "emptyConfig", value: "")
        nullConfig = new ApplicationConfiguration(code: "nullConfig", value: null)
        mockDomain(ApplicationConfiguration, [multiConfig, singleConfig, emptyConfig, nullConfig])

        service = new CustomHeaderFooterService()
        service.owfApplicationConfigurationService = mockConfigService.createMock()
    }

    void testEmptyStringInJsImportConfigReturnsAnEmptyList() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> emptyConfig }
        def jsList = service.getJsImportsAsList()
        assertEquals jsList, []
    }

    void testEmptyStringInCssImportConfigReturnsAnEmptyList() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> emptyConfig }
        def cssList = service.getCssImportsAsList()
        assertEquals cssList, []
    }

    void testNullConfigInJsImportReturnsAnEmptyList() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> nullConfig }
        def jsList = service.getJsImportsAsList()
        assertEquals jsList, []
    }

    void testNullConfigInCssImportReturnsAnEmptyList() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> nullConfig }
        def cssList = service.getCssImportsAsList()
        assertEquals cssList, []
    }

    void testSingleValueJsImport() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> singleConfig }
        def jsList = service.getJsImportsAsList()
        assertEquals jsList, [configValue1]
    }

    void testSingleValueCssImport() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> singleConfig }
        def cssList = service.getCssImportsAsList()
        assertEquals cssList, [configValue1]
    }

    void testMultiValueJsImport() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> multiConfig }
        def jsList = service.getJsImportsAsList()
        assertEquals jsList, [configValue1, configValue2]
    }

    void testMultiValueCssImport() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> multiConfig }
        def cssList = service.getCssImportsAsList()
        assertEquals cssList, [configValue1, configValue2]
    }

    void testNullHeaderHeightReturnsZero() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> nullConfig }
        def headerHeight = service.getCustomHeaderHeight()
        assertEquals headerHeight, 0
    }

    void testEmptyHeaderHeightReturnsZero() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> emptyConfig }
        def headerHeight = service.getCustomHeaderHeight()
        assertEquals headerHeight, 0
    }

    void testNullFooterHeightReturnsZero() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> nullConfig }
        def footerHeight = service.getCustomFooterHeight()
        assertEquals footerHeight, 0
    }

    void testEmptyFooterHeightReturnsZero() {
        mockConfigService.demand.getApplicationConfiguration(0..1) { code -> emptyConfig }
        def footerHeight = service.getCustomFooterHeight()
        assertEquals footerHeight, 0
    }
}
