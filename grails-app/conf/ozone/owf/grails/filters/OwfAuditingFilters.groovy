package ozone.owf.grails.filters

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.ozoneplatform.auditing.filter.AuditingFilters
import ozone.owf.grails.services.AccountService
import javax.servlet.http.HttpSession

class OwfAuditingFilters extends AuditingFilters {

    GrailsApplication grailsApplication
    
	AccountService accountService

	def jbFilter
	
    public String getApplicationVersion() {
        return grailsApplication.metadata['app.version']
    }

    @Override
    public boolean doLogging() {
        return true
    }

    @Override
    public String getUserName() {
        return accountService.getLoggedInUsername()
    }

    @Override
    public String getHostClassification() {
		try{
			if(!jbFilter)
				jbFilter = this.grailsApplication.getMainContext().getBean("JBlocksFilter")
			return jbFilter?.configMessage
		} catch (Exception ex){
			return "UNKNOWN"
		}
    }

    @Override
    public boolean isLogOnEvent(HttpSession session) {

        if (session.loginWasAudited) {
            return false
        }

        session.loginWasAudited = true
        return true
    }

}
