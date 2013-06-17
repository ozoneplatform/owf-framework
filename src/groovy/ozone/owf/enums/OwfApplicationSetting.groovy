package ozone.owf.enums

import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting

public enum OwfApplicationSetting implements ApplicationSetting{

	CEF_LOGGING_STATUS("owf.enable.cef.logging"),
	CEF_OJBECT_ACCESS_LOGGING_STATUS("owf.enable.cef.object.access.logging"),
	CEF_SEARCH_AUDIT_REGEX("owf.cef.search.audit.regex")

	
	
	OwfApplicationSetting(String code) {
		this.code = code;
	}
	
	private final String code
	

	public String getCode() {
		return code
	}
	

}

