package org.grails.plugins.quartz

import org.quartz.Scheduler
import org.codehaus.groovy.grails.plugins.quartz.JobObject

class JobManagerService {

    boolean transactional = false

    Scheduler quartzScheduler

    def getAllJobs() {
        def jobsList = []
        def listJobGroups = quartzScheduler.getJobGroupNames()
        listJobGroups?.each {jobGroup ->
            quartzScheduler.getJobNames(jobGroup)?.each {jobName ->
                JobObject currentJob = new JobObject()
                currentJob.group = jobGroup
                currentJob.name = jobName
                def triggers = quartzScheduler.getTriggersOfJob(jobName, jobGroup)
                if (triggers != null && triggers.size() > 0) {
                    triggers.each {trigger ->
                        currentJob.triggerName = trigger.name
                        currentJob.triggerGroup = trigger.group
                        currentJob.status = quartzScheduler.getTriggerState(trigger.name, trigger.group)                        
                    }
                }
                jobsList.add(currentJob)
            }
        }

        jobsList
    }

    def getJob(String group) {
        if (group != null && !group.equals("")) {
            return quartzScheduler.getJobNames(group)
        } else {
            //TODO: Maybe we can create an exception for this kind of call
            return null
        }
    }

    def getRunningJobs() {
        /*
        JobExecutionContext:
            trigger: 'G1.TR1
            job: FooGroup1.FooJob1
            fireTime: 'Thu Oct 23 11:12:49 CEST 2008
            scheduledFireTime: Thu Oct 23 11:12:49 CEST 2008
            previousFireTime: 'Thu Oct 23 11:12:42 CEST 2008
            nextFireTime: Thu Oct 23 11:12:56 CEST 2008
            isRecovering: false
            refireCount: 0
         */
        quartzScheduler.getCurrentlyExecutingJobs()
    }

    def pauseJob(String group, String name) {
        quartzScheduler.pauseJob(name, group)
    }

    def resumeJob (String group, String name) {
        quartzScheduler.resumeJob (name, group)
    }

    def pauseTrigger(String group, String name) {
        quartzScheduler.pauseTrigger (name, group)
    }

    def resumeTrigger(String group, String name) {
        quartzScheduler.resumeTrigger (name, group)
    }

    def pauseTriggerGroup (String group) {
        quartzScheduler.pauseTriggerGroup (group)
    }

    def resumeTriggerGroup (String group) {
        quartzScheduler.resumeTriggerGroup (group)    
    }

    def pauseJobGroup (String group) {
        quartzScheduler.pauseJobGroup (group)
    }

    def resumeJobGroup (String group) {
        quartzScheduler.resumeJobGroup (group)    
    }

    def removeJob (String group, String name) {
        quartzScheduler.deleteJob(name, group)
    }

    def unscheduleJob (String group, String name) {
        quartzScheduler.unscheduleJob(name, group)
     }

    def interruptJob (String group, String name) {
        quartzScheduler.interrupt(name, group)
    }



}
