package ozone.owf.grails.services

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.service.impl.ApplicationConfigurationServiceImpl
import org.springframework.transaction.annotation.Transactional
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*
import org.codehaus.groovy.grails.commons.ConfigurationHolder as confHolder
import ozone.owf.grails.jobs.DisableInactiveAccountsJob

class OwfApplicationConfigurationService  extends ApplicationConfigurationServiceImpl {

    def quartzScheduler

    @Override
    @Transactional(readOnly=false)
    public void saveApplicationConfiguration(ApplicationConfiguration item){
        super.saveApplicationConfiguration(item)
        // OP-727 Disabling inactive user accounts
        if (item.code == DISABLE_INACTIVE_ACCOUNTS.code) {
            handleDisableInactiveAccountsJobChange(item)
        }
	}
	
	@Override
	@Transactional(readOnly=false)
	void createRequired(){
		createRequiredCefAuditingConfigurations()
        createRequiredUserAccountConfigurations()
	}
	
	
	@Transactional(readOnly=false)
	public void createRequiredCefAuditingConfigurations(){
		
		def GROUP_NAME = AUDITING
		def SUB_GROUP_NAME = ""
		int subGroupCtr = 1
		
		createOrUpdateApplicationConfig(CEF_LOGGING_STATUS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
		createOrUpdateApplicationConfig(CEF_OJBECT_ACCESS_LOGGING_STATUS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
		createOrUpdateApplicationConfig(CEF_SEARCH_AUDIT_REGEX, GROUP_NAME,  "String", "(?i)(.*items.*|.*results.*|.*list.*)", subGroupCtr++, SUB_GROUP_NAME)
	}

    @Transactional(readOnly=false)
    public void createRequiredUserAccountConfigurations(){
        // OP-1103
        def GROUP_NAME = USER_ACCOUNT_SETTINGS
        def SUB_GROUP_NAME = "Session Control"
        int subGroupCtr = 1

        // TODO: Initial values hard-coded here - later update to use config when available
        // Configuration for the Enable session control switch
        createOrUpdateApplicationConfig(ENABLE_MAX_CONCURRENT_SESSIONS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)

        // Configuration for the Maximum sessions per user value
        createOrUpdateApplicationConfig(MAX_CONCURRENT_SESSIONS, GROUP_NAME,  "Number", "3", subGroupCtr++, SUB_GROUP_NAME)


        // OP-727
        SUB_GROUP_NAME = "Inactive Accounts"
        subGroupCtr = 1

        // TODO: Initial values hard-coded here - later update to use config when available
        // Configuration for the Disable Inactive Accounts switch
        createOrUpdateApplicationConfig(DISABLE_INACTIVE_ACCOUNTS, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)

        // Configuration for the Inactivity Threshold value in minutes
        createOrUpdateApplicationConfig(INACTIVITY_THRESHOLD, GROUP_NAME,  "Number", "90", subGroupCtr++, SUB_GROUP_NAME)

        // Turn on the job if the config is set to on
        handleDisableInactiveAccountsJobChange(this.getApplicationConfiguration(DISABLE_INACTIVE_ACCOUNTS))
    }

	private def handleDisableInactiveAccountsJobChange(ApplicationConfiguration configItem) {
        log.info "Doing disableInactiveAccountsJob change"
        def job = new DisableInactiveAccountsJob()

        // Schedule the disable job if turned on, otherwise cancel the job  
        if (configItem) {
            if (configItem.value.toBoolean()) {
                job.schedule(quartzScheduler)
        }
            else {
                job.cancel(quartzScheduler)
            }    
        }
		
   }
	
}
