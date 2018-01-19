package owf.grails.test.integration.services

import spock.lang.Ignore
import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration
import grails.web.servlet.mvc.GrailsParameterMap

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.PersonWidgetDefinitionService
import ozone.owf.grails.services.WidgetDefinitionService

import static owf.grails.test.integration.services.WidgetDefinitionPostParams.WIDGET_1_GUID
import static owf.grails.test.integration.services.WidgetDefinitionPostParams.WIDGET_2_GUID


@Integration
@Rollback
class PersonWidgetDefinitionServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    PersonWidgetDefinitionService personWidgetDefinitionService

    @Autowired
    WidgetDefinitionService widgetDefinitionService

    Person user1

    private void setupData() {
        user1 = createUser('user1')
    }

    void testCreate() {
        given:
        setupData()
        loggedInAs user1

        def widgetDef = createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsA())

        when:
        def result = personWidgetDefinitionService.create(generatePWDPostParamsA())

        then:
        result.success
        result.personWidgetDefinition.widgetDefinition.widgetGuid == widgetDef.widgetGuid
    }

    void testShow() {
        given:
        setupData()
        loggedInAs user1

        def widgetDef = createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsA())
        personWidgetDefinitionService.create(generatePWDPostParamsA())

        when:
        def result = personWidgetDefinitionService.show(generatePWDPostParamsA())

        then:
        result.success
        result.personWidgetDefinition.widgetDefinition.widgetGuid == widgetDef.widgetGuid
    }


    void testUpdateForPersonWidgetDefinitionParameter() {
        given:
        setupData()
        loggedInAs user1

        and:
        createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsA())

        def response = personWidgetDefinitionService.create(generatePWDPostParamsA())

        def personWidgetDefinition = response.personWidgetDefinition
        def widgetDefinition = personWidgetDefinition.widgetDefinition

        assert widgetDefinition.displayName == "My Widget"

        when:
        // TODO: Should we really be assigning directly to the object to test the update?
        widgetDefinition.displayName = "New Widget Name"
        personWidgetDefinition.widgetDefinition = widgetDefinition

        def response2 = personWidgetDefinitionService.update(pwdParams(personWidgetDefinition))

        then:
        response2.personWidgetDefinition.widgetDefinition.displayName == "New Widget Name"
    }

    /**
     * TODO: Broken; see below
     *
     * PersonWidgetDefinitionService.update() calls .getPersonWidgetDefinitionByGuidForUser(),
     * which requires an Admin role if personId is provided. What is the expected behavior here?
     */
    @Ignore
    void testUpdateForGuidAndPersonIdParameters() {
        given:
        setupData()
        loggedInAs user1

        and:
        createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsA())

        def response = personWidgetDefinitionService.create(generatePWDPostParamsA())

        def personWidgetDefinition = response.personWidgetDefinition
        def widgetDefinition = personWidgetDefinition.widgetDefinition

        assert widgetDefinition.displayName == "My Widget"

        when:
        widgetDefinition.displayName = "New Widget Name"
        personWidgetDefinition.widgetDefinition = widgetDefinition

        def response2 = personWidgetDefinitionService.update([guid: widgetDefinition.widgetGuid, personId: user1.id])

        then:
        response2.personWidgetDefinition.widgetDefinition.displayName == "New Widget Name"
    }

    /**
     * TODO: Broken; same problem as {@link #testUpdateForGuidAndPersonIdParameters()}
     */
    @Ignore
    void testUpdateForNonExistentWidgetDefinitionGuid() {
        given:
        setupData()
        loggedInAs user1

        when:
        personWidgetDefinitionService.update([guid: '12345678-1234-1234-abcd-1234567890a9', personId: user1.id])

        then:
        def ex = thrown(OwfException)
        ex.exceptionType == OwfExceptionTypes.NotFound
    }

    void testList() {
        given:
        setupData()
        loggedInAs user1

        createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsA())
        createWidgetDefinition(WidgetDefinitionPostParams.generatePostParamsC())
        createPersonWidgetDefinition(generatePWDPostParamsA())
        createPersonWidgetDefinition(generatePWDPostParamsC())

        when:
        def result = personWidgetDefinitionService.list(widgetNameParams())

        then:
        result.personWidgetDefinitionList.size() == 2
    }

    private static def generatePWDPostParamsA() {
        ["guid": WIDGET_1_GUID]
    }

    private static def generatePWDPostParamsC() {
        ["guid": WIDGET_2_GUID]
    }

    private static def widgetNameParams() {
        new GrailsParameterMap(["widgetName": "My Widget%"], null);
    }

    private static def pwdParams(pwd) {
        ["personWidgetDefinition": pwd]
    }

    private WidgetDefinition createWidgetDefinition(params) {
        runAsAdmin {
            widgetDefinitionService.create(params)
        }

        return verifyNotNull { WidgetDefinition.findByWidgetGuid(params.widgetGuid) }
    }

    private PersonWidgetDefinition createPersonWidgetDefinition(params) {
        def response = personWidgetDefinitionService.create(params)

        assert response.success
        assert response.personWidgetDefinition != null

        return response.personWidgetDefinition
    }

}
