package ozone.owf.grails.services

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.OwfException

/*
    This is an account service used for development so that cas is
    not needed.  It is configured in the resources.groovy file
    and is removed from the war file in BuildConfig.groovy
 */
public class AutoLoginAccountService extends AccountService {

    def autoAccountName
	def autoAccountDisplayName
    def autoRoles

    def getLoggedInUser() {
         return Person.findByUsername(getLoggedInUsername(),[cache:true])
    }

    def getLoggedInUsername() {
        autoAccountName
    }
	
	def getLoggedInUserDisplayName(){
		return autoAccountDisplayName
	}

    def getLoggedInUserIsAdmin() {
        getLoggedInUserRoles().contains ERoleAuthority.ROLE_ADMIN.strVal
    }

    def getLoggedInUserIsUser() {
        getLoggedInUserRoles().contains ERoleAuthority.ROLE_USER.strVal
    }

    def getLoggedInUserRoles() {
        autoRoles
    }

	def getAllUsers() {
		if (!getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to see a list of users in the system.', exceptionType: OwfExceptionTypes.Authorization)
		}
		return Person.listOrderByUsername()
	}
}