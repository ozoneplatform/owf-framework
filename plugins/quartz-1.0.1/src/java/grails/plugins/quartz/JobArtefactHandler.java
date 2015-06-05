/*
 * Copyright (c) 2011 the original author or authors.
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

package grails.plugins.quartz;

import org.codehaus.groovy.grails.commons.ArtefactHandlerAdapter;
import org.quartz.JobExecutionContext;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Method;

/**
 * Grails artifact handler for job classes.
 *
 * @author Marc Palmer (marc@anyware.co.uk)
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 * @since 0.1
 */
public class JobArtefactHandler extends ArtefactHandlerAdapter {

    public static final String TYPE = "Job";

    public JobArtefactHandler() {
        super(TYPE, GrailsJobClass.class, DefaultGrailsJobClass.class, null);
    }

    public boolean isArtefactClass(Class clazz) {
        // class shouldn't be null and should ends with Job suffix
        if (clazz == null || !clazz.getName().endsWith(DefaultGrailsJobClass.JOB)) return false;
        // and should have one of execute() or execute(JobExecutionContext) methods defined
        Method method = ReflectionUtils.findMethod(clazz, GrailsJobClassConstants.EXECUTE);
        if (method == null) {
            // we're using Object as a param here to allow groovy-style 'def execute(param)' method
            method = ReflectionUtils.findMethod(clazz, GrailsJobClassConstants.EXECUTE, new Class[]{Object.class});
        }
        if (method == null) {
            // also check for the execution context as a variable because that's what's being passed
            method = ReflectionUtils.findMethod(clazz, GrailsJobClassConstants.EXECUTE, new Class[]{JobExecutionContext.class});
        }
        return method != null;
    }
}
