package org.ozoneplatform.auditing.filter


import java.text.DateFormat
import java.text.SimpleDateFormat
import javax.servlet.http.HttpServletRequest

import org.apache.log4j.Logger
import org.ozoneplatform.auditing.format.cef.CEF
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.format.cef.factory.CEFFactory
import org.ozoneplatform.auditing.format.cef.factory.ExtensionFactory
import org.ozoneplatform.auditing.enums.*
import org.ozoneplatform.auditing.util.AuditingUtil

import javax.servlet.http.HttpSession

abstract class AbstractAuditingFilters {

	private static final Logger log = Logger.getLogger(AbstractAuditingFilters)
	
	def filters = {

		checkLogOn(controller: '*', action: '*') {
			after = {
				if(isLogOnEvent(session)){
					logLogOnEvent(request)
				}
			}
		}
		checkLogOffAction(action: 'onBeforeLogout') {
			before = {
				logLogOffEvent(request)
			}
		}
		checkLogOfUrl(uri: '/logout/**'){
			before = {
				logLogOffEvent(request)
			}
		}
		checkSearchAction(action: 'list*|search*|filter*|find*') {
			after = {model ->
				logSearchEvent(request, model)
			}
		}
		checkImportExportAction(controller: '*', action: 'import*|export*') {
			after = {
				if("$actionName" =~ /(?i)(.*import.*)/){
					logImportEvent(request)
				}else if("$actionName" =~ /(?i)(.*export.*)/){
					logExportEvent(request, response)
				}
			}
		}

        checkRestSearch(uri:'/public/search/**') {
            before = {model ->
                logSearchEvent(request, model)
            }
        }

        checkOpenSearch(uri:'/public/openSearch/**') {
            before = {model ->
                logSearchEvent(request, model)
            }
        }
	}

