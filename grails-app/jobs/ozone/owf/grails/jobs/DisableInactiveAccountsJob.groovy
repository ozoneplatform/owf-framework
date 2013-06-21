package ozone.owf.grails.jobs

import org.quartz.Job
import org.quartz.JobDetail
import org.quartz.JobExecutionContext
import org.quartz.SimpleTrigger
import org.quartz.Trigger

class DisableInactiveAccountsJob implements Job {
	def name = "deleteInactiveAccounts"
	def group = "owfDeleteInactiveAccounts"

    public DisableInactiveAccountsJob() {

    }

    static triggers = {
        //simple name: 'mySimpleTrigger', startDelay: 1000, repeatInterval: 5000  
    }

    def schedule(def quartzScheduler) {
        def job = new JobDetail(name, group, this.class)
        //Change 5000 (once every 5 seconds) to 86400000 for 24 hours
        def trigger = new SimpleTrigger(name, group, new Date(), null, SimpleTrigger.REPEAT_INDEFINITELY, 5000)
        if (quartzScheduler.getJobDetail(name, group)) {
            log.info "$name job already exists, don't schedule"
        } else {
            quartzScheduler.scheduleJob(job, trigger)    
        }
    }

    def cancel(def quartzScheduler) {
        quartzScheduler.deleteJob(name, group)
    }

    /**
     * Execute this Job.
     * @param context
     * @return
     */
    public void execute(JobExecutionContext context) {
    	//Delete inactive accounts here
		// println("Doing $name job")
    }

}
