package ozone.owf.grails.test.integration
/******************************** THINGS LEFT TO TEST **************************************************
    Test listForAdmin, listForUser, findByUserAndNamespaceAndPath, and findByAdminAndNamespaceAndPath
    	when (params?.limit) && (params?.start) && (params?.sort)
    Test create when !preference.save()
    Test deleteForUser when preference.delete() fails
    Test updateForUser when !preference.save()
********************************************************************************************************/

import ozone.owf.grails.services.PreferenceService
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Person;

class PreferenceServiceTests extends OWFGroovyTestCase {
	
	def service
	def testAdmin1
	def testUser1
	def testUser2
	def pref1
	def pref2
	def pref3
	def pref4
	def pref5
	def pref6
    def pref7
    def pref8

	void setUp() {
		service = new PreferenceService()
		service.accountService = accountService

		Preference.list()*.delete()
		
		testAdmin1 = Person.build(username:'testAdmin1')
		testUser1 = Person.build(username:'testUser1')
		testUser2 = Person.build(username:'testUser2')
	  
		pref1 = Preference.build(namespace: "namespace1", path: "path1", value: "value1", user: testAdmin1)
		pref2 = Preference.build(namespace: "namespace2", path: "path2", value: "value2", user: testAdmin1)
		pref3 = Preference.build(namespace: "namespace3", path: "path3", value: "value3", user: testAdmin1)
		pref4 = Preference.build(namespace: "namespace1", path: "path1", value: "value4", user: testUser1)
		pref5 = Preference.build(namespace: "namespace2", path: "path2", value: "value5", user: testUser1)
		pref6 = Preference.build(namespace: "namespace1", path: "path3", value: "value6", user: testUser2)
		pref7 = Preference.build(namespace: "namespace1", path: "path3", value: "value6", user: testUser1)
		pref8 = Preference.build(namespace: "namespace1", path: "path3", value: "value6", user: testAdmin1)
	}

	void testListAsNonAdmin() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
		def result = service.list([:])
		
