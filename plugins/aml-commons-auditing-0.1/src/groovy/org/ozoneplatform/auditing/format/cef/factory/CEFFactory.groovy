package org.ozoneplatform.auditing.format.cef.factory

import org.ozoneplatform.auditing.format.cef.CEF
import org.ozoneplatform.auditing.format.cef.Extension

/*
 * Right now this class is pretty simple but if we need lots of CEF objects
 * pre-populated in a consistent manner it makes sense to be here.
 */
class CEFFactory {
	
	public static final String DEVICE_VENDOR = "NSA"
	
	public static final String DEVICE_PRODUCT = "APPSMALL"
	
	public static final String DEVICE_VERSION = "500-27_L2::IC::1.3"
	
	public static final int VERSION = 0
	//Should severity be decided by the event?
	public static CEF buildBaseCEF(String signatureID, String name, int severity){
		return new CEF(VERSION, DEVICE_VENDOR, DEVICE_PRODUCT, DEVICE_VERSION, signatureID, name, severity, null)
	}	
}
