import grails.util.GrailsUtil
import org.apache.log4j.xml.*
import org.apache.log4j.helpers.*
import org.springframework.context.ApplicationContext
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes
import grails.converters.deep.JSON as JSOND
import grails.converters.JSON
import grails.converters.deep.XML as XMLD
import grails.converters.XML
import org.apache.commons.lang.time.StopWatch
import ozone.owf.cache.OwfMessageCache
import ozone.owf.grails.web.converters.marshaller.json.ServiceModelObjectMarshaller
import ozone.owf.grails.web.converters.marshaller.xml.ServiceModelObjectMarshaller as ServiceModelObjectMarshallerXML
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Role
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.services.OwfApplicationConfigurationService
import ozone.owf.grails.services.OwfMessagingService

class BootStrap {

    def grailsApplication
    def sessionFactory
    def domainMappingService
    def dashboardService
    def personWidgetDefinitionService
    def quartzScheduler
    def appMigrationService
    def stackService

    OwfApplicationConfigurationService owfApplicationConfigurationService

    OwfMessagingService owfMessagingService

    OwfMessageCache owfMessageCache

    def init = { servletContext ->

        println 'BootStrap running!'

        //Register an alias to the configuration service. This provides a common convention for accessing
        //the service from, for example, a grails plugin
        grailsApplication.mainContext.registerAlias('owfApplicationConfigurationService', 'ozoneConfiguration')

        //configure custom marshallers
        JSON.registerObjectMarshaller(new ServiceModelObjectMarshaller())
        JSOND.registerObjectMarshaller(new ServiceModelObjectMarshaller())

        XML.registerObjectMarshaller(new ServiceModelObjectMarshallerXML())
        XMLD.registerObjectMarshaller(new ServiceModelObjectMarshallerXML())

        if (GrailsUtil.environment == 'production')
        {
            def log4jConfigure
            URL url = Loader.getResource('owf-override-log4j.xml')
            String fileName = url.toString()
            if (fileName.startsWith('file:/')) {


                File file;
                try {
                    file = new File(url.toURI());
                } catch(URISyntaxException e) {
                    file = new File(url.getPath());
                }

                //File file = new File(url.toURI())

                //if the file does not exist -- this really shouldn't happen
                //set url to null thus causing the default log4j file to be loaded
                if (!file.exists()) {
                    url = null
                }

                log4jConfigure = {
                    ApplicationContext apc = servletContext.getAttribute(GrailsApplicationAttributes.APPLICATION_CONTEXT)
                    def watchTime = grailsApplication.config.owf.log4jWatchTime;
                    println "########## Found owf-override-log4j.xml at: ${file.getAbsolutePath()} ${watchTime}"
                    DOMConfigurator.configureAndWatch(file.getAbsolutePath(),watchTime ? watchTime : 180000)
                }
            }
            else {
                url = null
            }

            if (!url) {
                url = Loader.getResource('owf-log4j.xml')
                log4jConfigure = {
                    println "########## Found owf-log4j.xml at: ${url.toString()}"
                    DOMConfigurator.configure(url)
                }
            }

            //execute closure
            if (url) {
                try {
                    log4jConfigure()
                } catch(Throwable t) {
                    println "########## Error loading log4j configuration ${t.getMessage()}"
                    t.printStackTrace()
                }
            }
        }
        switch (GrailsUtil.environment) {
            case 'test':
                loadWidgetTypes()
                break
            case ["development", "testUser1", "testAdmin1"]:
                StopWatch stopWatch = new StopWatch();
                log.info('Loading development fixture data')
                stopWatch.start();
                createNewUser()
                createSystemGroups();
                loadDevelopmentData()
                stopWatch.stop();
                log.info('Finished Loading development fixture data:'+stopWatch)
                break
            case 'production':
                log.info('Adding default newUser')
                createNewUser()
                createSystemGroups()
                break;
            default:
            //do nothing
            break
        }
        println 'Creating or updating required database configurations'
        stackService.createStackDefaultGroups()

        //TODO: all createRequired does now is initialize config dependent services - we probably should move/rename the method
        // don't want this to run in test mode since the needed configs won't be there
        // tests should create and set the configs they need
        if(grails.util.Environment.current.name != 'test') {
            owfApplicationConfigurationService.checkThatConfigsExist()
            owfApplicationConfigurationService.createRequired()
        }


        if(grailsApplication.config.notifications.enabled == true) {
            owfMessagingService.startListening()
            owfMessageCache.setExpiration(grailsApplication.config.notifications.query.interval as Integer)
        }

        println 'BootStrap finished!'
    }
    def destroy = {
    }

