package ozone.securitysample.authentication.ldap;

import static org.junit.Assert.*;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.ldap.core.ContextMapper;
import org.springframework.ldap.core.LdapOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import ozone.security.authentication.OWFUserDetails;
import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.model.GrantedAuthorityImpl;
import ozone.security.authorization.model.OwfGroupImpl;
import ozone.security.authorization.target.OwfGroup;

public class LdapUserDetailsServiceTest {

	private LdapUserDetailsService ldapUserDetailsService;
	private List<LdapAuthorityGroup> ldapAuthorityGroups = new ArrayList<LdapAuthorityGroup>();

	@Before
	public void setUp() throws Exception {
		
		// Test authority group.
		LdapAuthorityGroup ldapAuthorityGroup = new LdapAuthorityGroup();
		ldapAuthorityGroup.setDn("cn=user,ou=groups,o=OWF,st=Maryland,c=us");
		ldapAuthorityGroup.setCn("user");
		ldapAuthorityGroup.setMembers(new String[]{"cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
				                                   "cn=jdoe,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
				                                   "cn=jjones,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"
				                                  });
		ldapAuthorityGroups.add(ldapAuthorityGroup);
		
		ldapUserDetailsService = new LdapUserDetailsService();
	}
	
	/**
	 * Test the main Spring Security method.
	 * @throws Exception
	 */
	@Test
	public void testLoadUserByUsername() throws Exception {
		Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		authorities.add(new GrantedAuthorityImpl("ROLE_USER"));
		
		Collection<OwfGroup> groups = new ArrayList<OwfGroup>();
		groups.add(new OwfGroupImpl("My Special Group!", "Description 1", "email1@fake.test", true)); 
		groups.add(new OwfGroupImpl("My Boring Group!", "Description 2", "email2@fake.test", true));
		
		OWFUserDetailsImpl owfUserDetails = new OWFUserDetailsImpl("jsmith", "password", authorities, groups);

		LdapOperations ldapOperations = mock(LdapOperations.class);
		when(ldapOperations.search(anyString(), anyString(), (ContextMapper)anyObject())).thenReturn(ldapAuthorityGroups);
		when(ldapOperations.lookup(anyString(), (ContextMapper)anyObject())).thenReturn(owfUserDetails);
		
		ldapUserDetailsService.setGroupSearchBase("ou=groups");
		ldapUserDetailsService.setRoleSearchBase("ou=groups");
		ldapUserDetailsService.setGroupSearchQuery("ou=groups");
		ldapUserDetailsService.setRoleSearchQuery("ou=groups");
		ldapUserDetailsService.setLdapOperations(ldapOperations);
		
		UserDetails userDetails = ldapUserDetailsService.loadUserByUsername("jsmith");
		
		// Since the building of the user details object is tested elsewhere 
		// and we've mocked up the lookup() method, just check for null.
		assertNotNull(userDetails);
		assertEquals("jsmith", userDetails.getUsername() );
		OWFUserDetails owfUserDetailsResult = (OWFUserDetails)userDetails;
		
		assertEquals(2,owfUserDetailsResult.getOwfGroups().size());
		
	}

	
	/**
	 * Test the main Spring Security method.  This tests edge case of no groups.
	 * @throws Exception
	 */
	@Test
	public void testLoadUserByUsernameNoGroups() throws Exception {
		Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		authorities.add(new GrantedAuthorityImpl("ROLE_USER"));
		
		Collection<OwfGroup> groups = new ArrayList<OwfGroup>();
		
		OWFUserDetailsImpl owfUserDetails = new OWFUserDetailsImpl("jsmith", "password", authorities, groups);

		LdapOperations ldapOperations = mock(LdapOperations.class);
		when(ldapOperations.search(anyString(), anyString(), (ContextMapper)anyObject())).thenReturn(ldapAuthorityGroups);
		when(ldapOperations.lookup(anyString(), (ContextMapper)anyObject())).thenReturn(owfUserDetails);
		
		ldapUserDetailsService.setGroupSearchBase("ou=groups");
		ldapUserDetailsService.setLdapOperations(ldapOperations);
		ldapUserDetailsService.setGroupSearchQuery("(&(objectClass=groupOfNames)(member=?))");
		ldapUserDetailsService.setRoleSearchBase("ou=Ozone,o=Ozone,l=Columbia,st=Maryland,c=US");		
		ldapUserDetailsService.setRoleSearchQuery("(&(objectclass=groupOfNames)(member=?))");
		
		UserDetails userDetails = ldapUserDetailsService.loadUserByUsername("jsmith");
		
		// Since the building of the user details object is tested elsewhere 
		// and we've mocked up the lookup() method, just check for null.
		assertNotNull(userDetails);
	}

	
	/**
	 * Test the main Spring Security method.  This tests edge case of no roles.  We expect a
	 * UsernameNotFoundException 
	 * @throws Exception
	 */
	@Test
	public void testLoadUserByUsernameNoRoles() throws Exception {
		Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		
		Collection<OwfGroup> groups = new ArrayList<OwfGroup>();
		
		OWFUserDetailsImpl owfUserDetails = new OWFUserDetailsImpl("jsmith", "password", authorities, groups);

		LdapOperations ldapOperations = mock(LdapOperations.class);
		when(ldapOperations.search(anyString(), anyString(), (ContextMapper)anyObject())).thenReturn(ldapAuthorityGroups);
		when(ldapOperations.lookup(anyString(), (ContextMapper)anyObject())).thenReturn(owfUserDetails);
		
		ldapUserDetailsService.setGroupSearchBase("ou=groups");
		ldapUserDetailsService.setLdapOperations(ldapOperations);
		ldapUserDetailsService.setGroupSearchQuery("(&(objectClass=groupOfNames)(member=?))");
		ldapUserDetailsService.setRoleSearchBase("ou=Ozone,o=Ozone,l=Columbia,st=Maryland,c=US");
		ldapUserDetailsService.setRoleSearchQuery("(&(objectclass=groupOfNames)(member=?))");
		
	
		
		try
		{
			ldapUserDetailsService.loadUserByUsername("jsmith");
			fail("We are expecting a UsernameNotFoundException because there were no roles.");
		}
		catch(UsernameNotFoundException e)
		{
			// success
		}
		catch(Exception e)
		{
			fail("We were expecting a UsernameNotFoundException because there were no roles.  Instead, we had "+ e.getMessage());
		}
		
	}

	
	
	
	/**
	 * Test the main Spring Security method with a null lookup.
	 */
	@Test(expected=UsernameNotFoundException.class)
	public void testLoadUserByUsernameWithNullLookup() {
		LdapOperations ldapOperations = mock(LdapOperations.class);
		when(ldapOperations.search(anyString(), anyString(), (ContextMapper)anyObject())).thenReturn(ldapAuthorityGroups);
		when(ldapOperations.lookup(anyString(), (ContextMapper)anyObject())).thenReturn(null);
		
		ldapUserDetailsService.setGroupSearchBase("ou=groups");
		ldapUserDetailsService.setLdapOperations(ldapOperations);
		ldapUserDetailsService.setGroupSearchQuery("(&(objectClass=groupOfNames)(member=?))");
		ldapUserDetailsService.setRoleSearchBase("ou=Ozone,o=Ozone,l=Columbia,st=Maryland,c=US");
		ldapUserDetailsService.setRoleSearchQuery("(&(objectclass=groupOfNames)(member=?))");
		
		
		ldapUserDetailsService.loadUserByUsername("jsmith");
	}

