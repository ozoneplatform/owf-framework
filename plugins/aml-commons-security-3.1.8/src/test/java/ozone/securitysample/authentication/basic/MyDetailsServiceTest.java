package ozone.securitysample.authentication.basic;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import org.hamcrest.core.IsInstanceOf;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import ozone.security.authentication.OWFUserDetails;
import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.target.OwfGroup;

public class MyDetailsServiceTest {

	private MyDetailsService myDetailsService;
	private Properties properties;

	@Before
	public void setUp() throws Exception {
		myDetailsService = new MyDetailsService();
		
		properties = new Properties();
		properties.put("jsmith","password,ROLE_USER,John Smith,[group1;Fancy group1 description;group1test@email.com;active]");
		properties.put("jdoe","password,ROLE_USER,Jane Doe,NGTR,jane.doe@ngtr.gov");
		properties.put("jjones","password,ROLE_ADMIN:ROLE_EXTERNADMIN,Jimmy Jones,Jones Inc.,[group1;Fancy group1 description;group1test@email.com;active],[group2;Fancy group2 description;group2test@email.com;inactive]");		
	}

	/**
	 * Tests the conversion of properties into a user map.
	 * @throws Exception
	 */
	@Test
	public void testBuildUserMapFromProperties() throws Exception {
		Map<String,OWFUserDetails> userMap = myDetailsService.buildUserMap(properties);
		
		assertNotNull(userMap);
		assertEquals(3,userMap.size());
		
		OWFUserDetails user = userMap.get("jsmith");
		assertEquals("jsmith",user.getUsername());
		assertEquals("password",user.getPassword());
		assertEquals("ROLE_USER",user.getAuthorities().iterator().next().getAuthority());
		assertEquals("John Smith",user.getDisplayName());		
		assertEquals(1,user.getOwfGroups().size());
		OwfGroup owfGroup = user.getOwfGroups().iterator().next();
		assertEquals("group1", owfGroup.getOwfGroupName());
		assertEquals("Fancy group1 description", owfGroup.getOwfGroupDescription());
		assertEquals("group1test@email.com", owfGroup.getOwfGroupEmail());
		assertTrue( owfGroup.isActive());

		user = userMap.get("jdoe");
		assertEquals("jdoe",user.getUsername());
		assertEquals("password",user.getPassword());
		assertEquals("ROLE_USER",user.getAuthorities().iterator().next().getAuthority());
		assertEquals("Jane Doe",user.getDisplayName());
		assertEquals("NGTR", user.getOrganization());
		assertEquals("jane.doe@ngtr.gov", user.getEmail());

		user = userMap.get("jjones");
		assertEquals("jjones",user.getUsername());
		assertEquals("password",user.getPassword());
		Iterator<GrantedAuthority> iter = user.getAuthorities().iterator();
		assertEquals("ROLE_ADMIN", iter.next().getAuthority());
		assertEquals("ROLE_EXTERNADMIN", iter.next().getAuthority());
		assertEquals("Jimmy Jones",user.getDisplayName());
		assertEquals("Jones Inc.", user.getOrganization());
		assertEquals(2,user.getOwfGroups().size());
		Iterator<OwfGroup> groupItr = user.getOwfGroups().iterator();
		owfGroup = groupItr.next();
		assertEquals("group1", owfGroup.getOwfGroupName());
		assertEquals("Fancy group1 description", owfGroup.getOwfGroupDescription());
		assertEquals("group1test@email.com", owfGroup.getOwfGroupEmail());
		assertTrue( owfGroup.isActive());
		owfGroup = groupItr.next();
		assertEquals("group2", owfGroup.getOwfGroupName());
		assertEquals("Fancy group2 description", owfGroup.getOwfGroupDescription());
		assertEquals("group2test@email.com", owfGroup.getOwfGroupEmail());
		assertTrue(!owfGroup.isActive());
	}
	
	/**
	 * Tests that bad properties don't blow it up.
	 * @throws Exception
	 */
	@Test
	public void testBuildUserMapFromInvalidProperties() throws Exception {
		Properties properties = new Properties();
		properties.put("jsmith","valuewithoutdelimiter");
		properties.put("jdoe","valuewithoutdelimiter");
		properties.put("jdoe","valuewithoutdelimiter");
		
		Map<String,OWFUserDetails> userMap = myDetailsService.buildUserMap(properties);
		
		assertEquals(userMap.size(),0);
	}
	
	/**
	 * Tests the main Spring Security method.
	 * @throws Exception
	 */
	@Test
	public void testLoadUserByUsername() throws Exception {

		Map<String,OWFUserDetails> userMap = myDetailsService.buildUserMap(properties);
		myDetailsService.setUserMap(userMap);
		
		UserDetails userDetails = myDetailsService.loadUserByUsername("jsmith");		
		assertNotNull(userDetails);
		assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(userDetails));
		assertEquals("jsmith",userDetails.getUsername());
		assertEquals(1,userDetails.getAuthorities().size());
		assertEquals("ROLE_USER",userDetails.getAuthorities().iterator().next().getAuthority());

		userDetails = myDetailsService.loadUserByUsername("jdoe");		
		assertNotNull(userDetails);
		assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(userDetails));
		assertEquals("jdoe",userDetails.getUsername());
		assertEquals(1,userDetails.getAuthorities().size());
		assertEquals("ROLE_USER",userDetails.getAuthorities().iterator().next().getAuthority());

		userDetails = myDetailsService.loadUserByUsername("jjones");		
		assertNotNull(userDetails);
		assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(userDetails));
		assertEquals("jjones",userDetails.getUsername());
		assertEquals(2,userDetails.getAuthorities().size());
		Iterator<GrantedAuthority> iter = userDetails.getAuthorities().iterator();
		assertEquals("ROLE_ADMIN", iter.next().getAuthority());
		assertEquals("ROLE_EXTERNADMIN", iter.next().getAuthority());
	}

	/**
	 * Test the main Spring Security method with an invalid user.
	 */
	@Test(expected=UsernameNotFoundException.class)
	public void testLoadUserByInvalidUsername() {
		Map<String,OWFUserDetails> userMap = myDetailsService.buildUserMap(properties);
		myDetailsService.setUserMap(userMap);
		
		myDetailsService.loadUserByUsername("bsmith");
	}

	/**
	 * Tests loading properties using the class resource loader..
	 * @throws Exception
	 */
	@Test
	public void testLoadPropertiesFile() throws Exception {
		
		Properties properties = myDetailsService.loadPropertiesFile("/test-users.properties");
		
		assertNotNull(properties);
		assertEquals(3,properties.size());
		
		assertEquals("password,ROLE_USER,John Smith",properties.getProperty("jsmith"));
		assertEquals("password,ROLE_USER,Jane Doe",properties.getProperty("jdoe"));
		assertEquals("password,ROLE_ADMIN,Jimmy Jones",properties.getProperty("jjones"));	
	}

	/**
	 * Tests loading non-existent properties using the class resource loader..
	 * @throws Exception
	 */
	@Test
	public void testLoadInvalidPropertiesFile() throws Exception {
		
		Properties properties = myDetailsService.loadPropertiesFile("/test-users-does-not-exist.properties");
		
		assertNotNull(properties);
		assertEquals(0,properties.size());
	}
}