    private def loadDevelopmentData() {
        def enabled = grailsApplication.config?.perfTest?.enabled
        def assignToOWFUsersGroup = grailsApplication.config?.perfTest?.assignToOWFUsersGroup

        log.info('Performance Test Data Generation Enabled: ' + enabled)
        log.info('Generate test data for OWF Users Group: ' + assignToOWFUsersGroup)

        if(enabled) {
            def numWidgets = ((grailsApplication.config?.perfTest?.numWidgets) ? grailsApplication.config.perfTest?.numWidgets : 0);
            log.info 'numWidgets: ' + numWidgets

            def numWidgetsPerUser = ((grailsApplication.config?.perfTest?.numWidgetsPerUser) ? grailsApplication.config.perfTest?.numWidgetsPerUser : 0);
            log.info 'numWidgetsPerUser: ' + numWidgetsPerUser

            def numAdmins = ((grailsApplication.config?.perfTest?.numAdmins) ? grailsApplication.config.perfTest?.numAdmins: 1);
            log.info 'numAdmins: ' + numAdmins

            def numUsers = ((grailsApplication.config?.perfTest?.numUsers) ? grailsApplication.config.perfTest?.numUsers : 2);
            log.info 'numUsers: ' + numUsers

            def numGroups = ((grailsApplication.config?.perfTest?.numGroups) ? grailsApplication.config.perfTest?.numGroups : 2);
            log.info 'numGroups: ' + numGroups

            def numGroupsPerUser = ((grailsApplication.config?.perfTest?.numGroupsPerUser) ? grailsApplication.config.perfTest?.numGroupsPerUser : 2);
            log.info 'numGroupsPerUser: ' + numGroupsPerUser

            def numWidgetsInGroups = ((grailsApplication.config?.perfTest?.numWidgetsInGroups) ? grailsApplication.config.perfTest?.numWidgetsInGroups : 2);
            log.info 'numWidgetsInGroups: ' + numWidgetsInGroups

            def numDashboardsWidgets = ((grailsApplication.config?.perfTest?.numDashboardsWidgets) ? grailsApplication.config.perfTest?.numDashboardsWidgets : 0);
            log.info 'numDashboardsWidgets: ' + numDashboardsWidgets

            def numStacks = ((grailsApplication.config?.perfTest?.numStacks) ? grailsApplication.config.perfTest?.numStacks : 0);
            log.info 'numStacks: ' + numStacks

            def numStacksPerUser = ((grailsApplication.config?.perfTest?.numStacksPerUser) ? grailsApplication.config.perfTest?.numStacksPerUser : 0);
            log.info 'numStacksPerUser: ' + numStacksPerUser

            def numStackDashboards = ((grailsApplication.config?.perfTest?.numStackDashboards) ? grailsApplication.config.perfTest?.numStackDashboards : 0);
            log.info 'numStackDashboards: ' + numStackDashboards

            def numPreferences = ((grailsApplication.config?.perfTest?.numPreferences) ? grailsApplication.config.perfTest?.numPreferences : 0);
            log.info 'numPreferences: ' + numPreferences

            def createSampleWidgets = ((grailsApplication.config?.perfTest?.createSampleWidgets) ? grailsApplication.config.perfTest?.createSampleWidgets : false);
            log.info 'createSampleWidgets: ' + createSampleWidgets

            def sampleWidgetBaseUrl = ((grailsApplication.config?.perfTest?.sampleWidgetBaseUrl) ? grailsApplication.config.perfTest?.sampleWidgetBaseUrl : 'https://127.0.0.1:8443/');
            log.info 'sampleWidgetBaseUrl: ' + sampleWidgetBaseUrl

            def people = []

            loadWidgetTypes()
            loadWidgetDefinitions(numWidgets, assignToOWFUsersGroup)

            loadGroups(numGroups)
            loadStacks(numStacks, assignToOWFUsersGroup)
            loadStackDashboards(numStackDashboards, numDashboardsWidgets)
            people << loadAdmins(numAdmins, assignToOWFUsersGroup)
            people << loadPersons(numUsers, assignToOWFUsersGroup)

            !assignToOWFUsersGroup && assignWidgetsToGroups(numGroups, numWidgetsInGroups)
            flushAndClearCache()

            assignGroupsToPersons(numGroups, numGroupsPerUser)
            assignStacksToPersons(numStacks, numStacksPerUser)

            loadPersonWidgetDefinitions(numWidgetsPerUser, assignToOWFUsersGroup)
            // loadPreferences(numPreferences)

            //create sample widgetdefs
            if (grailsApplication.config?.perfTest?.createSampleWidgets) {
                loadAndAssignSampleWidgetDefinitions(sampleWidgetBaseUrl, 10)
            }

            if(!assignToOWFUsersGroup) {
                def counter = 0
                people.flatten().each {
                    dashboardService.sync(it)
                    personWidgetDefinitionService.sync(it)
                    counter++;
                    if(counter % 10 == 0) {
                        flushAndClearCache();
                    }
                }
            }
        }
    }

