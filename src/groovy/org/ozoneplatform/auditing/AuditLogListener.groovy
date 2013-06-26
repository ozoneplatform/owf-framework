package org.ozoneplatform.auditing

import static ozone.owf.enums.OwfApplicationSetting.*

import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.hibernate.SessionFactory
import org.hibernate.event.PostLoadEvent
import org.hibernate.event.PostUpdateEvent
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.hibernate.AbstractAuditLogListener
import org.springframework.beans.BeansException
import org.springframework.web.context.request.RequestContextHolder

import ozone.owf.grails.services.AccountService
class AuditLogListener extends AbstractAuditLogListener {

    GrailsApplication grailsApplication
	
    AccountService accountService
	
	def jbFilter
	

	@Override
    public boolean doCefLogging() {
		getSettingFromRequest(CEF_LOGGING_ENABLED)
    }	
	
	@Override
	public boolean doCefObjectAccessLogging(){
		getSettingFromRequest(CEF_OBJECT_ACCESS_LOGGING_ENABLED.getCode())
	}
	
	private getSettingFromRequest(ApplicationSetting setting) {
		if(getRequest() == null)
			return false
		return this.getRequest().getAttribute(setting.getCode()) ?: false
	}

    @Override
    public String getApplicationVersion() {
        return grailsApplication.metadata['app.version']
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
		} catch (BeansException ex){
			return Extension.UNKOWN_VALUE
		}
    }

    @Override
    public HttpServletRequest getRequest(){
        return RequestContextHolder?.getRequestAttributes()?.getRequest()
    }
}
