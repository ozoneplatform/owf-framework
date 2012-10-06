package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class ButtonElement<T extends WebDriverPage> extends NavElement<T> {

    protected static boolean supports(WebElement element) {
        return (element.tagName == 'input' && element.getAttribute("type") in ['reset', 'submit', 'image']) || element.tagName == 'button'

    }
}
