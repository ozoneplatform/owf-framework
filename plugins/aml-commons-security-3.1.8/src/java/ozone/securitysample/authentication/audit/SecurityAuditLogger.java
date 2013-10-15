/**
 * 
 */
package ozone.securitysample.authentication.audit;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationFailureProviderNotFoundEvent;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;

import ozone.security.authentication.OWFUserDetailsImpl;
import java.security.cert.X509Certificate;

public class SecurityAuditLogger {
	private static final Logger logAudit = Logger.getLogger(SecurityAuditLogger.class);
	private static final AuthenticationUtils MP_AUTH_UTILS = new AuthenticationUtils();
	protected DateFormat eventDateFormatter = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss Z");
	
	private static final String LOGIN_ACTION = "LOGIN";
	private static final String LOGOUT_ACTION = "LOGOUT";
	private static final String STATE_SUCCESS = "SUCCESS";
	private static final String STATE_FAILURE = "FAILURE";
	private static final String SUCCESS_LOGIN_STATUS = LOGIN_ACTION + " SUCCESS - ACCESS GRANTED";
	private static final String FAILURE_LOGIN_STATUS = LOGIN_ACTION + " FAILURE - ACCESS DENIED";
	
	public SecurityAuditLogger(){}
	
	/***
	 * CHECK FOR INFO LEVEL LOGGING
	 * 
	 * @return
	 */
	public boolean isInfo(){
        return logAudit.getLevel() == Level.INFO;
    }
	
	/***
	 * CHECK FOR DEBUG LEVEL LOGGING
	 * 
	 * @return
	 */
	public boolean isDebug(){
        return logAudit.getLevel() == Level.DEBUG;
    }
	
	/***
	 * LOG SUCCESS LOGIN MESSAGE
	 * 
	 * @param event
	 */
	public void logSuccessLoginMsg(InteractiveAuthenticationSuccessEvent event){
		if(event == null){
			return;
		}
		Authentication authentication = event.getAuthentication();
		logEventSuccessMsg(authentication, LOGIN_ACTION);
	}
	
	/***
	 * LOG SUCCESS LOGOUT MESSAGE
	 * 
	 * @param authentication
	 */
	public void logSuccessLogoutMsg(Authentication authentication){
		logEventSuccessMsg(authentication, LOGOUT_ACTION);
	}
	
	/***
	 * LOG EVENT SUCCESS MESSAGE
	 * 
	 * @param authentication
	 * @param actionType
	 */
	private void logEventSuccessMsg(Authentication authentication, String actionType){
		if(authentication == null){
			return;
		}
		Object user = authentication.getPrincipal();
		Object credentials = authentication.getCredentials();
		HashMap<String, String> detailsMap = (HashMap<String, String>) MP_AUTH_UTILS.getDetailsMap(authentication);
		if(user instanceof OWFUserDetailsImpl){
			StringBuffer auditLogMsgBuffer = (new StringBuffer("[USER ").append(actionType).append("]:").append(getMsgByActionType(STATE_SUCCESS, actionType))
					.append(" USER [").append(detailsMap.get(AuthenticationUtils.MAP_KEY_USERNAME)).append("], ")
					.append("with DISPLAY NAME [").append(((OWFUserDetailsImpl)user).getDisplayName()).append("], ")
					.append("with AUTHORITIES [").append(((OWFUserDetailsImpl)user).displayAuthorities()).append("], ")
					.append("with ORGANIZATION [").append(((OWFUserDetailsImpl)user).getOrganization()).append("], ")
					.append("with EMAIL [").append(((OWFUserDetailsImpl)user).getEmail()).append("] "))
					.append("with CREDENTIALS [");
			if(credentials instanceof X509Certificate){
				if (isDebug()){
					X509Certificate x509Credentials = (X509Certificate) credentials;
					//KEY SIGNATURE
					auditLogMsgBuffer.append("CERTIFICATE ").append(actionType).append(" >> Signature Algorithm: [")
									.append(x509Credentials.getSigAlgName())
									.append(", OID = ")
									.append(x509Credentials.getSigAlgOID()).append("]; ");
					//SUBJECT INFO
					auditLogMsgBuffer.append("Subject: [")
									.append(x509Credentials.getSubjectDN())
									.append("]; ");
					//VALID DATES
					auditLogMsgBuffer.append("Validity: [")
									.append("From: ")
									.append(x509Credentials.getNotBefore())
									.append(", To: ")
									.append(x509Credentials.getNotAfter())
									.append("]; ");
					//ISSUER INFO
					auditLogMsgBuffer.append("Issuer: [")
									.append(x509Credentials.getIssuerDN())
									.append("]; ");
				}else{
					auditLogMsgBuffer.append("CERTIFICATE ").append(actionType);
				}
			} else if((credentials instanceof String) && (((String)credentials).toLowerCase().contains("cas"))){
				if (isDebug()){
					auditLogMsgBuffer.append("CAS ").append(actionType).append(" >> ").append(credentials);
				}else{
					auditLogMsgBuffer.append("CAS ").append(actionType);
				}
			} else {
				if (isDebug()){
					auditLogMsgBuffer.append("SUCCESSFUL ").append(actionType).append(" >> ").append(credentials);
				}else{
					auditLogMsgBuffer.append("SUCCESSFUL ").append(actionType);
				}
			}
			auditLogMsgBuffer.append("]");
			String auditLogMsg = auditLogMsgBuffer.toString();
			
			String sessionId = detailsMap.get(AuthenticationUtils.MAP_KEY_SESSION_ID);
			if (isInfo()){
				logAuditMsg(detailsMap.get(AuthenticationUtils.MAP_KEY_IP_ADDRESS), sessionId, 
						detailsMap.get(AuthenticationUtils.MAP_KEY_USERNAME),auditLogMsg,Level.INFO_INT);
			}else if (isDebug()){
				logAuditMsg(detailsMap.get(AuthenticationUtils.MAP_KEY_IP_ADDRESS), sessionId, 
						detailsMap.get(AuthenticationUtils.MAP_KEY_USERNAME),auditLogMsg,Level.DEBUG_INT);
			}
		}
		
	}
	
