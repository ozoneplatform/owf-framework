package ozone.owf.grails.controllers

import grails.converters.JSON
import static ozone.owf.enums.OwfApplicationSetting.*

/**
 * User controller.
 */
class ConfigController {

    def accountService
    def grailsApplication
    def preferenceService
    def themeService
    def serviceModelService
    def customHeaderFooterService
    def owfApplicationConfigurationService


    def config = {
        def curUser = accountService.getLoggedInUser()

        def widgetNamesResults = preferenceService.show([namespace: 'owf.custom.widgetprefs',
                path: 'widgetNames'])
        def widgetNames = widgetNamesResults.preference?.value ? widgetNamesResults.preference.value : [:] as JSON

        def bannerStateResults = preferenceService.show([namespace: 'owf.banner',
                path: 'state'])
        def bannerState = bannerStateResults.preference?.value ? bannerStateResults.preference.value : [:] as JSON

        def pDate = new Date()
        def pDateString = null
        if (curUser.prevLogin != null) {
          pDate = curUser.prevLogin
        }
        pDateString = prettytime.display(date: pDate).toString()
        if ("1 day ago".equalsIgnoreCase(pDateString)) { pDateString = 'Yesterday' }

        def groups = []
        curUser.groups.each { 
            if (!it.stackDefault) { groups.add(serviceModelService.createServiceModel(it)) }
        }
        def emailString = curUser.email != null ? curUser.email : ''

        def isAdmin = accountService.getLoggedInUserIsAdmin()

        def curUserResult = [displayName: curUser.username, userRealName:curUser.userRealName,
                prevLogin: pDate, prettyPrevLogin: pDateString, id:curUser.id, groups:groups, email: emailString,
                isAdmin: isAdmin] as JSON

        def themeResults = themeService.getCurrentTheme()
        def theme = [:]

        //use only key information
        theme["themeName"] =  themeResults["name"]
        theme["themeContrast"] =  themeResults["contrast"]
        theme["themeFontSize"] =  themeResults["owf_font_size"]
        
        //copy owf section of grails config, removing sensitive properties
        def conf = grailsApplication.config.owf.clone()
        conf.metric = conf.metric.findAll { 
            ! (it.key in ['keystorePass', 'truststorePass', 'keystorePath', 'truststorePath'])
        }

        conf.customHeaderFooter = customHeaderFooterService.configAsMap
        conf.backgroundURL =  owfApplicationConfigurationService.getApplicationConfiguration(CUSTOM_BACKGROUND_URL).value

        render(view: 'config_js',
                model: [
                  user: curUserResult,
                  widgetNames: widgetNames,
                  bannerState: bannerState,
                  currentTheme: theme as JSON,
                  conf: conf as JSON
                 ],
                contentType: 'text/javascript')
    }

}
