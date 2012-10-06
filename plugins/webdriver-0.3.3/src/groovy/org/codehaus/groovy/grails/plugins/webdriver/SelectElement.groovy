package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.By
import org.openqa.selenium.StaleElementReferenceException
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.ui.Select

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
class SelectElement extends SettableWebDriverPageElement {
    String getSelected() {
        new Select(webElement).firstSelectedOption.text
    }

    List<String> getOptions() {
        if (!isVisible()) {
            throw new IllegalStateException("This element is not visible so cannot view it's options")
        }
        webElement.findElements(By.tagName("option"))*.text
    }

    public void setSelected(String value) {
        if (!options.contains(value)) {
            throw new IllegalArgumentException("Can't select ${value} in ${options}")
        }
        settingValue {
            new Select(webElement).selectByVisibleText(value.toString())
            click(webElement) // Needed for jquery 1.4.3 and HtmlUnit (current as of selenium-2.0b1)
        }
    }

    private def click(WebElement webElement) {
        try {
            webElement.click()
        } catch (StaleElementReferenceException e) {
//                ok
        }
    }

    protected void setElementValue(Object o) {
        setSelected(o.toString())
    }

    Object asType(Class type) {
        switch (type) {
            case String: return getSelected()
            case Select: return new Select(webElement)
            default: return super.asType(type)
        }
    }

    protected static boolean supports(WebElement element) {
        return element.tagName == 'select'
    }
}