package ozone.owf.grails.test.functional.pages

import org.codehaus.groovy.grails.plugins.webdriver.LinkElement;
import org.codehaus.groovy.grails.plugins.webdriver.ButtonElement;
import org.codehaus.groovy.grails.plugins.webdriver.WebDriverPage
import org.openqa.selenium.support.FindBy
import org.openqa.selenium.By
import org.openqa.selenium.JavascriptExecutor
import org.openqa.selenium.WebElement
import static org.junit.Assert.*

abstract class BasePage extends WebDriverPage {


	Object clickYesButton(Object type) {
		driver.findElement(By.xpath("//button[text() = 'Yes']")).click()
		delay(3000)
		create(type)
	}

	boolean isTextPresent(String text) {
		WebElement bodyTag =
			driver.findElement(By.tagName("body")); 
			println "Body text:\n${bodyTag?.getText()}"
		bodyTag?.getText().contains(text)
	}
}