package org.ozoneplatform.auditing

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpSession
import javax.servlet.http.HttpSessionEvent

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.http.AbstractSessionEventListener
import org.springframework.beans.BeansException
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.support.WebApplicationContextUtils

import ozone.owf.grails.services.AccountService

class OwfSessionEventListener extends AbstractSessionEventListener{

	AccountService accountService
	
	GrailsApplication grailsApplication
	
	def jbFilter
	
	@Override
	public String getHostClassification() {
		if(jbFilter)
			return jbFilter?.configMessage
		else
			return Extension.UNKOWN_VALUE
	}

	@Override
	public String getApplicationVersion() {
		return grailsApplication.metadata['app.version']
	}

	@Override
	public HttpServletRequest getRequest() {
		return RequestContextHolder?.getRequestAttributes()?.getRequest()
	}

	@Override
	public String getUserName() {
		return accountService.getLoggedInUsername()
	}

	@Override
	public void setBeans(HttpSessionEvent event){
		if(!accountService)
			this.accountService = getBean(event.getSession(), 'accountService')
		
		if(!grailsApplication)
			this.grailsApplication = getBean(event.getSession(), 'grailsApplication')	
		
		try{
			if(!jbFilter)
				this.jbFilter = getBean(event.getSession(), 'JBlocksFilter')
		} catch (BeansException ex){
			this.jbFilter = null
		}

	}
	
	
	private def getBean(HttpSession session, def bean){
		WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext())
		return ctx.getBean(bean)
	}


}
