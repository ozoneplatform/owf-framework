package ozone.securitysample.mock;

import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@SuppressWarnings("serial")
public class MockAuthentication implements Authentication {

	private UserDetails userDetails;
	private boolean authentication = true;

	public MockAuthentication(UserDetails userDetails) {
		this.userDetails = userDetails;
	}

	public MockAuthentication(UserDetails userDetails, boolean authentication) {
		this.userDetails = userDetails;
		this.authentication = authentication;
	}

	public Collection<GrantedAuthority> getAuthorities() {
		return userDetails.getAuthorities();
	}

	public Object getCredentials() {
		return null;
	}

	public Object getDetails() {
		return null;
	}

	public Object getPrincipal() {
		return this.userDetails;
	}

	public boolean isAuthenticated() {
		return authentication;
	}

	public void setAuthenticated(boolean arg0) throws IllegalArgumentException {
		this.authentication = arg0;
	}

	public String getName() {
		return null;
	}
}