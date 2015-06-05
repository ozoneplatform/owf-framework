package org.ozoneplatform.auditing.format.cef.factory

import java.text.DateFormat
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletRequest
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.enums.*

/*
 * The Extension object is coupled to the HttpServletRequest object to get most the data
 * that makes it up so a factory is needed so that the Extension object need not be aware of web
 * elements like the HttpServletRequest object.
 */
class ExtensionFactory {

	
	public static DateFormat eventDateFormatter = new SimpleDateFormat("MM:dd:yyyy HH:mm:ss")
	 
	
	//Fills out fields with sensible defaults
	//Might want to change the HttpServletRequest to a custom object to house these values
	public static def getBaseExtensionFields(HttpServletRequest servletRequest, String userName, 
            String appVersion, String hostClassification){
		def fields = [:]
		fields[Extension.EVENT_TYPE]    		= ""
		fields[Extension.STATUS] 				= "SUCCESS"  //Not sure how to trap failures
		fields[Extension.REASON] 				= ""
		fields[Extension.SYSTEM_NOTIFICATIONS]  = ""
		fields[Extension.SYSTEM_VERSION] 		= appVersion
		fields[Extension.TRANSACTION_ID] 		= ""
		fields[Extension.DESTINATION_CLS] 		= hostClassification
		fields[Extension.EVENT_DATE_TIME] 		= eventDateFormatter.format(new Date())
		fields[Extension.EVENT_CLS] 		    = hostClassification

        if (servletRequest) {
            fields[Extension.SOURCE] 				= getClientIpAddress(servletRequest)
            fields[Extension.SYSTEM_EVENT_ID] 		= servletRequest?.getRequestedSessionId()
            fields[Extension.DESTINATION] 			= servletRequest?.getLocalAddr()
            fields[Extension.TRIGGER]				= RequestMethodTypes.USER_INITIATED.getDescription()
            fields[Extension.USER_ID]   			= userName
        }
        else {
            InetAddress addr = InetAddress.getLocalHost()
            String hostname = addr.getHostName()
            String hostAddress = addr.getHostAddress()
            String hostInfo = "${hostname}:${hostAddress}"
            fields[Extension.SOURCE]                = hostInfo
            fields[Extension.SYSTEM_EVENT_ID]       = Extension.UNKOWN_VALUE
            fields[Extension.DESTINATION]           = hostInfo
            fields[Extension.TRIGGER]               = RequestMethodTypes.UNKNOWN.description
            fields[Extension.USER_ID]               = 'SYSTEM'
        }

		return fields
	}
	
	private static String getClientIpAddress(HttpServletRequest servletRequest){
        servletRequest.getHeader("x-forwarded-for") ?: 
            servletRequest.getHeader("X_FORWARDED_FOR") ?: 
            servletRequest.getRemoteAddr()
	}
}
