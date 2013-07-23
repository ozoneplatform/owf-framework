import grails.util.GrailsUtil
import org.apache.log4j.helpers.*
import java.net.URL
import java.util.Random
import org.apache.log4j.xml.*
import org.apache.log4j.helpers.*
import org.springframework.context.ApplicationContext
import org.codehaus.groovy.grails.web.servlet.GrailsApplicationAttributes
import grails.converters.deep.JSON as JSOND
import grails.converters.JSON
import grails.converters.deep.XML as XMLD
import grails.converters.XML
import org.apache.commons.lang.time.StopWatch
import ozone.owf.grails.domain.Requestmap
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
import org.springframework.beans.factory.annotation.Autowired

class BootStrap {
    
    def grailsApplication
    def sessionFactory
    def domainMappingService
    def dashboardService
    def quartzScheduler
    def appMigrationService
	
    OwfApplicationConfigurationService owfApplicationConfigurationService
	
    def init = {servletContext ->

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
		owfApplicationConfigurationService.createRequired()

        println 'BootStrap finished!'
    }
    def destroy = {
    }

    private def loadDevelopmentData() {
        def enabled = grailsApplication.config?.perfTest?.enabled
        def assignToOWFUsersGroup = grailsApplication.config?.perfTest?.assignToOWFUsersGroup

        log.info('Performance Test Data Generation Enabled: ' + enabled)
        log.info('Generate test data for OWF Users Group: ' + assignToOWFUsersGroup)
      
        if (enabled) {  
        
            def numWidgets = ((grailsApplication.config?.perfTest?.numWidgets && enabled) ? grailsApplication.config.perfTest?.numWidgets : 0);
            log.info 'numWidgets: ' + numWidgets

            def numWidgetsPerUser = ((grailsApplication.config?.perfTest?.numWidgetsPerUser && enabled) ? grailsApplication.config.perfTest?.numWidgetsPerUser : 0);
            log.info 'numWidgetsPerUser: ' + numWidgetsPerUser

            def numAdmins = ((grailsApplication.config?.perfTest?.numAdmins && enabled) ? grailsApplication.config.perfTest?.numAdmins: 1);
            log.info 'admins: ' + numAdmins
        
            def numUsers = ((grailsApplication.config?.perfTest?.numUsers && enabled) ? grailsApplication.config.perfTest?.numUsers : 2);
            log.info 'users: ' + numUsers

            def numGroups = ((grailsApplication.config?.perfTest?.numGroups && enabled) ? grailsApplication.config.perfTest?.numGroups : 2);
            log.info 'groups: ' + numGroups

            def numGroupsPerUser = ((grailsApplication.config?.perfTest?.numGroupsPerUser && enabled) ? grailsApplication.config.perfTest?.numGroupsPerUser : 2);
            log.info 'number of groups per user: ' + numGroupsPerUser

            def numWidgetsInGroups = ((grailsApplication.config?.perfTest?.numWidgetsInGroups && enabled) ? grailsApplication.config.perfTest?.numWidgetsInGroups : 2);
            log.info 'number of widgets in groups: ' + numWidgetsInGroups

            def numDashboards = ((grailsApplication.config?.perfTest?.numDashboards && enabled) ? grailsApplication.config.perfTest?.numDashboards : 0);
            log.info 'numDashboards: ' + numDashboards
        
            def numGroupDashboards = ((grailsApplication.config?.perfTest?.numGroupDashboards && enabled) ? grailsApplication.config.perfTest?.numGroupDashboards : 0);
            log.info 'numGroupDashboards: ' + numGroupDashboards

            def numDashboardsWidgets = ((grailsApplication.config?.perfTest?.numDashboardsWidgets && enabled) ? grailsApplication.config.perfTest?.numDashboardsWidgets : 0);
            log.info 'numDashboardsWidgets: ' + numDashboardsWidgets

            def numStacks = ((grailsApplication.config?.perfTest?.numStacks && enabled) ? grailsApplication.config.perfTest?.numStacks : 0);
            log.info 'numStacks: ' + numStacks

            def numStacksPerUser = ((grailsApplication.config?.perfTest?.numStacksPerUser && enabled) ? grailsApplication.config.perfTest?.numStacksPerUser : 0);
            log.info 'numStacksPerUser: ' + numStacksPerUser
        
            def numStackDashboards = ((grailsApplication.config?.perfTest?.numStackDashboards && enabled) ? grailsApplication.config.perfTest?.numStackDashboards : 0);
            log.info 'numStackDashboards: ' + numStackDashboards

            def numPreferences = ((grailsApplication.config?.perfTest?.numPreferences && enabled) ? grailsApplication.config.perfTest?.numPreferences : 2);
            log.info 'preferences: ' + numPreferences

            def clearCacheEvery = ((grailsApplication.config?.perfTest?.clearCacheEvery && enabled) ? grailsApplication.config.perfTest?.clearCacheEvery : 10);
            log.info 'clearCacheEvery: ' + clearCacheEvery

            def createSampleWidgets = ((grailsApplication.config?.perfTest?.createSampleWidgets) ? grailsApplication.config.perfTest?.createSampleWidgets : false);
            log.info 'createSampleWidgets: ' + createSampleWidgets

            def sampleWidgetBaseUrl = ((grailsApplication.config?.perfTest?.sampleWidgetBaseUrl) ? grailsApplication.config.perfTest?.sampleWidgetBaseUrl : 'https://127.0.0.1:8443/');
            log.info 'sampleWidgetBaseUrl: ' + sampleWidgetBaseUrl
            
            loadWidgetTypes()
            sessionFactory.currentSession.clear()
                
            loadWidgetDefinitions(numWidgets, clearCacheEvery)
            sessionFactory.currentSession.clear()

            loadAdmins(numAdmins, numGroupsPerUser, numStacksPerUser, clearCacheEvery)
            sessionFactory.currentSession.clear()
        
            loadPersons(numUsers, numGroupsPerUser, numStacksPerUser, clearCacheEvery)
            sessionFactory.currentSession.clear()

            if(assignToOWFUsersGroup) {
                assignWidgetsToGroup(loadOWFUsersGroup(), numWidgetsInGroups)

                assignDashboardsToGroup(loadOWFUsersGroup(), '', numGroupDashboards, numDashboardsWidgets, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadStacks(numStacks, true, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadStackDashboards(numStackDashboards, numDashboardsWidgets, clearCacheEvery)
                sessionFactory.currentSession.clear()
            }
            else {
                loadGroups(numGroups, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadStacks(numStacks, clearCacheEvery)
                sessionFactory.currentSession.clear()

                assignWidgetsToGroups(numGroups, numWidgetsInGroups, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadRoles()
                sessionFactory.currentSession.clear()

                //create default user
                createNewUser()
                sessionFactory.currentSession.clear()

                assignPeopleToRoles()
                sessionFactory.currentSession.clear()

                loadPersonWidgetDefinitions(numWidgetsPerUser, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadDashboards(numDashboards, numDashboardsWidgets, clearCacheEvery)
                sessionFactory.currentSession.clear()

                loadStackDashboards(numStackDashboards, numDashboardsWidgets, clearCacheEvery)
                sessionFactory.currentSession.clear()
            
                loadGroupDashboards(numGroupDashboards, numDashboardsWidgets, clearCacheEvery)
                sessionFactory.currentSession.clear()
            
                loadRequestmaps()
                sessionFactory.currentSession.clear()

                loadPreferences(numPreferences, clearCacheEvery)
                sessionFactory.currentSession.clear()

                //create sample widgetdefs
                if (grailsApplication.config?.perfTest?.createSampleWidgets) {
                    loadAndAssignSampleWidgetDefinitions(sampleWidgetBaseUrl, 10)
                    sessionFactory.currentSession.clear()
                }

                /*Person.list().each {
                    log.info "Calling listDashboards for user ${it}"
                    dashboardService.listDashboards([ user_id: it.id ])
                }
                sessionFactory.currentSession.clear()*/
            }

        }
    }

    private def saveInstance(instance, boolean flush = true) {
        if (instance.save(flush:flush) == null) {
            log.info "ERROR: ${instance} not saved - ${instance.errors}"
        } else {
            log.debug "${instance.class}:${instance} saved"
        }
        return instance
    }

    private loadWidgetDefinitions(int numWidgets = 0, boolean assignToOWFUsersGroup = false, int clearCacheEvery) {
        def standard = WidgetType.findByName('standard')

        sessionFactory.currentSession.clear()
        //generate extra dummy widgets
        for (int i = 0 ; i < numWidgets ; i++) {
            def id = generateId()
            saveInstance(new WidgetDefinition(
                    displayName: 'Test Widget '+i,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/widget-icons/HTMLViewer.png',
                    imageUrlSmall: 'themes/common/images/widget-icons/HTMLViewer.png',
                    widgetGuid: id,
                    widgetUrl: 'examples/walkthrough/widgets/HTMLViewer.gsp',
                    widgetVersion: '1.0',
                    widgetTypes: [standard],
                    width: 540
                ))
            //periodically clear 1 level cache
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private loadAndAssignSampleWidgetDefinitions(baseUrl,int clearCacheEvery = 10) {

        def id = null
        def widgetDefs = []
        def standard = WidgetType.findByName('standard')

        //owf-sample-html
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_DynamicLauncher',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_DynamicLauncher.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Eventing',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Eventing.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Launcher',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Launcher.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Localization',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Localization.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Logging',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Logging.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'AnnouncingClock_Preference',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/clock.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/clocksm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/AnnouncingClock_Preference.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Second Tracker',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/tracker.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/trackersm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-html/clock/SecondTracker.html',
                widgetVersion: '1.0',
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')

        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'SecondTracker_Launched',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-html/images/tracker.gif',
                imageUrlSmall: baseUrl + 'owf-sample-html/images/trackersm.gif',
                widgetGuid: 'b93e73a4-4819-475f-82fd-9c31954e09bf',
                widgetUrl: baseUrl + 'owf-sample-html/clock/SecondTracker_Launched.html',
                widgetVersion: '1.0',
                visible: false,
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('clock')
        //owf-sample-html

        //owf-sample-flex
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Pan',
                height: 500,
                imageUrlLarge: baseUrl + 'owf-sample-flex/images/pansm.gif',
                imageUrlSmall: baseUrl + 'owf-sample-flex/images/pan.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-flex/pan.html',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 600
            ))
        widgetDefs.last().addTag('flex')

        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'Direct',
                height: 300,
                imageUrlLarge: baseUrl + 'owf-sample-flex/images/direct.gif',
                imageUrlSmall: baseUrl + 'owf-sample-flex/images/directsm.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-flex/direct.html',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 300
            ))
        widgetDefs.last().addTag('flex')
        //owf-sample-flex

        //owf-sample-applet
        id = generateId()
        widgetDefs << saveInstance(new WidgetDefinition(
                displayName: 'MyChess Viewer',
                height: 654,
                imageUrlLarge: baseUrl + 'owf-sample-applet/images/chess.gif',
                imageUrlSmall: baseUrl + 'owf-sample-applet/images/white-queen.gif',
                widgetGuid: id,
                widgetUrl: baseUrl + 'owf-sample-applet/widget.jsp',
                widgetVersion: '1.0',
                visible: true,
                widgetTypes: [standard],
                width: 660
            ))
        widgetDefs.last().addTag('applet')

        def people = Person.findAll()
        def widgetDefinitions = widgetDefs
        people.each { person ->
            def wdSize = widgetDefinitions.size()
            for (int idx in 0..<wdSize) {
                def widgetDefinition = widgetDefinitions[idx]
                def tagLinks = widgetDefinition.getTags()
                def pwd = new PersonWidgetDefinition(person: person,
                    widgetDefinition: widgetDefinition,
                    visible: true,
                    pwdPosition: idx)
                saveInstance(pwd)
                def tags = tagLinks?.collect {
                    [
                        name: it.tag.name,
                        visible: true,
                        position: -1,
                        editable: true
                    ]
                }
                if (tags) {
                    pwd.setTags(tags)
                }
                saveInstance(pwd)
                if ((idx % clearCacheEvery) == 0) {
                    sessionFactory.currentSession.clear()
                }
            }

        }
    }

    private loadRoles() {
        saveInstance(new Role(authority: ERoleAuthority.ROLE_USER.strVal, description: "User Role"))
        saveInstance(new Role(authority: ERoleAuthority.ROLE_ADMIN.strVal, description: "Admin Role"))
    }

    private loadOWFUsersGroup() {
        def groups = Group.findAllByNameAndAutomatic('OWF Users', true)
        if(groups.size() == 0) {
            def allUsers = new Group(
                name: 'OWF Users',
                description: 'OWF Users',
                automatic: true,
                status: 'active',
                displayName: 'OWF Users'
            )
            return saveInstance(allUsers)
        }
        return groups[0]
    }

    private loadOWFAdminGroup() {
        Group.findAllByNameAndAutomatic('OWF Administrators', true)
    }
  
    private loadWidgetTypes() {
        saveInstance(new WidgetType(name: 'standard'))
        saveInstance(new WidgetType(name: 'administration'))
        saveInstance(new WidgetType(name: 'metrics'))
        saveInstance(new WidgetType(name: 'marketplace'))
    }
  
    private loadAdmins(int numAdmins, int numGroups, int numStacks, int clearCacheEvery) {
        for (int i = 1; i <= numAdmins; i++) {
            def admin = new Person(
                description: 'Test Administrator '+i,
                email: 'testAdmin'+i+'@ozone3.test',
                emailShow: false,
                enabled: true,
                //            passwd: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
                userRealName: 'Test Admin '+i,
                username: "testAdmin"+i,
                lastLogin: new Date()
            )
            assignGroupsToUser(admin, numGroups)
            assignStacksToUser(admin, numStacks)
            saveInstance(admin)
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private loadPersons(int numPersons, int numGroups, int numStacks, int clearCacheEvery) {
        for (int i = 1; i <= numPersons; i++) {
            def person = saveInstance(new Person(
                    description: 'Test User '+i,
                    email: 'testUser'+i+'@ozone3.test',
                    emailShow: false,
                    enabled: true,
                    //              passwd: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
                    userRealName: 'Test User '+i,
                    username: 'testUser'+i,
                    lastLogin: new Date() - 5
                ), false)

            assignGroupsToUser(person, numGroups)
            assignStacksToUser(person, numStacks)

            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private loadGroups(int numGroups, int clearCacheEvery) {
        for (int i = 1; i <= numGroups; i++) {
            //create group
            saveInstance(new Group(
                    name: 'TestGroup' + i,
                    description: 'TestGroup' + i,
                    email: "testgroup${i}@group${i}.com",
                    automatic: false,
                    displayName: 'TestGroup' + i
                ), false);

            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }
    
    private assignGroupsToUser(Person person, int numGroups) {
        def rand = new Random();
        def num = Group.createCriteria().list() { eq("stackDefault", false) }.size() - numGroups;
        num = num <= 0 ? 1 : num;
        def groups = Group.createCriteria().list(max:numGroups, offset:rand.nextInt(num)) { eq("stackDefault", false) }
        for (def i = 0; i < groups.size(); i++) {
            groups[i].people << person
            groups[i].save(flush: true)
        }
    }

    private assignWidgetsToGroup(group, numWidgetsInGroups) {
        println group
        def widgets = WidgetDefinition.list(max:numWidgetsInGroups)
        widgets.each { widget ->
            println widget
            println group
            domainMappingService.createMapping(group,RelationshipType.owns,widget)
        }
    }

    private assignWidgetsToGroups(int numGroups, int numWidgetsInGroups, int clearCacheEvery) {
        for (int i = 1; i <= numGroups; i++) {
            def group = Group.findByName('TestGroup' + i)

            assignWidgetsToGroup(group, numWidgetsInGroups)
            
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private assignDashboardsToStacks(int numStacks, int numDashboards, int clearCacheEvery) {
        for (int i = 1; i <= numStacks; i++) {
            def stack = Stack.findByName('TestStack' + i)
            def dashboards = WidgetDefinition.list(max:numWidgetsInGroups)
            dashboards.each { dashboard ->

                //save and map group dashboard
                saveInstance(dashboard)
                domainMappingService.createMapping(testGroup, RelationshipType.owns, dashboard)
            }
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private loadStacks(int numStacks, boolean assignToOWFUsersGroup = false, int clearCacheEvery) {
        def allUsersGroup;

        if(assignToOWFUsersGroup) {
            allUsersGroup = loadOWFUsersGroup();
        }
        
        for (int i = 1; i <= numStacks; i++) {
            //create stack
            def stack = new Stack(
                name: 'TestStack' + i,
                description: 'TestStack' + i,
                stackContext: 'TestStack' + i
            );

            saveInstance(stack)

            //create its default group
            def stackDefaultGroup = new Group(
                name: 'TestStack' + i + '-DefaultGroup',
                displayName: 'TestStack' + i + '-DefaultGroup',
                stackDefault: true
            );

            saveInstance(stackDefaultGroup)

            //associate stack with its default group
            stack.addToGroups(stackDefaultGroup)

            if(allUsersGroup) {
                stack.addToGroups(allUsersGroup)    
            }
            
            domainMappingService.createMapping(stack, RelationshipType.owns, stackDefaultGroup)
            saveInstance(stack)

            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }
    
    private assignStacksToUser(Person person, int numStacks) {
        def rand = new Random();
        def num = Stack.list().size() - numStacks;
        num = num <= 0 ? 1 : num;
        def stacks = Stack.list(max:numStacks, offset:rand.nextInt(num))
        for (def i = 0; i < stacks.size(); i++) {
            def defaultStackGroup = stacks[i].findStackDefaultGroup()
            defaultStackGroup.people << person
            defaultStackGroup.save(flush: true)
        }
    }

    private createNewUser() {
        def user = Person.findByUsername(Person.NEW_USER)
        if (user == null)
        {
            //Create
            user =  new Person(
                username     : Person.NEW_USER,
                userRealName : Person.NEW_USER,
                //                                passwd       : 'password',
                lastLogin    : new Date(),
                email        : '',
                emailShow    : false,
                description  : '',
                enabled      : true)
            saveInstance(user)
            def userRole = Role.findByAuthority(ERoleAuthority.ROLE_USER.strVal)
            def users = Person.findAllByUsername(Person.NEW_USER)
            if (userRole)
            {
                if (!userRole.people)
                userRole.people = users
                else
                userRole.people.add(Person.findByUsername(Person.NEW_USER))
                saveInstance(userRole)
            }

        }
    }
    /**
     * Creates the OWF Users and OWF Administrators group if they do not already exist.
     */
    private createSystemGroups() {
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
    private assignPeopleToRoles() {
        // assign people to roles, must be on the hasMany relationship
        def userRole = Role.findByAuthority(ERoleAuthority.ROLE_USER.strVal)
        def adminRole = Role.findByAuthority(ERoleAuthority.ROLE_ADMIN.strVal)
        def users = Person.findAllByUsernameLike('testUser%')
        def admins = Person.findAllByUsernameLike('testAdmin%')
        if (!userRole.people)
        userRole.people = users
        else
        userRole.people += users
        saveInstance(userRole)
        
        if (!adminRole.people)
        adminRole.people = admins
        else
        adminRole.people += admins
        saveInstance(adminRole)
    }
    
    private loadDashboards(int numDashboards, int numDashboardsWidgets, int clearCacheEvery) {

        def testUsers = Person.findAllByUsernameLike('test%')

        testUsers.each { user ->
            log.debug 'generating user dashboards for user:' + user

            for (int i = 0; i < numDashboards; i++) {
                log.debug 'createDashboard:' + i + ' for user: ' + user

                def dashboardGuid = generateId()
                def paneGuid = generateId()

                def dashboard = new Dashboard(
                    name: i + '-Dashboard (' + user.username + ')',
                    isdefault: false,
                    guid: dashboardGuid,
                    dashboardPosition: 4 + i,
                    user: user,
                    alteredByAdmin: false,
                    layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}'
                )

                def rand = new Random();
                def randomWidget
                def userWidgets = PersonWidgetDefinition.findAllByPerson(user)

                //Create JSON string of widgets
                def widgets = '[{'
                for (int j = 0; j < numDashboardsWidgets; j++) {
                    if(j != 0) {
                        widgets += ',{'
                    }

                    def xyPos = 300 + (j * 5)

                    //Add a random widget to the dashboard
                    randomWidget = userWidgets[rand.nextInt(userWidgets.size())].widgetDefinition
                    widgets += '"widgetGuid":"' + randomWidget.widgetGuid + '","x":' + xyPos + ',"y":' + xyPos +
                        ',"uniqueId":"' + generateId() + '","name":"' + randomWidget.displayName + '","paneGuid":"' +
                        paneGuid + '","height":250,"width":250,"dashboardGuid":"' + dashboardGuid + '"}'
                }
                widgets += ']'

                def layoutConfig = JSON.parse(dashboard.layoutConfig)
                layoutConfig.widgets = JSON.parse(widgets)
                dashboard.layoutConfig = layoutConfig

                saveInstance(dashboard)
                sessionFactory.currentSession.clear()
            }
        }
    }
    
    private loadStackDashboards(int numStackDashboards, int numDashboardsWidgets, int clearCacheEvery) {
        def stacks = Stack.findAllByNameLike('TestStack%')
        stacks.each { stack ->
            log.debug 'generating stack dashboards for stack:' + stack
            assignDashboardsToGroup(stack.findStackDefaultGroup(), 'Stack', numStackDashboards, numDashboardsWidgets, clearCacheEvery)
        }
    }
    
    private loadGroupDashboards(int numGroupDashboards, int numDashboardsWidgets, int clearCacheEvery) {
        //load group dashboards
        def groups = Group.findAllByNameLike('TestGroup%')
        groups.each { group ->
            log.debug 'generating group dashboards for group:' + group
            assignDashboardsToGroup(group, 'Group', numGroupDashboards, numDashboardsWidgets, clearCacheEvery)
        }
    }

    private assignDashboardsToGroup(Group group, String groupType, int numDashboards, int numDashboardsWidgets, int clearCacheEvery) {
        def allWidgets = WidgetDefinition.list()
        
        for (int i = 1; i <= numDashboards; i++) {
            def dashboardGuid = generateId()
            def paneGuid = generateId()

            def dashboard = new Dashboard(
                name: groupType + ' Dashboard ' + i + ' (' + group.name + ')',
                isdefault: true,
                guid: dashboardGuid,
                dashboardPosition: 0,
                alteredByAdmin: false,
                layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}'
            )

            groupType == 'Stack' && (dashboard.stack = group.stacks?.toArray()[0])

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

    private loadPersonWidgetDefinitions(int numWidgetsPerUser, int clearCacheEvery) {
        // give every person access to standard widget
        def people = Person.findAll()

        // give every person access to extra widgets
        def widgetDefinitions = WidgetDefinition.withCriteria {
            like('displayName','Test Widget %')
        }
        def rand = new Random();
        people.each { person ->
            def num = widgetDefinitions.size() - numWidgetsPerUser;
            num = num <= 0 ? 1 : num;
            def min = rand.nextInt(num);
            for(int idx in min..<(numWidgetsPerUser + min)){
                def widgetDefinition = widgetDefinitions[idx]
                saveInstance(new PersonWidgetDefinition(person: person,
                        widgetDefinition: widgetDefinition,
                        visible : true,
                        pwdPosition: idx))
                if ((idx % clearCacheEvery) == 0){
                    sessionFactory.currentSession.clear()
                }
            }
        }
    }
    
    private loadRequestmaps() {
        saveInstance(new Requestmap(configAttribute :'IS_AUTHENTICATED_ANONYMOUSLY', url : '/login/**'))
        
        saveInstance(new Requestmap(configAttribute :'IS_AUTHENTICATED_ANONYMOUSLY', url : '/denied.jsp'))
        
        saveInstance(new Requestmap(configAttribute :'IS_AUTHENTICATED_FULLY', url : '/**'))
    }

    private loadPreferences(int numPreferences, int clearCacheEvery) {
        
        def users = Person.list()
        users.each {
            for (int i = 0 ; i < numPreferences ; i++) {
                generatePreference(i,it)
                if ((i % clearCacheEvery) == 0){
                    sessionFactory.currentSession.clear()
                }
            }
        }
    }

    private def generatePreference(int i, Person user) {
        saveInstance(new Preference(
                namespace: 'foo.bar.'+i,
                path: 'test path entry '+i,
                user: user,
                value: 'foovalue'
            ))
    }
}
