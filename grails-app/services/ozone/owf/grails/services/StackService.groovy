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
        
        def criteria = ozone.owf.grails.domain.Stack.createCriteria()
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
        
        def processedResults = results.collect { stack ->
            
            def totalGroups = Group.withCriteria {
                cacheMode(CacheMode.GET)
                eq('stackDefault', false)
                stacks {
                    eq('id', stack.id)
                }
                projections { rowCount() }
            }
            
            def totalUsers = Person.withCriteria {
                cacheMode(CacheMode.GET)
                groups {
                    eq('stackDefault', true)
                    stacks {
                        eq('id', stack.id)
                    }
                    projections { rowCount() }
                }
            }

            def stackDefaultGroup = stack.findStackDefaultGroup()
            def totalDashboards = (stackDefaultGroup != null) ? domainMappingService.countMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE) : 0
            
            serviceModelService.createServiceModel(stack,[
                totalDashboards: totalDashboards,
                totalUsers: totalUsers[0],
                totalGroups: totalGroups[0]
            ])
            
        }
        return [data: processedResults, results: results.totalCount]
        
    }
    
    def createOrUpdate(params) {
        
        // Only admins may create or update Stacks
        ensureAdmin()
        def stacks = []

        if (params.update_action) {
            stacks << params;
        } else {
            if (params.data) {
                def json = JSON.parse(params.data)
                
                if (json instanceof List) {
                    stacks = json
                } else {
                    stacks << json
                }
            } else {
                stacks << params
            }
        }

        def results = stacks.collect { updateStack(it) }

        [success:true, data:results.flatten()]
    }
    
    private def updateStack(params) {

        def stack, returnValue = null

        if (params?.stack_id) params.stack_id = (params.stack_id instanceof String ? Integer.parseInt(params.stack_id) : params.stack_id)
        
        if (params?.id >= 0 || params.stack_id  >= 0) {  // Existing Stack
            params.id = params?.id >= 0 ? params.id : params.stack_id
            stack = Stack.findById(params.id, [cache: true])
            if (!stack) {
                throw new OwfException(message: 'Stack ' + params.id + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
        } else { // New Stack
            stack = new ozone.owf.grails.domain.Stack()
            def dfltGroup = new Group(name: java.util.UUID.randomUUID().toString(), stackDefault: true)
            stack.addToGroups(dfltGroup)
        }

        if (!params.update_action) {
            
            //If context was modified and it already exists, throw a unique constrain error
            if(params.stackContext && params.stackContext != stack.stackContext) {
                if(Stack.findByStackContext(params.stackContext)) {
                    throw new OwfException(message: 'Another stack uses ' + params.stackContext + ' as its URL Name. ' 
                        + 'Please select a unique URL Name for this stack.', exceptionType: OwfExceptionTypes.GeneralServerError)
                }
            }

            stack.properties = [
                name: params.name ?: stack.name,
                description: params.description ?: stack.description,
                stackContext: params.stackContext ?: stack.stackContext,
                imageUrl: params.imageUrl ?: stack.imageUrl,
                descriptorUrl: params.descriptorUrl ?: stack.descriptorUrl
            ]
            
            stack.save(flush: true, failOnError: true)
            
            def stackDefaultGroup = stack.findStackDefaultGroup()
            def totalDashboards = (stackDefaultGroup != null) ? domainMappingService.countMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE) : 0

            returnValue = serviceModelService.createServiceModel(stack,[
                totalDashboards: totalDashboards,
                totalUsers: stack.findStackDefaultGroup()?.people ? stack.findStackDefaultGroup().people.size() : 0,
                totalGroups: stack.groups ? stack.groups.size() - 1 : 0, // Don't include the default stack group
                totalWidgets: 0
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
                            //Remove all references to stack for all user's dashboards in the stack
                            removeUserStackDashboards(user, stack, stackDefaultGroup)
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
    
    def deleteUserStack(stackIds) {
        
        def user = accountService.getLoggedInUser();
        def stacks = [];
        
        stackIds.each {
            def stack = Stack.findById(it.id, [cache: true])
            def stackDefaultGroup = stack.findStackDefaultGroup()
            
            stackDefaultGroup.removeFromPeople(user)

            // Remove all user dashboards that are in the stack
            def userStackDashboards = Dashboard.findAllByUserAndStack(user, stack)
            userStackDashboards?.each { userStackDashboard ->

                dashboardService.delete([
                    dashboard: userStackDashboard
                ])
            }
            
            stacks << stack
        }
        return [success: true, data: stacks];
    }
    
    def delete(params) {
        def stacks = []
        
        if (params.data) {
            def json = JSON.parse(params.data)
            stacks = [json].flatten()
        } else {
            stacks = params.list('id').collect {
                [id:it]
            }
        }
        
        // Handle user deletion of their stack association and data.
        if((!accountService.getLoggedInUserIsAdmin()) || (params.adminEnabled != true  && params.adminEnabled != 'true')) {
            return deleteUserStack(stacks);
        }
        
        // Handle administrative removal of stacks.
        stacks.each {
            def stack = Stack.findById(it.id)
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
            stack?.groups?.each { group ->
                if (group?.stackDefault) {
                    //delete all widget mappings
                    //domainMappingService.deleteAllMappings(group)
                    stack.removeFromGroups(group);
                    stack.save()
                    groupService.delete(["data": "{id: ${group.id}}"])
                }
            }
            
            // Delete the stacks's master dashboards.
            defaultDashboards?.each { dashboard ->
                dashboard.delete()
            }
            
            // Delete the stack.
            stack?.delete(flush: true, failOnError: true)
      
        }
        
        return [success: true, data: stacks]
    }

    def importStack(params) {

        //only admins may import stacks
        ensureAdmin()

        def stackParams = [:]
        params.data = JSON.parse(params.data)
        stackParams.name = params.data.name
        stackParams.description = params.data.description
        stackParams.stackContext = params.data.stackContext
        stackParams.descriptorUrl = params.descriptorUrl

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
			json = json.replace(it.guid, java.util.UUID.randomUUID().toString())
			it = new JSONObject(json)
			changeWidgetInstanceIds(it.layoutConfig)
            it.isGroupDashboard = true
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
			widgets[i].put("uniqueId", java.util.UUID.randomUUID().toString())
		}
		
		def items = layoutConfig.items
		for(def i = 0; i < items?.size(); i++) {
			changeWidgetInstanceIds(items[i])
		}
	}
    
    def export(params) {
        
        // Only admins may export Stacks
        ensureAdmin()
        
        def stack = Stack.findById(params.id, [cache: true])

        //Construct the list of dashboards for the descriptor
        def dashboards = []
        def stackGroup = stack.findStackDefaultGroup()
        if(stackGroup != null) {
            domainMappingService.getMappings(stackGroup, RelationshipType.owns, Dashboard.TYPE).eachWithIndex { it, i ->

                def dashboard = Dashboard.findById(it.destId)

                def dashboardData = [:]
                //Get only the parameters required for a dashboard definition
                dashboardData.put('name', dashboard.name)
                dashboardData.put('guid', dashboard.guid)
                dashboardData.put('description', dashboard.description)
                dashboardData.put('isdefault', dashboard.isdefault)
                dashboardData.put('locked', dashboard.locked)
                dashboardData.put('dashboardPosition', dashboard.dashboardPosition)
                dashboardData.put('layoutConfig', JSON.parse(dashboard.layoutConfig))

                dashboards.push(dashboardData)
            }
        }

        def widgets = []
        widgetDefinitionService.list([stack_id: stack.id]).data.eachWithIndex { widget, i ->

            def widgetDefinition = widget.toDataMap().value

                def widgetData = [:]
                //Get only the values required for a widget definition
                widgetData.put("widgetGuid", widget.id)
                widgetData.put("descriptorUrl", widgetDefinition.descriptorUrl)
                widgetData.put("universalName", widgetDefinition.universalName)
                widgetData.put("displayName", widgetDefinition.namespace)
                widgetData.put("description", widgetDefinition.description)
                widgetData.put("widgetVersion", widgetDefinition.widgetVersion)
                widgetData.put("widgetUrl", widgetDefinition.url)
                widgetData.put("imageUrlSmall", widgetDefinition.smallIconUrl)
                widgetData.put("imageUrlLarge", widgetDefinition.largeIconUrl)
                widgetData.put("width", widgetDefinition.width)
                widgetData.put("height", widgetDefinition.height)
                widgetData.put("visible", widgetDefinition.visible)
                widgetData.put("singleton", widgetDefinition.singleton)
                widgetData.put("background", widgetDefinition.background)
                widgetData.put("widgetTypes", [widgetDefinition.widgetTypes[0].name])
                widgetData.put("intents", widgetDefinition.intents)
                def tags = []
                widgetDefinition.tags.each { tags.push(it.name) }
                widgetData.put("defaultTags", tags)

            widgets.push(widgetData)
        }

        def stackData = [:]
        //Get only the parameters required for a stack descriptor
        stackData.put('name', stack.name)
        stackData.put('stackContext', stack.stackContext)
        stackData.put('description', stack.description)
        stackData.put('dashboards', dashboards)
        stackData.put('widgets', widgets)

        //Pretty print the JSON
        stackData = (stackData as JSON).toString(true)

        //Get the empty descriptor with appropriate javascript
        def dir = './lib/'
        if(grails.util.GrailsUtil.environment != 'production') dir = './src/resources/'
        def stackDescriptor = new File(dir + "empty_descriptor.html").text

        stackDescriptor = stackDescriptor.replaceFirst("var data;", java.util.regex.Matcher.quoteReplacement("var data = ${stackData};"))

        return stackDescriptor
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
}
