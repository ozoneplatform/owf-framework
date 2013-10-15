package ozone.security.authorization.model;

import java.io.Serializable;

import ozone.security.authorization.target.OwfGroup;


/**
 * OwfGroupImpl
 * 
 * This class implements the idea of a OWF user Group, an OWF concept 
 * where a user is authorized as being part of a particular group which
 * can have widgets and other behaviors assigned to it.  
 * 
 */
public class OwfGroupImpl implements OwfGroup, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// the name of the widget group
	private String owfGroupName = null;
	private String owfGroupDescription = null;
	private String owfGroupEmail = null;
	private boolean active = true; // active by default!
	
	/**
	 * default constructor
	 */
	public OwfGroupImpl(){
		// do nothing
	}
	
	/**
	 * Constructor that sets the widgetGroupName
	 * @param widgetGroupName String non empty
	 * @param owfGroupDescription  String A description that is displayed to admins in OWF that describes the group
	 * @param owfGroupEmail  String an email that is displayed to admins in OWF that will reach a group owner
	 * @param active boolean  true if the group is active, false otherwise
	 */
	public OwfGroupImpl(String widgetGroupName, String owfGroupDescription, String owfGroupEmail, boolean active) {		
		this.owfGroupName = widgetGroupName;
		this.owfGroupDescription = owfGroupDescription;
		this.owfGroupEmail = owfGroupEmail;
		this.active = active;
	}


	/**
	 * a non-empty string 
	 */
	public void setOwfGroupName(String name) {
		this.owfGroupName = name;
	}


	/**
	 * See parent
	 */
	public String getOwfGroupName() {
		return owfGroupName;
	}

	
	public String toString() {
		return "OwfGroupImpl [owfGroupName=" + owfGroupName + "]";
	}

	/**
	 * @return a drescription of the OWF group
	 */
	public String getOwfGroupDescription() {
		return owfGroupDescription;
	}

	/**
	 * 
	 * @param owfGroupDescription
	 */
	public void setOwfGroupDescription(String owfGroupDescription) {
		this.owfGroupDescription = owfGroupDescription;
	}

	/**
	 * @return an email address that will reach someone if there are problems with the group
	 * This is displayed ot a group administrator in OWF
	 */
	public String getOwfGroupEmail() {
		return owfGroupEmail;
	}

	/**
	 * 
	 * @param owfGroupEmail
	 */
	public void setOwfGroupEmail(String owfGroupEmail) {
		this.owfGroupEmail = owfGroupEmail;
	}

	/**
	 * @return true if this is an active group
	 */
	public boolean isActive() {
		return active;
	}

	/**
	 * 
	 * @param active
	 */
	public void setActive(boolean active) {
		this.active = active;
	}
	
	
	
}
