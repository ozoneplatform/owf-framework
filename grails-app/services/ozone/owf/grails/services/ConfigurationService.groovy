package ozone.owf.grails.services

import groovy.transform.CompileStatic

import grails.core.GrailsApplication


@CompileStatic
class ConfigurationService {

    GrailsApplication grailsApplication

    private <T> T property(String property, Class<T> type, T defaultValue) {
        return grailsApplication.config.getProperty(property, type, defaultValue)
    }

    private <T> T metadata(String property, Class<T> type, T defaultValue) {
        return grailsApplication.metadata.getProperty(property, type, defaultValue)
    }

    boolean isExampleWidgetPluginEnabled() {
        property('owf.exampleWidgets.enabled', Boolean, false) ||
                isPropertyFlagEnabled('enable.example.widgets')
    }

    boolean isNotificationsEnabled() {
        property('notifications.enabled', Boolean, false)
    }

    int getNotificationQueryInterval() {
        property('notifications.query.interval', Integer, 30)
    }

    String getApplicationVersion() {
        metadata('info.app.version', String, 'unknown')
    }

    String getAboutDescription() {
        property('about.description', String, '')
    }

    String getAboutNotice() {
        property('about.notice', String, '')
    }

    Map getDataguardConfig() {
        property('owf.dataguard', Map, [:])
    }

    private static boolean isPropertyFlagEnabled(String property) {
        String value = System.getProperty(property)
        return value != null && !value.equalsIgnoreCase('false')
    }

}
