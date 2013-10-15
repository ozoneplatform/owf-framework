package ozone.security.authorization.model;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.springframework.security.core.GrantedAuthority;

/**
 * GrantedAuthorityImpl
 * 
 *  See GrantedAuthority for details.  
 */
public class GrantedAuthorityImpl implements GrantedAuthority {

    /**
	 * Version 1 of this class
	 */
	private static final long serialVersionUID = 1L;
	
	private String authority = null;

    public GrantedAuthorityImpl(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }

    public int compareTo(Object o) {
        if (o != null && o instanceof GrantedAuthority) {
            String rhsRole = ((GrantedAuthority) o).getAuthority();

            if (rhsRole == null) {
                return -1;
            }

            return rhsRole.compareTo(authority);
        }
        return -1;
    }

    public String toString () {
    	return new ReflectionToStringBuilder(this).toString();
    }
}
