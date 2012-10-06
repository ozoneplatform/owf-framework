package org.codehaus.groovy.grails.plugins.webdriver

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Dec 10, 2009
 * Time: 7:36:21 AM
 * To change this template use File | Settings | File Templates.
 */
public interface PageTracker {
    void setCurrentPage(WebDriverPage page)

    WebDriverPage getCurrentPage()
}