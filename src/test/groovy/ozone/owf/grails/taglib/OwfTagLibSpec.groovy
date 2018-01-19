package ozone.owf.grails.taglib

import spock.lang.Specification
import spock.lang.Unroll

import grails.testing.web.taglib.TagLibUnitTest

import ozone.owf.grails.services.ThemeService

import static ozone.owf.grails.taglib.OwfTagLib.*


class OwfTagLibSpec extends Specification implements TagLibUnitTest<OwfTagLib> {

    ThemeService themeService = Mock()

    void setup() {
        tagLib.themeService = themeService
    }

    @Unroll
    void "javascript: when context is '#context'"(String context, String src) {
        given:
        request.contextPath = context

        expect:
        template('<owf:javascript src="script.js" />') ==
                """<script type="text/javascript" src="$src"></script>"""

        where:
        context || src
        '/owf'  || "/owf/$INTERNAL_JAVASCRIPT_PATH/script.js"
        ''      || "/$INTERNAL_JAVASCRIPT_PATH/script.js"
        null    || "/$INTERNAL_JAVASCRIPT_PATH/script.js"
    }

    @Unroll
    void "stylesheet: when context is '#context'"(String context, String href) {
        given:
        request.contextPath = context

        expect:
        template('<owf:stylesheet src="stylesheet.css" />') ==
                """<link rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || '/owf/stylesheet.css'
        ''      || '/stylesheet.css'
        null    || '/stylesheet.css'
    }

    void "vendor: should link to external vendor script path"(String context, String src) {
        given:
        request.contextPath = context

        expect:
        template('<owf:vendor src="script.js" />') ==
                """<script type="text/javascript" src="$src"></script>"""

        where:
        context || src
        '/owf'  || "/owf/$EXTERNAL_JAVASCRIPT_PATH/script.js"
        ''      || "/$EXTERNAL_JAVASCRIPT_PATH/script.js"
        null    || "/$EXTERNAL_JAVASCRIPT_PATH/script.js"
    }

    void "configScript: should link to config.js endpoint"(String context, String src) {
        given:
        request.contextPath = context

        expect:
        template('<owf:configScript />') ==
                """<script type="text/javascript" src="$src"></script>"""

        where:
        context || src
        '/owf'  || '/owf/js/config/config.js'
        ''      || '/js/config/config.js'
        null    || '/js/config/config.js'
    }

    void "themeStylesheet: with 'theme' attr should use specified theme"(String context, String href) {
        given:
        request.contextPath = context

        expect:
        template('<owf:themeStylesheet theme="a_default"/>') ==
                """<link id="theme" rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || "/owf/$THEME_PATH/a_default.theme/css/a_default.css"
        ''      || "/$THEME_PATH/a_default.theme/css/a_default.css"
        null    || "/$THEME_PATH/a_default.theme/css/a_default.css"
    }

    void "themeStylesheet: without 'theme' attr should find current theme"(String context, String href) {
        given:
        themeService.getCurrentTheme() >> [css: "foo/theme.css"]

        request.contextPath = context

        expect:
        template('<owf:themeStylesheet />') ==
                """<link id="theme" rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || '/owf/foo/theme.css'
        ''      || '/foo/theme.css'
        null    || '/foo/theme.css'
    }

    void "themeStylesheet: without 'theme' attr and no current theme should link to 'about:blank'"(String context, String href) {
        given:
        themeService.getCurrentTheme() >> null

        request.contextPath = context

        expect:
        template('<owf:themeStylesheet />') ==
                """<link id="theme" rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || 'about:blank'
        ''      || 'about:blank'
        null    || 'about:blank'
    }


    void "bootstrapStylesheet: should link to stylesheet relative to current theme path"(String context, String href) {
        given:
        themeService.getCurrentTheme() >> [css: "foo/theme.css"]

        request.contextPath = context

        expect:
        template('<owf:bootstrapStylesheet />') ==
                """<link id="bootstrap" rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || '/owf/foo/bootstrap_main.css'
        ''      || '/foo/bootstrap_main.css'
        null    || '/foo/bootstrap_main.css'
    }

    void "bootstrapStylesheet: with no current theme should link to 'about:blank'"(String context, String href) {
        given:
        themeService.getCurrentTheme() >> null

        request.contextPath = context

        expect:
        template('<owf:bootstrapStylesheet />') ==
                """<link id="bootstrap" rel="stylesheet" type="text/css" media="$STYLESHEET_MEDIA_DEFAULT" href="$href" />"""

        where:
        context || href
        '/owf'  || 'about:blank'
        ''      || 'about:blank'
        null    || 'about:blank'
    }

    void "beforeIE8"() {
        expect:
        template("<owf:beforeIE8>foo</owf:beforeIE8>") ==
                """<!--[if lt IE 8]>foo<![endif]-->"""
    }

    void "beforeIE8: with nested GSP tag should evaluate it"() {
        expect:
        template("""<owf:beforeIE8><owf:javascript src="script.js" /></owf:beforeIE8>""") ==
                """<!--[if lt IE 8]><script type="text/javascript" src="/$INTERNAL_JAVASCRIPT_PATH/script.js"></script><![endif]-->"""
    }


    private String template(String value) {
        applyTemplate(value).stripMargin().replaceAll(/\r/, '').replaceAll(/\n/, '')
    }

}
