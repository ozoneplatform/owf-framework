package org.ozoneplatform.auditing

import static ozone.owf.enums.OwfApplicationSetting.*
import grails.util.Environment

import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.auditing.filter.AuditingFilters
import org.ozoneplatform.auditing.format.cef.Extension
import org.springframework.web.context.request.RequestContextHolder

import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService

class OwfAuditingFilters extends AuditingFilters {

    GrailsApplication grailsApplication
    
	AccountService accountService

	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	def jbFilter
	
    public String getApplicationVersion() {
        return grailsApplication.metadata['app.version']
    }

    @Override
	public boolean doCefLogging() {
		ApplicationConfiguration doCefLogging = owfApplicationConfigurationService.getApplicationConfiguration(CEF_LOGGING_ENABLED)
		if(doCefLogging)
			return doCefLogging.value
		return false
	}

    @Override
    public String getUserName() {
        return accountService.getLoggedInUsername()
    }

    @Override
    public String getHostClassification() {
		try{
			if(!jbFilter)
				jbFilter = this.grailsApplication.getMainContext().getBean("JBlocksFilter")
			return jbFilter?.configMessage
		} catch (Exception ex){
			return Extension.UNKOWN_VALUE
		}
    }

	@Override
	public HttpServletRequest getRequest()
	{
		return RequestContextHolder?.getRequestAttributes()?.getRequest()
	}
}
