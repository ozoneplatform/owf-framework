package ozone.owf.grails.filters

import grails.util.Environment
import grails.util.Holders
import org.codehaus.groovy.grails.web.util.WebUtils
import org.grails.plugins.metrics.groovy.Timed
import org.springframework.security.core.context.SecurityContextHolder as SCH
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken
import ozone.owf.grails.domain.*
import ozone.security.authentication.OWFUserDetailsImpl

class SecurityFilters {
    def accountService
    def personWidgetDefinitionService
    def dashboardService
    def administrationService
    def preferenceService
    def domainMappingService
    def grailsApplication

    def filters = {
        securityAll(controller:'index', action:'index') {
            before = {
                if (!accountService.getLoggedInUserIsUser()) {
                    log.debug(accountService.getLoggedInUsername() + " does not have ROLE_USER role, erroring out with 403");
                    response.sendError(403)
                    return false
                }
                try {
                    setupPerson()
                    createAutomaticGroupRecords()
                    updateUserGroups()
                    return true
                }
                catch (Exception e) {
                    log.error e.getMessage()
                    response.sendError(500)
                    return false
                }
            }
        }
    }

    @Timed
    private void setupPerson () {
        def session = WebUtils.retrieveGrailsWebRequest().session
        def username = accountService.getLoggedInUsername()
        def userDisplayName = accountService.getLoggedInUserDisplayName()
        def adminRole = Role.findByAuthority(ERoleAuthority.ROLE_ADMIN.strVal)
        def userRole = Role.findByAuthority(ERoleAuthority.ROLE_USER.strVal)

        def isAdmin = accountService.getLoggedInUserIsAdmin()
        def roles = (isAdmin ? [adminRole, userRole] : [userRole]) as Set

        def person = Person.findByUsername(username, [cache:true])
        if (!person) {
            Person.withTransaction {
                person = new Person(
                    username     : username,
                    userRealName : userDisplayName,
                    lastLogin    : new Date(),
                    email        : accountService.getLoggedInUserEmail(),
                    emailShow    : false,
                    description  : '',
                    enabled      : true,
                    requiresSync : true,
                    authorities  : roles               )

                person.save(flush:true)
                setUserDefaults(username)
            }

            session["savedLastLogin"] = true
        }

        // Last login value should exist if user has logged in before
        if(person.lastLogin == null) {
            person.lastLogin = new Date()
        }

        // update last logged in if we haven't already done so and update name in case it changed (marriage, divorce etc)
        // The real name is the display name provided by the custom security module.
        if (!session["savedLastLogin"]) {
            Person.withTransaction {
                person.prevLogin = person.lastLogin
                person.lastLogin = new Date()

                if (userDisplayName != username) {
                    person.userRealName = userDisplayName
                }

                person.authorities = roles
                person.save(flush:true)
            }
            session["savedLastLogin"] = true
        }

        loadAdminData(person)
        person
    }

    @Timed
    private def createAutomaticGroupRecords() {
        def userGroupNames = accountService.getLoggedInAutomaticUserGroups()*.owfGroupName

        // Don't assume the user has any groups.  Monitoring agents might not
        // have any and if the list is empty, the criteria query below will
        // bomb.  Bail early....
        if (!userGroupNames || userGroupNames.isEmpty()) {
            return
        }

        def userGroupAttribs = [:]
        accountService.getLoggedInAutomaticUserGroups().each {
            userGroupAttribs.put(it.owfGroupName, [email: it.owfGroupEmail, desc: it.owfGroupDescription])
        }

        def existingGroupNames = Group.withCriteria {
            'in'('name', userGroupNames)
            projections {
                property('name')
            }
        }
        userGroupNames.removeAll(existingGroupNames)

        // Now that we have the list of existing group names among those
        // that belong to the user, remove that list and focus on the ones
        // that don't yet exist.
        //
        // NOTE: make sure to keep people initialized as an empty list or you'll
        // be hating life later when you go to add the current user to the group
        // -- you'll get NPE.
        userGroupNames.each {
            try {
                def group = new Group(
                    name: it,
                    displayName: it,
                    description: userGroupAttribs.get(it).desc,
                    email: userGroupAttribs.get(it).email,
                    automatic: true,
                    status: 'active',
                    people: []
                )
                group.save(flush: true)
            } catch (Exception e) {
                // Chew.  We don't want the exception bubbling back.
            }
        }
    }

