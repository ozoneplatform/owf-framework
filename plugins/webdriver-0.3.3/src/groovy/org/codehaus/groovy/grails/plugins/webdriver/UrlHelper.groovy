package org.codehaus.groovy.grails.plugins.webdriver

import java.util.logging.Logger
import grails.util.BuildSettingsHolder
import grails.util.BuildSettings

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Oct 30, 2009
 * Time: 9:29:54 AM
 * To change this template use File | Settings | File Templates.
 */

public class UrlHelper {
    static Logger log = Logger.getLogger(UrlHelper.toString())

    private static baseURL

    public static String getFullUrl(String url) {
        if (url.indexOf(':') == -1) {
            getBaseURL(true)
            if (!url.startsWith("/")) {
                url = "/" + url
            }
            url = baseURL + url
        }
        url
    }

    public static String getRelativeUrl(String url) {
        getBaseURL(false)
        if (baseURL && url.startsWith(baseURL)) {
            url = url.substring(baseURL.length())
        }
        url
    }

    static void getBaseURL(boolean required) {
        if (!baseURL) {
            baseURL = BuildSettingsHolder.settings.functionalTestBaseUrl
            if (!baseURL && required) {
                    throw new IllegalStateException("Please set the grails.functional.test.baseURL System property")
            }
            if (baseURL?.endsWith("/")) {
                baseURL = baseURL[0..-2]
            }
            if (baseURL) {
                log.info("Using base URL of ${baseURL} (set ${BuildSettings.FUNCTIONAL_BASE_URL_PROPERTY} system property to override)")
            }
        }
    }
}