package ozone.owf.grails.taglib

import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

import ozone.owf.grails.services.ThemeService


class ThemeCssTagLib implements ApplicationContextAware {

    static namespace = 'owfCss'

    static returnObjectForTags = ['defaultCssPath', 'bootstrapCssPath']

    ThemeService themeService

    ApplicationContext applicationContext

    def defaultCssPath = {
        themeService.getCurrentTheme().css.toString()
    }

    def bootstrapCssPath = {
        def mainTheme = themeService.getCurrentTheme().css.toString()

        //replace the file after the last directory
        def bootstrapTheme = (mainTheme =~ /[^\/]+$/).replaceFirst('bootstrap_main.css')

        bootstrapTheme
    }

    def getCurrentThemeName = {
        out << themeService.getCurrentTheme().name.toString()
    }

    void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext
    }
}
