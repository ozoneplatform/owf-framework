package ozone.owf.grails.controllers

import grails.util.Environment
import org.hibernate.FetchMode
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition

import static ozone.owf.enums.OwfApplicationSetting.*
import ozone.owf.grails.OwfException

import ozone.security.SecurityUtils

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
    def dashboardService
    def personWidgetDefinitionService

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
        def conf = grailsApplication.config.owf.clone()
        conf.metric = conf.metric.findAll {
            ! (it.key in ['keystorePass', 'truststorePass', 'keystorePath', 'truststorePath'])
        }

        String showAccessAlert = grailsApplication.config.owf.showAccessAlert
        String sessionShowAccessAlert = session.getAttribute('showAccessAlert')
        //not null or empty
        if (sessionShowAccessAlert) {
            showAccessAlert = sessionShowAccessAlert
        }

        conf.showAccessAlert = showAccessAlert

        conf.with {
            customHeaderFooter = this.customHeaderFooterService.configAsMap
            showAccessAlert = this.grailsApplication.config.owf.showAccessAlert
            loginCookieName = Environment.current == Environment.DEVELOPMENT ?
                null : SecurityUtils.LOGIN_COOKIE_NAME

            backgroundURL =
                this.owfApplicationConfigurationService.getApplicationConfiguration(CUSTOM_BACKGROUND_URL)?.value
            freeTextEntryWarningMessage =
                this.owfApplicationConfigurationService.getApplicationConfiguration(FREE_WARNING_CONTENT)?.value ?: ""
            notificationsPollingInterval =
                this.grailsApplication.config.notifications.xmpp.query.interval ?: 30
            notificationsEnabled =
                this.grailsApplication.config.notifications.enabled ?: false
        }

        // whether the show animations user preference exists
        def showAnimations = false,
            showHints = false

        try {
            def showAnimationsPreference = preferenceService.showForUser([
                namespace: "owf",
                path: "show-animations"
            ]);
            def showHintsPreference = preferenceService.showForUser([
                namespace: "owf",
                path: "show-hints"
            ]);
            showAnimations =
                (showAnimationsPreference?.preference) ? (true) : (false)

            showHints =
                (showHintsPreference?.preference == null || showHintsPreference?.preference.value == 'true') ? (true) : (false)
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
            appComponentsViewState = preferenceService.showForUser([
                namespace: "owf",
                path: "appcomponent-view"
            ])
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