    @Timed
    private void updateUserGroups () {
        def session = WebUtils.retrieveGrailsWebRequest().session
        if (session["savedUserGroups"]) {
            return
        }

        def userGroupNames = accountService.getLoggedInAutomaticUserGroups()*.owfGroupName
        def username = accountService.getLoggedInUsername()

        try {
            def personInDB = accountService.getLoggedInUser()

            def groupsToRemove = Group.withCriteria {
                eq('automatic', true)
                people {
                    eq('username', username)
                }

                if (userGroupNames.size()) {
                    not {
                        'in'('name', userGroupNames)
                    }
                }

                projections {
                    property('id')
                }
                cache false
            }

            // Adds are two-step:  find all the groups we have already and subtract
            // them out of the list of group names, then find the groups
            // corresponding to the remaining names and add those to the person.
            def existingUserGroupNames = Group.withCriteria {
                eq('automatic', true)
                people {
                    eq('username', username)
                }
                projections {
                    property('name')
                }
                cache false
            }
            userGroupNames.removeAll(existingUserGroupNames)


            // Find groups to assign to user
            def groupsToCreate = []
            if (!userGroupNames.isEmpty()) {
                groupsToCreate = Group.withCriteria {
                    eq('automatic', true)
                    'in'('name', userGroupNames)
                    projections {
                        property('id')
                    }
                    cache false
                }
            }

            // Now, we have a list of ids for groups we should remove and groups
            // we should add. Since the owf_group_people table is not managed
            // we're actually dropping to native SQL for the changes.
            def hSession = Holders.applicationContext.sessionFactory.getCurrentSession()
            def delQuery = "DELETE FROM owf_group_people WHERE person_id = ? AND group_id = ?"
            def addQuery = "INSERT INTO owf_group_people (person_id, group_id) VALUES (?, ?)"
            groupsToRemove.each {
                hSession.createSQLQuery(delQuery)
                        .setLong(0, personInDB.id)
                        .setLong(1, it)
                        .executeUpdate()
            }
            groupsToCreate.each {
                hSession.createSQLQuery(addQuery)
                        .setLong(0, personInDB.id)
                        .setLong(1, it)
                        .executeUpdate()
            }
            session["savedUserGroups"] = true

            if (groupsToRemove.size() > 0 || groupsToCreate.size() > 0) {
            	accountService.sync(personInDB, true)
            }
        }
        catch (Exception e) {
            // Chew.  We don't want the exception bubbling back.
            log.warn "failed to update groups for user ${username} in database, message: ${e.toString()}"
        }
    }

