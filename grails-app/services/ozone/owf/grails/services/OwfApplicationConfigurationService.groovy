package ozone.owf.grails.services

import org.ozoneplatform.appconfig.server.service.impl.ApplicationConfigurationServiceImpl
import org.springframework.transaction.annotation.Transactional
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*

class OwfApplicationConfigurationService  extends ApplicationConfigurationServiceImpl {
	
	
	@Override
	@Transactional(readOnly=false)
	void createRequired(){
		createRequiredCefAuditingConfigurations()
	}
	
	
	@Transactional(readOnly=false)
	public void createRequiredCefAuditingConfigurations(){
		
		def GROUP_NAME = CEF_AUDITING
		def SUB_GROUP_NAME = ""
		int subGroupCtr = 1
		
		createOrUpdateApplicationConfig(CEF_LOGGING_STATUS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
		createOrUpdateApplicationConfig(CEF_OJBECT_ACCESS_LOGGING_STATUS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
		createOrUpdateApplicationConfig(CEF_SEARCH_AUDIT_REGEX, GROUP_NAME,  "String", "(?i)(.*items.*|.*results.*|.*list.*)", subGroupCtr++, SUB_GROUP_NAME)
	}
	
}