    private def saveInstance(instance, boolean flush = false) {
        if (instance.save(flush:flush) == null) {
            log.info "ERROR: ${instance} not saved - ${instance.errors}"
        } else {
            log.debug "${instance.class}:${instance} saved"
        }
        return instance
    }

    private def flushAndClearCache() {
        sessionFactory.currentSession.flush()
        sessionFactory.currentSession.clear()
    }

    private loadWidgetTypes() {
        println "---- loadWidgetTypes() ----"
        WidgetType.withTransaction {
            if(!WidgetType.findByName('standard')) saveInstance(new WidgetType(name: 'standard', displayName: 'standard'))
            if(!WidgetType.findByName('administration')) saveInstance(new WidgetType(name: 'administration', displayName: 'administration'))
            if(!WidgetType.findByName('metrics')) saveInstance(new WidgetType(name: 'metrics', displayName: 'metrics'))
            if(!WidgetType.findByName('marketplace')) saveInstance(new WidgetType(name: 'marketplace', displayName: 'store'))
        }

        flushAndClearCache()
    }

    private loadWidgetDefinitions(int numWidgets = 0, boolean assignToOWFUsersGroup = false) {
        println "---- loadWidgetDefinitions() ----"
        def standard = WidgetType.findByName('standard'),
            existingWidgetCount = WidgetDefinition.findAllByDisplayNameLike('Test Widget%').size()

        println('widgets already in system: ' + existingWidgetCount)
        def owfUsersGroup = loadOWFUsersGroup()

        for (int i = existingWidgetCount + 1; i <= numWidgets; i++) {
            def widgetDefinition = saveInstance(new WidgetDefinition(
                displayName: 'Test Widget '+i,
                height: 440,
                imageUrlMedium: 'themes/common/images/widget-icons/HTMLViewer.png',
                imageUrlSmall: 'themes/common/images/widget-icons/HTMLViewer.png',
                widgetGuid: generateId(),
                widgetUrl: 'examples/walkthrough/widgets/HTMLViewer.gsp',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 540
            ))
            assignToOWFUsersGroup && domainMappingService.createMapping(owfUsersGroup, RelationshipType.owns, widgetDefinition)
        }

        flushAndClearCache()
    }

    private loadGroups(int numGroups) {
        println "---- loadGroups() ----"
        def existingGroupsCount = Group.findAllByNameLike('TestGroup%').size()
        println('groups already in system: ' + existingGroupsCount)
        for (int i = existingGroupsCount + 1; i <= numGroups; i++) {
            //create group
            saveInstance(new Group(
                name: 'TestGroup' + i,
                description: 'TestGroup' + i,
                email: "testgroup${i}@group${i}.com",
                automatic: false,
                displayName: 'TestGroup' + i
            ))
        }

        flushAndClearCache()
    }

