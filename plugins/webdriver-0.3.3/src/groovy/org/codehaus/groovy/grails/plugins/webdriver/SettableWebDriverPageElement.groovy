package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement
import org.openqa.selenium.htmlunit.HtmlUnitDriver

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Dec 14, 2010
 * Time: 3:55:55 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class SettableWebDriverPageElement extends WebDriverPageElement {
    protected void settingValue(Closure c) {
        boolean changeJavascript = getConfig().containsKey("javascript") && getDriver() instanceof HtmlUnitDriver && getConfig().javascript != ((HtmlUnitDriver) getDriver()).isJavascriptEnabled()
        if (changeJavascript) {
            ((HtmlUnitDriver) getDriver()).setJavascriptEnabled(getConfig().javascript)
        }
        try {
            c.call()
        } finally {
            if (changeJavascript) {
                ((HtmlUnitDriver) getDriver()).setJavascriptEnabled(!getConfig().javascript)
            }
        }
        callClosure(this, webElement, getConfig().afterSet)
    }

    abstract protected void setElementValue(Object o)

    ;

    private static callClosure(WebDriverComponent page, WebElement e, Closure closure) {
        if (closure) {
            closure.setDelegate(page)
            closure.call(e)
        }
    }
}
