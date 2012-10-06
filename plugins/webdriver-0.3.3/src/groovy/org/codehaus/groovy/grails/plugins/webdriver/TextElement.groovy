package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class TextElement extends SettableWebDriverPageElement {
    String getValue() {
        webElement.getAttribute('value')
    }

    public void setValue(String value) {
        settingValue {
            webElement.clear()
            webElement.sendKeys(value)
        }
    }

    protected void setElementValue(Object o) {
        setValue(o?.toString())
    }

    Object asType(Class type) {
        switch (type) {
            case String: return getValue()
            default: return super.asType(type)
        }
    }

    protected static boolean supports(WebElement element) {
        return element.tagName == 'textarea' || (element.tagName == 'input' && element.getAttribute('type') in ['text', 'file', 'password'])

    }

}
