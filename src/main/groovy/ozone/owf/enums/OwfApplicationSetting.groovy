package ozone.owf.enums

import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting


public enum OwfApplicationSetting implements ApplicationSetting{

	CEF_LOGGING_ENABLED("owf.enable.cef.logging"),
	CEF_OBJECT_ACCESS_LOGGING_ENABLED("owf.enable.cef.object.access.logging"),
	CEF_LOG_LOCATION("owf.cef.log.location"),
	CEF_LOG_SWEEP_LOCATION("owf.cef.sweep.log.location"),
	CEF_LOG_SWEEP_ENABLED("owf.enable.cef.log.sweep"),
    SECURITY_LEVEL("owf.security.level"),
	
    // OP-727
    DISABLE_INACTIVE_ACCOUNTS("owf.disable.inactive.accounts"),
    INACTIVITY_THRESHOLD("owf.inactivity.threshold"),
    JOB_DISABLE_ACCOUNTS_INTERVAL("owf.job.disable.accounts.interval"),
    JOB_DISABLE_ACCOUNTS_START("owf.job.disable.accounts.start.time"),

    // OP-1103
    SESSION_CONTROL_ENABLED("owf.session.control.enabled"),
    SESSION_CONTROL_MAX_CONCURRENT("owf.session.control.max.concurrent"),

    CUSTOM_HEADER_URL("owf.custom.header.url"),
    CUSTOM_FOOTER_URL("owf.custom.footer.url"),
    CUSTOM_HEADER_HEIGHT("owf.custom.header.height"),
    CUSTOM_FOOTER_HEIGHT("owf.custom.footer.height"),
    CUSTOM_JS_IMPORTS("owf.custom.jss"),
    CUSTOM_CSS_IMPORTS("owf.custom.css"),

    //OP-2015
    CUSTOM_BACKGROUND_URL("owf.custom.background.url"),

    FREE_WARNING_CONTENT("free.warning.content")

	OwfApplicationSetting(String code) {
		this.code = code;
	}
	
	private final String code
	

	public String getCode() {
		return code
	}
	

}

