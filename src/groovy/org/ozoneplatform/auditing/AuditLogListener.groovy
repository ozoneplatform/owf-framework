package org.ozoneplatform.auditing

import static ozone.owf.enums.OwfApplicationSetting.*

import grails.converters.JSON
import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationSetting
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.hibernate.AbstractAuditLogListener
import org.springframework.web.context.request.RequestContextHolder

import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService

class AuditLogListener extends AbstractAuditLogListener {

    GrailsApplication grailsApplication
	
    AccountService accountService
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	String hostCls
	

	@Override
    public boolean doCefLogging() {
		owfApplicationConfigurationService.is(CEF_LOGGING_ENABLED)
    }	
	
	@Override
	public boolean doCefObjectAccessLogging(){
		owfApplicationConfigurationService.is(CEF_OBJECT_ACCESS_LOGGING_ENABLED)
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
		if(!hostCls){
			def host = 'http://localhost:8080/jblocks-banner/config/getConfigs'
			try{
				hostCls = JSON.parse(new URL(host)?.text)?.hostCls ?: Extension.UNKOWN_VALUE
			} catch (IOException ioe){
				hostCls = Extension.UNKOWN_VALUE
			}			
		}		
		hostCls
    }

    @Override
    public HttpServletRequest getRequest(){
        return RequestContextHolder?.getRequestAttributes()?.getRequest()
    }
}