    private loadStacks(int numStacks, boolean assignToOWFUsersGroup = false) {
        println "---- loadStacks() ----"
        Group allUsersGroup

        def existingStacksCount = Stack.findAllByNameLike('TestStack%').size()

        if(assignToOWFUsersGroup) {
            allUsersGroup = loadOWFUsersGroup();
        }

        println('stacks already in system: ' + existingStacksCount)
        for (int i = existingStacksCount + 1; i <= numStacks; i++) {

            //create the stack default group
            def stackDefaultGroup = new Group(
                name: 'TestStack' + i + '-DefaultGroup',
                displayName: 'TestStack' + i + '-DefaultGroup',
                stackDefault: true
            );

            saveInstance(stackDefaultGroup, true)

            //create stack
            def stack = new Stack(
                name: 'TestStack' + i,
                description: 'TestStack' + i,
                stackContext: 'TestStack' + i,
                defaultGroup: stackDefaultGroup
            );

            saveInstance(stack, true)

            if(allUsersGroup) {
                stack.addToGroups(allUsersGroup)
            }

            saveInstance(stack, true)
        }

        flushAndClearCache()
    }

    private loadStackDashboards(int numStackDashboards, int numDashboardsWidgets) {
        println "---- loadStackDashboards() ----"
        def stacks = Stack.findAllByNameLike('TestStack%')
        stacks.each { stack ->
            log.debug 'generating stack dashboards for stack:' + stack
            assignDashboardsToStackGroup(stack, numStackDashboards, numDashboardsWidgets)
        }

        flushAndClearCache()
    }

    private loadAdmins(int numAdmins, boolean assignToOWFUsersGroup = false) {
        println "---- loadAdmins() ----"
        def date = new Date(),
            admins = [],
            existingAdminsCount = Person.findAllByUsernameLike('testAdmin%').size()
        println('Admins already in system: ' + existingAdminsCount)
        for (int i = existingAdminsCount + 1; i <= numAdmins; i++) {
            def admin = new Person(
                description: 'Test Administrator '+i,
                email: 'testAdmin'+i+'@ozone3.test',
                emailShow: false,
                enabled: true,
                userRealName: 'Test Admin '+i,
                username: "testAdmin"+i,
                lastLogin: date,
                requiresSync: assignToOWFUsersGroup
            )
            saveInstance(admin)
            admins << admin
        }

        flushAndClearCache()

        admins
    }

    private loadPersons(int numPersons, boolean assignToOWFUsersGroup = false) {
        println "---- loadPersons() ----"
        def date = new Date(),
            people = [],
            existingUsersCount = Person.findAllByUsernameLike('testUser%').size()
        println('Users already in system: ' + existingUsersCount)
        for (int i = existingUsersCount + 1; i <= numPersons; i++) {
            def person = new Person(
                description: 'Test User '+i,
                email: 'testUser'+i+'@ozone3.test',
                emailShow: false,
                enabled: true,
                userRealName: 'Test User '+i,
                username: 'testUser'+i,
                lastLogin: date,
                requiresSync: assignToOWFUsersGroup
            )
            saveInstance(person)
            people << person
        }

        flushAndClearCache()

        people
    }

    private assignWidgetsToGroup(group, numWidgetsInGroups) {
        println "---- assignWidgetsToGroup() -----------------------"
        def widgets = WidgetDefinition.withCriteria {
            like("displayName", "Test Widget%")
            maxResults(numWidgetsInGroups)
        }
        widgets.each { widget ->
            domainMappingService.createMapping(group, RelationshipType.owns, widget)
        }
    }

    private assignWidgetsToGroups(int numGroups, int numWidgetsInGroups) {
        println "---- assignWidgetsToGroups() ----"
        for (int i = 1; i <= numGroups; i++) {
            def group = Group.findByName('TestGroup' + i)
            assignWidgetsToGroup(group, numWidgetsInGroups)
        }
    }

    private assignGroupsToPersons(int numGroups, int numGroupsPerUser) {
        println "---- assignGroupsToPersons() ----"
        def random = new Random(),
            persons = Person.list(),
            groups = Group.withCriteria {
                and {
                    eq("stackDefault", false)
                    like("name", "TestGroup%")
                }
            },
            randomOffset,
            offsetMax = numGroups - numGroupsPerUser

        persons.each { person ->
            try {
                randomOffset = random.nextInt(offsetMax)
            }
            catch(e) {
                randomOffset = 0
            }
            for(int i = randomOffset; i < randomOffset + numGroupsPerUser; i++) {
                groups[i].people << person
                saveInstance(groups[i])
            }
        }

        flushAndClearCache()
    }

