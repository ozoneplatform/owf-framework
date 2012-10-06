package ozone.owf.grails.services

import grails.converters.JSON
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import org.hibernate.CacheMode

class WidgetTypeService {
	def loggingService = new AuditOWFWebRequestsLogger()
	def accountService
    def serviceModelService
	def list(params) {

		ensureAdmin()
		def widgetTypes = null
		def opts = [:]
		widgetTypes = WidgetType.createCriteria().list(opts) {
			cache(true)
			cacheMode(CacheMode.GET)
            order('name', params?.order?.toLowerCase() ?: 'asc')
		}
	
		def processedWidgetTypes = widgetTypes.collect { wt ->
			serviceModelService.createServiceModel(wt)
			
		}
		return [success: true, results: widgetTypes.totalCount, data: processedWidgetTypes]
	}

	private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }
}
