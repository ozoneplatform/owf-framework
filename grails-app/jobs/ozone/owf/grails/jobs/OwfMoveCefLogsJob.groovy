package ozone.owf.grails.jobs

import ozone.owf.grails.services.OwfApplicationConfigurationService
import org.ozoneplatform.auditing.quartz.jobs.AbstractFileMovementJob

import static ozone.owf.enums.OwfApplicationSetting.*


class OwfMoveCefLogsJob extends  AbstractFileMovementJob{
	
	OwfApplicationConfigurationService owfApplicationConfigurationService
	
	def group = "cefLogSweepingGroup"
	
	
	static triggers = { 
		long fiveMinutes = 1000 * 60 * 5
		long oneHour = fiveMinutes * 12
		simple name: 'OwfMoveCefLogsTrigger', startDelay: fiveMinutes, repeatInterval: oneHour
	}
	
	@Override
	public String getFromLocation(){
		owfApplicationConfigurationService.valueOf(ozone.owf.enums.OwfApplicationSetting.CEF_LOG_LOCATION)
	}
	
	@Override
	public String getToLocation(){
		owfApplicationConfigurationService.valueOf(ozone.owf.enums.OwfApplicationSetting.CEF_LOG_SWEEP_LOCATION)
	}
	
	@Override
	public boolean isJobEnabled(){
		owfApplicationConfigurationService.is(ozone.owf.enums.OwfApplicationSetting.CEF_LOG_SWEEP_ENABLED)
	}
	
}
