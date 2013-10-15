/**
 * 
 */
package ozone.securitysample.authentication.listener;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;

import ozone.securitysample.authentication.audit.SecurityAuditLogger;

/**
 *
 */
public class AuthenticationFailureListener implements ApplicationListener<AbstractAuthenticationEvent> {
	
	private static final SecurityAuditLogger SecurityAuditLogger = new SecurityAuditLogger();
	
	public void onApplicationEvent(AbstractAuthenticationEvent event) {
		if(event instanceof AbstractAuthenticationFailureEvent){
			SecurityAuditLogger.logFailureLoginMsg((AbstractAuthenticationFailureEvent)event);
		}
	}
}
