package ozone.securitysample.authentication.ldap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.naming.ldap.LdapName;

import org.hamcrest.core.IsInstanceOf;
import org.junit.Before;
import org.junit.Test;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.target.OwfGroup;

public class LdapUserDetailsContextMapperTest {

	private LdapUserDetailsContextMapper ldapUserDetailsContextMapper;
	private List<LdapAuthorityGroup> ldapAuthorityRoles = new ArrayList<LdapAuthorityGroup>();
	private List<LdapAuthorityGroup> ldapAuthorityGroups = new ArrayList<LdapAuthorityGroup>();

	@Before
	public void setUp() throws Exception {
		
		// Test authority roles.  Set up some authority roles (ROLE_ADMIN and ROLE_USER)
		LdapAuthorityGroup ldapAuthorityRole = new LdapAuthorityGroup();
		ldapAuthorityRole.setDn("cn=user,ou=groups,o=OWF,st=Maryland,c=us");
		ldapAuthorityRole.setCn("user");
		ldapAuthorityRole.setMembers(new String[]{"cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
				                                   "cn=jdoe,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
				                                   "cn=jjones,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"
				                                  });
		ldapAuthorityRoles.add(ldapAuthorityRole);
		
		
		
		// set up some OWF groups 
		LdapAuthorityGroup ldapAuthorityGroup = new LdapAuthorityGroup();
		ldapAuthorityGroup.setDn("cn=group1,ou=owfGroups,o=Ozone,l=Columbia,st=Maryland,c=US,cn=group1");
		ldapAuthorityGroup.setCn("group1");
		ldapAuthorityGroup.setMembers(new String[]{"cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
                "cn=jdoe,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
                "cn=jjones,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"
               });		
		ldapAuthorityGroups.add(ldapAuthorityGroup);
		
		ldapAuthorityGroup = new LdapAuthorityGroup();
		ldapAuthorityGroup.setDn("cn=group2,ou=owfGroups,o=Ozone,l=Columbia,st=Maryland,c=US,cn=group1");
		ldapAuthorityGroup.setCn("group2");
		ldapAuthorityGroup.setMembers(new String[]{
                "cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"                
               });		
		ldapAuthorityGroups.add(ldapAuthorityGroup);
		
		
		ldapUserDetailsContextMapper = new LdapUserDetailsContextMapper(ldapAuthorityRoles, ldapAuthorityGroups);
	}
	
	/**
	 * Test the function that returns authorities for a user.
	 * @throws Exception
	 */
	@Test
	public void testDetermineAuthorities() throws Exception {
		Collection<GrantedAuthority> authorities = ldapUserDetailsContextMapper.determineAuthorities("cn=jjones,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US");
		assertNotNull(authorities);
		assertEquals(1,authorities.size());
		
		// Can't be guaranteed order, but ensure both ROLE_USER and ROLE_ADMIN
		// are in the array.
		boolean match = false;
		for (GrantedAuthority authority : authorities) {
			if ( authority.getAuthority().equalsIgnoreCase("ROLE_USER") ) {
				match = true;
				break;
			}
		}
		assertEquals(true,match);
	}

	
	
	
	
	/**
	 * Test same function with non-existent user.
	 * @throws Exception
	 */
	@Test
	public void testDetermineAuthoritiesWithInvalidUser() throws Exception {
		
		
		// this user has no authorities
		LdapUserDetailsContextMapper myLdapUserDetailsContextMapper = new LdapUserDetailsContextMapper(new ArrayList<LdapAuthorityGroup>(), new ArrayList<LdapAuthorityGroup>());
		
		Collection<GrantedAuthority> authorities = myLdapUserDetailsContextMapper.determineAuthorities("cn=idontexist,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US");
		assertNotNull(authorities);
		assertEquals(0,authorities.size());
	}

	
	/**
	 * Test the function that returns owf groups for a user.
	 * @throws Exception
	 */
	@Test
	public void testDetermineOwfGroups() throws Exception {
		
		// test a user with both groups
		Collection<OwfGroup> groups = ldapUserDetailsContextMapper.determineOwfGroups("cn=jdoe,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US");
		assertNotNull(groups);
		assertEquals(2,groups.size());
		
		// Can't be guaranteed order, but ensure both group1 and group2
		// are in the array.
		boolean match = false;
		for (OwfGroup authority : groups) {
			if ( authority.getOwfGroupName().equalsIgnoreCase("group1") ) {
				match = true;
				break;
			}
		}
		assertEquals(true,match);
		
		match = false;
		for (OwfGroup authority : groups) {
			if ( authority.getOwfGroupName().equalsIgnoreCase("group2") ) {
				match = true;
				break;
			}
		}
		assertEquals(true,match);	
		
		
	}
	
	
	
	
	
	
	
