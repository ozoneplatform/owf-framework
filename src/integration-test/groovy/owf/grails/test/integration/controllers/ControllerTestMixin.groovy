package owf.grails.test.integration.controllers

import java.lang.reflect.ParameterizedType

import grails.artefact.Controller
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.util.GrailsNameUtils
import grails.util.GrailsWebMockUtil
import grails.web.api.ServletAttributes
import grails.web.mvc.FlashScope
import grails.web.servlet.mvc.GrailsParameterMap

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.web.context.WebApplicationContext

import org.grails.core.artefact.ControllerArtefactHandler
import org.grails.web.json.JSONElement
import org.grails.web.json.JSONObject
import org.grails.web.util.GrailsApplicationAttributes


trait ControllerTestMixin<T extends Controller & ServletAttributes> {

    @Autowired
    GrailsApplication grailsApplication

    @Autowired
    WebApplicationContext ctx

    private T _instance;

    ApplicationContext getApplicationContext() {
        grailsApplication.mainContext
    }

    T getController() {
        if (_instance == null) {
            createController()
        }

        _instance
    }

    MockHttpServletResponse getControllerResponse() {
        assert controller.response != null

        controller.response as MockHttpServletResponse
    }

    GrailsParameterMap params(Map entries) {
        controller.params.clear()
        controller.params.putAll(entries)

        controller.params
    }

    HttpStatus getResponseStatus() {
        HttpStatus.valueOf(controllerResponse.status)
    }

    FlashScope getFlash() {
        controller.flash
    }

    String getResponseHeader(String name) {
        controllerResponse.getHeader(name)
    }

    JSONElement getResponseJson() {
        JSON.parse(responseString)
    }

    String getResponseString() {
        def content = controllerResponse.contentAsString
        assert content != null
        assert !content.empty

        content
    }

    void responseStringMatches(String template, Object arg) {
        def message = sprintf(template, arg)

        assert responseString == message
    }

    void responseStringMatches(String template, Collection<Object> args) {
        def message = sprintf(template, args.toArray())

        assert responseString == message
    }

    void redirectedTo(String url) {
        assert controllerResponse.redirectedUrl == url
    }

    void jsonResponseMatches(Map<String, Object> expectedValues) {
        JSONElement element = responseJson

        assert element instanceof JSONObject

        JSONObject response = (JSONObject) element

        expectedValues.forEach { key, value ->
            if (response.has(key)) {
                assert response[key] == value
            }
        }

        def expectedKeys = expectedValues.keySet()
        def actualKeys = element.keySet()

        def responseMissingExpectedProperties = expectedKeys - actualKeys
        def responseContainedUnexpectedProperties = actualKeys - expectedKeys

        assert responseMissingExpectedProperties.isEmpty()
        assert responseContainedUnexpectedProperties.isEmpty()
    }

    private void createController() {
        Class<T> type = getTypeUnderTest()
        _instance = applicationContext.getBean(type)

        def webRequest = GrailsWebMockUtil.bindMockWebRequest(ctx)
        webRequest.request.setAttribute(GrailsApplicationAttributes.CONTROLLER, _instance)
        webRequest.controllerName = GrailsNameUtils.getLogicalPropertyName(_instance.class.name, ControllerArtefactHandler.TYPE)
    }

    private Class<T> getTypeUnderTest() {
        ParameterizedType parameterizedType = (ParameterizedType) getClass().genericInterfaces.find {
            it instanceof ParameterizedType &&
                    ControllerTestMixin.isAssignableFrom((Class) ((ParameterizedType) it).rawType)
        }

        parameterizedType?.actualTypeArguments[0] as Class<T>
    }


}
