package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Dec 14, 2010
 * Time: 3:55:55 PM
 * To change this template use File | Settings | File Templates.
 */
class WebDriverPageElement extends WebDriverComponent {
    boolean isVisible() {
        webElement.isDisplayed()
    }

    boolean isEnabled() {
        webElement.isEnabled()
    }

    Object asType(Class type) {
        if (type.isAssignableFrom(getClass())) {
            return this
        }
        if (WebDriverComponent.isAssignableFrom(type)) {
            return WebDriverComponent.initialize(type, driver, pageTracker, config, webElement)
        }
        switch (type) {
            case Integer:
            case int: return Integer.parseInt(asType(String.class))
            case Boolean:
            case boolean: return webElement.isSelected()
            case String: return webElement.text
            case WebElement: return webElement
            default: return super.asType(type)
        }
    }

    @Override
    void validate(boolean newComponent) {
        if (!getClass().supports(webElement)) {
            throw new IllegalStateException("${getClass().simpleName} does not support HTML element ${webElement}.  Please check the finder: ${config.find} or field type")
        }
    }

    protected static boolean supports(WebElement element) {
        return true
    }
}
