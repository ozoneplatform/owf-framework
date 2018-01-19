package ozone.owf.filter

import javax.servlet.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletResponseWrapper

import org.springframework.security.core.context.SecurityContextHolder as SCH

import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.util.OWFDate


public class HttpRequestLoggingFilter implements Filter {

    def dateTimeGenerator = new HttpRequestLoggingFilterDateTimeGenerator()
    def loggingService = new AuditOWFWebRequestsLogger()

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws ServletException {
    	
        checkHttpServletRequest(servletRequest)
        checkHttpServletResponse(servletResponse)

        def wrappedServletResponse = new StatusCodeHttpServletResponse(servletResponse)
        
        try {
            filterChain.doFilter(servletRequest, wrappedServletResponse)
        } finally {
            // Log exception cases too, because any redirects come through here as
            // thrown ServletExceptions; if you don't log here, you won't see them
            logRequestResponse(servletRequest, wrappedServletResponse)
        }
    }

    public void init(FilterConfig filterConfig) {
        // No op.
    }

    public void destroy() {
        // No op.
    }

    private def logRequestResponse(ServletRequest servletRequest, StatusCodeHttpServletResponse wrappedServletResponse) {
        final def remoteAddr = servletRequest.remoteAddr
        final def userId = SCH?.context?.authentication?.principal?.username ?: "-"
        final def requestTime = OWFDate.format(dateTimeGenerator.now())
        final def sessionId = servletRequest.getSession(false) ? servletRequest.getSession(false).getId() : 'Unknown'
        final def method = servletRequest.method
        final def path = servletRequest.requestURI
        final def parameters = servletRequest.parameterMap ? "?${formEncode(servletRequest.parameterMap)}" : ""
        final def protocol = servletRequest.protocol
        final def statusCode = wrappedServletResponse.statusCode ?: HttpServletResponse.SC_OK
        final def referer = servletRequest.getHeader("referer") ?: "-"
        final def userAgent = servletRequest.getHeader("user-agent")
        
        loggingService.log("${remoteAddr} - ${userId} (${sessionId}) [${requestTime}] \"${method} ${path}${parameters} ${protocol}\" ${statusCode} - \"${referer}\" \"${userAgent}\"")
    }

    private def checkHttpServletRequest(servletRequest) throws ServletException {
        if (!(servletRequest instanceof HttpServletRequest)) {
            throw new ServletException("servlet request must be an HttpServletRequest")
        }
    }

    private def checkHttpServletResponse(servletResponse) throws ServletException {
        if (!(servletResponse instanceof HttpServletResponse)) {
            throw new ServletException("servlet response must be an HttpServletResponse")
        }
    }

    private def formEncode(parameters) {
        parameters.collect {parameter, values ->
            values.collect {value ->
                "${parameter}=${value}"
            }.join("&")
        }.join("&")
    }
}


class StatusCodeHttpServletResponse extends HttpServletResponseWrapper {

    def statusCode

    StatusCodeHttpServletResponse(HttpServletResponse response) {
        super(response)
    }

    void setStatus(int sc) {
        super.setStatus(sc)

        statusCode = sc
    }

    void setStatus(int sc, String msg) {
        super.setStatus(sc, msg)

        statusCode = sc
    }

    void sendError(int sc) throws IOException {
        super.sendError(sc)

        statusCode = sc
    }

    void sendError(int sc, String msg) throws IOException {
        super.sendError(sc, msg)

        statusCode = sc
    }
}


class HttpRequestLoggingFilterDateTimeGenerator {
    Date now() { new Date() }
}
