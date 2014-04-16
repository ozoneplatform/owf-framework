
package ozone.owf.grails.services

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONObject
import org.hibernate.CacheMode
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetType

class StackService {

    def accountService
    def serviceModelService
    def dashboardService
    def domainMappingService
    def groupService
    def widgetDefinitionService

    def grailsApplication

    private static def addFilter(name, value, c) {
        c.with {
            switch (name) {
                case 'group_id':
                    groups {
                        eq('id', value.toLong())
                    }
                    break
                default:
                    ilike(name, "%" + value + "%")
            }
        }
    }

    def list(params) {

        def criteria = Stack.createCriteria()
        def opts = [:]

        if (params?.offset != null) opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
        if (params?.max != null) opts.max =(params.max instanceof String ? Integer.parseInt(params.max) : params.max)

        def results = criteria.list(opts) {

            if (params?.id)
                eq("id", Long.parseLong(params.id))

            // Apply any filters
            if (params.filters) {
                if (params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        JSON.parse(params.filters).each { filter ->
                            ilike(filter.filterField, "%" + filter.filterValue + "%")
                        }
                    }
                } else {
                    JSON.parse(params.filters).each { filter ->
                        ilike(filter.filterField, "%" + filter.filterValue + "%")
                    }
                }
            } else if (params.filterName && params.filterValue) {
                def filterNames = params.list('filterName')
                def filterValues = params.list('filterValue')

                if (params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        filterNames.eachWithIndex { filterName, i ->
                            ilike(filterName, "%" + filterValues[i] + "%")
                        }
                    }
                } else {
                    filterNames.eachWithIndex { filterName, i ->
                        ilike(filterName, "%" + filterValues[i] + "%")
                    }
                }
            }

            if (params.group_id) {
                addFilter('group_id', params.group_id, criteria)
            }

            if (params.user_id) {
                groups {
                    eq('stackDefault', true)
                    people {
                        eq('id', Long.parseLong(params.user_id))
                    }
                }
            }

            // Sort
            if (params?.sort) {
                order(params.sort, params?.order?.toLowerCase() ?: 'asc')
            }
            else {
                //default sort
                order('name', params?.order?.toLowerCase() ?: 'asc')
            }