    private assignStacksToPersons(int numStacks, int numStacksPerUser) {
        println "---- assignStacksToPersons() ----"
        def random = new Random(),
            persons = Person.list(),
            stackGroups = Group.withCriteria {
                and {
                    eq("stackDefault", true)
                }
            },
            randomOffset,
            offsetMax = numStacks - numStacksPerUser

        persons.each { person ->
            try {
                randomOffset = random.nextInt(offsetMax)
            }
            catch(e) {
                randomOffset = 0
            }
            for(int i = randomOffset; i < randomOffset + numStacksPerUser; i++) {
                stackGroups[i].people << person
                saveInstance(stackGroups[i])
            }
        }

        flushAndClearCache()
    }

    private loadPersonWidgetDefinitions(int numWidgetsPerUser, boolean assignToOWFUsersGroup = false) {
        println "---- loadPersonWidgetDefinitions() ----"
        if(numWidgetsPerUser <= 0 || assignToOWFUsersGroup)
            return
        // give every person access to standard widget
        def people = Person.findAll()

        // give every person access to extra widgets
        def widgetDefinitions = WidgetDefinition.withCriteria {
            like('displayName','Test Widget %')
        }
        def rand = new Random(),
            maxOffset = widgetDefinitions.size() - numWidgetsPerUser,
            randomNum

        maxOffset = maxOffset <= 0 ? 1 : maxOffset
        people.each { person ->
            randomNum = rand.nextInt(maxOffset)

            for(int i in randomNum..<(numWidgetsPerUser + randomNum)){
                saveInstance(new PersonWidgetDefinition(person: person,
                    widgetDefinition: widgetDefinitions[i],
                    visible : true,
                    pwdPosition: i
                ))
            }
        }

        flushAndClearCache()
    }

    private loadPreferences(int numPreferences) {
        println "---- loadPreferences() ----"
        if (numPreferences <= 0)
            return

        def persons = Person.list()
        persons.each { person ->
            for (int i = 0; i < numPreferences; i++) {
                saveInstance(new Preference(
                    namespace: 'foo.bar.'+i,
                    path: 'test path entry '+i,
                    user: person,
                    value: 'foovalue'
                ))
            }
        }

        flushAndClearCache()
    }

    private createNewUser() {
        Person.withTransaction {
            def user = Person.findByUsername(Person.NEW_USER)
            def role = Role.findByAuthority(ERoleAuthority.ROLE_USER.strVal)
            if (user == null) {
                //Create
                user =  new Person(
                    username     : Person.NEW_USER,
                    userRealName : Person.NEW_USER,
                    lastLogin    : new Date(),
                    email        : '',
                    emailShow    : false,
                    description  : '',
                    enabled      : true,
                    authorities  : [role] as Set
                )
                saveInstance(user)
            }
        }

        flushAndClearCache()
    }

