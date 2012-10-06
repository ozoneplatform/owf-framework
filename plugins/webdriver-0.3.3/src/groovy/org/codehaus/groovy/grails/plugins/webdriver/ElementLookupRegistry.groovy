package org.codehaus.groovy.grails.plugins.webdriver

import java.lang.reflect.Array
import java.lang.reflect.Field
import java.lang.reflect.Modifier
import org.codehaus.groovy.grails.plugins.webdriver.ast.GenericTypes
import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.ByIdOrName
import org.openqa.selenium.support.pagefactory.Annotations

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Oct 21, 2009
 * Time: 7:19:34 AM
 * To change this template use File | Settings | File Templates.
 */

public class ElementLookupRegistry {

    static List pageElementClasses = [SelectElement, RadioElement, CheckboxElement, TextElement]

    static Map<Class, ElementLookupRegistry> data = new HashMap<Class, ElementLookupRegistry>()
    private Map<String, Map> fields = new HashMap<String, Map>()
    private Class clazz

    static getDefaultMap(WebDriverComponent page) {
        Map ret = [:]
        getMap(page.class).fields.each { key, value ->
            if (value.defaultValue) {
                ret[key] = value.defaultValue
            }
        }
        return ret
    }

    private static ElementLookupRegistry getMap(Class clazz, Object instance = null) {
        synchronized (data) {
            if (!data.containsKey(clazz)) {
                data.put(clazz, new ElementLookupRegistry(clazz, instance))
            }
            return data.get(clazz)
        }
    }

    private ElementLookupRegistry(Class clazz, Object instance = null) {
        this.clazz = clazz
        if (instance == null) {
            instance = clazz.newInstance()
        }
        if (WebDriverComponent.isAssignableFrom(clazz.superclass) && clazz.superclass != WebDriverComponent.class) {
            Map superFields = getMap(clazz.superclass, instance).fields
            this.fields.putAll(superFields)
        }
        if (clazz.metaClass.getStaticMetaMethod('getElements', [] as Object[])) {
            clazz.elements.delegate = this
            clazz.elements.call()
            clazz.elements = this
        }
        def privateFields = clazz.getDeclaredFields().findAll { Field field -> (field.modifiers & Modifier.PRIVATE) > 0 }

        clazz.metaClass.properties.findAll { MetaProperty prop ->
            Map props = [:]
            Field field = privateFields.find { it.name == prop.name }

            if (!field || !interceptedProperty(prop.type)) {
                if (!fields.containsKey(prop.name)) {
                    props.manual = true
                }
            } else {
                field.setAccessible(true)
                props.genericTypes = field.getAnnotation(GenericTypes)?.value() as List<Class>
                props.find = new Annotations(field).buildBy()
                props.defaultValue = field.get(instance);
            }
            if (fields.containsKey(prop.name)) {
                props.putAll(fields.get(prop.name))
            }
            props.defaultFinder = props.find instanceof ByIdOrName
            fields.put(prop.name, props)
        }
    }

    public static LookupDetails get(WebDriverComponent parent, Class expectedType, String fieldName) {
        assert fieldName != null
        if (!interceptedProperty(expectedType)) {
            return null
        }
        Map fields = getMap(parent.class).fields
        Map details = fields.get(fieldName)
        if (details?.manual) {
            return null
        }
        FetchType type = FetchType.DIRECT
        if (!details || details.defaultFinder) {
            if (fieldName.endsWith("Element")) {
                details = fields.get(fieldName = fieldName[0..-8])
                type = FetchType.ELEMENT
            } else if (fieldName.endsWith("Options")) {
                details = fields.get(fieldName = fieldName[0..-8])
                type = FetchType.OPTIONS
            } else if (fieldName.endsWith("Exists")) {
                details = fields.get(fieldName = fieldName[0..-7])
                type = FetchType.EXISTS
            } else if (fieldName.endsWith("Visible")) {
                details = fields.get(fieldName = fieldName[0..-8])
                type = FetchType.VISIBLE
            }
            if (!details) {
                details = [:]
            }
        }
        if (!details.find) {
            details.find = new ByIdOrName(fieldName)
            details.defaultFinder = true
        }
        return new LookupDetails(parent: parent, details: details, type: expectedType, name: fieldName, fetchType: type)
    }

    static boolean interceptedProperty(Class type) {
        return type in [null, List, WebElement, String, boolean, Boolean, int, Integer] || WebDriverComponent.class.isAssignableFrom(type) || type.isArray()
    }

    def methodMissing(String name, args) {
        Map map = [:]
        args.each {
            if (it instanceof Map) {
                map.putAll(it)
            } else if (it instanceof Closure || it instanceof By) {
                map['find'] = it
            } else {
                throw new MissingMethodException(name, clazz, args)
            }
        }
        fields[name] = map
    }

    def propertyMissing(String name) {
        if (name == "By") {
            return By
        }
        throw new MissingPropertyException(name, clazz)
    }