            cache(true)
            cacheMode(CacheMode.GET)
        }

        def stackList = []
        results.collect { tempStack ->

            def totalGroups = Group.withCriteria {
                cacheMode(CacheMode.GET)
                eq('stackDefault', false)
                stacks {
                    eq('id', tempStack.id)
                }
                projections { rowCount() }
            }

            def totalUsers = Person.withCriteria {
                cacheMode(CacheMode.GET)
                groups {
                    eq('stackDefault', true)
                    stacks {
                        eq('id', tempStack.id)
                    }
                    projections { rowCount() }
                }
            }

            def stackDefaultGroup = tempStack.findStackDefaultGroup()
            def totalDashboards = (stackDefaultGroup != null) ? domainMappingService.countMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE) : 0

            // OP-2297: this is used to find out if dashboards associated with this stack are of type marketplace,
            // and if so, we don't want to return these since these are transparent to the end user
            def marketplaceDashboard = Dashboard.withCriteria {
                cacheMode(CacheMode.GET)
                eq('type','marketplace')
                stack {
                    eq('id', tempStack.id)
                }
            }

            // iwe only want to return this stack if it does NOT have marketplace dashboards in it
            if (marketplaceDashboard.size() == 0) {
                stackList.add(serviceModelService.createServiceModel(tempStack,[
                    totalDashboards: totalDashboards,
                    totalUsers: totalUsers[0],
                    totalGroups: totalGroups[0]
                ]))
            }

        }

        return [data: stackList, results: results.totalCount]

    }

    def createOrUpdate(params) {
        def stacks = []

        if (params.id) {
            params.id = params.id as Integer
        }
        if (params.stack_id) {
            params.stack_id = params.stack_id as Integer
        }

        if (params.update_action) {
            if(params.id >= 0 || params.stack_id >= 0) {
                ensureAdminOrOwner(params.id >= 0 ? params.id: params.stack_id);
            }

            stacks << params
        } else {
            if (params.data) {
                def json = JSON.parse(params.data)

                if (json instanceof List) {
                    json.each {
                        if(it.id >= 0 || it.stack_id >= 0) {
                            ensureAdminOrOwner(it.id >= 0 ? it.id: it.stack_id);
                        }
                    }

                    stacks = json
                } else {
                    if(json.id >= 0 || json.stack_id >= 0) {
                        ensureAdminOrOwner(json.id >= 0 ? json.id: json.stack_id);
                    }

                    stacks << json
                }
            } else {
                if(params.id || params.stack_id) {
                    if(params.id >= 0 || params.stack_id >= 0) {
                        ensureAdminOrOwner(params.id >= 0 ? params.id: params.stack_id);
                    }
                }

                stacks << params
            }
        }

        def results = stacks.collect { updateStack(it) }

        [success:true, data:results.flatten()]
    }

    private def updateStack(params) {
        def stack, returnValue = null

        if (params?.stack_id){
            params.stack_id = (params.stack_id instanceof String ? Integer.parseInt(params.stack_id) : params.stack_id)
        }

        if (params?.id >= 0 || params.stack_id  >= 0) {  // Existing Stack
            params.id = (params?.id >= 0 ? params.id : params.stack_id)
            stack = Stack.findById(params.id, [cache: true])
            if (!stack) {
                throw new OwfException(message: 'Stack ' + params.id + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
        } else { // New Stack
            stack = createStack()
        }

        if (!params.update_action) {

            //If context was modified and it already exists, throw a unique constrain error
            if(params.stackContext && params.stackContext != stack.stackContext) {
                if(Stack.findByStackContext(params.stackContext)) {
                    throw new OwfException(message: 'Another stack uses ' + params.stackContext + ' as its URL Name. '
                        + 'Please select a unique URL Name for this stack.', exceptionType: OwfExceptionTypes.GeneralServerError)
                }
            }

            def loggedInUser = accountService.getLoggedInUser()

            // In Groovy, an empty string evaluates to false, so check params explicitly for null
            stack.properties = [
                name: params.name != null ? params.name : stack.name,
                description: params.description != null ? params.description : stack.description,
                imageUrl: params.imageUrl != null ? params.imageUrl : stack.imageUrl,
                stackContext: params.stackContext ?: stack.stackContext ?: UUID.randomUUID().toString(),
                descriptorUrl: params.descriptorUrl ?: stack.descriptorUrl,
                //If param owner isn't null and user is admin, check if previous owner is different
                //and new user is the logged in user, if so set user to the owner
                owner: !params.owner?.equals(null) && accountService.getLoggedInUserIsAdmin() ?
                            (stack.owner?.username != params.owner?.username &&
                            params.owner?.username == loggedInUser?.username ? loggedInUser :
                            stack.owner) : stack.owner
            ]

            // OP-2494 Commented out this fix for OP-2287, because Drew said that the fix wasn't
            // complete and it was causing a NullPointerException when a stack was added to OWF
            // from the store
            if (stack.id != null) {
                stack.uniqueWidgetCount = widgetDefinitionService.list([stack_id: stack.id]).results
            }
            stack = stack.save(flush: true, failOnError: true)

            def stackDefaultGroup = stack.findStackDefaultGroup()

            //OP-70 adding owner to users by default
            if(stackDefaultGroup && loggedInUser) {
                stackDefaultGroup.addToPeople(loggedInUser)
            }

            def totalDashboards = (stackDefaultGroup != null) ? domainMappingService.countMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE) : 0

            returnValue = serviceModelService.createServiceModel(stack,[
                totalDashboards: totalDashboards,
                totalUsers: stack.findStackDefaultGroup()?.people ? stack.findStackDefaultGroup().people.size() : 0,
                totalGroups: stack.groups ? stack.groups.size() - 1 : 0, // Don't include the default stack group
                totalWidgets: stack.uniqueWidgetCount
            ])
        } else {
            if ('groups' == params.tab) {

                def updatedGroups = []
                def groups = JSON.parse(params.data)

                groups?.each { it ->
                    def group = Group.findById(it.id.toLong(), [cache: true])
                    if (group) {
                        if (params.update_action == 'add') {
                            stack.addToGroups(group)
                        } else if (params.update_action == 'remove') {
                            //Remove all references to stack for all the groups' user's dashboards in the stack
                            group.people?.each { user ->
                                removeUserStackDashboards(user, stack, group)
                            }
                            stack.removeFromGroups(group)
                            dashboardService.purgePersonalDashboards(stack, group)
                        }

                        updatedGroups << group
                    }
                }
                if (!updatedGroups.isEmpty()) {
                    returnValue = updatedGroups.collect{ serviceModelService.createServiceModel(it) }
                }
            } else if ('users' == params.tab) {

                def stackDefaultGroup = stack.findStackDefaultGroup()

                def updatedUsers = []
                def users = JSON.parse(params.data)

                users?.each { it ->
                    def user = Person.findById(it.id.toLong(), [cache: true])
                    if (user) {
                        if (params.update_action == 'add') {
                            stackDefaultGroup.addToPeople(user)
                        } else if (params.update_action == 'remove') {
                            deleteUserFromStack(stack, user)
                            stackDefaultGroup.removeFromPeople(user)
                        }

                        updatedUsers << user
                    }
                }
                if (!updatedUsers.isEmpty()) {
                    returnValue = updatedUsers.collect{ serviceModelService.createServiceModel(it) }
                }
            }
            else if ('dashboards' == params.tab) {
                // Add the general dashboard definition to the default
                // stack group.
                def updatedDashboards = []
                def dashboardsToCopy = []
                def dashboards = JSON.parse(params.data)

                def stackDefaultGroup = stack.findStackDefaultGroup()

                dashboards?.each { it ->
                    def dashboard = Dashboard.findByGuid(it.guid)

                    if (dashboard) {
                        if (params.update_action == 'remove') {
                            // Find all clones.
                            def clones = domainMappingService.getMappedObjects([id:dashboard.id,TYPE:Dashboard.TYPE],
                                RelationshipType.cloneOf,Dashboard.TYPE,[:],{},'dest')

                            // Set their stack to null and remove it's clone record.
                            clones?.each{ clone ->
                                domainMappingService.deleteMapping(clone, RelationshipType.cloneOf,dashboard)
                                clone.delete()
                            }

                            // Remove the mapping to the group.
                            domainMappingService.deleteMapping(stackDefaultGroup,RelationshipType.owns,dashboard)

                            // Delete the dashboard.
                            dashboard.delete(flush: true)
                            updatedDashboards << dashboard
                        }
                        else if (params.update_action == 'add') {
                            dashboardsToCopy << it
                        }
                    }
                }

                // Copy any new instances to the default group.  Save the results for the return value.
                if (!dashboardsToCopy.isEmpty()) {
                    def copyParams = [:]
                    copyParams.dashboards = (dashboardsToCopy as JSON).toString()
                    copyParams.groups = []
                    copyParams.groups << serviceModelService.createServiceModel(stackDefaultGroup)
                    copyParams.groups = (copyParams.groups as JSON).toString()
                    copyParams.isGroupDashboard = true;
                    copyParams.stack = stack
                    returnValue = groupService.copyDashboard(copyParams).msg;
                }
                // Append the service models for any deleted dashboards.
                if (!updatedDashboards.isEmpty()) {
                    def serviceModels = updatedDashboards.collect{ serviceModelService.createServiceModel(it) }
                    if (returnValue != null){
                        returnValue = (returnValue << updatedDashboards).flatten()
                    }
                    else {
                        returnValue = serviceModels
                    }
                }

                // Add any widgets to the stack's default group if not already there.
                widgetDefinitionService.reconcileGroupWidgetsFromDashboards(stackDefaultGroup, false)

                // Update the unique widgets now contained in the stack's dashboards.
                stack.uniqueWidgetCount = widgetDefinitionService.list([stack_id: stack.id]).results
                stack.save(flush: true, failOnError: true)
            }
        }

        return returnValue
    }

    /**
     * Creates a stack given optional parameters along with tht stack's default group
     * @param stackParams
     * @return
     */
    def Stack createStack(def stackParams) {
        Stack stack = stackParams ? new Stack(stackParams) : new Stack()
        Group defaultGroup = new Group(name: UUID.randomUUID().toString(), stackDefault: true)
        stack.addToGroups(defaultGroup)
        stack
    }

    def restore(params) {
        def stack = Stack.findById(params.id)

        if (stack == null) {
            throw new OwfException(message:'Stack ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
        }
        def user = accountService.getLoggedInUser()
        def userStackDashboards = Dashboard.findAllByUserAndStack(user, stack)
        def updatedDashboards = []
        userStackDashboards?.each { userStackDashboard ->

            updatedDashboards.push(dashboardService.restore([
                    guid: userStackDashboard.guid
                ]).data[0])
        }

                reorderUserDashboards(params)

        def stackDefaultGroup = stack.findStackDefaultGroup()
        def totalDashboards = (stackDefaultGroup != null) ? domainMappingService.countMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE) : 0

        return [success:true, updatedDashboards: updatedDashboards]
    }

    def reorderUserDashboards(params) {
        def stack = Stack.findById(params.id)
        def user = accountService.getLoggedInUser()
        def userStackDashboards = Dashboard.findAllByUserAndStack(user, stack, [sort:'dashboardPosition', order:'asc'])
        if (userStackDashboards?.size > 0) {
            def firstPos = userStackDashboards[0].dashboardPosition
            userStackDashboards?.each { userStackDashboard ->
                def groupDashboardMappings = domainMappingService.getMappings(userStackDashboard, RelationshipType.cloneOf, Dashboard.TYPE)
                if (groupDashboardMappings[0] != null) {
                    def groupDash = Dashboard.get(groupDashboardMappings[0].destId)
                    if (groupDash != null) {
                        def args = [:]
                        args.guid = userStackDashboard.guid
                        args.dashboardPosition = firstPos + groupDash?.dashboardPosition - 1
                        dashboardService.updateDashboard(args, user, userStackDashboard)
                    }
                }
            }
        }
    }

    /**
     * Remove the user form stack's default group and all the user's personal dashboards from that stack
     * @param stack
     * @return
     */
    def Stack deleteUserFromStack(Stack stack, Person user = null) {
        if(user == null) {
            user = accountService.getLoggedInUser();
        }

        boolean userAssignedToStackThroughGroup = userAssignedToStackThroughGroup(stack, user)

        if (!userAssignedToStackThroughGroup) {
            def stackDefaultGroup = stack.findStackDefaultGroup()
            stackDefaultGroup.removeFromPeople(user)

            // Remove all user dashboards that are in the stack
            def userStackDashboards = Dashboard.findAllByUserAndStack(user, stack)
            userStackDashboards?.each { userStackDashboard ->
                dashboardService.deletePersonalDashboard(userStackDashboard)
            }
        }
        stack
    }

    boolean userAssignedToStackThroughGroup(Stack stack, Person user) {
        def stackDefaultGroup = stack.findStackDefaultGroup()
        Set<Group> groups = []
        groups.addAll(stack.groups)
        groups.remove(stackDefaultGroup)
        groups.add(groupService.allUsersGroup)
        if (accountService.isUserAdmin(user)) groups.add(groupService.allAdminsGroup)

        groups.find { Group group ->
            group != stackDefaultGroup && group && group.people && group.people.contains(user)
        } as boolean
    }

    def isStackOwner(Stack stack) {
        stack?.owner?.id == accountService.getLoggedInUser()?.id
    }

    /**
     * Disassociates the given stack and group. Deletes all personal dashboards of the group's user that belong to that stack.
     * @param stack
     * @param group
     */
    def void removeStackFromGroup(Stack stack, Group group) {

    }

    /**
     * Deletes one or more stacks from the parameters.
     * @param params
     * @return
     */
    def delete(params) {
        def stackParams

        if (params.data) {
            def json = JSON.parse(params.data)
            stackParams = [json].flatten()
        } else {
            stackParams = params.list('id').collect {
                [id:it]
            }
        }

        def stacks = []
        stackParams.each {
            Stack stack = Stack.findById(it.id)
            // Handle user deletion of their stack association and data.
            boolean isAdmin = accountService.getLoggedInUserIsAdmin()
            boolean adminEnabled = (params.adminEnabled == true  || params.adminEnabled == 'true')
            if ((isAdmin && adminEnabled)) {
                // Handle administrative removal of stacks.
                if (stack) deleteStack(stack)
                stacks << it
            } else {
                // The user cannot delete the stacks - remove that user and his dashboards from the stack
               stacks << deleteUserFromStack(stack);
            }
        }

        return [success: true, data: stacks]
    }

    /**
     * Deletes the given stack
     * @param stack
     */
    protected void deleteStack(Stack stack) {
        def dashboards = Dashboard.findAllByStack(stack)
        def defaultDashboards = []
        // Delete the association with any existing dashboard instances.
        dashboards.each { dashboard ->
            // Remove and clean up any user instances of stack dashboards.
            if (dashboard.user != null) {
                domainMappingService.deleteMappings(dashboard, RelationshipType.cloneOf, Dashboard.TYPE)
                dashboard.delete()
            }
            // Save the stack's master copy of its dashboards for deletion after associated group/stack
            // mappings have been cleared.
            else {
                defaultDashboards << dashboard
            }
        }
        // Remove the default stack group
        Group defaultStackGroup = stack?.groups?.find { it.stackDefault }
        if (defaultStackGroup) {
            stack.removeFromGroups(defaultStackGroup);
            stack.save()
            groupService.delete(["data": "{id: ${defaultStackGroup.id}}"])
        }

        // Delete the stacks's master dashboards.
        defaultDashboards?.each { dashboard ->
            dashboard.delete()
        }

        // Delete the stack.
        stack?.delete(flush: true, failOnError: true)
    }

    def importStack(params) {
        //ensureAdmin() removed for OP-70

        def stackParams = [:]
        params.data = JSON.parse(params.data)
        stackParams.name = params.data.name
        stackParams.description = params.data.description.equals(null) ? "" : params.data.description
        stackParams.stackContext = params.data.stackContext
        stackParams.descriptorUrl = params.data.descriptorUrl.equals(null)  ? "" : params.data.descriptorUrl
        stackParams.imageUrl = params.data.imageUrl ?: ''

        def s = createOrUpdate(stackParams)
        def stack = Stack.findById(s.data[0].id)
        def stackDefaultGroup = stack.findStackDefaultGroup()

        // create widgets from stack descriptor json
        def widgets = params.data.widgets
        def oldToNewGuids = [:]
        widgets.each {
            def widget = WidgetDefinition.findByWidgetGuid(it.widgetGuid)

            def tags = []
            if (it.defaultTags && it.defaultTags.length() > 0) {
                for (def i = 0 ; i < it.defaultTags.length() ; i++) {
                    def name = it.defaultTags.get(i)
                    if (name != '') {
                        def tag = [:]
                        tag.put('name', name)
                        tag.put('visible', true)
                        tag.put('position', -1)
                        tag.put('editable', true)
                        tags.push(new JSONObject(tag))
                    }
                }
            }
            if(!tags.isEmpty()){
                it.tags = tags
            }
            def types = []
            if(it.widgetTypes){
                def type = WidgetType.findByName(it.widgetTypes[0])
                def t = [:]
                t.put("id", type.id)
                t.put("name", type.name)
                types.push(new JSONObject(t))
                it.widgetTypes = types
            }
            it.stackDescriptor = true
            if(widget) {
                it.id = it.widgetGuid
            }
            def oldGuid = it.widgetGuid
            widget = widgetDefinitionService.createOrUpdate(it)
            if(!(oldGuid.equals(widget.data[0].id))){
                oldToNewGuids[oldGuid] = widget.data[0].id
            }
        }

        // create dashboards from stack descriptor json
        def dashboards = params.data.dashboards

        dashboards.each {
            def json = it.toString()
            oldToNewGuids.each {old, changed ->
                json = json.replace(old, changed)
            }
            json = json.replace(it.guid, UUID.randomUUID().toString())
            it = new JSONObject(json)
            changeWidgetInstanceIds(it.layoutConfig)
            it.isGroupDashboard = true
            it.isdefault = false
            it.stack = stack
            def dashboard = dashboardService.createOrUpdate(it).dashboard
            domainMappingService.createMapping(stackDefaultGroup, RelationshipType.owns, dashboard)
        }

        // Add any widgets to the stack's default group if not already there.
        widgetDefinitionService.reconcileGroupWidgetsFromDashboards(stackDefaultGroup, false)

        //Update the uniqueWidgetCount of the stack
        stack.uniqueWidgetCount = widgets.length()
        stack.save(flush: true, failOnError: true)
    }

    private def changeWidgetInstanceIds(layoutConfig) {

		def widgets = layoutConfig.widgets
		for(def i = 0; i < widgets?.size(); i++) {
			widgets[i].put("uniqueId", UUID.randomUUID().toString())
		}

		def items = layoutConfig.items
		for(def i = 0; i < items?.size(); i++) {
			changeWidgetInstanceIds(items[i])
		}
	}

    private def createStackData(params) {

        def stack = Stack.findById(params.id, [cache: true])
        def owner = stack.owner
        boolean noMarketplaces = !widgetDefinitionService.hasMarketplace().data

        // if no marketplace exits, approve stack
        if(noMarketplaces) {
            stack.approved = true
            stack.save()
        }

        //Construct the list of dashboards for the descriptor
        def dashboards = []
        def stackGroup = stack.findStackDefaultGroup()
        if(stackGroup != null) {
            domainMappingService.getMappings(stackGroup, RelationshipType.owns, Dashboard.TYPE).eachWithIndex { it, i ->

                def dashboard = Dashboard.findById(it.destId);
                dashboardService.syncDashboardForPublish(dashboard, owner)

                //Get only the parameters required for a dashboard definition
                def dashboardData = [
                        'name': dashboard.name,
                        'guid': dashboard.guid,
                        'description': dashboard.description,
                        'type': dashboard.type,
                        'isdefault': dashboard.isdefault,
                        'locked': dashboard.locked,
                        'dashboardPosition': dashboard.dashboardPosition,
                        'layoutConfig': JSON.parse(dashboard.layoutConfig)
                ]

                dashboards.push(dashboardData)
            }
        }

        def widgets = []
        widgetDefinitionService.list([stack_id: stack.id], true).data.eachWithIndex { widget, i ->

            def widgetDefinition = serviceModelService.createServiceModel(widget)
                .toDataMap().value

            //Get only the values required for a widget definition
            def widgetData = [
                    "widgetGuid": widget.widgetGuid,
                    "descriptorUrl": widgetDefinition.descriptorUrl,
                    "universalName": widgetDefinition.universalName,
                    "displayName": widgetDefinition.namespace,
                    "description": widgetDefinition.description,
                    "widgetVersion": widgetDefinition.widgetVersion,
                    "widgetUrl": widgetDefinition.url,
                    "imageUrlSmall": widgetDefinition.smallIconUrl,
                    "imageUrlLarge": widgetDefinition.largeIconUrl,
                    "width": widgetDefinition.width,
                    "height": widgetDefinition.height,
                    "visible": widgetDefinition.visible,
                    "singleton": widgetDefinition.singleton,
                    "background": widgetDefinition.background,
                    "widgetTypes": [widgetDefinition.widgetTypes[0].name],
                    "intents": widgetDefinition.intents
            ]
            def tags = []
            widgetDefinition.tags.each { tags.push(it.name) }
            widgetData.put("defaultTags", tags)

            widgets.push(widgetData)

            //add the widget to the stack's group
            domainMappingService.createMapping(stackGroup, RelationshipType.owns, widget)
        }

        //Get only the parameters required for a stack descriptor
        return [
                'name': stack.name,
                'stackContext': stack.stackContext,
                'description': stack.description,
                'imageUrl': stack.imageUrl,
                'dashboards': dashboards,
                'widgets': widgets
        ]
    }

    /**
     * Generates a stack JSON structure for sharing.  Also performs any internal
     * cleanup needed in order to sync the owner's view of the stack with others.
     * This includes deleting dashboards that are marked for deletion and setting
     * isPublished on all pages (dashboards)
     */
    def share(params)  {

        // Only owner of stack can push to store
        ensureOwner(params.id)
        def stackData = createStackData(params)
        stackData =  (stackData as JSON)
        return stackData
    }

    def export(params) {

        // Only admins may export Stacks
        ensureAdmin()

        def stackData = createStackData(params)

        //Pretty print the JSON to be put as part of descriptor
        stackData = (stackData as JSON).toString(true)

        // Get the empty descriptor with appropriate JavaScript
        def stackDescriptor

        if (grails.util.GrailsUtil.environment != 'production') {
            stackDescriptor = new File('./src/resources/empty_descriptor.html').text
        } else {
            // Search classpath since different servlet containers can store
            // files in any number of places
            def resource = grailsApplication.mainContext.getResource('classpath:empty_descriptor.html')
            stackDescriptor = resource.getFile().text
        }

        stackDescriptor = stackDescriptor.replaceFirst("var data;", java.util.regex.Matcher.quoteReplacement("var data = ${stackData};"))

        return stackDescriptor

    }

    def addPage(params) {

        def stackParams = JSON.parse(params.stackData)
        def dashboardParams = JSON.parse(params.dashboardData)

        // Extract stack id
        int stackId = stackParams?.id as int

        Stack stack

        Person currentUser = accountService.getLoggedInUser()

        // check if the stack is the apps mall stack
        boolean isMarketplaceApp = false
        if (stackParams?.stackContext == 'store.ozone.org') {
            stack = Stack.findByStackContext('store.ozone.org')
            stackId = stack?.id
            isMarketplaceApp = true
        }

        // If adding page to an existing stack, assure the user has permission to do so.
        if (stackId) {
            // only ensure it is admin or owner if not adding a marketplace page
            if (!isMarketplaceApp)
                ensureAdminOrOwner(stackId)

            stack = Stack.get(stackId)
        } else {
            // If the stack is new, create it
            stack = createStack(stackParams)

            //If owner param is present (including explicitly null), set it to that,
            //otherwise, on update do not change, and on create set to current user
            def owner = params.owner ?: (params.id  >= 0 ? stack.owner :
                accountService.getLoggedInUser())
            if (owner == JSONObject.NULL) {
                owner = null
            }
            stack.setOwner(owner)
            if (!stack.stackContext) stack.setStackContext(UUID.randomUUID().toString())
            stack = stack.save(flush: true, failOnError: true)
        }

        def stackDefaultGroup = stack.findStackDefaultGroup()

        // Adding owner to users by default
        if(stackDefaultGroup) {
            stackDefaultGroup.addToPeople(currentUser)
        }

        // Add the page to the stack as a stack dashboard
        dashboardParams.cloned = true
        dashboardParams.isGroupDashboard = true
        dashboardParams.isdefault = false
        dashboardParams.stack = stack
        def result = dashboardService.create(dashboardParams)
        def groupDashboard = result.dashboard
        domainMappingService.createMapping(stackDefaultGroup, RelationshipType.owns, groupDashboard)

        // Create a personal dashboard clone for the user
        int maxPosition = Math.max(dashboardService.getMaxDashboardPosition(currentUser), 0)
        dashboardService.cloneGroupDashboardAndCreateMapping(groupDashboard, currentUser.id, maxPosition)
    }

    /**
     * Create a stack, assign the group dashboard to that stack.
     * @param groupDashboard
     */
    def createAppForGroupDashboard(Dashboard groupDashboard) {
        if (!groupDashboard.stack) {
            Stack newApp = createStack([name: groupDashboard.name,
                    description: groupDashboard.description,
                    stackContext: UUID.randomUUID().toString(),
                    imageUrl: groupDashboard.iconImageUrl,
                    owner: null])

            Group stackDefaultGroup = newApp.groups.asList()[0]

            // Obtain the group dashboard's groups
            List<Group> groups = dashboardService.getGroupDashboardsGroups(groupDashboard)

            // Assign the new App to all the group dashboard's groups
            groups.each { group ->
                newApp.addToGroups(group)
                // Disassociate the group dashboard from all of its groups
                dashboardService.removeGroupDashboardFromGroup(groupDashboard, group)
            }
            newApp.save()

            domainMappingService.createMapping(stackDefaultGroup, RelationshipType.owns, groupDashboard)

            groupDashboard.stack = newApp
            groupDashboard.publishedToStore = true

            groupDashboard.save()

            // Assign the personal dashboards to the new App
            List<Dashboard> personalDashboards = dashboardService.findPersonalDashboardsForGroupDashboard(groupDashboard)
            personalDashboards.each { personalDashboard ->
                personalDashboard.stack = newApp
                personalDashboard.save()
            }
        }
    }

    /**
     * Creates a wrapper App for a personal dashboard not associated with a group dashboard
     * @param personalDashboard
     */
    def createAppForPersonalDashboard(Dashboard personalDashboard) {
        Stack newApp = createStack([name: personalDashboard.name,
                description: personalDashboard.description,
                stackContext: UUID.randomUUID().toString(),
                imageUrl: personalDashboard.iconImageUrl,
                owner: personalDashboard.user])
        newApp.save()
        personalDashboard.stack = newApp
        personalDashboard.save()

        // Create group dashboard
        Map dashboardParams = [:]
        dashboardParams.with {
            name = personalDashboard.name
            guid = personalDashboard.guid
            description = personalDashboard.description
            iconImageUrl = personalDashboard.iconImageUrl
            layoutConfig = personalDashboard.layoutConfig
            cloned = true
            isGroupDashboard = true
            isdefault = false
            stack = newApp
        }
        def result = dashboardService.create(dashboardParams)
        def groupDashboard = result.dashboard
        domainMappingService.createMapping(newApp.findStackDefaultGroup(), RelationshipType.owns, groupDashboard)

        // Link the group dashboard with the personal one
        domainMappingService.createMapping(personalDashboard, RelationshipType.cloneOf, [id: groupDashboard.id, TYPE: 'dashboard'])
    }

    def addToUser(Stack stack, Person user) {
        def stackDefaultGroup = stack.findStackDefaultGroup()
        stackDefaultGroup.addToPeople(user)
    }

    //If a user is no longer assigned to a stack directly or through a group, this method
    //removes that user's instances of the stack dashboards
    private def removeUserStackDashboards(user, stack, groupToRemove) {
        def stillAssignedStack = false
        stack.groups?.each { stackGroup ->
            if(stackGroup != groupToRemove) { //Skip if it's the group to remove
                if(stackGroup.people?.contains(user)) {
                    //This group contains the user, set flag to skip dashboard removal
                    stillAssignedStack = true
                }
            }
        }
        if(!stillAssignedStack) {
            //The user is no longer assigned to the stack so orphan all their dashboards assigned to the stack
            def userStackDashboards = Dashboard.findAllByUserAndStack(user, stack)
            userStackDashboards?.each { userStackDashboard ->
                domainMappingService.deleteMappings(userStackDashboard,RelationshipType.cloneOf,Dashboard.TYPE)
                userStackDashboard.delete(flush: true, failOnError: true)
            }
        }
    }

    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }

    private def ensureAdminOrOwner(stackId) {
        if(!stackId && !accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "Cannot verify ownership of a stack without the stack ID", exceptionType: OwfExceptionTypes.NotFound)
        }

        def stackInstance = Stack.get(stackId)

        if(!stackInstance) {
            throw new OwfException(message: "Cannot find a stack with id ${stackId}", exceptionType: OwfExceptionTypes.NotFound)
        } else if((!stackInstance.owner || accountService.getLoggedInUser().id != stackInstance.owner.id) && !accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an administrator or owner of a stack to edit it.",
                    exceptionType: OwfExceptionTypes.Authorization)
        }


    }

    private def ensureOwner(stackId) {
        if(!stackId && !accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "Cannot verify ownership of a stack without the stack ID", exceptionType: OwfExceptionTypes.NotFound)
        }

        def stackInstance = Stack.get(stackId)

        if(!stackInstance) {
            throw new OwfException(message: "Cannot find a stack with id ${stackId}", exceptionType: OwfExceptionTypes.NotFound)
        } else if((!stackInstance.owner || accountService.getLoggedInUser().id != stackInstance.owner.id)) {
            throw new OwfException(message: "You must be an owner of a stack to push it to the store.",
                    exceptionType: OwfExceptionTypes.Authorization)
        }


    }
}