    private loadAndAssignSampleWidgetDefinitions(baseUrl) {

        def id = null
        def widgetDefs = []
        def standard = WidgetType.findByName('standard')

        //owf-sample-html
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_DynamicLauncher',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_DynamicLauncher.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Eventing',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Eventing.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Launcher',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Launcher.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Localization',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Localization.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Logging',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Logging.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Preference',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Preference.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Second Tracker',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/tracker.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/trackersm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/SecondTracker.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))

        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'SecondTracker_Launched',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-html/images/tracker.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/trackersm.gif',
                widgetGuid: 'b93e73a4-4819-475f-82fd-9c31954e09bf',
                widgetUrl: baseUrl + 'owf-sample-html/clock/SecondTracker_Launched.html',
                widgetVersion: '1.0',
                visible: false,
                widgetTypes: [standard],
                width: 300
            ))
        //owf-sample-html

        //owf-sample-flex
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Pan',
                height: 500,
                imageUrlMedium: baseUrl + 'owf-sample-flex/images/pansm.gif',
                imageUrlSmall: baseUrl + 'owf-sample-flex/images/pan.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-flex/pan.html',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 600
            ))

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Direct',
                height: 300,
                imageUrlMedium: baseUrl + 'owf-sample-flex/images/direct.gif',
                imageUrlSmall: baseUrl + 'owf-sample-flex/images/directsm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-flex/direct.html',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 300
            ))
        //owf-sample-flex

        //owf-sample-applet
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'MyChess Viewer',
                height: 654,
                imageUrlMedium: baseUrl + 'owf-sample-applet/images/chess.gif',
                imageUrlSmall: baseUrl + 'owf-sample-applet/images/white-queen.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-applet/widget.jsp',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 660
            ))

        def people = Person.findAll()
        def widgetDefinitions = widgetDefs
        people.each { person ->
            def wdSize = widgetDefinitions.size()
            for (int idx in 0..<wdSize) {
                def widgetDefinition = widgetDefinitions[idx]
                def pwd = new PersonWidgetDefinition(person: person,
                    widgetDefinition: widgetDefinition,
                    visible: true,
                    pwdPosition: idx)
                saveInstance(pwd)
            }

        }

        flushAndClearCache()
    }

    private Group loadOWFUsersGroup() {
        def groups = Group.findAllByNameAndAutomatic('OWF Users', true)
        return groups[0]
    }

    /**
     * Creates the OWF Users and OWF Administrators group if they do not already exist.
     */
    private createSystemGroups() {
        Group.withTransaction {
            // Create OWF Administrators group if it doesn't already exist
            def adminGroup = Group.findByNameAndAutomatic('OWF Administrators', true, [cache:true])
            if (adminGroup == null) {
                // add it
                adminGroup = new Group(
                        name: 'OWF Administrators',
                        description: 'OWF Administrators',
                        automatic: true,
                        status: 'active',
                        displayName: 'OWF Administrators'
                )

                adminGroup = saveInstance(adminGroup)
            }

            def allUsers = Group.findByNameAndAutomatic('OWF Users', true, [cache:true])
            // Create the OWF Users group if it doesn't exist.
            if (allUsers == null) {
                // add it
                allUsers = new Group(
                        name: 'OWF Users',
                        description: 'OWF Users',
                        automatic: true,
                        status: 'active',
                        displayName: 'OWF Users'
                )

                allUsers = saveInstance(allUsers)
            }
        }
    }

    private assignDashboardsToStackGroup(Stack stack, int numDashboards, int numDashboardsWidgets) {
        def allWidgets = WidgetDefinition.list()

        Group group =  stack.defaultGroup

        for (int i = 1; i <= numDashboards; i++) {
            def dashboardGuid = generateId()
            def paneGuid = generateId()

            def dashboard = new Dashboard(
                name: 'Stack Dashboard ' + i + ' (' + group.name + ')',
                isdefault: true,
                stack: stack,
                guid: dashboardGuid,
                dashboardPosition: 0,
                alteredByAdmin: false,
                publishedToStore: true,
                layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}'
            )
            def rand = new Random()
            def randomWidget

            //Create JSON string of widgets
            def widgets = '[{'
            for (int j = 0; j < numDashboardsWidgets; j++) {
                if(j != 0) {
                    widgets += ',{'
                }

                def xyPos = 300 + (j * 5)

                //Add a random group widget to the dashboard
                randomWidget = allWidgets[rand.nextInt(allWidgets.size())]

                domainMappingService.createMapping(group, RelationshipType.owns, randomWidget)

                widgets += '"widgetGuid":"' + randomWidget.widgetGuid + '","x":' + xyPos + ',"y":' + xyPos +
                    ',"uniqueId":"' + generateId() + '","name":"' + randomWidget.displayName + '","paneGuid":"' +
                    paneGuid + '","height":250,"width":250,"dashboardGuid":"' + dashboardGuid + '"}'
            }
            widgets += ']'

            def layoutConfig = JSON.parse(dashboard.layoutConfig)
            layoutConfig.widgets = JSON.parse(widgets)
            dashboard.layoutConfig = layoutConfig

            //save and map group dashboard
            saveInstance(dashboard)
            domainMappingService.createMapping(group, RelationshipType.owns, dashboard)

            sessionFactory.currentSession.clear()
        }
    }

    private generateId() {
        return java.util.UUID.randomUUID().toString()
    }
}
