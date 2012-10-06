package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebDriver

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Oct 20, 2009
 * Time: 9:23:40 PM
 * To change this template use File | Settings | File Templates.
 */

public abstract class WebDriverTestCase extends GroovyTestCase {
    public WebDriverHelper helper = new WebDriverHelper()

    public void runBare() {
        helper.setUpDriver()
        try {
            super.runBare()
        } catch(Throwable th) {
            throw helper.enhanceException(th)
        } finally {
            helper.cleanUpDriver()
        }
    }

    public void setBaseURL(String baseURL) {
        helper.setBaseURL(baseURL)
    }

    public void open(String url) {
        helper.open(url)
    }

    public <T extends WebDriverPage> T create(Class<T> type) {
        helper.create(type)
    }

    public <T extends WebDriverPage> T open(String url, Class<T> clazz) {
        helper.open(url, clazz)
    }

    public WebDriver getDriver() {
        return helper.driver
    }

    public WebDriverPage getCurrentPage() {
        return helper.currentPage
    }
}