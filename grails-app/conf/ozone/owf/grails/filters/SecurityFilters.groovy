package ozone.owf.grails.filters

import org.hibernate.FetchMode as FM
import org.apache.commons.lang.time.StopWatch
import org.springframework.security.core.context.SecurityContextHolder as SCH
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken
import grails.converters.JSON
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.DomainMapping
import ozone.owf.grails.services.OwfApplicationConfigurationService;
import ozone.security.authentication.OWFUserDetailsImpl
import java.util.HashMap
import static ozone.owf.enums.OwfApplicationSetting.*

import org.apache.log4j.*

class SecurityFilters {
    def accountService
    def personWidgetDefinitionService
    def widgetDefinitionService
    def administrationService
    def groupService
    def preferenceService
    def domainMappingService
    def serviceModelService
    def grailsApplication

	OwfApplicationConfigurationService owfApplicationConfigurationService
	
    def filters = {
        securityAll(controller:'index', action:'index') {
            before = {

                log.debug("Entering SecurityFilter filters: before");

                try {
                    def username = accountService.getLoggedInUsername()
                    def userDisplayName = accountService.getLoggedInUserDisplayName()
                    StopWatch stopWatch

                    //find the user (if possible) and stuff them into the session
                    if (username == null) {
                        log.debug("username is null, erroring out with 401");
                        response.sendError(401)
                        return false
                    } else {
    
                        log.debug("Username is " + username);

                        if (log.isInfoEnabled()) {
                            stopWatch = new StopWatch();
                            stopWatch.start();
                            log.info("SecurityFilter finding person");
                        }
                        def personInDB = Person.findByUsername(username, [cache:true])
                        if (log.isInfoEnabled()) {
                            stopWatch.stop();
                            log.info("SecurityFilter found person in "+stopWatch);
                        }

                        if (!personInDB)
                        {
                            log.info 'Adding New User to Database'
                            //add user to DB since they don't exist
                            personInDB = new Person(
                                username     : username,
                                userRealName : userDisplayName,
                                //passwd       : 'password',
                                lastLogin    : new Date(),
                                email        : accountService.getLoggedInUserEmail(),
                                emailShow    : false,
                                description  : '',
                                enabled      : true)

                            if (log.isInfoEnabled()) {
                                stopWatch = new StopWatch();
                                stopWatch.start();
                                log.info("securityfilters.save new person");
                            }
                            personInDB.save(flush:true)
                            setUserDefaults(username)
                            if (log.isInfoEnabled()) {
                                stopWatch.stop();
                                log.info("securityfilters.saved new person"+stopWatch);
                            }

                            session["savedLastLogin"] = true
                        }
                        session.personID = personInDB.id
						
                        def sezzion = session
                        // Last login value should exist if user has logged in before
                        if(personInDB.lastLogin == null) 
                        {
                            log.debug("Setting default lastlogin");
                            personInDB.lastLogin = new Date()
                        } 

                        //update last logged in if we haven't already done so and update name in case it changed (marriage, divorce etc)
                        // The real name is the display name provided by the custom security module.
                        if (!session["savedLastLogin"])
                        {
                            personInDB.prevLogin = personInDB.lastLogin
                            personInDB.lastLogin = new Date()

                            if (userDisplayName != username)
                            {
                                personInDB.userRealName = userDisplayName
                            }
                            if (log.isInfoEnabled())
                            {
                                stopWatch = new StopWatch();
                                stopWatch.start();
                                log.info("securityfilters.save existing person");
                            }
                            personInDB.save(flush:true)
                            if (log.isInfoEnabled())
                            {
                                stopWatch.stop();
                                log.info("securityfilters.saved existing person"+stopWatch);
                            }
                            session["savedLastLogin"] = true
                        }

                        loadUserData(personInDB)

                        // Add Admin Widgets if user is an admin
                        loadAdminData(personInDB)

                        // Check Automatic Groups and add/remove them as necessary
                        if (!session["savedUserGroups"])
                        {
                            def newAutomaticUserGroups = accountService.getLoggedInAutomaticUserGroups()

                            log.info("Analyzing New Automatic User Groups for " + username + " from Security Plugin--list size is " + newAutomaticUserGroups.size())

                            // reset all the person's groups.  We'll update them in the end.
                            for ( newGroup in newAutomaticUserGroups )
                            {
                                // check if the group already exists
                                def matches = Group.findAllByNameAndAutomatic(newGroup.getOwfGroupName(), true, [cache:true])
                                def myGroup
                                if (matches == null || matches?.size() == 0)
                                {
                                    // add it
                                    myGroup = new Group()
                                    myGroup.people =[personInDB]
                                    myGroup.properties = [
                                        name: newGroup.getOwfGroupName(),
                                        displayName: newGroup.getOwfGroupName(),
                                        description: newGroup.getOwfGroupDescription(),
                                        email: newGroup.getOwfGroupEmail(),
                                        automatic: true,
                                        status: newGroup.isActive() ? 'active' : 'inactive'
                                    ]
                                }
                                else
                                {
                                    // it already exists--update it rather than creating a new one
                                    myGroup = matches[0]
                                    myGroup.people << personInDB
                                }

                                myGroup.save(flush: true)
                            }

                            // retrieve all  groups assigned to the user--if an
                            // automatic group has been removed from the security
                            // plugin, the relationship must be removed from the OWF database
                            def c = Group.createCriteria()
                            def existingGroupAssignments = c.list{
                                eq('automatic',true)
                                people {
                                    eq('username', username)
                                }

                                //Don't include the OWF group for administrators or users
                                ne('name', 'OWF Administrators')
                                ne('name', 'OWF Users')
                            }

                            // we must turn newAutomaticUserGroups into a map
                            def newAutomaticUserGroupsMap = new HashMap()
                            for(group in newAutomaticUserGroups) {
                                newAutomaticUserGroupsMap.put(group.getOwfGroupName(), group)
                            }

                            // search to see if any groups assigned to the user are
                            // not in the list from the security plugin, now a map
                            // called newAutomaticUserGroupsMap
                            for(group in existingGroupAssignments)
                            {
                                if(! newAutomaticUserGroupsMap.get(group.name))
                                {

                                    // we must delete the user/group association in the database--remove the user and save the group.

                                    def personToRemove
                                    for(person in group.people)
                                    {
                                        if (person.username == username)
                                        {
                                            personToRemove = person
                                            break
                                        }
                                    }
                                    if( personToRemove != null )
                                    {
                                        def criteria = Person.createCriteria()
                                        group.people = criteria.list{
                                            groups {
                                                eq('id', group.id)
                                            }
                                        }

                                        group.people = group.people - personToRemove
                                        group.save()
                                    }
                                }
                            }

                            // now
                            session["savedUserGroups"] = true
                        }

                        //verify they have and admin OR user role
                        if(accountService.getLoggedInUserIsAdmin() || accountService.getLoggedInUserIsUser()){
                            return true;
                        }
                        else{
                            //println("401: NO ROLES!!")
                            response.sendError(401)
                            return false;
                        }

                    }
                } catch (Exception e) {
                    log.error e.getMessage();
                    response.sendError(401);
                    return false;
                }
            }			
        }
		
		setApplicationConfigurationFlags(controller: '*', action:'*'){			
			before = {				
				request.setAttribute(CEF_LOGGING_ENABLED.getCode(), owfApplicationConfigurationService.is(CEF_LOGGING_ENABLED))
				request.setAttribute(CEF_OBJECT_ACCESS_LOGGING_ENABLED.getCode(), owfApplicationConfigurationService.is(CEF_OBJECT_ACCESS_LOGGING_ENABLED))							
			}			
		}
		
//        securityDashboardAdmin(controller:'dashboardAdmin', action:'*'){
//            before = {
//                if (! accountService.getLoggedInUserIsAdmin() ) {
//                    redirect(controller: "dashboard")
//                }
//                return true;
//            }
//        }
//        securityPersonAdmin(controller:'person', action:'*'){
//            before = {
//                def illegalActions = ["create", "delete", "save"]
//
//                if(actionName.equals("whoami")) {
//                    // allow everyone to access this
//                    return true
//                } else if (! accountService.getLoggedInUserIsAdmin() && illegalActions.contains(actionName) ) {
//                    //unauthorized if user is not admin or the action is illegal
//                    //redirect(uri:"/")
//                    response.sendError(401)
//                    return false;
//                }
//                return true;
//            }
//
//        }
//        securityWidgetAdmin(controller:'widgetAdmin', action:'*'){
//            before = {
//                if (! accountService.getLoggedInUserIsAdmin() ) {
//                    redirect(controller:"widget")
//                }
//                return true;
//            }
//
//        }
    }
    private void setUserDefaults(String username)
    {
        def newUser = Person.findByUsername(Person.NEW_USER, [cache:true])
        def oldAuthentication
        try
        {
            // temporarily give user admin privileges if they don't already have them so that
            // we can safely call our services for setting the user defaults
            oldAuthentication = SCH.context.authentication
            def oldPrincipal = oldAuthentication.principal
			
            def temporaryPrincipal = new OWFUserDetailsImpl(oldPrincipal.username, oldPrincipal.password, [ new org.springframework.security.core.authority.GrantedAuthorityImpl('ROLE_ADMIN') ], [])
            SCH.context.authentication = new PreAuthenticatedAuthenticationToken(temporaryPrincipal, temporaryPrincipal.getPassword());
          
            def personInDB = Person.findByUsername(username, [cache:true])

            log.info 'newUser:'+newUser
            log.info 'personInDB:'+personInDB
            if (newUser && personInDB)
            {
                def maxPosition = 0
                newUser.personWidgetDefinitions.each{ pwd ->
                    def users = [[id:personInDB.id]]
                    log.info 'Adding DEFAULT_USER widgets to new user'

                    personWidgetDefinitionService.bulkAssignForSingleWidgetDefinitionMultipleUsers(pwd.widgetDefinition.widgetGuid,users,[])
                }

                def dashBoards = Dashboard.findAllByUser(newUser, [cache:true])
                def args = [checkedTargets: personInDB.id]
                dashBoards.each{ db ->
                    log.info 'Adding DEFAULT_USER dashboards to new user'

                    //Skip if dashboard belongs to a stack, it will be added as a result
                    //of adding the user to the stack next
                    if(!db.stack) {
                        args.guid = db.guid
                        args.isdefault = db.isdefault
                        args.name = db.name
                        args.description = db.description
                        args.locked = db.locked
                        args.layoutConfig = db.layoutConfig

                        administrationService.cloneDashboards(args)
                    }
                }

                //Get all stack default groups DEFAULT_USER is in
                def stackDefaultGroups = Group.withCriteria(uniqueResult: true){
                    eq('stackDefault', true)
                    people {
                        eq('id', newUser.id)
                    }
                }
                args = [checkedTargets: personInDB.id]
                stackDefaultGroups.each{ stackDefaultGroup ->
                    log.info 'Adding DEFAULT_USER stacks to new user'

                    //Add the new user to the stack's default group
                    stackDefaultGroup.addToPeople(personInDB)
                    stackDefaultGroup.save(flush: true, failOnError: true)
                }

                def preferences = Preference.findAllByUser(newUser, [cache:true])
                args = [checkedTargets: personInDB.id]
                preferences.each{ pref ->
                    log.info 'Adding DEFAULT_USER preferences to new user'

                    args.namespace = pref.namespace
                    args.path = pref.path
                    args.value = pref.value
                    administrationService.clonePreference(args)
                }
            }
            else {
                log.info 'No need to copy default dashboards, stacks, prefs and widgets, newUser or personInDb is null'
            }
        } catch(Exception e)
        {
            e.printStackTrace()
        } finally
        {
            if (oldAuthentication)
            try
            {
                SCH.context.authentication = oldAuthentication
            } catch(Exception e)
            {
                e.printStackTrace()
            }
        }
    }

