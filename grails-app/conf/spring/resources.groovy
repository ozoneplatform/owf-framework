import grails.util.GrailsUtil
import ozone.owf.grails.OwfExceptionResolver
import ozone.owf.grails.services.AutoLoginAccountService
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.services.AccountService
import ozone.owf.nineci.hibernate.AuditTrailInterceptor

beans = {

	entityInterceptor(AuditTrailInterceptor)
	
    // wire up a different account service if -Duser=something and environment is development
    if (GrailsUtil.environment == "development") {
        switch (System.properties.user) {
            case "testUser1":
                println("Using AutoLoginAccountService - you will be logged in as testUser1")
                accountService(AutoLoginAccountService) {
                    autoAccountName = "testUser1"
					autoAccountDisplayName = "Test User 1"
                    autoRoles = [ERoleAuthority.ROLE_USER.strVal]
                    serviceModelService = ref('serviceModelService')
                }
                break
            case "testAdmin1":
                println("Using AutoLoginAccountService - you will be logged in as testAdmin1")
                accountService(AutoLoginAccountService) {
                    autoAccountName = "testAdmin1"
					autoAccountDisplayName = "Test Admin 1"
                    autoRoles = [ERoleAuthority.ROLE_USER.strVal, ERoleAuthority.ROLE_ADMIN.strVal]
                    serviceModelService = ref('serviceModelService')
                }
                break
            case "testAdmin2":
                println("Using AutoLoginAccountService - you will be logged in as testAdmin2")
                accountService(AutoLoginAccountService) {
                    autoAccountName = "testAdmin2"
                    autoAccountDisplayName = "Test Admin 2"
                    autoRoles = [ERoleAuthority.ROLE_USER.strVal, ERoleAuthority.ROLE_ADMIN.strVal]
                    serviceModelService = ref('serviceModelService')
                }
                break
            default :
               accountService(AccountService) {
                   serviceModelService = ref('serviceModelService')
               }
               break
        }
    } else {
       accountService(AccountService) {
           serviceModelService = ref('serviceModelService')
       }
    }

	exceptionHandler(OwfExceptionResolver)
	{
		exceptionMappings = [
				'java.lang.Exception': '/error'
				]		
	}
}
