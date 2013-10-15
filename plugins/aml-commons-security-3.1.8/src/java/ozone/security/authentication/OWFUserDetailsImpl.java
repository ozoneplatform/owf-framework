package ozone.security.authentication;

import java.util.ArrayList;
import java.util.Collection;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.springframework.security.core.GrantedAuthority;
import ozone.security.authorization.target.OwfGroup;

/**
 * This is the OWF UserDetails implementation.  It is a data model that 
 * encapsulates necessary information about the user.  See interface for
 * details about it's integration with the spring security flow.
 */
public class OWFUserDetailsImpl implements OWFUserDetails{

    /**
	 * Version 2 of this class
	 */
	private static final long serialVersionUID = 2L;

	// holds the authorities this user has--their ROLES.  (IE, ROLE_USER and ROLE_ADMIN)
	private Collection<GrantedAuthority> authorities = null;
	
	// The user's password
    private String password = null;
    
    // the user's username.  Must be unique.
	private String username = null;

    // the user's display name
    private String displayName = null;

	// the user's organization
    private String organization = null;

	// the user's email address
    private String email = null;

    // a collection of the groups a user is a member of.  It may be empty.
    private Collection<OwfGroup> owfGroups = new ArrayList<OwfGroup>();

    /**
     * 
     * @param username  
     * @param password
     * @param authorities  
     * @param groups
     */
    public OWFUserDetailsImpl(String username, String password, Collection<GrantedAuthority> authorities, Collection<OwfGroup> groups) {
    	this.authorities = authorities;
    	this.password = password;
    	this.username = username;
        this.owfGroups = groups;
    }
   
    public Collection<GrantedAuthority> getAuthorities() {
        return authorities;
    }


    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String name) {
        this.displayName = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }
    
	public Collection<OwfGroup> getOwfGroups() {
		return owfGroups;
	}

	public void setOwfGroups(Collection<OwfGroup> owfGroups) {
		this.owfGroups = owfGroups;
	}

	/**
	 * Pass in an OwfGroup to add for this user.
	 * @param group
	 */
	public void addOwfGroup(OwfGroup group){
		owfGroups.add(group);
	}

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

    public String toString () {
    	return new ReflectionToStringBuilder(this).toString();
    }

    /**
     * @return String a comma delimited string list of the granted authorities (options: none, ROLE_USER and ROLE_ADMIN) 
     */
    public String displayAuthorities() {
    	StringBuffer sb = new StringBuffer(255);
    	for (GrantedAuthority authority : authorities) {
    		sb.append(sb.length() > 0 ? "," : "");
    		sb.append(authority.getAuthority());
    	}
    	return sb.toString();
    }
    
    
    /**
     * @return String a comma delimited string list of the owf groups.  May be empty 
     */
    public String displayOwfGroups() {
    	StringBuffer sb = new StringBuffer(255);
    	for (OwfGroup group : owfGroups) {
    		sb.append(sb.length() > 0 ? "," : "");
    		sb.append(group.getOwfGroupName());
    	}
    	return sb.toString();
    }

    public boolean equals(Object other) {
        return this.getClass() == other.getClass() && this.equals((OWFUserDetailsImpl)other);
    }

    /**
     * equals is overridden to compare based on username.  This makes sense since the rest 
     * of the application uses usernames to uniquely identify users.
     */
    public boolean equals(OWFUserDetailsImpl other) {
        return (this.username == null ? other.username == null : 
            this.username.equals(other.username));
    }

    /**
     * overridden to coincide with equals
     */
    public int hashCode() {
        return (this.username == null ? 0 : this.username.hashCode());
    }
}