	/***
	 * LOG FAILURE LOGIN MESSAGE
	 * 
	 * @param event
	 */
	public void logFailureLoginMsg(AbstractAuthenticationFailureEvent event){
		logEventFailureMsg(event, LOGIN_ACTION);
	}
	
	
	/***
	 * LOG FAILURE EVENT MESSAGE
	 * @param authentication
	 * @param event
	 * @param actionType
	 */
	private void logEventFailureMsg(AbstractAuthenticationFailureEvent event, String actionType){
		if(event == null){
			return;
		}
		
		Authentication authentication = (Authentication)event.getSource();
		if(authentication == null){
			return;
		}
		Object user = authentication.getPrincipal();
		Object credentials = authentication.getCredentials();
		String eventExceptionMsg = event.getException().getMessage();
		HashMap<String, String> detailsMap = (HashMap<String, String>) MP_AUTH_UTILS.getDetailsMap(authentication);
    	String failureMsg = "";
		if(event instanceof AuthenticationFailureProviderNotFoundEvent){
			StringBuffer auditLogMsgBuffer = new StringBuffer();
			auditLogMsgBuffer.append("Login for ")
				.append(((user instanceof String) ? "'"+user+"' " : "a user with principal '"+user+"' "))
				.append("attempted with authenticated credentials [");
			if(credentials instanceof X509Certificate){
				if (isDebug()){
					X509Certificate x509Credentials = (X509Certificate) credentials;
					//KEY SIGNATURE
					auditLogMsgBuffer.append("CERTIFICATE ").append(actionType).append(" >> Signature Algorithm: [")
									.append(x509Credentials.getSigAlgName())
									.append(", OID = ")
									.append(x509Credentials.getSigAlgOID()).append("]; ");
					//SUBJECT INFO
					auditLogMsgBuffer.append("Subject: [")
									.append(x509Credentials.getSubjectDN())
									.append("]; ");
					//VALID DATES
					auditLogMsgBuffer.append("Validity: [")
									.append("From: ")
									.append(x509Credentials.getNotBefore())
									.append(", To: ")
									.append(x509Credentials.getNotAfter())
									.append("]; ");
					//ISSUER INFO
					auditLogMsgBuffer.append("Issuer: [")
									.append(x509Credentials.getIssuerDN())
									.append("]; ");
				}else{
					auditLogMsgBuffer.append("CERTIFICATE ").append(actionType);
				}
			}else if((credentials instanceof String) && (((String)credentials).toLowerCase().contains("cas"))){
				if (isDebug()){
					auditLogMsgBuffer.append("CAS ").append(actionType).append(" >> ").append(credentials);
				}else{
					auditLogMsgBuffer.append("CAS ").append(actionType);
				}
			}else {
				if (isDebug()){
					auditLogMsgBuffer.append("FAILURE ").append(actionType).append(" >> ").append(credentials);
				}else{
					auditLogMsgBuffer.append("FAILURE ").append(actionType);
				}
			}
			auditLogMsgBuffer.append("]; However, the Provider was not found. Access is DENIED.");
			if (isDebug()){
				auditLogMsgBuffer.append(actionType).append(" Exception Message: [")
					.append(eventExceptionMsg)
					.append("]");
			}
			failureMsg = auditLogMsgBuffer.toString();
		}else{
			failureMsg = "Authentication Failure Message : " + eventExceptionMsg;
		}
		
		String auditLogMsg = (new StringBuffer("[USER ").append(actionType).append("]:").append(getMsgByActionType(STATE_FAILURE, actionType))
				.append(" with FAILURE MSG [").append(failureMsg).append("]"))
				.toString();
		
		
		String sessionId = detailsMap.get(AuthenticationUtils.MAP_KEY_SESSION_ID);
		if (isInfo()){
			logAuditMsg(detailsMap.get(AuthenticationUtils.MAP_KEY_IP_ADDRESS), sessionId, 
					detailsMap.get(AuthenticationUtils.MAP_KEY_USERNAME), auditLogMsg,Level.INFO_INT);
		}else if (isDebug()){
			logAuditMsg(detailsMap.get(AuthenticationUtils.MAP_KEY_IP_ADDRESS), sessionId, 
					detailsMap.get(AuthenticationUtils.MAP_KEY_USERNAME), auditLogMsg,Level.DEBUG_INT);
		}
	}
	
