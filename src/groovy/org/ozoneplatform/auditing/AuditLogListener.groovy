package org.ozoneplatform.auditing

import static ozone.owf.enums.OwfApplicationSetting.*

import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.auditing.hibernate.AbstractAuditLogListener
import org.springframework.web.context.request.RequestContextHolder

import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService

class AuditLogListener extends AbstractAuditLogListener {

    GrailsApplication grailsApplication
	
    AccountService accountService
	
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	@Override
    protected boolean doCefLogging() {
        owfApplicationConfigurationService.is(CEF_LOGGING_ENABLED)
    }
	
	protected boolean doCefObjectAccessLogging(){
        owfApplicationConfigurationService.is(CEF_OBJECT_ACCESS_LOGGING_ENABLED)
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
        owfApplicationConfigurationService.valueOf(SECURITY_LEVEL)
    }

    @Override
    protected String getDeviceVendor() {
        grailsApplication.config.cef.device.vendor
    }

    @Override
    protected String getDeviceProduct() {
        grailsApplication.config.cef.device.product
    }

    @Override
    protected String getDeviceVersion() {
        grailsApplication.config.cef.device.version
    }

    @Override
    protected int getCEFVersion() {
        grailsApplication.config.cef.version
    }

    @Override
    protected HttpServletRequest getRequest(){
        return RequestContextHolder?.getRequestAttributes()?.getRequest()
    }

	@Override
	protected boolean isAccessAuditable(String arg0) {
		return true
	}
}
