package grails.plugins.quartz

import org.quartz.CronScheduleBuilder
import org.quartz.CronTrigger
import org.quartz.SimpleScheduleBuilder
import org.quartz.SimpleTrigger
import org.quartz.Trigger
import org.quartz.TriggerBuilder

/**
 * The util class which helps to build triggers for schedule methods.
 *
 * @author Vitalii Samolovskikh aka Kefir
 */
class TriggerUtils {
    private static def generateTriggerName() {
        "GRAILS_" + UUID.randomUUID().toString()
    }

    static Trigger buildDateTrigger(String jobName, String jobGroup, Date scheduleDate) {
        return TriggerBuilder.newTrigger()
                .withIdentity(generateTriggerName(), GrailsJobClassConstants.DEFAULT_TRIGGERS_GROUP)
                .withPriority(6)
                .forJob(jobName, jobGroup)
                .startAt(scheduleDate)
                .build()
    }

    static SimpleTrigger buildSimpleTrigger(String jobName, String jobGroup, long repeatInterval, int repeatCount) {
        return TriggerBuilder.newTrigger()
                .withIdentity(generateTriggerName(), GrailsJobClassConstants.DEFAULT_TRIGGERS_GROUP)
                .withPriority(6)
                .forJob(jobName, jobGroup)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withIntervalInMilliseconds(repeatInterval).withRepeatCount(repeatCount))
                .build()
    }

    static CronTrigger buildCronTrigger(String jobName, String jobGroup, String cronExpression) {
        return TriggerBuilder.newTrigger()
                .withIdentity(generateTriggerName(), GrailsJobClassConstants.DEFAULT_TRIGGERS_GROUP)
                .withPriority(6)
                .forJob(jobName, jobGroup)
                .withSchedule(CronScheduleBuilder.cronSchedule(cronExpression))
                .build()
    }
}
