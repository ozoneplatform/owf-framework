/*
    Copyright (c) 2014 Next Century Corporation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

import org.ozoneplatform.messaging.service.XmppAgent
import org.ozoneplatform.messaging.service.XmppListenerAgent
import org.ozoneplatform.messaging.service.impl.XmppConfigurationService
import org.ozoneplatform.messaging.service.impl.XmppMessageService

class OzoneMessagingGrailsPlugin {
    // the plugin version
    def version = "1.19"
    // the version or versions of Grails the plugin is designed for
    def grailsVersion = "2.3.7 > *"

    def groupId = 'org.ozoneplatform'

    // the other plugins this plugin depends on
    def dependsOn = [:]
    // resources that are excluded from plugin packaging
    def pluginExcludes = [
            "grails-app/views/error.gsp"
    ]

    def loadAfter = ['services']

    def author = "OZONE Team"
    def authorEmail = "goss-support@owfgoss.org"
    def title = "OZONE Messaging plugin"
    def description = '''\\
        Common messaging components.
    '''

    // URL to the plugin's documentation
    def documentation = ""

    def doWithWebDescriptor = { xml ->
        // TODO Implement additions to web.xml (optional), this event occurs before
    }

    def doWithSpring = {

        xmppConfigurationService(XmppConfigurationService)

        xmppAgent(XmppAgent)

        xmppListenerAgent(XmppListenerAgent)

        messageService(XmppMessageService){
            xmppAgent = ref('xmppAgent')
            xmppListenerAgent = ref ('xmppListenerAgent')
        }
    }

    def doWithDynamicMethods = { ctx ->

    }

    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)
    }

    def onChange = { event ->
        // TODO Implement code that is executed when any artefact that this plugin is
        // watching is modified and reloaded. The event contains: event.source,
        // event.application, event.manager, event.ctx, and event.plugin.
    }

    def onConfigChange = { event ->
        // TODO Implement code that is executed when the project configuration changes.
        // The event is the same as for 'onChange'.
    }
}