	private String getMsgByActionType(String eventState, String actionType){
		if(LOGIN_ACTION.equals(actionType) && STATE_SUCCESS.equals(eventState)){
			return SUCCESS_LOGIN_STATUS;
		}else if(LOGIN_ACTION.equals(actionType) && STATE_FAILURE.equals(eventState)){
			return FAILURE_LOGIN_STATUS;
		}else{
			return actionType;
		}
	}
	
	/***
	 * LOG AUDIT MESSAGE
	 * 
	 * @param ipAddress
	 * @param sessionId
	 * @param username
	 * @param msg
	 * @param logLevel
	 */
	public void logAuditMsg(String ipAddress, String sessionId, 
			String username, String msg, int logLevel)
    {
		
		StringBuffer auditLogStringBuffer = new StringBuffer();
		boolean isExtraSpace = false;
		auditLogStringBuffer.append("[").append(this.eventDateFormatter.format(new Date())).append("] ");
    	if(StringUtils.isNotBlank(ipAddress)){
    		auditLogStringBuffer.append("IP: ")
								.append(ipAddress);
    		isExtraSpace = true;
    	}
    	if(StringUtils.isNotBlank(sessionId)){
    		auditLogStringBuffer.append(isExtraSpace? " ": "")
    							.append("SessionID: ")
								.append(sessionId);
    		isExtraSpace = true;
    	}									
    	
    	if(StringUtils.isNotBlank(username)){
    		auditLogStringBuffer.append(isExtraSpace? " ": "")
    							.append("User: ")
    							.append(username);
    		isExtraSpace = true;
    	}
    	auditLogStringBuffer.append(isExtraSpace? " ": "")
    						.append(msg);
    	String auditLogString = auditLogStringBuffer.toString();
    	switch(logLevel){
    		case Level.DEBUG_INT:
    			logAudit.debug(auditLogString);
    			break;
    		case Level.INFO_INT:
    			logAudit.info(auditLogString);
    			break;
    		case Level.WARN_INT:
    			logAudit.warn(auditLogString);
    			break;
    		case Level.ERROR_INT:
    			logAudit.error(auditLogString);
    			break;
    		case Level.FATAL_INT:
    			logAudit.fatal(auditLogString);
    			break;
    		default:
    			//Do nothing...
    			break;
    	}
    }
	
	public Logger getLogAudit(){
		return logAudit;
	}
}
