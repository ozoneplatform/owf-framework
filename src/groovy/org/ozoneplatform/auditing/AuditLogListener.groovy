package org.ozoneplatform.auditing

import static ozone.owf.enums.OwfApplicationSetting.*

import grails.converters.JSON
import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.hibernate.AbstractAuditLogListener
import org.springframework.web.context.request.RequestContextHolder
import org.hibernate.event.PostLoadEvent;

import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService

class AuditLogListener extends AbstractAuditLogListener {

    GrailsApplication grailsApplication
	
    AccountService accountService
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	String hostCls

    //thread-local cache of looked up ApplicationConfigurations, to prevent recursive
    //lookups of CEF object access flags
    private ThreadLocal<HashMap<String, ApplicationConfiguration>> knownValues =
        new ThreadLocal<HashMap<String, ApplicationConfiguration>>()

    @Override
    protected void withKnownValue(PostLoadEvent event, Closure fn) {
        if (!knownValues.get()) {
            knownValues.set([:])
        }

        def valMap = knownValues.get(),
            entity = event.entity
        if (entity instanceof ApplicationConfiguration) {
            try {
                //put the loaded configuration in the map so that it can be used
                //in getApplicationConfiguration calls within fn
                valMap.put(entity.code, entity)
                fn()
            }
            finally {
                //clean up the configurations that were added to the map.  Finally block
                //ensures that this happens no matter what
                valMap.remove(entity.code)
            }
        }
        else {
            fn()
        }
    }

	@Override
    protected boolean doCefLogging() {
        getBooleanConfiguration(CEF_LOGGING_ENABLED)
    }
	
	protected boolean doCefObjectAccessLogging(){
        getBooleanConfiguration(CEF_OBJECT_ACCESS_LOGGING_ENABLED)
	}

    private boolean getBooleanConfiguration(ApplicationSetting setting) {
        def conf = getApplicationConfiguration(setting)

        conf == null ? false : conf.toBoolean()
    }

    private def getApplicationConfiguration(ApplicationSetting setting) {
        //first look for values that were discovered farther up the stack, then check the
        //database if it wasn't found
        def knownValue = knownValues.get()?.get(setting.code)?.value 

        knownValue != null ? knownValue : 
            owfApplicationConfigurationService.getApplicationConfiguration(setting)?.value
    }

    @Override
    protected String getApplicationVersion() {
        return grailsApplication.metadata['app.version']
    }

    @Override
    protected String getUserName() {
        return accountService.getLoggedInUsername()
    }

    @Override
    protected String getHostClassification() {
        getApplicationConfiguration(SECURITY_LEVEL)
    }

    @Override
    protected HttpServletRequest getRequest(){
        return RequestContextHolder?.getRequestAttributes()?.getRequest()
    }
}
