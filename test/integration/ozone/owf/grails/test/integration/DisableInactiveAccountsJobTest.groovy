package ozone.owf.grails.test.integration

import ozone.owf.grails.jobs.DisableInactiveAccountsJob


class DisableInactiveAccountsJobTest extends GroovyTestCase {
    def quartzScheduler
    def name = "deleteInactiveAccounts"
    def group = "owfDeleteInactiveAccounts"

    //Test that scheduling works
    def testScheduleJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        assertNotNull quartzScheduler.getJobDetail(name, group)
    }

    //Test that canceling deletes the job
    def testCancelJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        job.cancel(quartzScheduler)
        assertNull quartzScheduler.getJobDetail(name, group)
    }

    //Test that scheduling the same job twice doesn't produce an error
    def testDuplicateScheduleJob() {
        def job = new DisableInactiveAccountsJob()
        job.schedule(quartzScheduler)
        job.schedule(quartzScheduler)
        assertNotNull quartzScheduler.getJobDetail(name, group)
    }
}