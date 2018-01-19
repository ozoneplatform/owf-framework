package ozone.owf.filter

import spock.lang.Ignore
import spock.lang.Specification

import javax.servlet.FilterChain
import javax.servlet.FilterConfig
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpSession
import java.text.SimpleDateFormat

// TODO: Is this still needed, or just needs to be fixed? All test methods are renamed and skipped.

@Ignore
class HttpRequestLoggingFilterSpec extends Specification {

	// TODO: Mike, fix me!
    HttpRequestLoggingFilter filter

    def mockLoggingService

    /*
    Set up
     */

    void setup() {
        mockLoggingService = newMockLoggingService()

        filter = new HttpRequestLoggingFilter()
        filter.loggingService = mockLoggingService
    }

    /*
    Test Helpers
     */
    /**
     * Creates a new mock logging service whose log() message stores whatever value it's called with in the
     * <tt>logMessage</tt> field of the returned object.
     */
    private def newMockLoggingService() {
        def loggingService = [:]
        loggingService.log = {message ->
            loggingService.logMessage = message
        }

        loggingService
    }

    /**
     * Creates a new <tt>FilterConfig</tt> from a map of parameters.
     */
    private def filterConfig(attributes) {
        [
                filterName: { null },
                servletContext: { null },
                getInitParameter: {attr -> attributes[attr] },
                initParameterNames: { Collections.enumeration(attributes.keySet()) }
        ] as FilterConfig
    }

    /**
     * Creates a new <tt>HttpServletRequest</tt> from a map of parameters.
     */
    private def servletRequest(params) {
        [
                getHeader: {
                    switch (it?.toLowerCase()) {
                        case "referer": return params.referer
                        case "user-agent": return params.userAgent
                    }
                },
                getMethod: {-> params.method },
                getParameterMap: {-> params.parameterMap },
                getProtocol: {-> params.protocol },
                getRemoteAddr: {-> params.remoteAddr },
                getRequestURI: {-> params.requestUri },
                getSession: {-> [id: params.sessionId] }
        ] as HttpServletRequest
    }

    /**
     * Creates a new <tt>HttpSession</tt> from a map of parameters.
     */
    private def httpSession(attributes) {
        [
                getAttribute: {attr -> attributes[attr] }
        ] as HttpSession
    }

    /**
     * Creates a new <tt>HttpServletResponse</tt> from a map of parameters.
     */
    private def servletResponse() {
        [
                setStatus: { }
        ] as HttpServletResponse
    }

    /**
     * Creates a new <tt>FilterChain</tt> from a map of parameters.
     */
    private def filterChain(params = null) {
        [
                doFilter: {req, resp ->
                    if (params?.status) resp.setStatus(params.status)
                }
        ] as FilterChain
    }

    /**
     * Creates a new <tt>FilterChain</tt> that throws an exception when you call doFilter.
     */
    private def exceptionFilterChain() {
        [
                doFilter: {req, resp ->
                    throw new IOException("Redirects throw IOExceptions out of the filter, not ServletExceptions")
                }
        ] as FilterChain
    }

    /**
     * Returns an ISO-formatted string for the given date/time.
     */
    private def formatDate(date) {
        def format = new SimpleDateFormat("[yyyy-MM-dd HH:mm:ss 'Z']");
        format.setTimeZone(TimeZone.getTimeZone("UTC"))
        format.format(date)
    }

    /**
     * Turns a map of strings to array of strings into form-encoded format. e.g. field=value1&field=value2&flag=true
     */
    private def formEncode(parameters) {
        parameters.collect {parameter, values ->
            values.collect {value ->
                "${parameter}=${value}"
            }.join("&")
        }.join("&")
    }

    /*
    Custom Asserts
     */

    private def assertLogMessageContains(object) {
        assertTrue "expected log message to contain <${object}>, but was <${mockLoggingService.logMessage}> instead",
                mockLoggingService.logMessage.contains(object.toString())
    }

    private def assertDoFilterLogsRequest(requestParams) {
        filter.init(filterConfig(sessionUsernameAttribute: "username"))

        requestParams.each {param, value ->
            // run
            filter.doFilter(servletRequest((param): value), servletResponse(), filterChain((param): value))

            // verify
            assertLogMessageContains value
        }
    }

    /*
    init()
     */

