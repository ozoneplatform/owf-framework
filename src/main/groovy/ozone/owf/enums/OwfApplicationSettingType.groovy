package ozone.owf.enums

import org.ozoneplatform.appconfig.server.domain.model.ApplicationSettingType


public enum OwfApplicationSettingType implements ApplicationSettingType  {


	FEATURES("FEATURES"),
	BRANDING("BRANDING"),
	ADDITIONAL_CONFIGURATION("ADDITIONAL_CONFIGURATION"),
    THEMING("THEMING"),
	HIDDEN("HIDDEN"),
	AUDITING("AUDITING"),
    // OP-727, OP-1103  User account settings
    USER_ACCOUNT_SETTINGS("USER_ACCOUNT_SETTINGS"),
    NOTIFICATIONS("NOTIFICATIONS")

	OwfApplicationSettingType(String description) {
		this.description = description;
	}
	
	private final String description
	

	public String getDescription() {
		return description
	}

}

