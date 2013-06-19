/*
* Copyright 2006-2008 the original author or authors.
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

import org.codehaus.groovy.grails.commons.ArtefactHandlerAdapter;
import org.springframework.util.ReflectionUtils;
import org.quartz.JobExecutionContext;

import java.lang.reflect.Method;

/**
 * Grails artefact handler for task classes.
 *
 * @author Marc Palmer (marc@anyware.co.uk)
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 * 
 * @since 0.1
 */
public class TaskArtefactHandler extends ArtefactHandlerAdapter {

    public static final String TYPE = "Task";

    public TaskArtefactHandler() {
        super(TYPE, GrailsTaskClass.class, DefaultGrailsTaskClass.class, null);
    }

    public boolean isArtefactClass(Class clazz) {
        // class shouldn't be null and shoud ends with Job suffix
        if(clazz == null || !clazz.getName().endsWith(DefaultGrailsTaskClass.JOB)) return false;
        // and should have one of execute() or execute(JobExecutionContext) methods defined
        Method method = ReflectionUtils.findMethod(clazz, GrailsTaskClassProperty.EXECUTE);
        if(method == null) {
            // we're using Object as a param here to allow groovy-style 'def execute(param)' method
            method = ReflectionUtils.findMethod(clazz, GrailsTaskClassProperty.EXECUTE, new Class[]{Object.class});
        }
        if(method == null) {
          // also check for the execution context as a variable because that's what's being passed
          method = ReflectionUtils.findMethod(clazz, GrailsTaskClassProperty.EXECUTE, new Class[]{JobExecutionContext.class});
        }
        return method != null;
    }
}
