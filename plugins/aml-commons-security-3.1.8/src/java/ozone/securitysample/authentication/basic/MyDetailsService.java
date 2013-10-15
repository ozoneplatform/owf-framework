package ozone.securitysample.authentication.basic;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import ozone.security.authentication.OWFUserDetails;
import ozone.security.authentication.OWFUserDetailsImpl;
import ozone.security.authorization.model.GrantedAuthorityImpl;
import ozone.security.authorization.model.OwfGroupImpl;
import ozone.security.authorization.target.OwfGroup;

/**
 * Example implementation of a DetailsService used by Spring
 * Security for loading the users into memory.  This class
 * utilizes a users.properties file with simple content.
 * 
 * propertyFileName (a typical users.properties ) is expected to be of the format
 * USERNAME=PASSWORD,ROLE,DISPLAY_NAME,optional ORGANIZATION,optional EMAIL,GROUPDEF1,GROUPDEF2,...
 * where a GROUPDEF looks like [GROUP_NAME; DESCRIPTION; EMAIL; ACTIVE/INACTIVE]
 * 
 * For example:
 * testUser1=password,ROLE_USER,John Doe
 * testAdmin1=password,ROLE_ADMIN:ROLE_EXTERNADMIN,Jane Smith,ACME Inc.,jsmith@acme.com
 * testUser2=password,ROLE_USER,Tom Jones,[group1;Just a sample Group;test@gmail.com;active]
 * testAdmin2=password,ROLE_ADMIN,Bob Roberts,[group1;Just a sample group;test@email.com;active],[group2;Another sample group from users.properties;test2@email.com;active],[group3;A third sample group from users.properties;test3@email.com;inactive]
 * 
 * One user per line.
 * Note that omitting ORGANIZATION and providing EMAIL may result in the email address being
 * interpretted as the organization name.  To make it clear, declare an empty ORGANIZATION
 * testUser3=password,ROLE_USER,Guy Someone,,guy.someone@somewhere.com
 */
public class MyDetailsService implements UserDetailsService {

	private static final Log log = LogFactory.getLog(MyDetailsService.class);
	
	// Static strings.
	private static final String REGEX_COMMA = "\\,";
	private static final String DEFAULT_PROPERTY_FILE = "/users.properties";
	
	
    // the users properties file.    
	private String propertyFileName = DEFAULT_PROPERTY_FILE;

    // user map storing valid users read in from propertyFileName
    private Map<String,OWFUserDetails> userMap = null;

    /**
     * Retrieves the user based on the provided name 
     * @param username - Name of the user to load
     * @return UserDetails - Spring Security object representing the name passed in
     * @throws UsernameNotFoundException
     * @throws DataAccessException
     */
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException,DataAccessException {
		log.debug("loading user by username [" + username + "]");
    	
    	Map<String,OWFUserDetails> userMap = getUserMap();
		OWFUserDetails user = userMap.get(username);
        if(user == null){
        	log.error("No matching user found [" + username + "].");
        	throw new UsernameNotFoundException("The user details service was passed authenticated credentials for '"+
        										username + "', but the credentials were not found. Access is denied.");
        }
        log.info("successfully logged in user [" + user.getUsername() + "], authorities [" + ((OWFUserDetailsImpl)user).displayAuthorities() + "], groups [" + ((OWFUserDetailsImpl)user).displayOwfGroups() + "]");
        return user;
    }
    
    /**
     * Loads a properties file using the class resource loader.
     * @param propertyFileName
     * @return properties
     */
    protected Properties loadPropertiesFile(String propertyFileName) {
        java.util.Properties properties = new Properties();
        try {
	        InputStream inputStream = this.getClass().getResourceAsStream(propertyFileName);
	        if (inputStream != null) {
	        	properties.load(inputStream);
	        } else {
	        	log.error("Property file [" + propertyFileName + "] not found.");
	        }
    	} catch (IOException e) {
    		log.error("I/O error retrieving users.", e);
    	}	
    	return properties;
    }
    
    /**
     * Creates a map of User objects keyed by username.
     * @param properties  The properties read in from user.properties (propertyFileName)
     * @return user map
     */
    protected Map<String,OWFUserDetails> buildUserMap(Properties properties) {

    	// create a new empty user map
    	Map<String,OWFUserDetails> userMap = new HashMap<String,OWFUserDetails>();
        Enumeration<Object> e = properties.keys();
        while (e.hasMoreElements()) {
            String username = (String)e.nextElement();
            String propValue = properties.getProperty(username);
            String[] values = propValue.split(REGEX_COMMA);
            if (values != null && values.length >= 3)   {
            	// pull the values out of the property and create the user object
				// First value is password
            	String password = values[0];

				// Second value is colon separated list of roles
            	String roles[] = values[1].split(":");
            	Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>(roles.length);
            	for(int i = 0; i < roles.length; ++i)
            	{
            		authorities.add(new GrantedAuthorityImpl(roles[i]));
            	}

				// Third value is display name
			   	String displayName = values[2];

				// Fourth value may be an organization or the first group.
				int groupStart = 5;
				String org = null;
				if (values.length >= 4) {
					if (values[3].startsWith("[")) {
						groupStart = 3;
					}
					else {
						org = values[3];
					}
				}

				// Fifth value may be email or the first group
				String email = null;
				if ((values.length >= 5) && (groupStart > 3)) {
					if (values[4].startsWith("[")) {
						groupStart = 4;
					}
					else {
						email = values[4];
					}
				}				 				

				// All the rest are groups.
            	Collection<OwfGroup> owfGroups = new ArrayList<OwfGroup>();
            	for(int i = groupStart; i < values.length; i++)
            	{
            		String[] groupInfo = values[i].split(";");
            		String groupName = groupInfo[0].replace("[", "");
            		String groupDescription = groupInfo[1];
            		String groupEmail = groupInfo[2];
            		boolean active = "active".equals(groupInfo[3].replace("]",""));
            		owfGroups.add(new OwfGroupImpl(groupName, groupDescription, groupEmail, active));
            	}

         		// Create the details object
            	OWFUserDetailsImpl owfUser = new OWFUserDetailsImpl(username, password, authorities, owfGroups);
            	owfUser.setDisplayName(displayName);
            	owfUser.setOrganization(org);
            	owfUser.setEmail(email);

            	// add the user to the map
            	userMap.put(username,owfUser);
            }
        }
    	return userMap;
    }
    
    protected void setUserMap(Map<String,OWFUserDetails> userMap) {
		this.userMap = userMap;
	}

	/**
	 * Returns a user map, builds it if it doesn't exist.
	 * @return
	 */
	protected Map<String,OWFUserDetails> getUserMap() {
    	if (this.userMap == null) {
    		Properties properties = loadPropertiesFile(this.propertyFileName);
    		this.userMap = buildUserMap(properties);
            log.debug("users:"+this.userMap);
        	log.debug("loaded [" + this.userMap.size() + "] users");
    	}
    	return this.userMap;
    }

    public String getPropertyFileName() {
      return propertyFileName;
    }

    public void setPropertyFileName(String propertyFileName) {
      this.propertyFileName = propertyFileName;
    }
}
