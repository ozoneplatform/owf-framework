package org.codehaus.groovy.grails.plugins.webdriver

import com.gargoylesoftware.htmlunit.BrowserVersion
import grails.util.BuildSettings
import grails.util.BuildSettingsHolder
import grails.util.Metadata
import java.text.SimpleDateFormat
import java.util.logging.Logger
import junit.framework.AssertionFailedError
import org.junit.Assert
import org.junit.ComparisonFailure
import org.junit.rules.MethodRule
import org.junit.runners.model.FrameworkMethod
import org.junit.runners.model.Statement
import org.openqa.selenium.WebDriver
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.htmlunit.HtmlUnitDriver
import org.openqa.selenium.ie.InternetExplorerDriver

public final class WebDriverHelper implements MethodRule, PageTracker {
    Logger log = Logger.getLogger(getClass().toString())
    WebDriver driver
    WebDriverPage currentPage

    public WebDriverHelper() {
        if (BuildSettingsHolder.settings == null) {
            BuildSettingsHolder.settings = new BuildSettings()
            BuildSettingsHolder.settings.loadConfig()
        }
        if (System.getProperty(BuildSettings.FUNCTIONAL_BASE_URL_PROPERTY) == null) {
            String baseURL = System.getProperty("grails.functional.test.baseURL") // property used in functional-test plugin
            if (!baseURL) {
                String appName = Metadata.current.getProperty("app.name")
                String portNumber = System.getProperty("server.port") ?: "8080"
                baseURL = "http://localhost:${portNumber}/${appName}"
            }
            System.setProperty(BuildSettings.FUNCTIONAL_BASE_URL_PROPERTY, baseURL)
        }
    }

    public void setBaseURL(String baseURL) {
        System.setProperty(BuildSettings.FUNCTIONAL_BASE_URL_PROPERTY, baseURL)
    }

    public void open(String url) {
        String fullUrl = UrlHelper.getFullUrl(url)
        driver.get(fullUrl);
        if (driver.currentUrl == "about:blank") {
            Assert.fail("Cannot open URL at ${fullUrl}.  Is the server running?")
        }
    }

    public <T extends WebDriverPage> T create(Class<T> type) {
        return WebDriverPage.create(type, driver, this)
    }

    public <T extends WebDriverPage> T open(String url, Class<T> clazz) {
        open(url)
        create(clazz)
    }

    private void setUpDriver() {
        if (!driver) {
            String browserString = System.getProperty("webdriver.browser")
            switch (browserString) {
                case "firefox": driver = new FirefoxDriver(); break;
                case "ie": driver = new InternetExplorerDriver(); break;
                case "chrome": driver = new ChromeDriver(); break;
                default:
                    def versions = ["ie6": BrowserVersion.INTERNET_EXPLORER_6, "ie7": BrowserVersion.INTERNET_EXPLORER_7, "ie": BrowserVersion.INTERNET_EXPLORER_7, "firefox": BrowserVersion.FIREFOX_3, "ff3": BrowserVersion.FIREFOX_3, "ff3.6": BrowserVersion.FIREFOX_3_6]
                    def opts = browserString?.split('-')
                    def version = ""
                    boolean js = true
                    if (opts && opts[0] == 'htmlunit') {
                        if (opts.length > 1 && versions[opts[1]]) {
                            version = "-${opts[1]}"
                            driver = new HtmlUnitDriver(versions[opts[1]])
                        }
                        js = opts[-1] != 'nojs'
                    }
                    if (!driver) {
                        driver = new HtmlUnitDriver();
                    }
                    if (js) {
                        ((HtmlUnitDriver) driver).setJavascriptEnabled(true)
                    }
                    browserString = "htmlunit${version}${js ? "" : "-nojs"}"
            }
            log.info("Using ${browserString} driver")
        } else {
            log.info("Reusing driver")
        }

    }

    public Throwable enhanceException(Throwable th) {
        if (driver != null) {
            String outputUrl = System.getProperty("webdriver.output.url")
            if (outputUrl?.endsWith('/')) {
                outputUrl = outputUrl[0..-2]
            }
            StringBuilder message = new StringBuilder()
            message.append("\nBrowser = ${driver.class.simpleName}\nTitle = \"${driver.title}\"\nURL = ${driver.currentUrl}")
            File dir = new File(BuildSettingsHolder.settings.testReportsDir, "webdriver")
            dir.mkdirs();
            String base = getClass().simpleName + "-" + new SimpleDateFormat("yyyyMMdd-HHmmss").format(new Date())
            if (driver instanceof FirefoxDriver) {
                File file = new File(dir, base + ".png")
                ((FirefoxDriver) driver).saveScreenshot(file);
                message.append("\nCurrent Screenshot saved to ${outputUrl ? "${outputUrl}/${file.name}" : "${file.absolutePath}"}")
            }
            File file = new File(dir, base + ".html")
            file.text = driver.getPageSource()
            message.append("\nCurrent HTML saved to ${outputUrl ? "${outputUrl}/${file.name}" : "${file.absolutePath}"}")
            if (th instanceof ComparisonFailure || th instanceof junit.framework.ComparisonFailure) {
                String msg = th.message
                int expected = msg.indexOf(" expected:<")
                if (expected != -1) {
                    msg = msg.substring(0, expected) + " " + message + msg.substring(expected)
                } else {
                    msg = "${msg} ${message.toString()}"
                }
                th = new ComparisonFailure(msg, th.expected, th.actual).initCause(th)
            } else if (th instanceof AssertionFailedError) {
                th = new AssertionFailedError("${th.message} ${message.toString()}").initCause(th)
            } else if (th instanceof NoSuchElementException) {
                th = new NoSuchElementException("${th.getMessage()} ${message.toString()}").initCause(th)
            } else {
                th = new RuntimeException("${th.toString()} ${message.toString()}", th)
            }
        }
        throw th
    }

    public void runTest(Closure c) {
        setUpDriver()
        try {
            c.call()
        } catch (Throwable th) {
            throw enhanceException(th)
        } finally {
            cleanUpDriver()
        }
    }

    private def cleanUpDriver() {
        if (driver != null) {
            driver.quit()
            driver = null
        }
    }


    @Override
    public Statement apply(Statement statement, final FrameworkMethod frameworkMethod, final Object o) {
        return new Statement() {
            @Override
            public void evaluate() throws Throwable {
                runTest { statement.evaluate() }
            }
        };
    }
}