		assertTrue result.success
		assertNotNull result.preference
		//assertEquals 3, result.preference.size
		assertEquals 3, result.count
	}

	void testListAsAdminShowsAll() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
		def result = service.list([:])
		
		assertTrue result.success
		assertNotNull result.preference
		//assertEquals 8, result.preference.size
		assertEquals 8, result.count
	}

	void testListByNamespace() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
		def result = service.list([namespace:'namespace1'])
		
		assertTrue result.success
		assertNotNull result.preference
		//assertEquals 5, result.preference.size
		assertEquals 5, result.count
	}

	void testListByNamespaceAndPath() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
		def result = service.list([namespace:'namespace3', path:'path3'])
		
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "value3", result.preference[0].value
		assertEquals 1, result.count
	}
	
	void testListByNamespaceAndPathWithDuplicates() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
		def result = service.list([namespace:'namespace1', path:'path1'])
		
		assertTrue result.success
		//assertEquals 2, result.preference.size
		assertEquals 2, result.count
	}
	
	void testShowForUserWithExistingPreference() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
		def result = service.showForUser([namespace:'namespace1', path:'path1'])

		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		assertEquals "value4", result.preference.value
	}
	
	void testShowForUserNoLanguageSet() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
		def result = service.showForUser([namespace:'owf.lang', path:'language'])

		assertTrue result.success
        assertNull result.preference
	}
	
	void testShowForUserWithNonExistingPreference() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
		def result = service.showForUser([namespace:'namespaceX', path:'pathX'])

		assertTrue result.success
        assertNull result.preference
	}

	void testCreateInvalidPreference() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
		// blank namespace
   	def preference = new Preference()
   	def params = [namespace:'', path:'pathX', value:'valueX']
		preference.namespace = params.namespace
		preference.path = params.path
		preference.value = params.value
		preference.user = testUser1
		preference.validate()
		
		shouldFail(OwfException){
			def result = service.create(params)
		}
		
		try {
			def result = service.create(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'A fatal validation error occurred during the updating of a preference. Params: ' + params.toString() + ' Validation Errors: ' + preference.errors.toString(), e.message
			assertEquals OwfExceptionTypes.Validation, e.exceptionType
		}
		
		// null namespace
		params = [path:'pathX', value:'valueX']
		shouldFail(OwfException){
			def nullNamespaceResult = service.create(params)
		}

		// null path
		params = [namespace:'foo', value:'valueX']
		shouldFail(OwfException){
			def nullPathResult = service.create(params)
		}
		
		// null value
		params = [namespace:'foo', path:'pathX']
		shouldFail(OwfException){
			def nullValueResult = service.create(params)
		}
		
	}

	void testCreateValidPreference() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def preference = new Preference()
      	def result = service.create([namespace:'namespaceX', path:'pathX', value:'valueX'])

		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespaceX", result.preference.namespace
		assertEquals "pathX", result.preference.path
		assertEquals "valueX", result.preference.value
	}
	
	void testDeepCloneAsUnauthorizedUser() {
		loginAsUsernameAndRole('testUser2', 'ROLE_USER')
		
      	def params = [namespace:'namespace1', path:'path1', value:'clonedValue']

		shouldFail(OwfException){
			def result = service.deepClone(params, testUser1.id)
		}
		
		try {
			def result = service.deepClone(params, testUser1.id)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'You are not authorized to clone preferences for other users.', e.message
			assertEquals OwfExceptionTypes.Authorization, e.exceptionType
		}
	}
	
	void testDeepCloneWithNoUserid() {
		loginAsUsernameAndRole('testUser4', 'ROLE_USER')
		
		def person = Person.build(username:'testUser4')
		
      	def params = [namespace:'namespace1', path:'path1', value:'clonedValue']

		try {
			def result = service.deepClone(params)
		} catch(e) {
			assertEquals result.namespace, 'namespace1'
			assertEquals result.path, 'path1'
			assertEquals result.value, 'clonedValue'
			assertEquals result.user, person
		}
	}
	
	void testDeepCloneAsAdminForAnotherUser() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
      	def params = [namespace:'namespace1', path:'path1', value:'clonedValue']
		def result = service.deepClone(params, testUser1.id)
		
		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		assertEquals "clonedValue", result.preference.value
	}
	
	void testDeleteForAdminAsNonAdminFails() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def params = [namespace:'namespaceX', path:'pathX']
		
		shouldFail(OwfException){
			def result = service.deleteForAdmin(params)
		}
		
		try {
			def result = service.deleteForAdmin(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'You are not authorized to delete Admin preferences.', e.message
			assertEquals OwfExceptionTypes.Authorization, e.exceptionType
		}
	}
	
	void testDeleteForAdminWithInvalidPreference() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
      	def params = [namespace:'namespaceX', path:'pathX', username: 'testAdmin1']
		def result = service.deleteForAdmin(params)
		
		assertTrue result.success
		assertNull result.preference
		
	}
	
	void testDeleteForAdminWithValidPreference() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
      	def params = [namespace:'namespace1', path:'path3', username: 'testUser2']
		
		def result = service.deleteForAdmin(params)

		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path3", result.preference.path
        assertEquals "testUser2", result.preference.user.username
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 7, result2.count
	}


	void testDeleteForAdminWithoutUsernameSpecified() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

      	def params = [namespace:'namespace1', path:'path3' ]

		shouldFail(OwfException){
			def result = service.deleteForAdmin(params)
		}

		try {
			def result = service.deleteForAdmin(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'The username is invalid.', e.message
			assertEquals OwfExceptionTypes.NotFound, e.exceptionType
		}
	}



	void testDeleteForUserAsUnauthorizedUser() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def params = [namespace:'namespace1', path:'path3', userid:testUser2.id]

		shouldFail(OwfException){
			def result = service.deleteForUser(params)
		}
		
		try {
			def result = service.deleteForUser(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'You are not authorized to delete preferences for other users.', e.message
			assertEquals OwfExceptionTypes.Authorization, e.exceptionType
		}
	}
	
	void testDeleteForUserAsSelf() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def params = [preference:pref4]

		def result = service.deleteForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path

		result = service.showForUser([namespace:'namespace1', path:'path1'])

		assertTrue result.success
        assertNull result.preference
	}

	void testDeleteForUserWithUserid() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
      	def params = [namespace:'namespace1', path:'path1', userid:testUser1.id]

		def result = service.deleteForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 7, result2.count
	}
	
	void testDeleteForUserWithUsername() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')
		
      	def params = [namespace:'namespace1', path:'path1', username:'testUser1']

		def result = service.deleteForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertNotNull result.preference
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 7, result2.count
	}
	
	void testBulkDeleteForAdminAsUnauthorizedUser() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1', username:'testAdmin1'}," +
      									    "{namespace:'namespace2', path:'path2', username:'testAdmin1'}," +
										    "{namespace:'namespace3', path:'path3', username:'testAdmin1'}]"]

		shouldFail(OwfException){
			def result = service.bulkDeleteForAdmin(params)
		}
		
		try {
			def result = service.bulkDeleteForAdmin(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'You are not authorized to bulkDelete Admin preferences.', e.message
			assertEquals OwfExceptionTypes.Authorization, e.exceptionType
		}
	}
	
	void testBulkDeleteForAdminWithNullPreferences() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

      	def params = [preferencesToDelete: null]

		shouldFail(OwfException){
			def result = service.bulkDeleteForAdmin(params)
		}
		
		try {
			def result = service.bulkDeleteForAdmin(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'A fatal validation error occurred. PreferencesToDelete param required. Params: ' + params.toString(), e.message
			assertEquals OwfExceptionTypes.Validation, e.exceptionType
		}
	}
	
	void testBulkDeleteForAdmin() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1', username:'testAdmin1'}," +
      									    "{namespace:'namespace2', path:'path2', username:'testAdmin1'}," +
										    "{namespace:'namespace3', path:'path3', username:'testAdmin1'}]"]

		def result = service.bulkDeleteForAdmin(params)

		assertNotNull result
		assertTrue result.success
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 5, result2.count
	}
	
	void testBulkDeleteForAdminWithDuplicatePathNames() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1', username:'testAdmin1'}," +
      									    "{namespace:'namespace1', path:'path1', username:'testUser1'}]"]

		def result = service.bulkDeleteForAdmin(params)

		assertNotNull result
		assertTrue result.success
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 6, result2.count
		
		def result3 = service.findPreference([username:'testAdmin1', namespace: "namespace1", path:"path1"])

		assertNull result3
		
		def result4 = service.findPreference([username: 'testUser1', namespace: "namespace1", path: "path1"])

		assertNull result4
	}
	
	void testBulkDeleteForAdminWithErrorsFails() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1', username:'testAdmin1'}," +
      									    "{namespace:'namespaceX', path:'pathX', username:'testAdmin1'}," +
										    "{namespace:'namespace3', path:'path3', username:'testAdmin1'}]"]
		def result = service.bulkDeleteForAdmin(params)
		
		assertTrue result.success
		assertNull result.preference

		// UNCOMMENT THE LINES BELOW ONCE THE TRANSACTION PROPAGATION BUG IS FIXED
		// def result2 = service.listForAdmin([])
		// 
		// assertTrue result2.success
		// assertNotNull result2.preference
		// assertEquals 6, result2.preference.size
		// assertEquals 6, result2.count
	}
	
	void testBulkDeleteForUserWithNullPreferences() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

      	def params = [preferencesToDelete: null]

		shouldFail(OwfException){
			def result = service.bulkDeleteForUser(params)
		}
		
		try {
			def result = service.bulkDeleteForUser(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'A fatal validation error occurred. PreferencesToDelete param required. Params: ' + params.toString(), e.message
			assertEquals OwfExceptionTypes.Validation, e.exceptionType
		}
	}
	
	void testBulkDeleteForUser() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1'}," +
      									    "{namespace:'namespace2', path:'path2'}]"]

		def result = service.bulkDeleteForUser(params)

		assertNotNull result
		assertTrue result.success
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 1, result2.count
	}
	
	void testBulkDeleteForUserWithErrorsFails() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

      	def params = [preferencesToDelete: "[{namespace:'namespace1', path:'path1'}," +
      									    "{namespace:'namespaceX', path:'pathX'}]"]
		def result = service.bulkDeleteForUser(params)
		
		assertTrue result.success
		assertNull result.preference

		// UNCOMMENT THE LINES BELOW ONCE THE TRANSACTION PROPAGATION BUG IS FIXED
		// def result2 = service.listForUser([])
		// 
		// assertTrue result2.success
		// assertNotNull result2.preference
		// assertEquals 2, result2.preference.size
		// assertEquals 4, result2.count
	}
	
	/*void testUpdateForUserAsUnauthorizedUser() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

		def params = [userid:testAdmin1.id]
				
		shouldFail(OwfException){
			def result = service.updateForUser(params)
		}
		
		try {
			def result = service.updateForUser(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals 'You are not authorized to edit preferences for other users.', e.message
			assertEquals OwfExceptionTypes.Authorization, e.exceptionType
		}
	}*/
	
	void testUpdateForUserAsAdmin() {
		loginAsUsernameAndRole('testAdmin1', 'ROLE_ADMIN')

		def params = [userid:testUser1.id, namespace:'namespace1', path:'path1', value:'updatedValue']
		
		def result = service.updateForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		assertEquals "updatedValue", result.preference.value
		assertEquals testUser1.id, result.preference.user.id
	}	
	
	void testUpdateForUserAsSelf() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

		def params = [namespace:'namespace1', path:'path1', value:'updatedValue']
		
		def result = service.updateForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertEquals "namespace1", result.preference.namespace
		assertEquals "path1", result.preference.path
		assertEquals "updatedValue", result.preference.value
		assertEquals testUser1.id, result.preference.user.id
	}
	
	void testUpdateForUserCreatesPreferenceIfItDoesntExist() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')

		def params = [namespace:'namespace1', path:'newPath', value:'newValue']
		
		def result = service.updateForUser(params)
		
		assertNotNull result
		assertTrue result.success
		assertEquals "namespace1", result.preference.namespace
		assertEquals "newPath", result.preference.path
		assertEquals "newValue", result.preference.value
		assertEquals testUser1.id, result.preference.user.id
		
		def result2 = service.list([:])
		
		assertTrue result2.success
		assertNotNull result2.preference
		assertEquals 4, result2.count
	}
	
	void testUpdateForUserInvalidPreference() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def preference = new Preference()
      	def params = [namespace:'', path:'pathX', value:'valueX']
		preference.namespace = params.namespace
		preference.path = params.path
		preference.value = params.value
		preference.user = testUser1
		preference.validate()
		
		shouldFail(OwfException){
			def result = service.updateForUser(params)
		}
		
		try {
			def result = service.updateForUser(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals OwfExceptionTypes.Validation, e.exceptionType
		}
	}
	
	void testUpdateForUserInvalidPreferenceValue() {
		loginAsUsernameAndRole('testUser1', 'ROLE_USER')
		
      	def preference = new Preference()
      	def params = [namespace:'namespace1', path:'path1', value:null]
		preference.namespace = params.namespace
		preference.path = params.path
		preference.value = params.value
		preference.user = testUser1
		preference.validate()
		
		shouldFail(OwfException){
			def result = service.updateForUser(params)
		}
		
		try {
			def result = service.updateForUser(params)
		} catch(e) {
			assertEquals OwfException, e.class
			assertEquals OwfExceptionTypes.Validation, e.exceptionType
		}
	}
}
