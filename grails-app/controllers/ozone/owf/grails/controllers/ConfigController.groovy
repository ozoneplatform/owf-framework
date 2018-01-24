package ozone.owf.grails.controllers

import grails.core.GrailsApplication
import grails.util.Environment

import ozone.owf.enums.OwfApplicationSetting
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.*
import ozone.security.SecurityUtils


class ConfigController {

    GrailsApplication grailsApplication

    AccountService accountService

    PreferenceService preferenceService

    ThemeService themeService

    ServiceModelService serviceModelService

    CustomHeaderFooterService customHeaderFooterService

    OwfApplicationConfigurationService owfApplicationConfigurationService

    DashboardService dashboardService

    PersonWidgetDefinitionService personWidgetDefinitionService

    def config = {
        def curUser = accountService.getLoggedInUser()

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

        def curUserResult = [
            displayName: curUser.username,
            userRealName:curUser.userRealName,
            prevLogin: pDate,
            prettyPrevLogin: pDateString,
            id:curUser.id,
            groups:groups,
            email: emailString,
            isAdmin: isAdmin
        ]

        def themeResults = themeService.getCurrentTheme()
        def theme = [:]

        //use only key information
        theme["themeName"] =  themeResults["name"]
        theme["themeContrast"] =  themeResults["contrast"]
        theme["themeFontSize"] =  themeResults["owf_font_size"]

        //copy owf section of grails config, removing sensitive properties
        Map conf = grailsApplication.config.owf.clone() as Map
        conf.metric = conf.metric.findAll {
            ! (it.key in ['keystorePass', 'truststorePass', 'keystorePath', 'truststorePath'])
        }

        String showAccessAlert = grailsApplication.config.getProperty('owf.showAccessAlert', Boolean, false)
        String sessionShowAccessAlert = session.getAttribute('showAccessAlert')
        //not null or empty
        if (sessionShowAccessAlert) {
            showAccessAlert = sessionShowAccessAlert
        }

        conf.showAccessAlert = showAccessAlert

        conf.with {
            customHeaderFooter = this.customHeaderFooterService.configAsMap

            loginCookieName = (Environment.current == Environment.DEVELOPMENT) ? null : SecurityUtils.LOGIN_COOKIE_NAME

            backgroundURL =
                this.owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.CUSTOM_BACKGROUND_URL)?.value
            freeTextEntryWarningMessage =
                this.owfApplicationConfigurationService.getApplicationConfiguration(OwfApplicationSetting.FREE_WARNING_CONTENT)?.value ?: ""
            notificationsPollingInterval =
                this.grailsApplication.config.getProperty('notifications.xmpp.query.interval', Integer, 30)
            notificationsEnabled =
                this.grailsApplication.config.getProperty('notifications.enabled', Boolean, false)
        }

        // whether the show animations user preference exists
        boolean showAnimations = false
        boolean showHints = false

        try {
            def showAnimationsPreference = preferenceService.showForUser([namespace: "owf", path: "show-animations"])
            showAnimations = showAnimationsPreference?.preference?.value == 'true' ?: false

            def showHintsPreference = preferenceService.showForUser([namespace: "owf", path: "show-hints"])
            showHints = showHintsPreference?.preference?.value == 'true' ?: true
        }
        catch(OwfException owe) {
            handleError(owe)
        }

        conf.currentTheme = theme
        conf.user = curUserResult
        conf.showAnimations = showAnimations
        conf.showHints = showHints

        def initialData = getInitialData(curUser)

        render(view: 'config_js',
                model: [
                  conf: conf,
                    initialData: initialData
                 ],
                contentType: 'text/javascript')
    }

    private getInitialData(Person user){
        def appComponentsViewState

        try {
            appComponentsViewState = preferenceService.showForUser([namespace: "owf", path: "appcomponent-view"])
            appComponentsViewState?.preference = appComponentsViewState?.preference?.value
        }
        catch (OwfException owe) {
            handleError(owe)
        }

        return [
            appComponentsViewState: appComponentsViewState
        ]
    }
}