    void _testInitSlurpsSessionUsernameAttributeFromFilterConfig() {
        // setup
        def username = "the-variable-that-you-look-up-in-the-session-to-get-the-user-name"
        def filterConfig = filterConfig(sessionUsernameAttribute: username)

        // run
        filter.init(filterConfig)

        // verify
        assertEquals username, filter.sessionUsernameAttribute
    }

    /*
    doFilter()
     */

    void _testDoFilterThrowsExceptionIfNotHttpServletRequest() {
        // test
        shouldFail(ServletException) {
            filter.doFilter([:] as ServletRequest, servletResponse(), filterChain())
        }
    }

    void _testDoFilterCallsChainDoFilter() {
        // verify
        def doFilterStub = StubClosure.stub { req, resp -> }
        def chain = [doFilter: doFilterStub] as FilterChain

        // run
        filter.doFilter(servletRequest([:]), servletResponse(), chain)

        // verify
        StubClosure.assertMethodCalled doFilterStub, StubClosure.once()
    }

    void _testDoFilterPassesRequestResponseToChain() {
        // setup
        def request = servletRequest([:])
        def response = servletResponse()

        def chain = [
                doFilter: {req, resp ->
                    assertEquals request, req
                    // don't check the response object because it's wrapped in a StatusCodeHttpServletResponse
                }
        ] as FilterChain

        // run
        filter.doFilter(request, response, chain)
    }

    void _testDoFilterCallsLoggingServiceOnSuccessfulFilterChainInvocation() {
        // setup
        mockLoggingService.log = StubClosure.stub { }

        // run
        filter.doFilter(servletRequest([:]), servletResponse(), filterChain())

        // verify
        StubClosure.assertMethodCalled mockLoggingService.log, StubClosure.once()
    }

    void _testDoFilterCallsLoggingServiceOnExceptionFilterChainInvocation() {
        // setup
        mockLoggingService.log = StubClosure.stub { }

        // run
        shouldFail IOException, {
            filter.doFilter(servletRequest([:]), servletResponse(), exceptionFilterChain())
        }

        // verify
        StubClosure.assertMethodCalled mockLoggingService.log, StubClosure.once()
    }

    void _testDoFilterLogsIp() {
        assertDoFilterLogsRequest remoteAddr: "my-ip"
    }

    void _testDoFilterLogsSessionUsername() {
        assertDoFilterLogsRequest username: "bob-the-builder"
    }

    void _testDoFilterLogsRequestTime() {
        // the key "requestTime" isn't actually used in the test harness. it just makes it so the assert will loop correctly
        def date = new Date()
        filter.dateTimeGenerator = new Expando(now: { date })
        assertDoFilterLogsRequest requestTime: formatDate(date)
    }

    void _testDoFilterLogsMethod() {
        assertDoFilterLogsRequest method: "POST"
    }

    void _testDoFilterLogsRequestUri() {
        assertDoFilterLogsRequest requestUri: "/my-servlet/some/thing/i/want"
    }

    void _testDoFilterLogsSimpleParameters() {
        // setup
        def parameterMap = [field: ["blah"] as String[], flag: ["true"] as String[]]

        // run
        filter.doFilter(servletRequest(parameterMap: parameterMap), servletResponse(), filterChain())

        // verify
        assertLogMessageContains formEncode(parameterMap)
    }

    void _testDoFilterLogsComplexParameters() {
        // setup
        def parameterMap = [field1: ["value1", "value2", "value3"] as String[], field2: ["thing1", "thing2", "thing3"] as String[]]

        // run
        filter.doFilter(servletRequest(parameterMap: parameterMap), servletResponse(), filterChain())

        // verify
        assertLogMessageContains formEncode(parameterMap)
    }

    void _testDoFilterLogsProtocol() {
        assertDoFilterLogsRequest protocol: "HTTP/7.1"
    }

    void _testDoFilterLogsStatus() {
        assertDoFilterLogsRequest status: 503
    }

    void _testDoFilterLogsStatus200IfSetStatusOrSetErrorIsNeverCalled() {
        // the key "defaultStatus" isn't actually used in the test harness. it just makes it so the assert will loop correctly
        // spaces around "200" make it so it doesn't match "2009"
        assertDoFilterLogsRequest defaultStatus: " 200"
    }

    void _testDoFilterLogsReferer() {
        assertDoFilterLogsRequest referer: "http://www.awesome-web-site.com/"
    }

    void _testDoFilterLogsUserAgent() {
        assertDoFilterLogsRequest userAgent: "Mozilla/9.08"
    }
    
    void testThis() {
    	
    }

    // there's no good way to test that null things log as hyphens
}
