package ozone.owf.grails

import org.codehaus.groovy.runtime.InvokerInvocationException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import org.springframework.web.servlet.ModelAndView

import org.apache.log4j.LogManager
import org.apache.log4j.Logger
import org.grails.web.errors.GrailsExceptionResolver


class OwfExceptionResolver extends GrailsExceptionResolver {
	
	static Logger log = LogManager.getLogger('StackTrace')
	@Override
	public ModelAndView resolveException(HttpServletRequest req,
			HttpServletResponse resp, Object obj, Exception e) 
	{
		if (e instanceof InvokerInvocationException) 
		{
			e = (Exception)getRootCause(e)
		}
		return super.resolveException(req, resp, obj, e)
	}

}
