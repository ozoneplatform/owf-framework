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

import org.quartz.SimpleTrigger;

/**
 * <p>Holds properties names from <code>GrailsTaskClass</code></p> 
 * 
 * @see GrailsTaskClass
 * @author Micha?? K??ujszo
 * @author Graeme Rocher
 * @author Marcel Overdijk
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 * 
 * @since 0.1
 */
public interface GrailsTaskClassProperty {

	public static final String EXECUTE = "execute";
	
	public static final String START_DELAY = "startDelay";
	
	public static final String CRON_EXPRESSION = "cronExpression";

    public static final String NAME = "name";
            
	public static final String GROUP = "group";		
	
	public static final String CONCURRENT = "concurrent";
	
	public static final String SESSION_REQUIRED = "sessionRequired";

    // TODO: deprecated, remove in the next release
    public static final String TIMEOUT = "timeout";

    public static final String REPEAT_INTERVAL = "repeatInterval";

    public static final String REPEAT_COUNT = "repeatCount";

    public static final String VOLATILITY = "volatility";

    public static final String DURABILITY = "durability";

    public static final String REQUESTS_RECOVERY = "requestsRecovery";

    // Default values for Job's properties

    public static final long DEFAULT_REPEAT_INTERVAL = 60000l;	// one minute

    // TODO: deprecated, remove in the next release
    public static final long DEFAULT_TIMEOUT = DEFAULT_REPEAT_INTERVAL;	// one minute

    public static final long DEFAULT_START_DELAY = 0l;  // no delay by default

    public static final int DEFAULT_REPEAT_COUNT = SimpleTrigger.REPEAT_INDEFINITELY;

    public static final String DEFAULT_CRON_EXPRESSION = "0 0 6 * * ?";

    public static final String DEFAULT_GROUP = "GRAILS_JOBS";

    public static final boolean DEFAULT_CONCURRENT = true;

    public static final boolean	DEFAULT_SESSION_REQUIRED = true;
    
    public static final String DEFAULT_TRIGGERS_GROUP = "GRAILS_TRIGGERS";

    public static final boolean DEFAULT_VOLATILITY = true;

    public static final boolean DEFAULT_DURABILITY = true;

    public static final boolean DEFAULT_REQUESTS_RECOVERY = false;
}
