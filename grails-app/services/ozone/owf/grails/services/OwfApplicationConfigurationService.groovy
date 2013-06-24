package ozone.owf.grails.services

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.service.impl.ApplicationConfigurationServiceImpl
import org.springframework.transaction.annotation.Transactional
import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*
import ozone.owf.grails.jobs.DisableInactiveAccountsJob
import org.codehaus.groovy.grails.commons.ConfigurationHolder as confHolder
import grails.util.GrailsUtil

class OwfApplicationConfigurationService  extends ApplicationConfigurationServiceImpl {

    def quartzScheduler
	
    //the spring security bean that is responsible for handling the max number of session.
    def concurrentSessionControlStrategy

    @Override
    @Transactional(readOnly=false)
    public void saveApplicationConfiguration(ApplicationConfiguration item){
        super.saveApplicationConfiguration(item)
        // OP-727 Disabling inactive user accounts
        if (item.code == DISABLE_INACTIVE_ACCOUNTS.code) {
            handleDisableInactiveAccountsJobChange(item)
        }

        handleSessionControlChange(item)
	}

    // Implements validations specific to OWF
    public void validateApplicationConfiguration(def applicationConfiguration){
        if(!applicationConfiguration)
            return

        if(applicationConfiguration.type == "Integer"){
            def val = applicationConfiguration.value
            if(!val.isInteger() || Integer.valueOf(val) <= 0){
                applicationConfiguration.errors.rejectValue('value', "application.configuration.invalid.integer.gt.zero")
                return
            }
        }

        if(applicationConfiguration.type == "Decimal"){
            def val = applicationConfiguration.value
            if(!val.isNumber() || Double.valueOf(val) <= 0){
                applicationConfiguration.errors.rejectValue('value', "application.configuration.invalid.number.gt.zero")
                return
            }               
        }

        super.validate(applicationConfiguration)
    }
	
    /**
     * helper method for handleSessionControlChange. Ths is the method that actuall updates the
     * property in spring security
     * @param maxSessions The value to be set as the maximumSessions on the spring 
     * ConcurrentSessionControlStrategy
     */
    private updateMaxSessions(int maxSessions) {
        log.debug "Updating max sessions per user to ${maxSessions}"
        log.debug "Session Control Strategy Bean: ${concurrentSessionControlStrategy}"

        if (concurrentSessionControlStrategy) {
            concurrentSessionControlStrategy.maximumSessions = maxSessions
        }
        else {
            throw new IllegalStateException("Attempted to update session control " + 
                "configuration when session control bean is not present")
        }
    }

    /**
     * @return the currently-stored value of the SESSION_CONTROL_ENABLED configuration
     */
    private boolean getSessionControlEnabled() {
        getApplicationConfiguration(SESSION_CONTROL_ENABLED).value.toBoolean()
    }

    /**
     * @return the currently-stored value of the SESSION_CONTROL_MAX_CONCURRENT configuration
     */
    private int getSessionControlMax() {
        getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT).value.toInteger()
    }

    /**
     * Updates the spring security ConcurrentSessionControlStrategy to accept the configured
     * number of concurrent sessions per user.
     * @param item The configuration that was just changed.  If null, this method ensures
     * that the ConcurrentSessionControlStrategy is updated with the current configurations
     * from the database.  If not a SESSION_CONTROL configuration, this method does nothing
     */
    private handleSessionControlChange(ApplicationConfiguration item) {
        final DISABLED_SETTING = -1 //this value tells spring not to limit sessions

        try {
            //if nothing is passed in, just update spring from the database
            if (!item) {
                updateMaxSessions(getSessionControlEnabled() ? getSessionControlMax() : 
                    DISABLED_SETTING) 
            }
            //check to see if item is a session control configuration and handle appropriately
            else if (item.code == SESSION_CONTROL_ENABLED.code) {
                updateMaxSessions(item.value.toBoolean() ? getSessionControlMax() : 
                    DISABLED_SETTING)
            }
            else if (item.code == SESSION_CONTROL_MAX_CONCURRENT.code) {
                if (getSessionControlEnabled()) {
                    updateMaxSessions(item.value.toInteger())
                }
            }
            //default - some other type of configuration, do nothing
        }
        catch (NumberFormatException e) {
            log.error "Invalid Session Control configuration: ${e.message}"
        }
    }

	@Override
	@Transactional(readOnly=false)
	void createRequired(){
		createRequiredCefAuditingConfigurations()
        createRequiredUserAccountConfigurations()
	}


	@Transactional(readOnly=false)
	private void createRequiredCefAuditingConfigurations(){

		def GROUP_NAME = AUDITING
		def SUB_GROUP_NAME = ""
		int subGroupCtr = 1

		createOrUpdateApplicationConfig(CEF_LOGGING_ENABLED, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
		createOrUpdateApplicationConfig(CEF_OBJECT_ACCESS_LOGGING_ENABLED, GROUP_NAME,  "Boolean", "true", subGroupCtr++, SUB_GROUP_NAME)
	}

    @Transactional(readOnly=false)
    private void createRequiredUserAccountConfigurations(){
        createRequiredSessionConfigurations() 
        createRequiredInactiveAccountConfigurations() 
    }

    private void createRequiredSessionConfigurations() {
        // OP-1103
        def GROUP_NAME = USER_ACCOUNT_SETTINGS
        def SUB_GROUP_NAME = "Session Control"
        int subGroupCtr = 1

        // TODO: Initial values hard-coded here - later update to use config when available
        // Configuration for the Enable session control switch
        createOrUpdateApplicationConfig(SESSION_CONTROL_ENABLED, GROUP_NAME,  "Boolean", 
            "true", subGroupCtr++, SUB_GROUP_NAME)

        // Configuration for the Maximum sessions per user value
        createOrUpdateApplicationConfig(SESSION_CONTROL_MAX_CONCURRENT, GROUP_NAME,  "Integer", "1", 
            subGroupCtr++, SUB_GROUP_NAME)

        try {
            //update spring security
            handleSessionControlChange()
        }
        catch (IllegalStateException e) {
            if (GrailsUtil.environment == 'production') {
                log.error "Unable to initialize session management: ${e.message}"
            }
            //this is expected in dev mode, since spring security is not set up
        }
    }

    private void createRequiredInactiveAccountConfigurations() {
        // OP-727
        def GROUP_NAME = USER_ACCOUNT_SETTINGS
        def SUB_GROUP_NAME = "Inactive Accounts"
        def subGroupCtr = 1

        // TODO: Initial values hard-coded here - later update to use config when available
        // Configuration for the Disable Inactive Accounts switch
        createOrUpdateApplicationConfig(DISABLE_INACTIVE_ACCOUNTS, GROUP_NAME,  "Boolean", "true",
            subGroupCtr++, SUB_GROUP_NAME)

        // Configuration for the Inactivity Threshold value in minutes
        createOrUpdateApplicationConfig(INACTIVITY_THRESHOLD, GROUP_NAME,  "Integer", "90", 
            subGroupCtr++, SUB_GROUP_NAME)

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
