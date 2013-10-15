package ozone.security.authentication;

import java.util.Collection;

import org.springframework.security.core.userdetails.UserDetails;

import ozone.security.authorization.target.OwfGroup;

/**
 * OWFUserDetails
 * 
* This is the OWF UserDetails interface.  
* 
* It defines an interface for a data model that OWF requires in order to handle 
* OWF User Groups.  Using an implementation of this interface (and implementations
* may vary) will ensure that OWF user groups work.  
* 
* OWF Groups are a way of grouping users so that various behaviors may be assigned to
* them collectively through the administrative console.  Behaviors include bulk 
* widget assignment.
* 
* @see org.springframework.security.core.userdetails.UserDetails
* 
* */
public interface OWFUserDetails extends UserDetails{

	
	/**
	 * getOwfGroups
	 * @return a Collection containing information about the OWF Groups that this user is a part of.
	 */
	public Collection<OwfGroup> getOwfGroups();
	
	
	/**
	 * getDisplayName
	 * @return String the Display Name of the user.  This name is displayed in the upper right hand corner of the banner.  If not set, the username is used instead.  It is an optional field.
	 */
	public String getDisplayName();
	
	/**
	 * getOrganization
	 * @return String the organization that the user belongs to if specified.
	 */
	public String getOrganization();
	
	/**
	 * getEmail
	 * @return String the email address of the user if specified.
	 */
	public String getEmail();
}
