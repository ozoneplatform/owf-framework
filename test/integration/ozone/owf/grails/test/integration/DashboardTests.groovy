package ozone.owf.grails.test.integration

import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.PersonWidgetDefinition
/**
 * Date: Aug 18, 2009
 * Time: 12:11:50 PM
 */

public class DashboardTests extends GroovyTestCase {
    void testStateOrder() {
        // cheap test to check order TODO: break this up and make unit tests
        //setup
		def dbName = "sampleDb"
		def db = Dashboard.build(name: dbName, guid: newUUID(), state: [] as SortedSet)
		def pwd1 = PersonWidgetDefinition.build(widgetDefinition: WidgetDefinition.build(universalName: newUUID(), widgetGuid: newUUID(), widgetVersion: '1.0'),person: Person.build(username: 'user 1'));
		def pwd2 = PersonWidgetDefinition.build(widgetDefinition: WidgetDefinition.build(universalName: newUUID(), widgetGuid: newUUID(), widgetVersion: '1.1'),person: Person.build(username: 'user 2'));
		def pwd3 = PersonWidgetDefinition.build(widgetDefinition: WidgetDefinition.build(universalName: newUUID(), widgetGuid: newUUID(), widgetVersion: '1.2'),person: Person.build(username: 'user 3'));
		
		def dws1 = DashboardWidgetState.build(statePosition: 1, uniqueId: newUUID(), personWidgetDefinition: pwd1, dashboard: db)
        def dws3 = DashboardWidgetState.build(statePosition : 3, uniqueId: newUUID(), personWidgetDefinition: pwd2, dashboard: db)
        def dws2 = DashboardWidgetState.build(statePosition: 2, uniqueId: newUUID(), personWidgetDefinition: pwd3, dashboard: db)
		
        db.addToState(dws2)
        db.addToState(dws1)
        db.addToState(dws3)
        db.save(flush:true)
	
        println("dws1 : ${db.state}")
        
        // execute and assert
        def expectedOrder = [1,2,3]
        assertEquals expectedOrder, Dashboard.findByName(dbName).state*.statePosition
    }
    
    private String newUUID() {
        return UUID.randomUUID()
    }
}