    @Timed
    private void setUserDefaults (String username) {
        Person.withTransaction {
            def newUser = Person.findByUsername(Person.NEW_USER, [cache:true])
            def oldAuthentication
            try {
                // temporarily give user admin privileges if they don't already have them so that
                // we can safely call our services for setting the user defaults
                if(Environment.current == Environment.PRODUCTION) {
                    oldAuthentication = SCH.context.authentication
                    def oldPrincipal = oldAuthentication.principal
                    def temporaryPrincipal = new OWFUserDetailsImpl(oldPrincipal.username, oldPrincipal.password, [ new org.springframework.security.core.authority.GrantedAuthorityImpl('ROLE_ADMIN') ], [])
                    SCH.context.authentication = new PreAuthenticatedAuthenticationToken(temporaryPrincipal, temporaryPrincipal.getPassword());
                }

                def personInDB = Person.findByUsername(username, [cache:true])

                if (newUser && personInDB) {
                    def widgets = newUser.personWidgetDefinitions*.widgetDefinition
                    personWidgetDefinitionService.bulkAssignMultipleWidgetsForSingleUser(personInDB, widgets)

                    // Skip if dashboard belongs to a stack, it will be added as a
                    // result of adding the user to the stack next
                    def dashboards = Dashboard.findAllByUserAndStackIsNull(newUser)
                    dashboards.each { db ->
                        administrationService.cloneDashboards([
                            checkedTargets: personInDB.id,
                            guid: db.guid,
                            isdefault: db.isdefault,
                            name: db.name,
                            description: db.description,
                            locked: db.locked,
                            layoutConfig: db.layoutConfig
                        ])
                    }

                    //Get all stack default groups DEFAULT_USER is in
                    def stackDefaultGroups = newUser.getStackDefaultGroups()

                    stackDefaultGroups.each { stackDefaultGroup ->
                        log.info 'Adding DEFAULT_USER stacks to new user'

                        //Add the new user to the stack's default group
                        stackDefaultGroup.addToPeople(personInDB)
                        stackDefaultGroup.save(flush: true, failOnError: true)
                    }

                    def preferences = Preference.findAllByUser(newUser, [cache:true])
                    preferences.each{ pref ->
                        log.info 'Adding DEFAULT_USER preferences to new user'
                        administrationService.clonePreference([
                            checkedTargets: personInDB.id,
                            namespace: pref.namespace,
                            path: pref.path,
                            value: pref.value
                        ])
                    }
                }
                else {
                    log.info 'No need to copy default dashboards, stacks, prefs and widgets, newUser or personInDb is null'
                }
            }
            catch(Exception e) {
                e.printStackTrace()
            }
            finally {
                if (oldAuthentication) {
                    try {
                        SCH.context.authentication = oldAuthentication
                    }
                    catch (Exception e) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }

    @Timed
    private loadAdminData(admin) {

        def id = null
        if (accountService.getLoggedInUserIsAdmin()) {

            WidgetDefinition.withTransaction {
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
                        imageUrlMedium: 'themes/common/images/adm-tools/Users64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Users24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/UserManagement.gsp',
                        widgetVersion: '1.0',
                        width: 818
                    )
                    userAdmin.addToWidgetTypes(adminWidgetType)
                    userAdmin = saveInstance(userAdmin)
                }

                def userEdit = WidgetDefinition.findByWidgetUrl('admin/UserEdit.gsp',[cache:true]);
                if (userEdit == null) {
                    id = generateId()
                    userEdit = new WidgetDefinition(
                        displayName: 'User Editor',
                        visible: false,
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Users64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Users24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/UserEdit.gsp',
                        widgetVersion: '1.0',
                        width: 581
                    )
                    userEdit.addToWidgetTypes(adminWidgetType)
                    userEdit = saveInstance(userEdit)
                }

                def widgetAdmin = WidgetDefinition.findByWidgetUrl('admin/WidgetManagement.gsp',[cache:true]);
                if (widgetAdmin == null) {
                    id = generateId()
                    widgetAdmin = new WidgetDefinition(
                        displayName: 'App Components',
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Widgets64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Widgets24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/WidgetManagement.gsp',
                        widgetVersion: '1.0',
                        width: 818
                    )
                    widgetAdmin.addToWidgetTypes(adminWidgetType)
                    widgetAdmin = saveInstance(widgetAdmin)
                }

                def widgetEdit = WidgetDefinition.findByWidgetUrl('admin/WidgetEdit.gsp',[cache:true]);
                if (widgetEdit == null) {
                    id = generateId()
                    widgetEdit = new WidgetDefinition(
                        displayName: 'App Component Editor',
                        visible: false,
                        height: 493,
                        imageUrlMedium: 'themes/common/images/adm-tools/Widgets64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Widgets24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/WidgetEdit.gsp',
                        widgetVersion: '1.0',
                        width: 581
                    )
                    widgetEdit.addToWidgetTypes(adminWidgetType)
                    widgetEdit = saveInstance(widgetEdit)
                }

                def groupAdmin = WidgetDefinition.findByWidgetUrl('admin/GroupManagement.gsp',[cache:true]);
                if (groupAdmin == null) {
                    id = generateId()
                    groupAdmin = new WidgetDefinition(
                        displayName: 'Groups',
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Groups64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Groups24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/GroupManagement.gsp',
                        widgetVersion: '1.0',
                        width: 818
                    )
                    groupAdmin.addToWidgetTypes(adminWidgetType)
                    groupAdmin = saveInstance(groupAdmin)
                }

                def groupEdit = WidgetDefinition.findByWidgetUrl('admin/GroupEdit.gsp',[cache:true]);
                if (groupEdit == null) {
                    id = generateId()
                    groupEdit = new WidgetDefinition(
                        displayName: 'Group Editor',
                        visible: false,
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Groups64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Groups24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/GroupEdit.gsp',
                        widgetVersion: '1.0',
                        width: 581
                    )
                    groupEdit.addToWidgetTypes(adminWidgetType)
                    groupEdit = saveInstance(groupEdit)
                }

                def dashboardEdit = WidgetDefinition.findByWidgetUrl('admin/DashboardEdit.gsp',[cache:true]);
                if (dashboardEdit == null) {
                    id = generateId()
                    dashboardEdit = new WidgetDefinition(
                        displayName: 'Page Editor',
                        visible: false,
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Dashboards64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Dashboards24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/DashboardEdit.gsp',
                        widgetVersion: '1.0',
                        width: 581
                    )
                    dashboardEdit.addToWidgetTypes(adminWidgetType)
                    dashboardEdit = saveInstance(dashboardEdit)
                }

                def stackAdmin = WidgetDefinition.findByWidgetUrl('admin/StackManagement.gsp',[cache:true]);
                if (stackAdmin == null) {
                    id = generateId()
                    stackAdmin = new WidgetDefinition(
                        displayName: 'Apps',
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Stacks64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Stacks24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/StackManagement.gsp',
                        widgetVersion: '1.0',
                        width: 818
                    )
                    stackAdmin.addToWidgetTypes(adminWidgetType)
                    stackAdmin = saveInstance(stackAdmin)
                }

                def stackEdit = WidgetDefinition.findByWidgetUrl('admin/StackEdit.gsp',[cache:true]);
                if (stackEdit == null) {
                    id = generateId()
                    stackEdit = new WidgetDefinition(
                        displayName: 'App Editor',
                        visible: false,
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Stacks64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Stacks24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/StackEdit.gsp',
                        widgetVersion: '1.0',
                        width: 581
                    )
                    stackEdit.addToWidgetTypes(adminWidgetType)
                    stackEdit = saveInstance(stackEdit)
                }

                def configurationWidget = WidgetDefinition.findByWidgetUrl('admin/Configuration.gsp',[cache:true]);
                if (configurationWidget == null) {
                    id = generateId()
                    configurationWidget = new WidgetDefinition(
                        displayName: 'Configuration',
                        height: 440,
                        imageUrlMedium: 'themes/common/images/adm-tools/Configuration64.png',
                        imageUrlSmall: 'themes/common/images/adm-tools/Configuration24.png',
                        widgetGuid: id,
                        widgetUrl: 'admin/Configuration.gsp',
                        widgetVersion: '1.0',
                        width: 900
                    )
                    configurationWidget.addToWidgetTypes(adminWidgetType)
                    configurationWidget = saveInstance(configurationWidget)
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

                // Add admin widgets back to the admin if they are gone for some reason.
                def adminGroup = Group.findByNameAndAutomatic('OWF Administrators', true, [cache:true])
                if (adminGroup != null) {

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
                }
            }
        }
    }

    private generateId( ) {
        return java.util.UUID.randomUUID().toString()
    }

    private def saveInstance (instance) {
        if (instance.save(flush:true) == null) {
            log.info "ERROR: ${instance} not saved - ${instance.errors}"
        } else {
            log.debug "${instance.class}:${instance} saved"
        }
        return instance
    }

}
