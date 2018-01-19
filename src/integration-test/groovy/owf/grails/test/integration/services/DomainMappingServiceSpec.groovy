package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.domain.DomainMapping
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.DomainMappingService


@Integration
@Rollback
class DomainMappingServiceSpec extends Specification implements OwfSpecMixin, SecurityMixin {

    @Autowired
    DomainMappingService service

    Person admin1

    WidgetDefinition testWidget1
    WidgetDefinition testWidget2

    private void setupData() {
        admin1 = createAdmin('admin1')

        testWidget1 = createWidgetDefinition('testWidget1')
        testWidget2 = createWidgetDefinition('testWidget2')
    }

    private void setupMappings() {
        service.createMapping(admin1, RelationshipType.owns, testWidget1)
        service.createMapping(admin1, RelationshipType.owns, testWidget2)
    }

    void testCreateDomainMapping() {
        given:
        setupData()

        when:
        service.createMapping(admin1, RelationshipType.owns, testWidget1)

        then:
        DomainMapping.count() == 1

    }

    void testGetDomainMapping() {
        given:
        setupData()
        setupMappings()

        when:
        def mapping = service.getMapping(admin1, RelationshipType.owns, testWidget1)

        then:
        mapping != null
    }

    void testGetMappedObjects() {
        given:
        setupData()
        setupMappings()

        when:
        def results = service.getMappedObjects(admin1, RelationshipType.owns, WidgetDefinition.TYPE)

        then:
        results.size() == 2
        results.each { widget -> assert widget.class == WidgetDefinition.class }
    }

    void testGetMappedObjectsWithPagingIntegerParams() {
        given:
        setupData()
        setupMappings()

        when:
        def results = service.getMappedObjects(admin1, RelationshipType.owns, WidgetDefinition.TYPE, [opts: [offset: 0, max: 1]])

        then:
        results.size() == 1
        results.each { widget -> assert widget.class == WidgetDefinition.class }
    }

    void testGetMappedObjectsWithSortingAsc() {
        given:
        setupData()
        setupMappings()

        when:
        def results = service.getMappedObjects(admin1, RelationshipType.owns, WidgetDefinition.TYPE, [sort: 'displayName'])

        then:
        results*.displayName == [testWidget1.displayName, testWidget2.displayName]
    }

    void testGetMappedObjectsWithSortingDesc() {
        given:
        setupData()
        setupMappings()

        when:
        def results = service.getMappedObjects(admin1, RelationshipType.owns, WidgetDefinition.TYPE, [sort: 'displayName', dir: 'desc'])

        then:
        results*.displayName == [testWidget2.displayName, testWidget1.displayName]
    }

    private static WidgetDefinition createWidgetDefinition(String name) {
        save new WidgetDefinition(
                displayName: name,
                widgetGuid: UUID.randomUUID().toString(),
                universalName: UUID.randomUUID().toString(),
                width: 200,
                height: 200,
                widgetUrl: 'http://example.com/widget/',
                imageUrlSmall: 'http://example.com/widget/small.png',
                imageUrlMedium: 'http://example.com/widget/medium.png')
    }

}
