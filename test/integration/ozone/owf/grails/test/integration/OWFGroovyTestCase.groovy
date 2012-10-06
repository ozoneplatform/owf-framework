package ozone.owf.grails.test.integration

import org.springframework.security.core.context.SecurityContextHolder as SCH

import grails.converters.JSON
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.GrantedAuthorityImpl
import org.springframework.security.core.userdetails.User
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.ServiceModelService

class OWFGroovyTestCase extends GroovyTestCase {
	
	int testAdmin1ID
	int testUser1ID
	int testUser2ID
	def accountService
	
	protected void setUp() {
		super.setUp() 
        accountService.serviceModelService = new ServiceModelService()

        //needed for the following 3 createOrUpdate calls
        loginAsAdmin()

		accountService.createOrUpdate(createTestUser1())
		accountService.createOrUpdate(createTestUser2())
		accountService.createOrUpdate(createTestAdmin())

        //clear admin login
		SCH.clearContext()

		testAdmin1ID = Person.findByUsername("testAdmin1").id
		testUser1ID = Person.findByUsername("testUser1").id
		testUser2ID = Person.findByUsername("testUser2").id
	}

	protected createTestAdmin(){
      Map map =
      [
         data: [[
                 username: 'testAdmin1',
                 userRealName: 'Test Admin',
                 enable: true,
                 email: 'something@something.com'
         ]].asType(JSON).toString()
      ]
	}

	protected createTestUser1(){
      Map map =
      [
         data:[[
              username: 'testUser1',
              userRealName: 'Test User 1',
              enable: true,
              email: 'something@something.com'
         ]].asType(JSON).toString()
      ]
    }

	protected createTestUser2(){
      Map map =
      [
         data: [[
                 username: 'testUser2',
                 userRealName: 'Test User 2',
                 enable: true,
                 email: 'something@something.com'
         ]].asType(JSON).toString()
      ]
	}

	protected createWidgetDefinition() {
		def json =
		[
		 	imageUrlSmall: "../images/blue/icons/widgetContainer/widgetEmptysm.gif", 
		 	imageUrlLarge: "../images/blue/icons/widgetIcons/nearlyEmpty.gif", 
		 	checkedTargets:  new JSON([['id':testAdmin1ID], ['id':testUser1ID], ['id':testUser2ID] ]).toString(),
		 	width:200, 
		 	uncheckedTargets:4, 
		 	height:200, 
		 	widgetUrl: "../examples/walkthrough/widgets/NearlyEmptyWidget.html", 
		 	isExtAjaxFormat:true, 
		 	action: "createOrUpdateWidgetDefinition", 
		 	widgetGuid: "6859f52e-2196-4880-8871-ba7b0ab057b7", 
            universalName: "6859f52e-2196-4880-8871-ba7b0ab057b7",
            widgetVersion: "1.0",
		 	controller: "administration",
		 	displayName:"New Empty Widget 1", 
		 	adminEnabled:true
		]
		return json
	}
	
	protected void tearDown() {
		SCH.clearContext();
		super.tearDown();
	}
	
	protected void loginAsAdmin() {
		loginAsUsernameAndRole("testAdmin1","ROLE_ADMIN")
	}
	
	protected void loginAsUsernameAndRole(def username, def role_string) {
		SCH.clearContext()
		
		GrantedAuthority[] authorities = [new GrantedAuthorityImpl(role_string)]
		SCH.context.authentication = new UsernamePasswordAuthenticationToken(
		new User(username, "password1", true, true, true, true, authorities),
		"password1"
		)
	}
	
	protected queryDashboardByUser(username, dashboardname) {
		def person = Person.createCriteria().list {
			and {
				eq('username', username)
				dashboards {
					eq('name', dashboardname)
				}
			}
		}
		
		return person.dashboards
	}

}
