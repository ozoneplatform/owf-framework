package ozone.owf.grails.jobs

import static ozone.owf.enums.OwfApplicationSetting.*
import org.ozoneplatform.auditing.quartz.jobs.AbstractFileMovementJob
import ozone.owf.grails.services.OwfApplicationConfigurationService



class OwfMoveCefLogsJob extends  AbstractFileMovementJob{
	
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	def group = "owfFileMoverGroup"
	
	
	static triggers = { 
		long fiveMinutes = 1000 * 60 * 5
		long oneHour = fiveMinutes * 12
		simple name: 'OwfMoveCefLogsTrigger', startDelay: fiveMinutes, repeatInterval: oneHour
	}
	
	@Override
	public String getFromLocation(){
		owfApplicationConfigurationService.valueOf(CEF_LOG_LOCATION)
	}
	
	@Override
	public String getToLocation(){
		owfApplicationConfigurationService.valueOf(CEF_LOG_SWEEP_LOCATION)
	}
	
	@Override
	public boolean isJobEnabled(){
		owfApplicationConfigurationService.is(CEF_LOG_SWEEP_ENABLED)
	}
	
}
