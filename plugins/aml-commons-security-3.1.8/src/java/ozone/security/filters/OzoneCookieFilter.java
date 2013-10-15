/**
 * A spring security filter that adds a cookie to the response
 * that is intended to last throughout the session.  This class
 * should be unsed in conjunction with the OzoneLogoutCookieHandler
 * class, which destroys the cookie on logout
 */
package ozone.security.filters;

import org.springframework.web.filter.GenericFilterBean;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.FilterChain;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import ozone.security.SecurityUtils;

public class OzoneCookieFilter extends GenericFilterBean {

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws ServletException, IOException {

        HttpServletRequest req = (HttpServletRequest)request;
        HttpServletResponse resp = (HttpServletResponse)response;

        /*if the user is authenticated, add the cookie that indicates
         * this.  Note that this cookie has minimal actual security impact.
         * It is simply checked client side to prevent the wierd user experience
         * where a user can view a cached copy of the app without having access
         * to actual data
         */
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Cookie owfCookie = new Cookie(SecurityUtils.LOGIN_COOKIE_NAME, "true");
            owfCookie.setPath(req.getContextPath());
            owfCookie.setMaxAge(-1);    //session cookie

            resp.addCookie(owfCookie);
        }

        chain.doFilter(req, resp);
    }
}
