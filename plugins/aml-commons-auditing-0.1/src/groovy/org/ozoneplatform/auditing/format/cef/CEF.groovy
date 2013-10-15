package org.ozoneplatform.auditing.format.cef

import org.ozoneplatform.auditing.format.cef.util.EscapedStringUtil


class CEF {

	/*
	Version is an integer and identifies the version of the CEF format. Event
	consumers use this information to determine what the following fields
	represent. 
	*/
	int version
	
	/*
	Device Vendor, Device Product, and Device Version are strings that
	uniquely identify the type of sending device. No two products may use the
	same device-vendor and device-product pair. There is no central authority
	managing these pairs. Event producers have
	to ensure that they assign unique
	name pairs 
	*/
	String deviceVendor, deviceProduct, deviceVersion
	

	/*
	Signature IDis a unique identifier per event-type. This can be a string or an
	integer. Signature ID identifies the type of event reported. In the intrusion
	detection system (IDS) world, each signature or rule that detects certain
	activity has a unique signature ID assigned. This is a requirement for other
	types of devices as well, and helps correlation engines deal with the events	 
	*/
	String id
	
	/*
	Name is a string representing a human-readable and understandable
	description of the event. The event name
	should not contain information that
	is specifically mentioned in other fields. For example: 'Port scan from 10.0.0.1
	targeting 20.1.1.1' is not a good event name. It should be: 'Port scan'. The
	other information is redundant and can be picked up from the other fields
	 */
	String name
	
	/*
	Severity is an integer and reflects the importance of the event. Only
	numbers from 0 to 10 are allowed, where 10 indicates the most important
	event. 	  
	 */
	int severity
	

	/*
	 Extension is a collection of key-value pairs. The keys are part of a predefined
	 set. The standard allows for including additional keys as outlined under 'The
	 Extension Dictionary' on page 4. An event can contain any number of key-
	 value pairs in any order, separated by spaces (' '). If a field contains a space,
	 such as a file name, this is valid and can be logged in exactly that manner, as
	 shown below: fileName=c:\Program <space> Files\ArcSight is a valid token.
	*/
	Extension extension

	private final StringBuilder sb
	
	//We want a constructor so that these fields are not null
	public CEF( int cefVersion, String deviceVendor, String deviceProduct, String deviceVersion, String id, String name, int severity,  Extension extension )	{
		this.version 			= cefVersion //CEF version
		this.deviceVendor     	= deviceVendor
		this.deviceProduct    	= deviceProduct
		this.deviceVersion    	= deviceVersion
		this.id         		= id
		this.name      			= name
		this.severity  			= severity
		this.extension  		= extension		
	}
	
	@Override
	public String toString(){
		StringBuilder sb = new StringBuilder()
		
		sb.append("CEF:")
		sb.append(version)
		sb.append("|")
		sb.append(EscapedStringUtil.escapeField(deviceVendor ))
		sb.append("|")
		sb.append(EscapedStringUtil.escapeField(deviceProduct))
		sb.append("|")
		sb.append(EscapedStringUtil.escapeField(deviceVersion))
		sb.append("|")
		sb.append(EscapedStringUtil.escapeField(id))
		sb.append("|")
		sb.append(EscapedStringUtil.escapeField(name))
		sb.append("|")
		sb.append(severity)
		sb.append("|")
		sb.append(extension)
		return sb.toString()
	}
	
}
