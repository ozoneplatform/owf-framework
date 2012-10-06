package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class CheckboxElement extends SettableWebDriverPageElement {
    boolean isChecked() {
        webElement.isSelected()
    }

    public void setChecked(boolean checked) {
        if (webElement.isSelected() != checked) {
            settingValue {
                webElement.click()
            }
        }
    }

    protected void setElementValue(Object o) {
        setChecked(o as boolean)
    }

    Object asType(Class type) {
        switch(type) {
            case String: return String.valueOf(isChecked())
            default: return super.asType(type)
        }
    }

    protected static boolean supports(WebElement element) {
        return element.tagName == 'input' && element.getAttribute("type") == 'checkbox'
    }

}
