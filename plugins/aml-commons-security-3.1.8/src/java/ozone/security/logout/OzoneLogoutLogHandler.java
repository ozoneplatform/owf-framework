/**
 * This LogoutHandler adds a log entry regarding the
 * logout
 */
package ozone.security.logout;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import ozone.securitysample.authentication.audit.SecurityAuditLogger;

public class OzoneLogoutLogHandler implements LogoutHandler {

	private static final SecurityAuditLogger LOGGER = 
        new SecurityAuditLogger();

    public void logout(HttpServletRequest request, HttpServletResponse response, 
            Authentication authentication) {

        LOGGER.logSuccessLogoutMsg(authentication);
    }
}
