package ozone.owf.enums

import org.ozoneplatform.appconfig.server.domain.model.ApplicationSettingType

public enum OwfApplicationSettingType implements ApplicationSettingType  {


	FEATURES("FEATURES"),
	BRANDING("BRANDING"),
	ADDITIONAL_CONFIGURATION("ADDITIONAL_CONFIGURATION"),
    THEMING("THEMING"),
	HIDDEN("HIDDEN"),
	CEF_AUDITING("CEF_AUDITING")
	
	OwfApplicationSettingType(String description) {
		this.description = description;
	}
	
	private final String description
	

	public String getDescription() {
		return description
	}

}

