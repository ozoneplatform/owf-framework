package ozone.owf.grails.test.integration

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference

class PreferenceTests extends GroovyTestCase {
	
    def serviceModelService
    
	Person createUser() {
		def person = new Person(username: "Mike O'Neil",userRealName: "Mike O'Neil",passwd: 'passwd',
				                enabled: true,description: 'something',lastLogin: '01/01/2009')
		person.save()
		return person
	}
	
	/**
	 * OWF-1052: The asJSON method was calling StringEscapeUtils.escapeJavaScript on class variables. This 
	 * was causing the escaped values to be saved to the database. For example; let say you created a 
	 * preference with the value of "I can't do it". After you saved it was stored in the db as entered. 
	 * Then you refresh your admin screen. Now the database has "I can\'t do it". What happened? Well, the 
	 * preference list rest call was calling the asJSON method of each retrieved preference. Whenever a 
	 * parse error occurred when trying to generate the JSON (which was the first time you hit a character 
	 * that needs to be escaped in JS) we would escape the characters in the class variable. This was marking 
	 * them dirty in GORM and being committed back to the db when the transaction committed (even on a list 
	 * or a show)
	 */
	void testAsJsonNotEscapingCharactersInTheDB() {
		def val = "I can't do it"
		def preference = new  Preference(namespace: "com.company.widget",path: "status",value: val,user: createUser())

		preference.save(flush:true)
		preference.refresh()
		serviceModelService.createServiceModel(preference)
		assertEquals val, preference.value
		assertEquals "Mike O'Neil", preference.user.username
	}
	    
}
