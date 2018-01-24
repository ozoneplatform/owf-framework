package ozone.owf.grails.taglib

import grails.util.Environment

import org.springframework.core.io.Resource

import ozone.owf.grails.services.ThemeService

import static org.grails.plugins.web.taglib.ApplicationTagLib.getAttributesToRender


class OwfTagLib {

    static namespace = 'owf'

    public static final String INTERNAL_JAVASCRIPT_PATH = "static/js"
    public static final String INTERNAL_JAVASCRIPT_CLASSPATH = "classpath:public/js"
    public static final String EXTERNAL_JAVASCRIPT_PATH = "static/vendor"

    public static final String THEME_PATH = "static/themes"

    public static final String STYLESHEET_MEDIA_DEFAULT = "screen, projection"

    ThemeService themeService

    Closure javascript = { Map attrs, Closure body ->
        if (!attrs.src) {
            createInlineJavascript(attrs, body)
            return
        }

        String scriptUrl = findInternalJavascriptUrl(attrs.remove('src') as String)

        createLinkedJavascript(attrs, "$INTERNAL_JAVASCRIPT_PATH/$scriptUrl")
    }

    private String findInternalJavascriptUrl(String scriptUrl) {
        if (Environment.current != Environment.PRODUCTION) {
            return scriptUrl
        }

        String minifiedUrl = scriptUrl.replaceAll(/\.js$/, ".min.js")

        Resource resource = grailsApplication.mainContext.getResource("$INTERNAL_JAVASCRIPT_CLASSPATH/$minifiedUrl")

        resource.exists() ? minifiedUrl : scriptUrl
    }

    Closure vendor = { Map attrs, Closure body ->
        String scriptUrl = attrs.remove('src')
        if (!scriptUrl) {
            throwTagError("'vendor' tag must include a 'src' attribute")
        }

        createLinkedJavascript(attrs, "$EXTERNAL_JAVASCRIPT_PATH/$scriptUrl")
    }

    Closure configScript = { Map attrs ->
        // Ignore the 'src' attribute, should not be provided in tag
        attrs.remove('src')

        createLinkedJavascript(attrs, 'js/config/config.js')
    }

    Closure stylesheet = { Map attrs, Closure body ->
        // Ignore the 'href' attribute, should use 'src' instead
        attrs.remove('href')

        if (!attrs.src) {
            createInlineStylesheet(attrs, body)
            return
        }

        String stylesheetUrl = attrs.remove('src')
        createLinkedStylesheet(attrs, stylesheetUrl)
    }

    Closure themeStylesheet = { attrs ->
        // Ignore the 'src' attribute, should not be provided in tag
        attrs.remove('src')

        if (!attrs.id) {
            attrs.id = 'theme'
        }

        String themeName = attrs.remove('theme')
        if (themeName) {
            String encoded = themeName.encodeAsURL().encodeAsHTML()
            createLinkedStylesheet(attrs, "$THEME_PATH/${encoded}.theme/css/${encoded}.css")
            return
        }

        String themeUrl = getCurrentThemeUrl()
        if (!themeUrl) {
            createEmptyStylesheet(attrs)
            return
        }

        createLinkedStylesheet(attrs, themeUrl)
    }

    Closure bootstrapStylesheet = { Map attrs ->
        // Ignore the 'src' attribute, should not be provided in tag
        attrs.remove('src')

        if (!attrs.id) {
            attrs.id = 'bootstrap'
        }

        String themeUrl = getCurrentThemeUrl()
        if (!themeUrl) {
            createEmptyStylesheet(attrs)
            return
        }

        def bootstrapUrl = (themeUrl =~ /[^\/]+$/).replaceFirst('bootstrap_main.css')

        createLinkedStylesheet(attrs, bootstrapUrl)
    }

    Closure beforeIE8 = { Map attrs, Closure body ->
        out.println '<!--[if lt IE 8]>'
        out << body()
        out.println '<![endif]-->'
    }

    private String getCurrentThemeUrl() {
        String currentTheme = themeService.getCurrentTheme()?.css?.toString()

        !(currentTheme == null || currentTheme.isEmpty()) ? currentTheme : null
    }

    private void createLinkedJavascript(Map attrs, String url) {
        String context = attrs.remove('context') ?: request.contextPath ?: ""

        Map constants = [type: attrs.remove('type') ?: 'text/javascript',
                         src : "$context/$url"]

        out.println """<script${attributes(constants, attrs)}></script>"""
    }

    private void createInlineJavascript(Map attrs, Closure body) {
        Map constants = [type: attrs.remove('type') ?: 'text/javascript']

        out.println """<script${attributes(constants, attrs)}>"""
        out << body()
        out.println()
        out.println '</script>'
    }

    private void createLinkedStylesheet(Map attrs, String url, boolean isAbsolute = false) {
        String context = attrs.remove('context') ?: request.contextPath ?: ""

        Map constants = [id   : attrs.remove('id'),
                         rel  : attrs.remove('rel') ?: 'stylesheet',
                         type : attrs.remove('type') ?: 'text/css',
                         media: attrs.remove('media') ?: STYLESHEET_MEDIA_DEFAULT,
                         href : isAbsolute ? "$url" : "$context/$url"]

        out.println """<link${attributes(constants, attrs)} />"""
    }

    private void createInlineStylesheet(Map attrs, Closure body) {
        Map constants = [type: attrs.remove('type') ?: 'text/css']

        out.println """<style${attributes(constants, attrs)}>"""
        out << body()
        out.println()
        out.println '</style>'
    }

    private void createEmptyStylesheet(Map attrs) {
        createLinkedStylesheet(attrs, 'about:blank', true)
    }

    private static String attributes(Map constants, Map attrs) {
        getAttributesToRender(constants, attrs)
    }

}
