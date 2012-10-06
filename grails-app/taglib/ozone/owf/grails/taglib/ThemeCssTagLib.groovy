package ozone.owf.grails.taglib

import ozone.owf.grails.services.ThemeService

import org.springframework.context.*
import java.util.NoSuchElementException
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes

class ThemeCssTagLib implements ApplicationContextAware {

    static namespace = 'owfCss'

    def themeService
    def applicationContext

    def defaultCssPath = {
        out << themeService.getCurrentTheme().css.toString()
    }

    def getCurrentThemeName = {
        out << themeService.getCurrentTheme().name.toString()
    }

    void setApplicationContext(ApplicationContext applicationContext) { 
        this.applicationContext = applicationContext
    }
}
