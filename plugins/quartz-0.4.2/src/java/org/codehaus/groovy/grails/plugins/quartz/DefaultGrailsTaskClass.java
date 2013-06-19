/* Copyright 2006-2008 the original author or authors.
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
package org.codehaus.groovy.grails.plugins.quartz;

import groovy.lang.Closure;
import org.codehaus.groovy.grails.commons.AbstractInjectableGrailsClass;
import org.codehaus.groovy.grails.commons.GrailsClassUtils;
import org.codehaus.groovy.grails.plugins.quartz.config.TriggersConfigBuilder;
import org.quartz.CronExpression;
import org.quartz.JobExecutionContext;

import java.util.HashMap;
import java.util.Map;

import grails.util.GrailsUtil;

/**
 * Grails artefact class which represents a Quartz job.
 *
 * @author Micha?? K??ujszo
 * @author Marcel Overdijk
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 * @since 0.1
 */
public class DefaultGrailsTaskClass extends AbstractInjectableGrailsClass implements GrailsTaskClass, GrailsTaskClassProperty {

    public static final String JOB = "Job";
    private Map triggers = new HashMap();


    public DefaultGrailsTaskClass(Class clazz) {
        super(clazz, JOB);
        evaluateTriggers();
    }

    private void evaluateTriggers() {
        // registering additional triggersClosure from 'triggersClosure' closure if present
        Closure triggersClosure = (Closure) GrailsClassUtils.getStaticPropertyValue(getClazz(), "triggers");

        TriggersConfigBuilder builder = new TriggersConfigBuilder(getFullName());

        if (triggersClosure != null) {
            builder.build(triggersClosure);
            triggers = (Map) builder.getTriggers();
        } else {
            // backward compatibility
            if (isCronExpressionConfigured()) {
                GrailsUtil.deprecated("You're using deprecated 'def cronExpression = ...' parameter in the " + getFullName() + ", use 'static triggers = { cron cronExpression: ...} instead.");
                triggers = builder.createEmbeddedCronTrigger(getStartDelay(), getCronExpression());
            } else {
                GrailsUtil.deprecated("You're using deprecated 'def startDelay = ...; def timeout = ...' parameters in the" + getFullName() + ", use 'static triggers = { simple startDelay: ..., repeatInterval: ...} instead.");
                triggers = builder.createEmbeddedSimpleTrigger(getStartDelay(), getTimeout(), getRepeatCount());
            }
        }
    }

    public void execute() {
        getMetaClass().invokeMethod(getReferenceInstance(), EXECUTE, new Object[]{});
    }

    public void execute(JobExecutionContext context) {
        getMetaClass().invokeMethod(getReferenceInstance(), EXECUTE, new Object[]{context});
    }

    // TODO: ============== start of deprecated methods =================
    public long getTimeout() {
        Object obj = getPropertyValue(TIMEOUT);
        if (obj == null) return DEFAULT_TIMEOUT;
        return ((Number) obj).longValue();
    }

    public long getStartDelay() {
        Object obj = getPropertyValue(START_DELAY);
        if (obj == null) return DEFAULT_START_DELAY;
        return ((Number) obj).longValue();
    }

    public int getRepeatCount() {
        Object obj = getPropertyValue(REPEAT_COUNT);
        if (obj == null) return DEFAULT_REPEAT_COUNT;
        return ((Number) obj).intValue();
    }

    public String getCronExpression() {
        String cronExpression = (String) getPropertyOrStaticPropertyOrFieldValue(CRON_EXPRESSION, String.class);
        if (cronExpression == null || "".equals(cronExpression)) return DEFAULT_CRON_EXPRESSION;
        return cronExpression;
    }

    public String getGroup() {
        String group = (String) getPropertyOrStaticPropertyOrFieldValue(GROUP, String.class);
        if (group == null || "".equals(group)) return DEFAULT_GROUP;
        return group;
    }

    // not certain about this... feels messy
    public boolean isCronExpressionConfigured() {
        String cronExpression = (String) getPropertyOrStaticPropertyOrFieldValue(CRON_EXPRESSION, String.class);
        return cronExpression != null;
    }
    // TODO: ============== end of deprecated methods =================

    public boolean isConcurrent() {
        Boolean concurrent = (Boolean) getPropertyValue(CONCURRENT, Boolean.class);
        return concurrent == null ? DEFAULT_CONCURRENT : concurrent;
    }

    public boolean isSessionRequired() {
        Boolean sessionRequired = (Boolean) getPropertyValue(SESSION_REQUIRED, Boolean.class);
        return sessionRequired == null ? DEFAULT_SESSION_REQUIRED : sessionRequired;
    }

    public boolean getVolatility() {
        Boolean volatility = (Boolean) getPropertyValue(VOLATILITY, Boolean.class);
        return volatility == null ? DEFAULT_VOLATILITY : volatility;
    }

    public boolean getDurability() {
        Boolean durability = (Boolean) getPropertyValue(DURABILITY, Boolean.class);
        return durability == null ? DEFAULT_DURABILITY : durability;
    }

    public boolean getRequestsRecovery() {
        Boolean requestsRecovery = (Boolean) getPropertyValue(REQUESTS_RECOVERY, Boolean.class);
        return requestsRecovery == null ? DEFAULT_REQUESTS_RECOVERY : requestsRecovery;
    }

    public Map getTriggers() {
        return triggers;
    }
}
