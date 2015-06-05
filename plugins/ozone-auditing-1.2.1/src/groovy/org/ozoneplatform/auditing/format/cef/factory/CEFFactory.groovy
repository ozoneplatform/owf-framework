package org.ozoneplatform.auditing.format.cef.factory

import org.ozoneplatform.auditing.format.cef.CEF
import org.ozoneplatform.auditing.format.cef.Extension

/*
 * Right now this class is pretty simple but if we need lots of CEF objects
 * pre-populated in a consistent manner it makes sense to be here.
 */
class CEFFactory {

	public static CEF buildBaseCEF(int version, String deviceVendor, String deviceProduct, String deviceVersion, String signatureID, String name, int severity){
		return new CEF(version, deviceVendor, deviceProduct, deviceVersion, signatureID, name, severity, null)
	}
}
    

