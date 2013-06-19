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

import org.springframework.scheduling.quartz.AdaptableJobFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.util.ReflectionUtils;
import org.springframework.beans.BeansException;
import org.quartz.spi.TriggerFiredBundle;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;

import java.lang.reflect.Method;

/**
 * Job factory which retrieves Job instances from ApplicationContext.
 *
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 *
 * @since 0.3.2
 */
public class GrailsJobFactory extends AdaptableJobFactory implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
        String grailsJobName = (String) bundle.getJobDetail().getJobDataMap().get(JobDetailFactoryBean.JOB_NAME_PARAMETER);
        //Object job = applicationContext.getBean(grailsJobName);
         if(grailsJobName != null) {
            Object job = applicationContext.getBean(grailsJobName);
            if(bundle.getJobDetail().getJobClass().equals(StatefulGrailsTaskClassJob.class)) {
                return new StatefulGrailsTaskClassJob(job);
            }
            return new GrailsTaskClassJob(job);
        } else {
            return super.createJobInstance(bundle);
        }
    }

    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    /**
	 * Quartz Job implementation that invokes execute() on the GrailsTaskClass instance.
	 */
	public class GrailsTaskClassJob implements Job {
      Object job;

      public GrailsTaskClassJob(Object job) {
          this.job = job;
      }

      public void execute(final JobExecutionContext context) throws JobExecutionException {
          try {
              Method method = ReflectionUtils.findMethod(job.getClass(), GrailsTaskClassProperty.EXECUTE, new Class[]{JobExecutionContext.class});
              if(method != null) {
                  ReflectionUtils.invokeMethod(method, job, (Object[]) (new JobExecutionContext[] {context}));
              } else if((method = ReflectionUtils.findMethod(job.getClass(), "execute", new Class[] {Object.class})) != null) {
                ReflectionUtils.invokeMethod(method, job, context);
              } else {
                  // falling back to execute() method
                  ReflectionUtils.invokeMethod(ReflectionUtils.findMethod(job.getClass(), "execute"), job);
              }
          }
          catch (Throwable e) {
            throw new JobExecutionException(e.getMessage(), e);
          }
  		}
	}

	/**
	 * Extension of the GrailsTaskClassJob, implementing the StatefulJob interface.
	 * Quartz checks whether or not jobs are stateful and if so,
	 * won't let jobs interfere with each other.
	 */
	public class StatefulGrailsTaskClassJob extends GrailsTaskClassJob implements StatefulJob {
		// No implementation, just an addition of the tag interface StatefulJob
		// in order to allow stateful jobs.

        public StatefulGrailsTaskClassJob(Object job) {
            super(job);
        }
    }

}
