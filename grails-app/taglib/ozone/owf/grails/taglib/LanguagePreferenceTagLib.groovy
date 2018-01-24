package ozone.owf.grails.taglib

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.PreferenceService


class LanguagePreferenceTagLib {

    static namespace = 'lang'

    PreferenceService preferenceService

    // TODO: clean this up and test it
    // We may want to change en_US to look for js-lib/ext-2.2/source/locale/ext-lang-en.js, 
    // since en_US does not exist

    def preference = { attrs ->
        String locale

        if (attrs['lang'] == null) {

            def lang = request.locale.toString()
            def result = null

            try {
                result = preferenceService.show([namespace: "owf", path: "language"])
            }
            catch (OwfException owe) {
                if ('INFO' == owe.logLevel) {
                    log.info(owe)
                }
                else if ('DEBUG' == owe.logLevel) {
                    log.debug(owe)
                }
                else {
                    log.error(owe)
                }
            }

            //check against preference
            if (result?.preference?.value != null) {
                lang = result.preference.value;
            }

            session.setAttribute("language", lang);

            locale = session.getAttribute('language')
        }
        else {
            locale = attrs['lang']
        }
        String extLocale = (locale == 'en_US') ? 'en' : locale;

        out << """${owf.javascript(src: "lang/ozone-lang-${locale}.js")}
                  ${owf.vendor(src: "ext-4.0.7/locale/ext-lang-${extLocale}.js")}"""
    }

}
