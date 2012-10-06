package ozone.owf.grails.test.functional.tests

import java.util.concurrent.TimeUnit;

import org.codehaus.groovy.grails.plugins.webdriver.WebDriverHelper;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.openqa.selenium.WebElement
import org.openqa.selenium.By

import static org.junit.Assert.*

abstract class TestBase {
	@Rule
	public WebDriverHelper webdriver = new WebDriverHelper()

	@Before void setUp() {
		webdriver.driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		webdriver.open('/')
//		try {
//			WebElement button = webdriver.driver.findElement(By.xpath("//button[text() = 'OK']"))
//			if (button) {
//				button.click();
//			}
//		} catch (NoSuchElementException e) {
//			// ignore
//		}
//		homePage = webdriver.create(HomePage.class)
	}

	protected void waitABit(int interval = 1000) {
		try {
			Thread.sleep(interval);
		}
		catch(InterruptedException e) {
			e.printStackTrace();
		}
	}
	
//	void createTestListings(int count = 10) {
//		try {
//			def states = State.list()
//			def categories = Category.list()
//			def types = Types.list()
//			def statuses = Constants.APPROVAL_STATUSES.values().toList()
//			Profile profile = Profile.findByUsername("testAdmin1")
//
//			(1..count).each { index ->
//				def state = states[index % states.size()]
//				def category = categories[index % categories.size()]
//				def type = types[index % types.size()]
//				def status = statuses[index % statuses.size()]
//
//				ServiceItem serviceItem =
//					ServiceItem.build(title:"$state $type $index", approvalStatus:status,
//									  types:type, categories:[category], state:state, author: profile,
//									  description: "Test $state $type $index")
//				println "Created $serviceItem"
//				serviceItem.save(flush:true)
//			}
//		}
//		catch (Exception e) {
//			e.printStackTrace()
//			throw e
//		}
//	}
//
//	void deleteTestListings() {
//		try {
//			ServiceItem.list().each {
//				it.delete(flush:true)
//			}
//		}
//		catch (Exception e) {
//			e.printStackTrace()
//			throw e
//		}
//		assertEquals(0, ServiceItem.list().size())
//	}
}
