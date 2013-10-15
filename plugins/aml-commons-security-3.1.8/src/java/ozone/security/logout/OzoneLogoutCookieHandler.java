/**
 * This logout filter deletes the OWF login cookies
 */
package ozone.security.logout;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.util.WebUtils;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import javax.servlet.http.Cookie;

import ozone.security.SecurityUtils;

public class OzoneLogoutCookieHandler implements LogoutHandler { 

    public void logout(HttpServletRequest request, HttpServletResponse response, 
            Authentication authentication) {

        expireCookie("JSESSIONID", request, response);
        expireCookie(SecurityUtils.LOGIN_COOKIE_NAME, request, response);
    }

    private void expireCookie(String name, HttpServletRequest request, 
        HttpServletResponse response) {

        Cookie cookie = WebUtils.getCookie(request, name);

        if (cookie != null) {
    		cookie.setPath(request.getContextPath());
    		cookie.setMaxAge(0);
    		response.addCookie(cookie);
    	}
    }
}
