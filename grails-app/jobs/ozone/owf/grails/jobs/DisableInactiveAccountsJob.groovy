package ozone.owf.grails.jobs

import java.text.ParseException
import java.text.SimpleDateFormat

import grails.web.context.ServletContextHolder

import org.grails.web.util.GrailsApplicationAttributes
import org.quartz.*


class DisableInactiveAccountsJob implements Job {
    def name = "deleteInactiveAccounts"
    def group = "owfDeleteInactiveAccounts"
    JobKey jobKey = new JobKey(name, group)
    def execInterval
    def startTime
    def purgeUserService

    public DisableInactiveAccountsJob() {

    }

    public DisableInactiveAccountsJob(String _execInterval, String _startTime) {

        execInterval = _execInterval?.isInteger() ? _execInterval.toInteger() : null

        startTime = _startTime

    }

    static triggers = {

    }

    /**
     * Get the start time for the first run of the job
     * @return
     */
    private Date getStartDateTime()  {

        def _startDateTime
        // If a start time provided to constructor, use it
        if (startTime) {
            try {
                def startDate = new Date()
                // Set the start time as part of the string then convert back to date
                def startDateString = startDate.format("yyyy-MM-dd") + " " + startTime
                _startDateTime =  new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").parse(startDateString)

            } catch(ParseException e) {

                log.error "Unable to parse time format. Will use default time: ${e.message}"
                // Set the start time to now
                _startDateTime = new Date()
            }

        }   else {
            // Set the start time to now
            _startDateTime = new Date()
        }

        return _startDateTime

    }

    /**
     * Get the interval for the job in milliseconds
     * @return
     */
    private Integer getExecInterval() {

        // Conversion factor for minutes to milliseconds
        def convToMs = 1000*60
        // Defaults to 24 hours in minutes
        def defaultInterval = 24*60
        return (execInterval != null && execInterval > 0) ? convToMs * execInterval : convToMs * defaultInterval
    }


    def schedule(def quartzScheduler) {
        def job = JobBuilder.newJob(this.class).withIdentity(jobKey).build()
        def trigger = TriggerBuilder.newTrigger()
            .withIdentity(name, group)
            .startAt(getStartDateTime())
            .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInMilliseconds(getExecInterval())
                .repeatForever()
            ).build()
        if (quartzScheduler.getJobDetail(jobKey)) {
            log.info "$name job already exists, don't schedule"
        } else {
            quartzScheduler.scheduleJob(job, trigger)
        }
    }

    def cancel(def quartzScheduler) {
        quartzScheduler.deleteJob(jobKey)
    }

    /**
     * Execute this Job.
     * @param context
     * @return
     */
    public void execute(JobExecutionContext context) {
        def ctx = ServletContextHolder.servletContext.getAttribute(GrailsApplicationAttributes.APPLICATION_CONTEXT)
        if (!ctx) throw new RuntimeException('Unable to execute DisableInactiveAccountsJob: AppContext is unavailable')
        if (!purgeUserService) {
            purgeUserService = ctx?.purgeUserService
        }

        log.info "Purging inactive users"
        purgeUserService.purgeInactiveAccounts()
    }

}
