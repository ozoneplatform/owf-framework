package org.codehaus.groovy.grails.plugins.webdriver

import java.util.regex.Pattern
import org.junit.Assert
import org.openqa.selenium.WebDriver
import org.openqa.selenium.By
import org.openqa.selenium.WebElement

public class WebDriverPage extends WebDriverComponent {
    PageTracker pageTracker

    public void regenerate() {
        String pageName = this.getClass().simpleName;
        File file = new File("test/functional", this.getClass().name.replaceAll(/\./, '/') + ".groovy")
        System.out.println("file = " + file + ":" + file.exists());
        List fields = []
        List elements = []
        driver.findElements(By.tagName("a")).each { WebElement element ->
            String linkText = element.text
            String fieldName = camelCase(element.text) + "Link";
            fields.add("LinkElement<${pageName}> ${fieldName}")
            elements.add("${fieldName}(By.linkText(\"${linkText}\"))")
        }
        driver.findElements(By.tagName("input")).each { WebElement element ->
            String id = element.getAttribute("id")
            String type = element.getAttribute("type")
            String name = element.getAttribute("name")
            String fieldName = id
            if (!fieldName) {
                fieldName = name
            }
            if (type == 'submit') {
                if (fieldName.startsWith("_action_")) {
                    fieldName = fieldName.substring(8) + "Button"
                }
                fields.add("ButtonElement<${pageName}> ${fieldName}")
            } else if (type != 'hidden') {
                fields.add("String ${fieldName}");
            }
            if (fieldName != id || fieldName != name) {
                fieldName = camelCase(fieldName)
                if (id) {
                    elements.add("${fieldName}(By.id('${id}'))")
                } else if (name) {
                    elements.add("${fieldName}(By.name('${name}'))")
                }
            }
        }
        driver.findElements(By.xpath("//tr[@class='prop']")).eachWithIndex { WebElement element, int index ->
            String fieldName = camelCase(element.findElement(By.xpath("td[@class='name']")).text)
            fields.add("String ${fieldName}")
            elements.add("${fieldName}(By.xpath('//tr[@class='prop'][${index+1}]/td[@class='value']))")
        }
        println "${this.getClass().package}"
        println "class ${this.getClass().getSimpleName()} extends WebDriverPage {"
        println()
        println "  static expectedTitle = \"${driver.getTitle()}\""
        if (driver.currentUrl =~ /\/\d+$/) {
            println "  static expectedUrl = ~\"${UrlHelper.getRelativeUrl(driver.currentUrl).replaceFirst(/\/\d+$/, /\/\\\\d+/)}\""
        } else {
            println "  static expectedUrl = \"${UrlHelper.getRelativeUrl(driver.currentUrl)}\""
        }
        println()
        fields.each {
            println "  ${it}"
        }
        if (elements) {
            println()
            println "  static elements = {"
            elements.each {
                println "    ${it}"
            }
            println "  }"
        }
        println "}"
    }

    String camelCase(String s) {
        String z = s.replaceAll(' ', '').replaceAll(/_([a-z])/) { a, b -> b.toUpperCase() }
        z.substring(0,1).toLowerCase() + z.substring(1)
    }

    String getCurrentURL() {
        driver.currentUrl
    }
    
    String getPageTitle() {
        driver.title
    }

    void fillInDefaultFields(Map overrides = [:]) {
        Map map = [:]
        map.putAll(ElementLookupRegistry.getDefaultMap(this))
        map.putAll(overrides)
        map.each { key, value -> setProperty(key, value) }
    }

    void validate(boolean newPage) {
        String currentURL = getDriver().currentUrl
        String newPageMessage = newPage ?
            "It looks like you've been taken to an unexpected page." : "It looks like you are calling a method on a non current page."
        boolean checked = false
        if (respondsTo("getExpectedURL")) {
            checked = true
            boolean valid = false
            def e = expectedURL
            if (e instanceof String) {
                String expectedURL = UrlHelper.getFullUrl(e)
                Assert.assertEquals("URL mismatch for ${this.class.simpleName}. ${newPageMessage}", expectedURL, currentURL)
            } else if (e instanceof Pattern) {
                Pattern expectedRegex = e
                String path = UrlHelper.getRelativeUrl(currentURL)
                if (path != currentURL) {
                    valid = (expectedRegex.matcher(path).matches())
                }
                valid = valid || expectedRegex.matcher(currentURL).matches()
                if (!valid) {
                    Assert.fail("Page URL regex fail for ${this.class.simpleName}. ${currentURL} does not match ${e}. ${newPageMessage}");
                }
            }
        }
        if (respondsTo("getExpectedTitle")) {
            checked = true
            String currentTitle = getDriver().getTitle()
            def e = expectedTitle
            if (e instanceof String) {
                Assert.assertEquals("Page title mismatch for ${this.class.simpleName}. ${newPageMessage}", e, currentTitle)
            } else if (e instanceof Pattern) {
                Pattern expectedRegex = e
                Assert.assertTrue("Page title regex fail for ${this.class.simpleName}. \"${currentTitle}\" does not match ${e}. ${newPageMessage}", expectedRegex.matcher(currentTitle).matches())
            }
        }
        if (!checked) {
            println("WARNING: ${this.class.simpleName} doesn't define an expectedTitle or expectedURL.")
        }
    }

    public static <T extends WebDriverPage> T create(Class<T> type, WebDriver driver, PageTracker pageTracker) {
        WebDriverPage page = WebDriverComponent.initialize(type, driver, pageTracker)
        page.validate(true)
        pageTracker.setCurrentPage(page)
        return page
    }
}