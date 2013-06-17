package ozone.owf.grails.test.integration;

import ozone.owf.grails.services.OwfApplicationConfigurationService;
import groovy.util.GroovyTestCase;
import static org.junit.Assert.assertThat
import static org.hamcrest.CoreMatchers.*
public class OwfApplicationConfigurationServiceTests extends GroovyTestCase{
	
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	//As more logic is added we can build these tests more.  For now we can just assume that there should be more than
	//zero application configuration items
	public void testCreateRequired(){
		
		 
		 owfApplicationConfigurationService.createRequired()
		 
		 assertTrue(owfApplicationConfigurationService.getAllApplicationConfigurations().size() > 0)
	}

}
