package ozone.securitysample.authentication.ldap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import javax.naming.ldap.LdapName;

import org.hamcrest.core.IsInstanceOf;
import org.junit.Before;
import org.junit.Test;
import org.springframework.ldap.core.DirContextAdapter;

import ozone.securitysample.authentication.ldap.LdapAuthorityGroup;
import ozone.securitysample.authentication.ldap.LdapAuthorityGroupContextMapper;

public class LdapAuthorityGroupContextMapperTest {
	
	private LdapAuthorityGroupContextMapper ldapAuthorityGroupContextMapper;
	
	@Before
	public void setUp() throws Exception {
		ldapAuthorityGroupContextMapper = new LdapAuthorityGroupContextMapper();
	}
	
	/**
	 * Test mapping functionality, ensure the proper fields get mapped.
	 * @throws Exception
	 */
	@Test
	public void testContextMapper() throws Exception {

		DirContextAdapter contextAdapter = mock(DirContextAdapter.class);
		when(contextAdapter.getDn()).thenReturn(new LdapName("cn=user,ou=groups,o=OWF,st=Maryland,c=us"));
		when(contextAdapter.getStringAttribute("cn")).thenReturn("user");
		when(contextAdapter.getStringAttributes("member")).thenReturn(new String[]{ "cn=jsmith,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US",
				                                                                    "cn=jdoe,ou=OWF,o=OWFDevelopment,l=Columbia,st=Maryland,c=US"
				                                                                  });
		
		Object oLdapAuthorityGroup = ldapAuthorityGroupContextMapper.mapFromContext(contextAdapter);
		
		assertTrue(new IsInstanceOf(LdapAuthorityGroup.class).matches(oLdapAuthorityGroup));
		LdapAuthorityGroup ldapAuthorityGroup = (LdapAuthorityGroup)oLdapAuthorityGroup;
		
		assertEquals("cn=user,ou=groups,o=OWF,st=Maryland,c=us",ldapAuthorityGroup.getDn());
		assertEquals("user",ldapAuthorityGroup.getCn());
		assertEquals(2,ldapAuthorityGroup.getMembers().length);
	}

	/**
	 * Test with null object.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperWithNullObject() throws Exception {

		Object oLdapAuthorityGroup = ldapAuthorityGroupContextMapper.mapFromContext(null);
		assertNull(oLdapAuthorityGroup);
	}

	/**
	 * Test with non-DirContextAdaper object.
	 * @throws Exception
	 */
	@Test
	public void testContextMapperWithDifferentObject() throws Exception {

		Object oLdapAuthorityGroup = ldapAuthorityGroupContextMapper.mapFromContext(new Object());
		assertNull(oLdapAuthorityGroup);		
	}
}
