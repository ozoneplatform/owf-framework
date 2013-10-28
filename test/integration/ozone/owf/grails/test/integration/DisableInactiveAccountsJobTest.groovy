package ozone.owf.grails.test.integration

import ozone.owf.grails.jobs.DisableInactiveAccountsJob


class DisableInactiveAccountsJobTest extends GroovyTestCase {
    def quartzScheduler
    static final String JOB_NAME = "deleteInactiveAccounts"
    def static final String GROUP_NAME = "owfDeleteInactiveAccounts"

    //Test that scheduling works
    void testScheduleJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        assertNotNull quartzScheduler.getJobDetail(JOB_NAME, GROUP_NAME)
    }

    //Test that canceling deletes the job
    void testCancelJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        job.cancel(quartzScheduler)
        assertNull quartzScheduler.getJobDetail(JOB_NAME, GROUP_NAME)
    }

    //Test that scheduling the same job twice doesn't produce an error
    void testDuplicateScheduleJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        job.schedule(quartzScheduler)
        assertNotNull quartzScheduler.getJobDetail(JOB_NAME, GROUP_NAME)
    }
}