    static boolean setElementValue(LookupDetails result, Object value) {
        Class type = result.type
        WebDriverComponent page = result.parent
        FetchType fetchType = result.fetchType
        String name = result.name
        if (fetchType != FetchType.DIRECT || result.details.listElement || type instanceof List || type?.isArray()) {
            throw new ReadOnlyPropertyException(name, page.class)
        }
        WebElement x = getWebElement(result)
        WebDriverPageElement e = getPageElement(result, x, type)
        if (!(e instanceof SettableWebDriverPageElement)) {
            throw new ReadOnlyPropertyException(name, page.class)
        }
        SettableWebDriverPageElement se = (SettableWebDriverPageElement) e

        se.setElementValue(value)
        return true
    }

    private static callClosure(WebDriverComponent page, WebElement e, Closure closure) {
        if (closure) {
            closure.setDelegate(page)
            closure.call(e)
        }
    }

    static WebDriverPageElement getPageElement(LookupDetails lookupDetails, WebElement x, Class toCreate = null) {
        if (x == null) {
            return null
        }
        if (!toCreate || !WebDriverPageElement.isAssignableFrom(toCreate)) {
            toCreate = pageElementClasses.find { Class c -> c.supports(x) } ?: WebDriverPageElement.class
        }
        WebDriverPageElement element = (WebDriverPageElement) WebDriverComponent.initialize(toCreate, lookupDetails.parent.driver, lookupDetails.parent.pageTracker, lookupDetails.details, x)
        element.validate(false)
        return element
    }

    static Object getElementValue(LookupDetails result) {
        Class type = result.type
        FetchType fetchType = result.fetchType
        if (fetchType == FetchType.EXISTS) {
            return getWebElements(result).size() > 0
        }
        List<WebElement> xs = getWebElements(result)
        if (result.details.listElement || (type != null && (List.isAssignableFrom(type) || type.isArray()))) {
            Class c = type.isArray() ? type.getComponentType() : getListElement(result)
            if (c != WebElement.class) {
                xs = xs.collect { getElementValue(it, result, c) }
            }
            if (type.isArray()) {
                return xs.toArray(Array.newInstance(type.getComponentType(), xs.size()))
            } else {
                return xs
            }
        }
        WebElement x = (xs.size() > 0) ? xs[0] : null
        if (!x && !result.getDetails()['optional']) {
            throw new RuntimeException("Can't find value for field ${result.parent.class.simpleName}.${result.name} ${getFindMessage(result)}")
        }
        getElementValue(x, result, type)
    }

    private static getFindMessage(LookupDetails result) {
        result.details.find.toString().replaceAll("By.", "by ");
    }

    static Object getElementValue(WebElement x, LookupDetails result, Class type) {
        WebDriverPageElement e = getPageElement(result, x, type)
        switch (result.fetchType) {
            case FetchType.OPTIONS:
                if (!x) {
                    throw new IllegalArgumentException("Can't get options because the element doesn't exist")
                }
                if (e instanceof SelectElement) {
                    return ((SelectElement) e).options
                }
                throw new IllegalArgumentException("Can't get options for a ${x.tagName}")
            case FetchType.ELEMENT:
                return x
            case FetchType.VISIBLE:
                return e?.isVisible()
            case FetchType.DIRECT:
                if (!x) {
                    return null;
                }
                if (type == String && x.getTagName() == 'input') {
                    return x.getAttribute('value')
                }
                return e.asType(type ?: WebElement.class)
            default: throw new IllegalStateException("Unknown type ${result.fetchType}")
        }
    }

    static Class getListElement(LookupDetails lookupDetails) {
        List<Class> types = lookupDetails.details.genericTypes
        def listElement = lookupDetails.details.listElement ?: types?.get(0)
        if (listElement instanceof Closure) {
            listElement.delegate = lookupDetails.parent
            listElement = listElement.call()
        }
        if (listElement instanceof Class) {
            return listElement
        }
        if (listElement == null) {
            throw new RuntimeException("List type unknown.  Please use a generic list, specify listElement or use an array")
        }
        throw new IllegalArgumentException("The listElement parameter should be a Class or a closure that returns a Class.  This listElement returned ${listElement.class}")
    }

    static WebElement getWebElement(LookupDetails lookupDetails) {
        def find = lookupDetails.details.find
        WebDriverComponent parent = lookupDetails.parent
        parent.validate(false)
        if (find instanceof Closure) {
            find.delegate = parent
            find = find.call()
        }
        if (find instanceof By) {
            if (parent.getWebElement()) {
                return parent.getWebElement().findElement((By) find)
            } else {
                return parent.getDriver().findElement((By) find)
            }
        }
        if (find instanceof WebElement) {
            return find
        }
        throw new IllegalArgumentException("Elements closures should return WebElements or By's.  The closure returned ${find}")
    }

    static List<WebElement> getWebElements(LookupDetails lookupDetails) {
        Map result = lookupDetails.details
        WebDriverComponent page = lookupDetails.parent
        def find = result.find
        page.validate(false)
        if (find instanceof Closure) {
            find.delegate = page
            find = find.call()
        }
        if (find instanceof By) {
            if (page.getWebElement()) {
                return page.getWebElement().findElements((By) find)
            } else {
                return page.getDriver().findElements((By) find)
            }
        }
        if (find instanceof List<WebElement>) {
            return find
        }
        if (find instanceof WebElement) {
            return [find]
        }
        throw new IllegalArgumentException("List element closures should return a list of WebElements or a By.  The closure returned ${find}")
    }
}
