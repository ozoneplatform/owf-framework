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
import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.WidgetType

class BootStrap {
	
    def grailsApplication
    def sessionFactory
    def domainMappingService
	
    def init = {servletContext ->

        println 'BootStrap running!'

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
            loadDevelopmentData()
            stopWatch.stop();
            log.info('Finished Loading development fixture data:'+stopWatch)
            break
            case 'production':
            log.info('Adding default newUser')
            createNewUser()
            break;
            default:
            //do nothing
            break
        }

        println 'BootStrap finished!'
    }
    def destroy = {
    }

    private def loadDevelopmentData() {
        def enabled = grailsApplication.config?.perfTest?.enabled

        log.info('Performance Test Data Generation Enabled: ' + enabled)
	  
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

            def numPreferences = ((grailsApplication.config?.perfTest?.numPreferences && enabled) ? grailsApplication.config.perfTest?.numPreferences : 2);
            log.info 'preferences: ' + numPreferences

            def clearCacheEvery = ((grailsApplication.config?.perfTest?.clearCacheEvery && enabled) ? grailsApplication.config.perfTest?.clearCacheEvery : 10);
            log.info 'clearCacheEvery: ' + clearCacheEvery

            def createRequiredWidgets = ((grailsApplication.config?.perfTest?.createRequiredWidgets) ? grailsApplication.config.perfTest?.createRequiredWidgets : false);
            log.info 'createRequiredWidgets: ' + createRequiredWidgets

            def createSampleWidgets = ((grailsApplication.config?.perfTest?.createSampleWidgets) ? grailsApplication.config.perfTest?.createSampleWidgets : false);
            log.info 'createSampleWidgets: ' + createSampleWidgets

            def sampleWidgetBaseUrl = ((grailsApplication.config?.perfTest?.sampleWidgetBaseUrl) ? grailsApplication.config.perfTest?.sampleWidgetBaseUrl : 'https://127.0.0.1:8443/');
            log.info 'sampleWidgetBaseUrl: ' + sampleWidgetBaseUrl

            loadGroups(numGroups, clearCacheEvery)
            sessionFactory.currentSession.clear()
		
            loadAdmins(numAdmins, numGroupsPerUser, clearCacheEvery)
            sessionFactory.currentSession.clear()
		
            loadPersons(numUsers, numGroupsPerUser, clearCacheEvery)
            sessionFactory.currentSession.clear()
		
            loadWidgetTypes()
            sessionFactory.currentSession.clear()

            loadWidgetDefinitions(numWidgets, clearCacheEvery)
            sessionFactory.currentSession.clear()

            assignWidgetsInGroups(numGroups, numWidgetsInGroups, clearCacheEvery)
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

            loadDashboardsAndDashboardWidgetStates(numDashboards, numDashboardsWidgets, clearCacheEvery)
            sessionFactory.currentSession.clear()
		
            loadGroupDashboardsAndDashboardWidgetStates(numGroupDashboards, numDashboardsWidgets, clearCacheEvery)
            sessionFactory.currentSession.clear()
		
            loadRequestmaps()
            sessionFactory.currentSession.clear()

            loadPreferences(numPreferences, clearCacheEvery)
            sessionFactory.currentSession.clear()

            //create test required widget relationshipts
            if (grailsApplication.config?.perfTest?.createRequiredWidgets) {
                assignRequiredWidgets()
                sessionFactory.currentSession.clear()
            }

            //create sample widgetdefs
            if (grailsApplication.config?.perfTest?.createSampleWidgets) {
                loadAndAssignSampleWidgetDefinitions(sampleWidgetBaseUrl, 10)
                sessionFactory.currentSession.clear()
            }
            sessionFactory.currentSession.clear()

        }
    }

    private def saveInstance(instance) {
        if (instance.save(flush:true) == null) {
            log.info "ERROR: ${instance} not saved - ${instance.errors}"
        } else {
            log.debug "${instance.class}:${instance} saved"
        }
        return instance
    }

    private loadWidgetDefinitions(int numWidgets = 0, int clearCacheEvery) {
        def standard = WidgetType.findByName('standard')

        sessionFactory.currentSession.clear()
        //generate extra dummy widgets
        for (int i = 0 ; i < numWidgets ; i++) {
            def id = generateId()
            saveInstance(new WidgetDefinition(
                    displayName: 'Test Widget '+i,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif',
                    imageUrlSmall: 'themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif',
                    widgetGuid: id,
                    widgetUrl: 'examples/walkthrough/widgets/NearlyEmptyWidget.html',
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
  
    private loadWidgetTypes() {
        saveInstance(new WidgetType(name: 'standard')) 
    }
  
    private loadAdmins(int numAdmins, int numGroups, int clearCacheEvery) {
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
            saveInstance(admin)
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }

    private loadPersons(int numPersons, int numGroups, int clearCacheEvery) {
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
                ))
            assignGroupsToUser(person, numGroups)
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
                ));

            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
    }
	
    private assignGroupsToUser(Person person, int numGroups) {
        def rand = new Random();
        def num = Group.list().size() - numGroups;
        num = num <= 0 ? 1 : num;
        def groups = Group.list(max:numGroups, offset:rand.nextInt(num))
        for (def i = 0; i < groups.size(); i++) {
            groups[i].people << person
            groups[i].save(flush: true)
        }
    }

    private assignWidgetsInGroups(int numGroups, int numWidgetsInGroups, int clearCacheEvery) {
        for (int i = 1; i <= numGroups; i++) {
            //create group
            def group = Group.findByName('TestGroup' + i)
            def widgets = WidgetDefinition.list(max:numWidgetsInGroups)
            widgets.each { widget ->
                //assign the people to this group up to numUsersInGroups value
                domainMappingService.createMapping(group,RelationshipType.owns,widget)
            }
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
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

    private assignRequiredWidgets() {
        def nearlyEmpty = WidgetDefinition.findByWidgetGuid('bc5435cf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetA   	= WidgetDefinition.findByWidgetGuid('ea5435cf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetB   	= WidgetDefinition.findByWidgetGuid('fb5435cf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetC   	= WidgetDefinition.findByWidgetGuid('0c5435cf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetD   	= WidgetDefinition.findByWidgetGuid('1d5435cf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetOne 	= WidgetDefinition.findByWidgetGuid('d6543ccf-4021-4f2a-ba69-dde451d12551', [cache: true])
        def widgetTwo 	= WidgetDefinition.findByWidgetGuid('e65431cf-4021-4f2a-ba69-dde451d12551', [cache: true])
		
        domainMappingService.createMapping(nearlyEmpty, RelationshipType.requires, widgetA)
        domainMappingService.createMapping(nearlyEmpty, RelationshipType.requires, widgetB)
        domainMappingService.createMapping(widgetA, 	RelationshipType.requires, widgetC)
        domainMappingService.createMapping(widgetA, 	RelationshipType.requires, widgetD)
        domainMappingService.createMapping(widgetB, 	RelationshipType.requires, widgetOne)
        domainMappingService.createMapping(widgetB, 	RelationshipType.requires, widgetTwo)
        domainMappingService.createMapping(widgetC, 	RelationshipType.requires, widgetB)
    }
	
    private loadDashboardsAndDashboardWidgetStates(int numDashboards, int numDashboardsWidgets, int clearCacheEvery) {

        def testUsers = Person.findAllByUsernameLike('test%')
        testUsers.each {
            log.debug 'generating user dashboards for user:'+it
            loadUserDashboardsAndDashboardWidgetStates(it,numDashboards,numDashboardsWidgets, clearCacheEvery)
        }
    }
	
    private loadGroupDashboardsAndDashboardWidgetStates(int numGroupDashboards, int numDashboardsWidgets, int clearCacheEvery) {
        //load group dashboards
        def groups = Group.findAllByNameLike('TestGroup%')
        groups.each {
            log.debug 'generating group dashboards for user:'+it
            loadGroupDashboardsAndDashboardWidgetStates(it,numGroupDashboards, numDashboardsWidgets, clearCacheEvery)
        }
    }

    private generateId() {
        return java.util.UUID.randomUUID().toString()
    }

    private def loadUserDashboardsAndDashboardWidgetStates(Person testUser1, int numDashboards, int numDashboardsWidgets, int clearCacheEvery) {

        //create extra dummy dashboards
        for (int i = 0; i < numDashboards; i++) {
            log.debug 'createDashboard:'+i+' for user:'+testUser1
            createDashboard(i, numDashboardsWidgets, testUser1,clearCacheEvery)
        }
    }

    private def loadGroupDashboardsAndDashboardWidgetStates(Group testGroup, int numDashboards, int numDashboardsWidgets, int clearCacheEvery) {

        def dashboard = new Dashboard(
            name: 'Group Dashboard (' + testGroup.name + ')',
            layout: null,
            isdefault: true,
            guid: generateId(),
            columnCount: 0,
            dashboardPosition: 0,
            alteredByAdmin: false,
            layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[{"widgetGuid":"eb5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"17580ea1-02fc-8ca7-e794-b5644f7dc21d","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Shouter","active":false,"x":549,"y":7,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19120,"height":250,"width":295},{"widgetGuid":"ec5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"9bdc8e96-f311-4a0b-c5b9-23ae5d768297","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Listener","active":true,"x":4,"y":5,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19130,"height":383,"width":540}],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}'
        )

        dashboard.state = [] as SortedSet
	  
        //TODO: Change this to write to the layoutConfig property of a dashboard, not the
        //dashboardWidgetState table which is no longer used to load widgets on a dashboard
        def widgets = domainMappingService.getMappings(testGroup, RelationshipType.owns, WidgetDefinition.TYPE)
        for (int i = 0; i < numDashboardsWidgets && i < widgets.size(); i++) {
            def dws = new DashboardWidgetState(
                name: i + ' Widget',
                widgetGuid: widgets[i] ? domainMappingService.getDestObjectFromMapping(widgets[i]).widgetGuid : null,
                active: false,
                width: 625,
                height: 405,
                zIndex: 222 + i,
                minimized: false,
                maximized: false,
                pinned: false,
                collapsed: false,
                columnPos: (i % 3) + 1,
                buttonId: null,
                buttonOpened: false,
                region: 'accordion',
                dashboard: dashboard,
                uniqueId: generateId(),
                statePosition: 3 + i,
            );

            dws.x = 300 + (i*5)
            dws.y = 300 + (i*5)
		 
            dashboard.state << dws
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
        //save and map group dashboard
        saveInstance(dashboard)
        domainMappingService.createMapping(testGroup, RelationshipType.owns, dashboard)

        sessionFactory.currentSession.clear()
    }

    private def createDashboard(int dashboardNum, int numDashboardsWidgets, Person user, int clearCacheEvery) {

        def dashboard = new Dashboard(
            name: dashboardNum + '-Dashboard (' + user.username + ')',
            layout: null,
            isdefault: false,
            guid: generateId(),
            columnCount: 0,
            dashboardPosition: 4 + dashboardNum,
            user: user,
            alteredByAdmin: false,
            layoutConfig: '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[{"widgetGuid":"eb5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"17580ea1-02fc-8ca7-e794-b5644f7dc21d","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Shouter","active":false,"x":549,"y":7,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19120,"height":250,"width":295},{"widgetGuid":"ec5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"9bdc8e96-f311-4a0b-c5b9-23ae5d768297","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Listener","active":true,"x":4,"y":5,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19130,"height":383,"width":540}],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}'
        )
        dashboard.state = [] as SortedSet
		
        //TODO: Change this to write to the layoutConfig property of a dashboard, not the
        //dashboardWidgetState table which is no longer used to load widgets on a dashboard
        //create extra dummy widgets on this dashboard
        //log.debug "Adding ${numDashboardsWidgets} extra widgets to this dashboard:${dashboard}"
        for (int i = 0; i < numDashboardsWidgets; i++) {
            def dws = new DashboardWidgetState(
                personWidgetDefinition: PersonWidgetDefinition.findByPerson(user),
                name: i + ' Widget',
                active: false,
                width: 625,
                height: 405,
                zIndex: 222 + i,
                minimized: false,
                maximized: false,
                pinned: false,
                collapsed: false,
                columnPos: (i % 3) + 1,
                buttonId: null,
                buttonOpened: false,
                region: 'accordion',
                dashboard: dashboard,
                uniqueId: generateId(),
                statePosition: 3 + i,
            );
            dashboard.state << dws
            if ((i % clearCacheEvery) == 0){
                sessionFactory.currentSession.clear()
            }
        }
        saveInstance(dashboard)
        sessionFactory.currentSession.clear()
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
