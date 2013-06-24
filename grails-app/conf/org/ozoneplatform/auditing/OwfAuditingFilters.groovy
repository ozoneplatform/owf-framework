package org.ozoneplatform.auditing

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.auditing.filter.AuditingFilters

import static ozone.owf.enums.OwfApplicationSetting.*
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService;
import org.springframework.web.context.request.RequestContextHolder
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession

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
		if(getRequest() == null)
			return false
		if(this.getRequest().getAttribute(CEF_LOGGING_STATUS.getCode())== null){
			this.getRequest().setAttribute(CEF_LOGGING_STATUS.getCode(), owfApplicationConfigurationService.is(CEF_LOGGING_STATUS))
		}
		return this.getRequest().getAttribute(CEF_LOGGING_STATUS.getCode())
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
			return "UNKNOWN"
		}
    }

	@Override
	public HttpServletRequest getRequest()
	{
		return RequestContextHolder?.getRequestAttributes()?.getRequest()
	}
}
