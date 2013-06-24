package ozone.owf.enums

import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting

public enum OwfApplicationSetting implements ApplicationSetting{

	CEF_LOGGING_ENABLED("owf.enable.cef.logging"),
	CEF_OBJECT_ACCESS_LOGGING_ENABLED("owf.enable.cef.object.access.logging"),
	CEF_SEARCH_AUDIT_REGEX("owf.cef.search.audit.regex"),

    // OP-727
    DISABLE_INACTIVE_ACCOUNTS("owf.disable.inactive.accounts"),
    INACTIVITY_THRESHOLD("owf.inactivity.threshold"),

    // OP-1103
    SESSION_CONTROL_ENABLED("owf.session.control.enabled"),
    SESSION_CONTROL_MAX_CONCURRENT("owf.session.control.max.concurrent")


	OwfApplicationSetting(String code) {
		this.code = code;
	}
	
	private final String code
	

	public String getCode() {
		return code
	}
	

}

