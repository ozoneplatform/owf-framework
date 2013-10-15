/**
 * 
 */
package ozone.security.logout;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.cas.authentication.CasAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;


/**
 *
 */
public class OzoneLogoutSuccessHandler implements LogoutSuccessHandler {

	private SimpleUrlLogoutSuccessHandler casLogoutHandler;
	private SimpleUrlLogoutSuccessHandler defaultLogoutHandler;
	
	/***
	 * Must have a valid defaultLogoutSuccessUrl
	 * 
	 * @param defaultLogoutSuccessUrl - Madatory, must be valid.
	 * @param casLogoutSuccessUrl - Optional, based on if CAS is provided, and if provided must be valid.
	 */
	public OzoneLogoutSuccessHandler(String defaultLogoutSuccessUrl,
								  String casLogoutSuccessUrl) {
		if (StringUtils.hasText(casLogoutSuccessUrl)) {
			Assert.isTrue(UrlUtils.isValidRedirectUrl(casLogoutSuccessUrl), casLogoutSuccessUrl + " isn't a valid redirect URL");
		}
		Assert.isTrue(!StringUtils.hasLength(defaultLogoutSuccessUrl) ||
                UrlUtils.isValidRedirectUrl(defaultLogoutSuccessUrl), defaultLogoutSuccessUrl + " isn't a valid redirect URL");
		
		this.casLogoutHandler = new SimpleUrlLogoutSuccessHandler();
        this.casLogoutHandler.setDefaultTargetUrl(casLogoutSuccessUrl);

		this.defaultLogoutHandler = new SimpleUrlLogoutSuccessHandler();
        this.defaultLogoutHandler.setDefaultTargetUrl(defaultLogoutSuccessUrl);
	}
	
	/* (non-Javadoc)
	 * @see org.springframework.security.web.authentication.logout.LogoutSuccessHandler#onLogoutSuccess(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, org.springframework.security.core.Authentication)
	 */
	public void onLogoutSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
		
		//Choose the right Logout Success URL
		getUrlLogoutSuccessHandlerByAuthentication(authentication).onLogoutSuccess(request, 
																	response, authentication);
	}
	
	/***
	 * If CAS authentication, we'll use the CAS Success Logout URL.
	 * Else we'll use the default logout URL
	 * 
	 * @param authentication
	 * @return
	 */
	private SimpleUrlLogoutSuccessHandler getUrlLogoutSuccessHandlerByAuthentication(final Authentication authentication){
		return (authentication instanceof CasAuthenticationToken) ? casLogoutHandler : defaultLogoutHandler;
	}

}
