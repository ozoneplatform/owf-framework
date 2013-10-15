/**
 * 
 */
package ozone.securitysample.authentication.listener;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;

import ozone.securitysample.authentication.audit.SecurityAuditLogger;

/**
 *
 */
public class AuthenticationSuccessListener implements ApplicationListener<AbstractAuthenticationEvent> {
	
	private static final SecurityAuditLogger SecurityAuditLogger = new SecurityAuditLogger();
	
	public void onApplicationEvent(AbstractAuthenticationEvent event) {
		if (event instanceof InteractiveAuthenticationSuccessEvent) {
			SecurityAuditLogger.logSuccessLoginMsg((InteractiveAuthenticationSuccessEvent)event);
		}
	}
}