    private loadAdminData(admin) {

        def id = null
        def adminWidgetType = WidgetType.findByName('administration')
        def userAdmin = WidgetDefinition.findByWidgetUrl('admin/UserManagement.gsp',[cache:true]);
        if(adminWidgetType == null) {
            adminWidgetType = saveInstance(new WidgetType(name: 'administration'))
        }
        if (userAdmin == null) {
            id = generateId()
            userAdmin = new WidgetDefinition(
                displayName: 'Users',
                height: 440,
                imageUrlLarge: 'themes/common/images/adm-tools/Users64.png',
                imageUrlSmall: 'themes/common/images/adm-tools/Users24.png',
                widgetGuid: id,
                widgetUrl: 'admin/UserManagement.gsp',
                widgetVersion: '1.0',
                width: 818
            )
            userAdmin.addToWidgetTypes(adminWidgetType)
            userAdmin = saveInstance(userAdmin)
            userAdmin.addTag('admin')
        }

        if (accountService.getLoggedInUserIsAdmin()) {

            def userEdit = WidgetDefinition.findByWidgetUrl('admin/UserEdit.gsp',[cache:true]);
            if (userEdit == null) {
                id = generateId()
                userEdit = new WidgetDefinition(
                    displayName: 'User Editor',
                    visible: false,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Users64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Users24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/UserEdit.gsp',
                    widgetVersion: '1.0',
                    width: 581
                )
                userEdit.addToWidgetTypes(adminWidgetType)
                userEdit = saveInstance(userEdit)
                userEdit.addTag('admin')
            }

            def widgetAdmin = WidgetDefinition.findByWidgetUrl('admin/WidgetManagement.gsp',[cache:true]);
            if (widgetAdmin == null) {
                id = generateId()
                widgetAdmin = new WidgetDefinition(
                    displayName: 'Widgets',
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Widgets64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Widgets24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/WidgetManagement.gsp',
                    widgetVersion: '1.0',
                    width: 818
                )
                widgetAdmin.addToWidgetTypes(adminWidgetType)
                widgetAdmin = saveInstance(widgetAdmin)
                widgetAdmin.addTag('admin')
            }

            def widgetEdit = WidgetDefinition.findByWidgetUrl('admin/WidgetEdit.gsp',[cache:true]);
            if (widgetEdit == null) {
                id = generateId()
                widgetEdit = new WidgetDefinition(
                    displayName: 'Widget Editor',
                    visible: false,
                    height: 493,
                    imageUrlLarge: 'themes/common/images/adm-tools/Widgets64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Widgets24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/WidgetEdit.gsp',
                    widgetVersion: '1.0',
                    width: 581
                )
                widgetEdit.addToWidgetTypes(adminWidgetType)
                widgetEdit = saveInstance(widgetEdit)
                widgetEdit.addTag('admin')
            }

            def groupAdmin = WidgetDefinition.findByWidgetUrl('admin/GroupManagement.gsp',[cache:true]);
            if (groupAdmin == null) {
                id = generateId()
                groupAdmin = new WidgetDefinition(
                    displayName: 'Groups',
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Groups64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Groups24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/GroupManagement.gsp',
                    widgetVersion: '1.0',
                    width: 818
                )
                groupAdmin.addToWidgetTypes(adminWidgetType)
                groupAdmin = saveInstance(groupAdmin)
                groupAdmin.addTag('admin')
            }

            def groupEdit = WidgetDefinition.findByWidgetUrl('admin/GroupEdit.gsp',[cache:true]);
            if (groupEdit == null) {
                id = generateId()
                groupEdit = new WidgetDefinition(
                    displayName: 'Group Editor',
                    visible: false,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Groups64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Groups24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/GroupEdit.gsp',
                    widgetVersion: '1.0',
                    width: 581
                )
                groupEdit.addToWidgetTypes(adminWidgetType)
                groupEdit = saveInstance(groupEdit)
                groupEdit.addTag('admin')
            }
    		
            def dashboardAdmin = WidgetDefinition.findByWidgetUrl('admin/GroupDashboardManagement.gsp',[cache:true]);
            if (dashboardAdmin == null) {
                id = generateId()
                dashboardAdmin = new WidgetDefinition(
                    displayName: 'Group Dashboards',
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Dashboards64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Dashboards24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/GroupDashboardManagement.gsp',
                    widgetVersion: '1.0',
                    width: 818
                )
                dashboardAdmin.addToWidgetTypes(adminWidgetType)
                dashboardAdmin = saveInstance(dashboardAdmin)
                dashboardAdmin.addTag('admin')
            }

            def dashboardEdit = WidgetDefinition.findByWidgetUrl('admin/DashboardEdit.gsp',[cache:true]);
            if (dashboardEdit == null) {
                id = generateId()
                dashboardEdit = new WidgetDefinition(
                    displayName: 'Dashboard Editor',
                    visible: false,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Dashboards64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Dashboards24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/DashboardEdit.gsp',
                    widgetVersion: '1.0',
                    width: 581
                )
                dashboardEdit.addToWidgetTypes(adminWidgetType)
                dashboardEdit = saveInstance(dashboardEdit)
                dashboardEdit.addTag('admin')
            }
            
            def stackAdmin = WidgetDefinition.findByWidgetUrl('admin/StackManagement.gsp',[cache:true]);
            if (stackAdmin == null) {
                id = generateId()
                stackAdmin = new WidgetDefinition(
                    displayName: 'Stacks',
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Stacks64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Stacks24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/StackManagement.gsp',
                    widgetVersion: '1.0',
                    width: 818
                )
                stackAdmin.addToWidgetTypes(adminWidgetType)
                stackAdmin = saveInstance(stackAdmin)
                stackAdmin.addTag('admin')
            }

            def stackEdit = WidgetDefinition.findByWidgetUrl('admin/StackEdit.gsp',[cache:true]);
            if (stackEdit == null) {
                id = generateId()
                stackEdit = new WidgetDefinition(
                    displayName: 'Stack Editor',
                    visible: false,
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Stacks64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Stacks24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/StackEdit.gsp',
                    widgetVersion: '1.0',
                    width: 581
                )
                stackEdit.addToWidgetTypes(adminWidgetType)
                stackEdit = saveInstance(stackEdit)
                stackEdit.addTag('admin')
            }

            def configurationWidget = WidgetDefinition.findByWidgetUrl('admin/Configuration.gsp',[cache:true]);
            if (configurationWidget == null) {
                id = generateId()
                configurationWidget = new WidgetDefinition(
                    displayName: 'Configuration',
                    height: 440,
                    imageUrlLarge: 'themes/common/images/adm-tools/Configuration64.png',
                    imageUrlSmall: 'themes/common/images/adm-tools/Configuration24.png',
                    widgetGuid: id,
                    widgetUrl: 'admin/Configuration.gsp',
                    widgetVersion: '1.0',
                    width: 900
                )
                configurationWidget.addToWidgetTypes(adminWidgetType)
                configurationWidget = saveInstance(configurationWidget)
                configurationWidget.addTag('admin')
            }

            // Update preferences
            preferenceService.updateForUser(
                userid: admin.id,
                namespace: 'owf.admin.UserEditCopy',
                path: 'guid_to_launch',
                value: userEdit.widgetGuid
            )
             
            preferenceService.updateForUser(
                path: 'guid_to_launch',
                namespace: 'owf.admin.WidgetEditCopy',
                userid: admin.id,
                value: widgetEdit.widgetGuid
            )
            preferenceService.updateForUser(
                path: 'guid_to_launch',
                namespace: 'owf.admin.GroupEditCopy',
                userid: admin.id,
                value: groupEdit.widgetGuid
            )
            preferenceService.updateForUser(
                path: 'guid_to_launch',
                namespace: 'owf.admin.DashboardEditCopy',
                userid: admin.id,
                value: dashboardEdit.widgetGuid
            )
            preferenceService.updateForUser(
                path: 'guid_to_launch',
                namespace: 'owf.admin.StackEditCopy',
                userid: admin.id,
                value: stackEdit.widgetGuid
            )

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
                adminGroup.people =[admin]

                adminGroup = saveInstance(adminGroup)
            }
            // } else {
            //     // it already exists--update it rather than creating a new one
            //     if (admin.groups == null || !adminGroup.people.contains(admin)) {
            //         adminGroup.people << admin
            //     }
            // }
            // adminGroup.properties = [
            //     status: 'active'
            // ]
            // adminGroup = saveInstance(adminGroup)
			
            // Assign the Admin Widgets
            log.debug "assigning admin widgets......................................................"
            def mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, userAdmin);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, userAdmin);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, userEdit);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, userEdit);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, widgetAdmin);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, widgetAdmin);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, widgetEdit);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, widgetEdit);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, groupAdmin);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, groupAdmin);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, groupEdit);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, groupEdit);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, dashboardAdmin);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, dashboardAdmin);
            }
			
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, dashboardEdit);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, dashboardEdit);
            }
            
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, stackAdmin);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, stackAdmin);
            }
            
            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, stackEdit);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, stackEdit);
            }

            mapping = domainMappingService.getMapping(adminGroup, RelationshipType.owns, configurationWidget);
            if (mapping[0] == null) {
                // If none of the admin widgets exist yet, create them
                domainMappingService.createMapping(adminGroup, RelationshipType.owns, configurationWidget);
            }
			
        } else {
            //User isn't an admin, remove them from the OWF Administrators group if they are in it
            def adminGroup = Group.findByNameAndAutomatic('OWF Administrators', true, [cache:true])
            if(adminGroup != null) {
                if(admin.groups?.contains(adminGroup)) {
                    admin.groups.remove(adminGroup)
                }
                if(adminGroup.people.contains(admin)) {
                    adminGroup.people.remove(admin)
                }
            }
        }
		
        /*if (userAdmin) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, userAdmin)?.delete(flush: true);
        if (userEdit) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, userEdit)?.delete(flush: true);
        if (widgetAdmin) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, widgetAdmin)?.delete(flush: true);
        if (widgetEdit) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, widgetEdit)?.delete(flush: true);
        if (groupAdmin) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, groupAdmin)?.delete(flush: true);
        if (groupEdit) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, groupEdit)?.delete(flush: true);
        if (dashboardAdmin) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, dashboardAdmin)?.delete(flush: true);
        if (dashboardEdit) PersonWidgetDefinition.findByPersonAndWidgetDefinition(admin, dashboardEdit)?.delete(flush: true);*/
    }
    
    private loadUserData(user) {
        
        if (user) {
            def allUsers = Group.findByNameAndAutomatic('OWF Users', true, [cache:true])

            if (allUsers == null) {
                // add it
                allUsers = new Group(
                    name: 'OWF Users',
                    description: 'OWF Users',
                    automatic: true,
                    status: 'active',
                    displayName: 'OWF Users'
                )
                allUsers.people = [user]

                allUsers = saveInstance(allUsers)
            }   
            // Do Not add them to the system groups of OWF Users and OWF Admin.  Instead, let the
            // resource services manage that.
                         
            // } else {
            //     // it already exists--update it rather than creating a new one
            //     if (user.groups == null || !user.groups.contains(allUsers)) {
            //         // Search for the OWF Users group using a join to cache the people (necessary
            //         // to avoid N+1 select problem on addToPeople
            //         def allUsersCachePeople = Group.withCriteria {
            //             and {
            //                 eq "name", "OWF Users"
            //                 eq "automatic", true
            //             }
            //             join "people"
            //         }

            //         allUsers.addToPeople(user);
            //     }
            //     // While we're modifying the group, make sure it's active.
            //     allUsers.properties = [
            //         status: 'active'
            //     ]
            //     allUsers = saveInstance(allUsers)
            // }
        }
            
    }

    private generateId() {
        return java.util.UUID.randomUUID().toString()
    }

    private def saveInstance(instance) {
        if (instance.save(flush:true) == null) {
            log.info "ERROR: ${instance} not saved - ${instance.errors}"
        } else {
            log.debug "${instance.class}:${instance} saved"
        }
        return instance
    }

}
