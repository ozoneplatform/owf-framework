package org.codehaus.groovy.grails.plugins.quartz
/**
 * JobObject that stores information about job to shown on webapp
 *
 * @author Marco Mornati (mmornati@byte-code.com)
 *
 * @since 0.4
 */
class JobObject {

    String name
    String group
    String triggerGroup
    String triggerName
    int status

    //TODO: add information about fire time (next, last, ...)

}