package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.AccessService


@Integration
@Rollback
class AccessServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    private static final String WIDGET_ID_1 = '3b12f1df-5232-4804-897e-917bf397618a'
    private static final String WIDGET_ID_2 = '5b12f1df-5232-4804-897e-917bf397618b'

    @Autowired
    AccessService accessService

    Person user1

    private void setupData() {
        user1 = createUser('user1')

        createWidgetDefinition(WIDGET_ID_1, 'http://localhost:8443/owf/examples/foo.html')
        createWidgetDefinition(WIDGET_ID_2, 'http://localhost:8443/owf/examples/bar.html')
    }

    void "check access"() {
        given:
        setupData()
        loggedInAs user1

        expect:
        accessService.checkAccess([widgetId: WIDGET_ID_1, senderId: WIDGET_ID_2]).success
    }

    private static createWidgetDefinition(String id, String url) {
        save new WidgetDefinition(
                widgetGuid: id,
                widgetUrl: url,
                displayName: 'Generic',
                height: 200,
                width: 200,
                imageUrlMedium: 'http://foo.jpg',
                imageUrlSmall: 'http://bar.jpg')
    }


}
