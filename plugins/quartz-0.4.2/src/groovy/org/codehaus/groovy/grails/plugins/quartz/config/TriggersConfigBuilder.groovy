/* Copyright 2004-2005 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.codehaus.groovy.grails.plugins.quartz.config

import org.codehaus.groovy.grails.plugins.quartz.GrailsTaskClassProperty as GTCP
import org.quartz.Trigger
import org.codehaus.groovy.grails.plugins.quartz.CustomTriggerFactoryBean
import org.codehaus.groovy.grails.exceptions.GrailsRuntimeException
import org.quartz.CronTrigger
import org.quartz.SimpleTrigger
import grails.util.GrailsUtil
import org.quartz.CronExpression
import org.codehaus.groovy.grails.commons.GrailsClassUtils

/**
 * Groovy Builder for parsing triggers configuration info.
 *
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 *
 * @since 0.3
 */
public class TriggersConfigBuilder extends BuilderSupport {
    private triggerNumber = 0
    private jobName

    def triggers = [:]

    public TriggersConfigBuilder(String jobName) {
        super()
        this.jobName = jobName
    }

    public build(closure) {
        closure.delegate = this
        closure.call()
        return triggers
    }

    protected void setParent(parent, child) {}

    protected createNode(name) {
        createNode(name, null, null)
    }

    protected createNode(name, value) {
        createNode(name, null, value)
    }

    protected createNode(name, Map attributes) {
        createNode(name, attributes, null)
    }

    protected Object createNode(name, Map attributes, Object value) {
        def trigger = createTrigger(name, attributes, value)
        triggers[trigger.triggerAttributes.name] = trigger
        trigger
    }

    public Expando createTrigger(name, Map attributes, value) {
        def triggerClass
        def triggerAttributes = new HashMap(attributes)

        prepareCommonTriggerAttributes(triggerAttributes)

        def triggerType = name

        if(triggerType == 'simpleTrigger') {
            GrailsUtil.deprecated("You're using deprecated 'simpleTrigger' construction in the ${jobName}, use 'simple' instead.")
            triggerType = 'simple'
        } else if(triggerType == 'cronTrigger') {
            GrailsUtil.deprecated("You're using deprecated 'cronTrigger' construction in the ${jobName}, use 'cron' instead.")
            triggerType = 'cron'
        } else if(triggerType == 'customTrigger') {
            GrailsUtil.deprecated("You're using deprecated 'customTrigger' construction in the ${jobName}, use 'custom' instead.") 
            triggerType = 'custom'
        }

        switch(triggerType) {
            case 'simple':
                triggerClass = SimpleTrigger
                prepareSimpleTriggerAttributes(triggerAttributes)
                break
            case 'cron':
                triggerClass = CronTrigger
                prepareCronTriggerAttributes(triggerAttributes)
                break
            case 'custom':
                if(!triggerAttributes?.triggerClass) throw new Exception("Custom trigger must have 'triggerClass' attribute")
                triggerClass = triggerAttributes.remove('triggerClass')
                if(!Trigger.isAssignableFrom(triggerClass)) throw new Exception("Custom trigger class must extend org.quartz.Trigger class.")
                break
            default:
                throw new Exception("Invalid format")
        }

        new Expando(clazz: CustomTriggerFactoryBean, triggerClass: triggerClass, triggerAttributes: triggerAttributes)
    }

    private prepareCommonTriggerAttributes(HashMap triggerAttributes) {
        if(triggerAttributes[GTCP.NAME] == null) triggerAttributes[GTCP.NAME] = "${jobName}${triggerNumber++}"
        if(triggerAttributes[GTCP.GROUP] == null) triggerAttributes[GTCP.GROUP] = GTCP.DEFAULT_GROUP
        if(triggerAttributes[GTCP.START_DELAY] == null) triggerAttributes[GTCP.START_DELAY] = GTCP.DEFAULT_START_DELAY
        if(!(triggerAttributes[GTCP.START_DELAY] instanceof Integer || triggerAttributes[GTCP.START_DELAY] instanceof Long)) {
            throw new IllegalArgumentException("startDelay trigger property in the job class ${jobName} class must be Integer or Long");
        }
        if(((Number) triggerAttributes[GTCP.START_DELAY]).longValue() < 0) {
            throw new IllegalArgumentException("startDelay trigger property in the job class ${jobName} is negative (possibly integer overflow error)");
        }
        if(triggerAttributes[GTCP.VOLATILITY] == null) triggerAttributes[GTCP.VOLATILITY] = GTCP.DEFAULT_VOLATILITY
    }

    private def prepareSimpleTriggerAttributes(HashMap triggerAttributes) {
        if (triggerAttributes[GTCP.TIMEOUT] != null) {
            GrailsUtil.deprecated("You're using deprecated 'timeout' property in the ${jobName}, use 'repeatInterval' instead")
            triggerAttributes[GTCP.REPEAT_INTERVAL] = triggerAttributes.remove(GTCP.TIMEOUT)
        }
        if (triggerAttributes[GTCP.REPEAT_INTERVAL] == null) triggerAttributes[GTCP.REPEAT_INTERVAL] = GTCP.DEFAULT_REPEAT_INTERVAL
        if (!(triggerAttributes[GTCP.REPEAT_INTERVAL] instanceof Integer || triggerAttributes[GTCP.REPEAT_INTERVAL] instanceof Long)) {
            throw new Exception("repeatInterval trigger property in the job class ${jobName} class must be Integer or Long");
        }
        if (((Number) triggerAttributes[GTCP.REPEAT_INTERVAL]).longValue() < 0) {
            throw new Exception("repeatInterval trigger property for job class ${jobName} is negative (possibly integer overflow error)");
        }
        if (triggerAttributes[GTCP.REPEAT_COUNT] == null) triggerAttributes[GTCP.REPEAT_COUNT] = GTCP.DEFAULT_REPEAT_COUNT
        if (!(triggerAttributes[GTCP.REPEAT_COUNT] instanceof Integer || triggerAttributes[GTCP.REPEAT_COUNT] instanceof Long)) {
            throw new Exception("repeatCount trigger property in the job class ${jobName} class must be Integer or Long");
        }
        if (((Number) triggerAttributes[GTCP.REPEAT_COUNT]).longValue() < 0 && ((Number) triggerAttributes[GTCP.REPEAT_COUNT]).longValue() != SimpleTrigger.REPEAT_INDEFINITELY) {
            throw new Exception("repeatCount trigger property for job class ${jobName} is negative (possibly integer overflow error)");
        }
    }

    private def prepareCronTriggerAttributes(HashMap triggerAttributes) {
        if (!triggerAttributes?.cronExpression) throw new Exception("Cron trigger must have 'cronExpression' attribute")
        if (!CronExpression.isValidExpression(triggerAttributes[GTCP.CRON_EXPRESSION].toString())) {
            throw new Exception("Cron expression '${triggerAttributes[GTCP.CRON_EXPRESSION]}' in the job class ${jobName} is not a valid cron expression");
        }
    }


    public Map createEmbeddedSimpleTrigger(long startDelay, long timeout, int repeatCount) {
        return [(jobName):createTrigger('simple', [name: jobName, startDelay:startDelay, repeatInterval:timeout, repeatCount:repeatCount], null)]
    }

    public Map createEmbeddedCronTrigger(long startDelay, String cronExpression) {
        return [(jobName):createTrigger('cron', [name: jobName, startDelay:startDelay, cronExpression:cronExpression], null)] 
    }
}
