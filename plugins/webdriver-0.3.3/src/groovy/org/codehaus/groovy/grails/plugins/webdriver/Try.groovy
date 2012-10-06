package org.codehaus.groovy.grails.plugins.webdriver

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Oct 28, 2009
 * Time: 4:49:16 PM
 * To change this template use File | Settings | File Templates.
 */

public class Try {
    static until(long timeout = 5000, Closure closure) {
        Throwable lastThrowable = null
        long time = System.currentTimeMillis()
        while((System.currentTimeMillis() - time) < timeout) {
            try {
                return closure.call()
            } catch (Throwable t) {
                lastThrowable = t
                Thread.sleep(100)
            }
        }
        throw lastThrowable
    }

    static untilTrue(long timeout = 5000, Closure closure) {
        long time = System.currentTimeMillis()
        while((System.currentTimeMillis() - time) < timeout) {
            if (closure.call()) {
                return
            }
            Thread.sleep(100)
        }
        throw new RuntimeException("Expression was not true within the timeout of ${timeout}ms")
    }

}