	protected void logLogOnEvent(HttpServletRequest request){		
		
		if(doCefLogging()){
			CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.LOGON.getDescription(), "A logon event occured.", 7)
			def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
			fields[Extension.EVENT_TYPE] = EventTypes.LOGON.getDescription()
			StringBuffer logonDetails = new StringBuffer()
			this.getUserInfo().each{
				logonDetails.append(it.key).append(":").append(it.value).append(";")
			}
			logonDetails.append("URL:" +   request.getRequestURI())
			fields[Extension.SYSTEM_NOTIFICATIONS] = logonDetails.toString()
			cef.extension = new Extension(fields)
			log.info cef.toString()
		}
		
	}
	
	protected void logLogOffEvent(HttpServletRequest request){		
		
		if(doCefLogging()){
			CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.LOGOFF.getDescription(), "A logoff event occured.", 5)
			def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
			fields[Extension.EVENT_TYPE] = EventTypes.LOGOFF.getDescription()
			cef.extension = new Extension(fields)
			log.info cef.toString()
		}
		
	}
	
	protected void logSearchEvent(HttpServletRequest request, def model){
		
		if(doCefLogging()){						
			CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.OBJ_SEARCH.getDescription(), "A search action was performed.", 5)
			def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(), getHostClassification())
			
			fields[Extension.EVENT_TYPE] = EventTypes.OBJ_SEARCH.getDescription()
			
			def modelName = /(?i)(.*items.*|.*results.*|.*list.*)/
			def results = model.find { k, v -> k ==~  modelName && v instanceof List }
	
			fields[Extension.PAYLOAD]				= results ? results?.key : request.getRequestURI()
			fields[Extension.PAYLOAD_CLS]			= getHostClassification()
			fields[Extension.PAYLOAD_ID]			= results ? results?.key : request.getRequestURI()
			fields[Extension.PAYLOAD_SIZE]			= results ? results?.value?.size().toString() : Extension.UNKOWN_VALUE
			fields[Extension.PAYLOAD_TYPE]			= PayloadType.OBJECT.getDescription()
			fields[Extension.SEARCH_MATCHES]		= Extension.listToString(results?.value)
			fields[Extension.NUMBER_OF_MATCHES] 	= results?.value ? results?.value?.size() : Extension.UNKOWN_NUMBER_VALUE
			fields[Extension.SEARCH_TEXT] 			= request?.getParameterMap()?.size() > 0 ? request?.getParameterMap()?.toMapString() : request.getAttribute("javax.servlet.forward.request_uri")
			fields[Extension.SEARCH_STYLE] 			= "USER_DRIVEN"
			fields[Extension.IS_SPANNING] 			= "FALSE"
	
			cef.extension = new Extension(fields)
			log.info cef.toString()			
		}
			
	}
	
	
	//Log Import event
	protected void logImportEvent(def request){			
		
		if(doCefLogging()){
			
		  // The import may be an entire file submitted via multipart message
		  // Log that differently than if the import data is just a POST parameter
		  if (request.getContentType()?.toLowerCase()?.startsWith("multipart/form-data"))
		  {
			request.getFileNames().each{
				CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.IMPORT.getDescription(), "A file was imported.", 7)
				def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
				fields[Extension.EVENT_TYPE] = EventTypes.IMPORT.getDescription()
				
				def file = request.getFile(it)
				
				fields[Extension.PAYLOAD]				= file.getName()
				fields[Extension.PAYLOAD_CLS]			= getHostClassification()
				fields[Extension.PAYLOAD_ID]			= file.getOriginalFilename()
				fields[Extension.PAYLOAD_SIZE]			= file.getBytes().length
				fields[Extension.PAYLOAD_TYPE]			= PayloadType.FILE.getDescription()
				fields[Extension.MEDIA_TYPE]			= Extension.UNKOWN_VALUE
				
				cef.extension = new Extension(fields)
				log.info cef.toString()
			}
		  }
		  else
		  {
			  // We assume the import data is passed in a parameter named "json"
			  CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.IMPORT.getDescription(), "A JSON object was imported.", 7)
			  def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
			  fields[Extension.EVENT_TYPE] = EventTypes.IMPORT.getDescription()
  
			  fields[Extension.PAYLOAD]				= request.getRequestURI()
			  fields[Extension.PAYLOAD_CLS]			= getHostClassification()
			  fields[Extension.PAYLOAD_ID]			= request.getRequestURI()
			  fields[Extension.PAYLOAD_SIZE]			= request.getParameter("json")?.size().toString()
			  fields[Extension.PAYLOAD_TYPE]			= PayloadType.OBJECT.getDescription()
			  fields[Extension.MEDIA_TYPE]			= Extension.UNKOWN_VALUE
  
			  cef.extension = new Extension(fields)
			  log.info cef.toString()
		  }
		}
		
	}
	
	//Log Export event
	protected void logExportEvent(def request, def response){	
		
		if(doCefLogging()){
			CEF cef = CEFFactory.buildBaseCEF(getCEFVersion(), getDeviceVendor(), getDeviceProduct(), getDeviceVersion(), EventTypes.EXPORT.getDescription(), "A file was exported.", 7)
			def fields = ExtensionFactory.getBaseExtensionFields(request, getUserName(), getApplicationVersion(),getHostClassification())
			fields[Extension.EVENT_TYPE] = EventTypes.EXPORT.getDescription()
			
			fields[Extension.PAYLOAD]				= request.getAttribute("fileName")
			fields[Extension.PAYLOAD_CLS]			= getHostClassification()
			fields[Extension.PAYLOAD_ID]			= request.getAttribute("fileName")
			fields[Extension.PAYLOAD_SIZE]			= request.getAttribute("fileSize")
			fields[Extension.PAYLOAD_TYPE]			= PayloadType.FILE.getDescription()
			fields[Extension.MEDIA_TYPE]			= Extension.UNKOWN_VALUE
			
			cef.extension = new Extension(fields)
			log.info cef.toString()
		}		
			
	}
	
	@Override
	protected boolean isLogOnEvent(HttpSession session) {
		try{
			if (session.loginWasAudited) {
				return false
			}
			session.loginWasAudited = true
		} catch (Exception e){
			return false
		}
		return true
	}
	
	abstract boolean doCefLogging()
	
	abstract String getApplicationVersion()
	
	abstract String getUserName()
	
	//This is form other information regarding the  user like roles, email, org, etc
	abstract def getUserInfo()
	
	abstract String getHostClassification()

	abstract String getDeviceVendor()

	abstract String getDeviceProduct()

	abstract String getDeviceVersion()

	abstract int getCEFVersion()
}
