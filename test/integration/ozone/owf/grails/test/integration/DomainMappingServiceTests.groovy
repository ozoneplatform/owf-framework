package ozone.owf.grails.test.integration

import grails.test.mixin.TestMixin
import grails.test.mixin.integration.IntegrationTestMixin

import ozone.owf.grails.domain.DomainMapping
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.DomainMappingService
import ozone.owf.grails.domain.RelationshipType

@TestMixin(IntegrationTestMixin)
class DomainMappingServiceTests extends OWFGroovyTestCase {

  DomainMappingService service
  def testAdmin1
  def testUser1
  def testUser2
  def testGroup1
  def testGroup2
  def testWidget1
  def testWidget2

  void setUp() {
    service = new DomainMappingService()

    DomainMapping.list()*.delete()

    testAdmin1 = Person.build(username: 'testAdmin1')
    testUser1 = Person.build(username: 'testUser1')
    testUser2 = Person.build(username: 'testUser2')

    testGroup1 = Group.build(name: "testGroup1", people: [testAdmin1])
    testGroup2 = Group.build(name: "testGroup2", people: [testUser1, testUser2])

    testWidget1 = WidgetDefinition.build(displayName: "testWidget1", widgetGuid: java.util.UUID.randomUUID().toString(),
            universalName: java.util.UUID.randomUUID().toString())
    testWidget2 = WidgetDefinition.build(displayName: "testWidget2", widgetGuid: java.util.UUID.randomUUID().toString(),
            universalName: java.util.UUID.randomUUID().toString())

  }

  void testCreateDomainMapping() {
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget1)

    assert DomainMapping.count() == 1

  }

  void testGetDomainMapping() {
    //create one mapping
    testCreateDomainMapping()

    def mapping = service.getMapping(testAdmin1, RelationshipType.owns, testWidget1)

    println(mapping)

    assert null != mapping
  }

  void testGetMappedObjects() {
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget1)
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget2)

    def results = service.getMappedObjects(testAdmin1, RelationshipType.owns, WidgetDefinition.TYPE)

    println("results: ${results}")
    println("results.class: ${results.class}")
    println("results.size(): ${results.size()}")

    assert null != results
    assert results.size() == 2

    results.each { widget ->
      assert widget.class == WidgetDefinition.class
    }
  }

  void testGetMappedObjectsWithPagingIntegerParams() {
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget1)
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget2)

    def results = service.getMappedObjects(testAdmin1, RelationshipType.owns, WidgetDefinition.TYPE,[opts:[offset:0,max:1]])

    println("results: ${results}")
    println("results.class: ${results.class}")
    println("results.size(): ${results.size()}")

    assert null != results
    assert results.size() == 1

    results.each { widget ->
      assert widget.class == WidgetDefinition.class
    }
  }

  void testGetMappedObjectsWithSortingAsc() {
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget1)
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget2)

    def results = service.getMappedObjects(testAdmin1, RelationshipType.owns, WidgetDefinition.TYPE,[sort:'displayName'])

    println("results: ${results}")
    println("results.class: ${results.class}")
    println("results.size(): ${results.size()}")

    assert null != results
    assert results.size() == 2

    assert results[0].displayName == 'testWidget1'
    assert results[0].class == WidgetDefinition.class

    assert results[1].displayName == 'testWidget2'
    assert results[1].class == WidgetDefinition.class
  }

  void testGetMappedObjectsWithSortingDesc() {
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget1)
    service.createMapping(testAdmin1, RelationshipType.owns, testWidget2)

    def results = service.getMappedObjects(testAdmin1, RelationshipType.owns, WidgetDefinition.TYPE,[sort:'displayName', dir:'desc'])

    println("results: ${results}")
    println("results.class: ${results.class}")
    println("results.size(): ${results.size()}")

    assert null != results
    assert results.size() == 2

    assert results[0].displayName == 'testWidget2'
    assert results[0].class == WidgetDefinition.class

    assert results[1].displayName == 'testWidget1'
    assert results[1].class == WidgetDefinition.class
  }
}