	/**
	 * Test same function with non-existent user.
	 * @throws Exception
	 */
	@Test
	public void testDetermineOwfGroupsWithInvalidUser() throws Exception {
		
		LdapUserDetailsContextMapper myLdapUserDetailsContextMapper = new LdapUserDetailsContextMapper(new ArrayList<LdapAuthorityGroup>(), new ArrayList<LdapAuthorityGroup>());
		
		Collection<OwfGroup> groups = myLdapUserDetailsContextMapper.determineOwfGroups("cn=idontexist,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US");
		assertNotNull(groups);
		assertEquals(0,groups.size());
	}

	
	
	
	
	/**
	 * Test that the context mapper can correctly map to a user object,
	 * the main functionality of the context mapper with a user DN.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperUser() throws Exception {
		DirContextAdapter contextAdapter = mock(DirContextAdapter.class);
		when(contextAdapter.getDn()).thenReturn(new LdapName("cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"));
		when(contextAdapter.getStringAttribute("cn")).thenReturn("jsmith");
		when(contextAdapter.getObjectAttribute("userpassword")).thenReturn(new String("password"));
		
		Object oUserDetails = ldapUserDetailsContextMapper.mapFromContext(contextAdapter);
		assertNotNull(oUserDetails);
		assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(oUserDetails));
		
		UserDetails userDetails = (UserDetails)oUserDetails;
		assertEquals("jsmith",userDetails.getUsername());
		assertEquals(1,userDetails.getAuthorities().size());
		
		Collection<GrantedAuthority> authorities = userDetails.getAuthorities();
		assertEquals(1, authorities.size());
		GrantedAuthority shouldBeRoleUser = authorities.iterator().next();
		assertEquals("ROLE_USER", shouldBeRoleUser.getAuthority());		
		
		Collection<OwfGroup> groups = ((OWFUserDetailsImpl)userDetails).getOwfGroups();
		assertEquals(2, groups.size());
		
		boolean foundGroup1 = false;
		boolean foundGroup2 = false;
		for(OwfGroup group : groups)
		{
			if("GROUP1".equals(group.getOwfGroupName())){
				foundGroup1 = true;
			}
			if("GROUP1".equals(group.getOwfGroupName())){
				foundGroup2 = true;
			}
		}
		assertTrue(foundGroup1);
		assertTrue(foundGroup2);
	}

	/**
	 * Test the main functionality of the context mapper with an admin DN.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperAdmin() throws Exception {
		DirContextAdapter contextAdapter = mock(DirContextAdapter.class);
		when(contextAdapter.getDn()).thenReturn(new LdapName("cn=jjones,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"));
		when(contextAdapter.getStringAttribute("cn")).thenReturn("jjones");
		when(contextAdapter.getObjectAttribute("userpassword")).thenReturn(new String("password"));
		
		Object oUserDetails = ldapUserDetailsContextMapper.mapFromContext(contextAdapter);
		assertNotNull(oUserDetails);
		assertTrue(new IsInstanceOf(OWFUserDetailsImpl.class).matches(oUserDetails));
		
		UserDetails userDetails = (UserDetails)oUserDetails;
		assertEquals("jjones",userDetails.getUsername());
		assertEquals(1,userDetails.getAuthorities().size());
		
		// Can't be guaranteed order, but ensure both ROLE_USER and ROLE_ADMIN
		// are in the array.
		Collection<GrantedAuthority> authorities = userDetails.getAuthorities();
		boolean match = false;
		for (GrantedAuthority authority : authorities) {
			if ( authority.getAuthority().equalsIgnoreCase("ROLE_USER") ) {
				match = true;
				break;
			}
		}
		assertEquals(true,match);
		
	}

	/**
	 * Test with null object.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperWithNullObject() throws Exception {

		Object oUserDetails = ldapUserDetailsContextMapper.mapFromContext(null);
		assertNull(oUserDetails);
	}

	/**
	 * Test with non-DirContextAdaper object.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperWithDifferentObject() throws Exception {

		Object oUserDetails = ldapUserDetailsContextMapper.mapFromContext(new Object());
		assertNull(oUserDetails);		
	}
}
