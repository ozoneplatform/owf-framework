package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.WebElement

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: 21/12/10
 * Time: 7:31 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class NavElement<T extends WebDriverPage> extends WebDriverPageElement {
    T click() {
        (T)clickTo(config.page ?: config.genericTypes?.last() ?: pageTracker.currentPage.class)
    }

    public void clickStay() {
        clickTo(pageTracker.currentPage.class)
    }

    public <S extends WebDriverPage> S clickTo(Class<S> type) {
        webElement.click()
        create(type)
    }
}
