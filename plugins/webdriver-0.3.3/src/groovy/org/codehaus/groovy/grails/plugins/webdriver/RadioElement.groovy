package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class RadioElement extends SettableWebDriverPageElement {
    boolean isSelected() {
        webElement.isSelected()
    }

    public void select() {
        if (!webElement.isSelected()) {
            settingValue {
                webElement.setSelected()
            }
        }
    }

    protected void setElementValue(Object o) {
        boolean selected = o as boolean
        if (!selected) {
            throw new IllegalArgumentException("Can't unselect a radio button")
        }
        select()
    }

    Object asType(Class type) {
        switch(type) {
            case String: return String.valueOf(isChecked())
            default: return super.asType(type)
        }
    }

    protected static boolean supports(WebElement element) {
        return element.tagName == 'input' && element.getAttribute("type") == 'radio'
    }

}
