package ozone.owf.security

import javax.annotation.Nullable

import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails


class UserSessionProvider {

    @Nullable
    Authentication getAuthentication() {
        SecurityContextHolder.context.authentication
    }

    void setAuthentication(Authentication authentication) {
        SecurityContextHolder.context.authentication = authentication
    }

    @Nullable
    UserDetails getPrincipal() {
        def principal = authentication?.principal

        (principal != null && principal instanceof UserDetails) ? principal : null
    }

    Collection<? extends GrantedAuthority> getAuthorities() {
        principal?.authorities ?: Collections.emptyList()
    }

    Set<String> getAuthorityNames() {
        authorities.collect { it.authority }.toSet()
    }

}
