package ozone.owf.security

import javax.annotation.Nullable

import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken

import ozone.owf.grails.domain.Person
import ozone.security.authentication.OWFUserDetailsImpl


class AutoUserSessionProvider extends UserSessionProvider {

    String autoUserName

    private Authentication _authentication

    @Override
    @Nullable
    synchronized Authentication getAuthentication() {
        if (!_authentication) {
            _authentication = createAutoAuthentication()
        }

        _authentication
    }

    @Override
    synchronized void setAuthentication(Authentication authentication) {
        _authentication = authentication
    }

    void logInAs(Person user) {
        authentication = createAuthentication(user)
    }

    void logOut() {
        authentication = null
    }

    private Authentication createAutoAuthentication() {
        if (!autoUserName) {
            throw new IllegalStateException("Could not create authentication token: autoUserName not set")
        }

        def user = Person.findByUsername(autoUserName)
        if (!user) {
            throw new IllegalStateException("Could not create authentication token: user '${autoUserName}' does not exist")
        }

        createAuthentication(user)
    }

    private Authentication createAuthentication(Person user) {
        if (!user) {
            throw new NullPointerException("user must not be null")
        }

        def authorities = user.authorities?.collect { new SimpleGrantedAuthority(it.authority) }
        if (!authorities) {
            throw new IllegalStateException("Could not create authentication token: user '${user.username}' has no authorities")
        }

        def principal = new OWFUserDetailsImpl(user.username, null, authorities, [])
        principal.displayName = user.userRealName

        new PreAuthenticatedAuthenticationToken(principal, null, authorities)
    }

}
