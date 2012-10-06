@artifact.package@import org.codehaus.groovy.grails.plugins.webdriver.WebDriverHelper
import org.junit.Rule
import org.junit.Test

class @artifact.name@ {
    @Rule
    public WebDriverHelper webdriver = new WebDriverHelper()

    @Test
    public void testSomething() {
        //HomePage homePage = webdriver.open('/', HomePage)
    }
}
