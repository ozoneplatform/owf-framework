package ozone.securitysample.authentication.ldap;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import java.text.MessageFormat;

import javax.naming.directory.Attributes;
import javax.naming.NamingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.ldap.core.LdapEncoder;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.ContextMapper;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.LdapContextSource;

import org.springframework.security.ldap.userdetails.UserDetailsContextMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.model.GrantedAuthorityImpl;
import ozone.security.authorization.model.OwfGroupImpl;
import ozone.security.authorization.target.OwfGroup;

/**
 * Context mapper to convert to a user details object. Includes code to
 * fetch OWF groups from the database
 */
public class OWFUserDetailsContextMapper implements UserDetailsContextMapper {

	private static final Log log = LogFactory
			.getLog(OWFUserDetailsContextMapper.class);

    private LdapContextSource contextSource;
    private LdapTemplate ldapTemplate;
    private String searchBase;
    private String filter;

    public OWFUserDetailsContextMapper(LdapContextSource contextSource, String searchBase, String filter) {
        this.ldapTemplate = new LdapTemplate(contextSource);
        this.contextSource = contextSource;
        this.searchBase = searchBase;
        this.filter = filter;
    }

	/**
	 * Main overridden function, maps specific fields from the context object to
	 * the user details object.
	 * 
	 * @param ctx
	 *            - directory context
     * @param username - The username
     * @param authority - Authorities that this user has been determined to have
	 * @return userDetails object
	 */
	public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<GrantedAuthority> authority) {
		OWFUserDetailsImpl userDetails = null;


        Collection<OwfGroup> groups = determineOwfGroups(ctx.getDn()
                .toString());

        userDetails = new OWFUserDetailsImpl(ctx
                .getStringAttribute("cn"), ctx.getObjectAttribute(
                "userpassword").toString(), authority, groups);

        userDetails.setDisplayName(ctx.getStringAttribute("givenname"));
        userDetails.setEmail(ctx.getStringAttribute("mail"));

        log.debug("user details [" + userDetails.toString() + "].");

		return userDetails;
	}

    public void mapUserToContext(UserDetails user, DirContextAdapter ctx) {
        throw new UnsupportedOperationException("This plugin does not support the saving of user attributes");
    }

	/**
	 * Determine owf groups from the list of groups. Translates into OwfGroup
	 * objects
	 * 
	 * @param dn
	 *            the user's dn
	 * @return GrantedAuthority array
	 */
    @SuppressWarnings("unchecked")
	protected Collection<OwfGroup> determineOwfGroups(final String dn) {
        return (Collection<OwfGroup>) ldapTemplate.search(searchBase, 
            //fill in the filter string
            MessageFormat.format(filter, LdapEncoder.filterEncode(dn + "," + contextSource.getBaseLdapPath().toString())),
                new AttributesMapper() {
                    public Object mapFromAttributes(Attributes attrs) throws NamingException {
                        //our sample ldap data does not include all of these fields
                        return new OwfGroupImpl((String)attrs.get("cn").get(), null, null, true);
                    }   
                });
	}
}
