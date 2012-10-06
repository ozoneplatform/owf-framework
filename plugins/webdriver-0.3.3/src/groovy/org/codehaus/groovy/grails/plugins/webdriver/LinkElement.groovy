package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class LinkElement<T extends WebDriverPage> extends NavElement<T> {
    String getURL() {
        webElement.getAttribute('href')
    }

    String getText() {
        webElement.text
    }

    protected static boolean supports(WebElement element) {
        return element.tagName == 'a'
    }
}
