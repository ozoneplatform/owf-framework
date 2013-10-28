package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.OwfException
import grails.web.JSONBuilder
import grails.validation.ValidationException
import java.lang.reflect.UndeclaredThrowableException

class BaseOwfRestController {
	
    def serviceModelService

    protected getJsonResult(result, targetProperty, params) {
        def gotFromTargetProperty = result.get(targetProperty)
        if (params.isExtAjaxFormat != null && params.isExtAjaxFormat == 'true') {
            return [success:result.success, data: ( (gotFromTargetProperty) ? serviceModelService.createServiceModel(gotFromTargetProperty) : result)] as JSON
        }
        else {
            return (gotFromTargetProperty) ? serviceModelService.createServiceModel(gotFromTargetProperty) as JSON : result as JSON
        }
    }

    protected def handleError(grails.validation.ValidationException ve)
    {
        return [msg: getFieldErrorsAsJSON(ve.errors), status: 500]
    }
    protected def handleError(UndeclaredThrowableException e)
    {
        return handleError(e.cause)
    }
    protected def handleError(Exception e)
    {
        log.error(e,e)
		def message = [:]
		message['success'] = false
		message['errorMsg'] = e.message
        return [msg: message as JSON, status: 500]
    }
    protected def handleError(OwfException owe) {
        if ('INFO' == owe.logLevel) {
            log.info(owe)
        }
        else if ('DEBUG' == owe.logLevel) {
            log.debug(owe)
        }
        else {
            log.error(owe,owe)
        }
        
        owe.setMessage(owe.message?.encodeAsHTML());
        
        def message = [:]
		message['success'] = false
		message['errorMsg'] =  "${owe.exceptionType.generalMessage} ${owe.message}"
        return [msg:message as JSON , status: owe.exceptionType.normalReturnCode]
    }

    protected renderResult(Map res)
    {
        response.status = res.status
        if (isWindowname())
        {
            render(view: '/show-windowname', model: [value: res.msg, status: res.status])
        } else {
            render res.msg
        }
    }
    protected renderResult(Object result, int statusCode) {
        response.status = statusCode

        if (result instanceof GString || result instanceof String) {
            result = '"' + result.replaceAll(/"/, /\\"/) + '"'
        }

        if (isWindowname()) {
            render(view: '/show-windowname', model: [value: result, status:statusCode])
        } else {
            render result
        }
    }
	
    // test if the window name transport is being used
    protected isWindowname() {
        return (params['windowname'] == 'true')
    }
    protected def getFieldErrorsAsJSON(errs)
    {
        if (!errs) return ''
        def sw = new StringWriter()
 
        def jb = new JSONBuilder()
        jb.build {
            success(false)
            errorMsg('Field  Validation error!')
            errors {
                errs.each{ error ->
                    def fe = error.getFieldError()
                    def arguments = Arrays.asList(fe.getArguments());
                    errors(id: fe.getField(), msg:  message(code: fe.getCode(), args:  arguments, 'default': fe.getDefaultMessage()))
                }
            }
        }
        jb.toString() 
    }
}
