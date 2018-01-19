package ozone.owf.grails.services

import ozone.owf.enums.OwfApplicationSetting


class CustomHeaderFooterService {

    OwfApplicationConfigurationService owfApplicationConfigurationService

    def getConfigAsMap() {
        def configurationMap = [:]

        configurationMap.with {
            header = getCustomHeaderUrl()
            headerHeight = getCustomHeaderHeight()
            footer = getCustomFooterUrl()
            footerHeight = getCustomFooterHeight()
            jsImports = getJsImportsAsList()
            cssImports = getCssImportsAsList()
        }

        configurationMap
    }

    def getCssImportsAsList() {
        def cssConfigItem = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_CSS_IMPORTS)?.value

        cssConfigItem?.size() > 0 ? cssConfigItem.split(",") : []
    }

    def getJsImportsAsList() {
        def jsConfigItem = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_JS_IMPORTS)?.value

        jsConfigItem?.size() > 0 ? jsConfigItem.split(",") : []
    }

    def getCustomHeaderUrl() {
        def headerConfig = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_HEADER_URL)?.value

        headerConfig?.size() > 0 ? headerConfig : ""
    }

    def getCustomFooterUrl() {
        def footerConfig = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_FOOTER_URL)?.value

        footerConfig?.size() > 0 ? footerConfig : ""

    }

    def getCustomHeaderHeight() {
        def heightConfig = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_HEADER_HEIGHT)?.value

        heightConfig?.size() > 0 ? heightConfig.toInteger() : 0
    }

    def getCustomFooterHeight() {
        def heightConfig = owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_FOOTER_HEIGHT)?.value

        heightConfig?.size() > 0 ? heightConfig.toInteger() : 0
    }
}
