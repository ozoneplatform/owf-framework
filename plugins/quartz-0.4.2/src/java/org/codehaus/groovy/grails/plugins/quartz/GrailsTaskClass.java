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

import org.codehaus.groovy.grails.commons.InjectableGrailsClass;

import java.util.Map;

/**
 * Represents a task class in Grails. 
 * 
 * @author Micha?? K??ujszo
 * @author Graeme Rocher
 * @author Marcel Overdijk
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 * 
 * @since 0.1
 */
public interface GrailsTaskClass extends InjectableGrailsClass {
	
	/**
	 * Method which is executed by the task scheduler.
	 */
	public void execute();

	/**
	 * Get task timeout between executions.
     *
     * @return timeout between job executions (repeat interval) in milliseconds
     */
	public long getTimeout();
	
	/**
	 * Get start delay before first execution after starting scheduler.
     *
     * @return delay between job's registering and first execution in milliseconds
     */
	public long getStartDelay();

    /**
     * Get the number of times the job should repeat, after which it will be automatically deleted
     *
     * @return maximum job's executions count
     */
    public int getRepeatCount();

    /**
	 * Get cron expression used for configuring scheduler.
     *
     * @return cron expression configured for this job
     */
	public String getCronExpression();
	
	/**
	 * Get group name used for configuring scheduler.
     *
     * @return jobs group name for this job
     */
	public String getGroup();
	
	/**
	 * If cronExpression property is set returns true.
     *
     * @return true, if cron expression is configured for this job, false overwise
     */
	public boolean isCronExpressionConfigured();
	
	/**
	 * If jobs can be executed concurrently returns true.
     *
     * @return true if several instances of this job can run concurrently
     */
	public boolean isConcurrent();

	/**
	 * If task requires Hibernate Session bounded to thread returns true.
     *
     * @return true if this job require a Hibernate Session bounded to thread
     */
	public boolean isSessionRequired();

    /**
     * If task is volatile (will not be persisted between Quartz runs) returns true.
     *
     * @return true if this job is volatile
     */
    public boolean getVolatility();

    /**
     * If task is durable returns true.
     *
     * @return true if this job is durable
     */
    public boolean getDurability();

    /**
     * If task should be re-executed if a 'recovery' or 'fail-over' situation is encountered returns true.
     *
     * @return true if this job requests recovery
     */
    public boolean getRequestsRecovery();

    public Map getTriggers();
}