	/**
	 * Test the main Spring Security method with no authorities (should
	 * throw an exception).
	 */
	@Test(expected=UsernameNotFoundException.class)
	public void testLoadUserByUsernameWithNoAuthorities() {
		Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		OWFUserDetailsImpl owfUserDetails = new OWFUserDetailsImpl("jsmith", "password", authorities, new ArrayList<OwfGroup>());

		LdapOperations ldapOperations = mock(LdapOperations.class);
		when(ldapOperations.search(anyString(), anyString(), (ContextMapper)anyObject())).thenReturn(ldapAuthorityGroups);
		when(ldapOperations.lookup(anyString(), (ContextMapper)anyObject())).thenReturn(owfUserDetails);
		
		ldapUserDetailsService.setGroupSearchBase("ou=groups");
		ldapUserDetailsService.setLdapOperations(ldapOperations);
		ldapUserDetailsService.setGroupSearchQuery("(&(objectClass=groupOfNames)(member=?))");
		ldapUserDetailsService.setRoleSearchBase("ou=Ozone,o=Ozone,l=Columbia,st=Maryland,c=US");
		ldapUserDetailsService.setRoleSearchQuery("(&(objectclass=groupOfNames)(member=?))");
				
		ldapUserDetailsService.loadUserByUsername("jsmith");
	}
}
