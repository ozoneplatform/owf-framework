package org.codehaus.groovy.grails.plugins.webdriver

import java.beans.Introspector
import java.lang.reflect.Field
import org.codehaus.groovy.runtime.MetaClassHelper
import org.codehaus.groovy.runtime.metaclass.ThreadManagedMetaBeanProperty
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.codehaus.groovy.grails.plugins.webdriver.ast.FieldAccessRemover

public class WebDriverComponent implements GroovyInterceptable {
    PageTracker pageTracker
    WebDriver driver
    WebElement webElement
    Map config

    static <T extends WebDriverComponent> T initialize(Class<T> clazz, WebDriver driver, PageTracker pageTracker, Map config = [:], WebElement element = null) {
        WebDriverComponent component = clazz.newInstance()
        assert driver != null
        assert pageTracker != null
        component.driver = driver
        component.config = config
        component.webElement = element
        component.pageTracker = pageTracker
        return component
    }

    void validate(boolean newComponent) {


    }

    WebDriverPageElement getPageElement(String name) {
        LookupDetails details = ElementLookupRegistry.get(this, WebDriverPageElement.class, name)
        if (details != null) {
            return (WebDriverPageElement)ElementLookupRegistry.getElementValue(details)
        }
        return null;
    }

    void setProperties(Map properties = [:]) {
        properties.each { String key, Object value ->
            setProperty(key, value)
        }
    }

    void fillInDefaultFields(Map overrides = [:]) {
        Map map = [:]
        map.putAll(ElementLookupRegistry.getDefaultMap(this))
        map.putAll(overrides)
        map.each { key, value -> setProperty(key, value) }
    }

    def invokeMethod(String name, args) {
        def validMethod = metaClass.getMetaMethod(name, args*.class as Class[])
        Class clazz = this.class.superclass
        while (validMethod == null && clazz != null) {
            validMethod = clazz.metaClass.getMetaMethod(name, args*.class as Class[])
            clazz = clazz.superclass
        }
        if (name =~ /get[A-Z].*/ && args.length == 0) {
            LookupDetails get = ElementLookupRegistry.get(this, validMethod?.returnType, Introspector.decapitalize(name.substring(3)))
            if (get != null) {
                return ElementLookupRegistry.getElementValue(get)
            }
        }
        if (name =~ /set[A-Z].*/ && args.length == 1) {
            LookupDetails set = ElementLookupRegistry.get(this, validMethod != null ? validMethod.nativeParameterTypes[0] : null, Introspector.decapitalize(name.substring(3)))
            if (set && ElementLookupRegistry.setElementValue(set, args[0])) {
                return null
            }
        }
        if (validMethod == null) {
            return metaClass.invokeMissingMethod(this, name, args)
        }
        def result = validMethod.invoke(this, args)
        Class type = validMethod.getReturnType();
        if (!(result instanceof WebDriverPage) && WebDriverPage.isAssignableFrom(type)) {
            return create(type)
        }
        if (result == null && type.simpleName.endsWith("Page")) {
            throw new IllegalStateException("${type.simpleName} should extend WebDriverPage to enable automatic construction.")
        }
        return result
    }

    public <T extends WebDriverPage> T create(Class<T> type) {
        return WebDriverPage.create(type, getDriver(), getPageTracker())
    }

    def getProperty(String name) {
        if (name.startsWith(FieldAccessRemover.FIELD_PREFIX)) {
            name = name.substring(FieldAccessRemover.FIELD_PREFIX.length())
        }
        MetaProperty validProperty = metaClass.getMetaProperty(name)
        LookupDetails details = ElementLookupRegistry.get(this, validProperty?.type, name)
        if (details != null) {
            return ElementLookupRegistry.getElementValue(details)
        }
        if (validProperty == null) {
            return metaClass.invokeMissingProperty(this, name, null, true)
        }
        if (validProperty instanceof ThreadManagedMetaBeanProperty) {
            def invoke = validProperty.getGetter().invoke(this, MetaClassHelper.EMPTY_ARRAY)
            return invoke;
        } else {
            Object property = validProperty.getProperty(this)
            return property
        }
    }

    void setProperty(String name, Object value) {
        if (name.startsWith(FieldAccessRemover.FIELD_PREFIX)) {
            name = name.substring(FieldAccessRemover.FIELD_PREFIX.length())
        }
        MetaProperty validProperty = metaClass.getMetaProperty(name)
        LookupDetails set = ElementLookupRegistry.get(this, validProperty?.type, name)
        if (set && ElementLookupRegistry.setElementValue(set, value)) {
            return
        }
        if (validProperty == null) {
            metaClass.invokeMissingProperty(this, name, value, false)
        }
        if (validProperty instanceof ThreadManagedMetaBeanProperty) {
            validProperty.getSetter().invoke(this, value)
        } else {
            validProperty.setProperty(this, value)
        }
    }
}