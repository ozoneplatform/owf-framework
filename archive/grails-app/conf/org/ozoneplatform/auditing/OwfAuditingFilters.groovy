package org.ozoneplatform.auditing

import java.util.Map;

import org.springframework.beans.factory.NoSuchBeanDefinitionException

import static ozone.owf.enums.OwfApplicationSetting.*

import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.auditing.filter.AbstractAuditingFilters
import org.ozoneplatform.auditing.format.cef.Extension
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.security.core.context.SecurityContextHolder as SCH
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService

class OwfAuditingFilters extends AbstractAuditingFilters {

    GrailsApplication grailsApplication
    
	AccountService accountService

	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	//String hostCls
	
    public String getApplicationVersion() {
        return grailsApplication.metadata['app.version']
    }

    @Override
	public boolean doCefLogging() {
		try{
			ApplicationConfiguration doCefLogging = owfApplicationConfigurationService.getApplicationConfiguration(CEF_LOGGING_ENABLED)
			if(doCefLogging)
				return Boolean.valueOf(doCefLogging.value)
		} catch (Exception e){
			return true
		}
		return true
	}

    @Override
    public String getUserName() {
        return accountService.getLoggedInUsername()
    }


    @Override
    public String getHostClassification() {
		String hostCls
        try {
            ApplicationConfiguration securityLevel = owfApplicationConfigurationService.getApplicationConfiguration(SECURITY_LEVEL)
            hostCls = securityLevel?.value ?: Extension.UNKOWN_VALUE
        } catch(NoSuchBeanDefinitionException nbe) {
            hostCls = Extension.UNKOWN_VALUE
        }

        hostCls
    }

    @Override
    public String getDeviceVendor() {
    	grailsApplication.config.cef.device.vendor
    }

    @Override
    public String getDeviceProduct() {
    	grailsApplication.config.cef.device.product
    } 

	@Override
    public String getDeviceVersion() {
    	grailsApplication.config.cef.device.version
    }

    @Override
    public int getCEFVersion() {
    	grailsApplication.config.cef.version
    }

	public HttpServletRequest getRequest(){
		return RequestContextHolder?.getRequestAttributes()?.getRequest()
	}

	@Override
	public Map<String, String> getUserInfo(){

		def map = [:]
		def p = SCH?.context?.authentication?.principal

		if(p){
			map['USERNAME'] = p?.username  ?: Extension.UNKOWN_VALUE
			if (p?.metaClass.hasProperty(p, "displayName")) {
				map['NAME'] = p?.displayName ?: map['USERNAME']
			}
			else {
				map['NAME'] = map['USERNAME']
			}
			if (p?.metaClass.hasProperty(p, "organization")) {
				map['ORG'] 	= p?.organization     ?: Extension.UNKOWN_VALUE
			}
			if (p?.metaClass.hasProperty(p, "email")) {
				map['EMAIL']= p?.email     ?: Extension.UNKOWN_VALUE
			}			
		}
		map['ROLES']	= accountService.getLoggedInUserRoles().collect{it instanceof String ? it : it.authority}
		map
	}
}
