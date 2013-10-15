package org.ozoneplatform.auditing.http

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpSessionEvent
import javax.servlet.http.HttpSessionListener

import org.ozoneplatform.auditing.enums.EventTypes
import org.ozoneplatform.auditing.format.cef.CEF
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.format.cef.factory.CEFFactory
import org.ozoneplatform.auditing.format.cef.factory.ExtensionFactory
import org.slf4j.Logger
import org.slf4j.LoggerFactory

abstract class AbstractSessionEventListener implements HttpSessionListener{

	private static final Logger log = LoggerFactory.getLogger(AbstractSessionEventListener.class)
	
	public void sessionCreated(HttpSessionEvent event) {
		setBeans(event)
		CEF cef = CEFFactory.buildBaseCEF(EventTypes.LOGON.getDescription(), "A http session was created", 7)
		def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
		fields[Extension.EVENT_TYPE] = EventTypes.LOGON.getDescription()
		cef.extension = new Extension(fields)
		log.info cef.toString()
	}
	
	public void sessionDestroyed(HttpSessionEvent event) {
		setBeans(event)
		CEF cef = CEFFactory.buildBaseCEF(EventTypes.LOGOFF.getDescription(), "A http session was destroyed", 5)
		def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
		fields[Extension.EVENT_TYPE] = EventTypes.LOGOFF.getDescription()
		cef.extension = new Extension(fields)
		log.info cef.toString()
	}

	
	abstract void setBeans(HttpSessionEvent event)
	
	abstract String getApplicationVersion()
	
	abstract String getUserName()
	
	abstract String getHostClassification()

    abstract HttpServletRequest getRequest()
	
	
}
