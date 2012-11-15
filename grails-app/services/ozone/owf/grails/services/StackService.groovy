package ozone.owf.grails.services

import grails.converters.JSON
import org.hibernate.CacheMode
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.RelationshipType

class StackService {

    def accountService
    def serviceModelService
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
                imageUrl: params.imageUrl ?: stack.imageUrl
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
                            // Remove the mapping to the group.
                            domainMappingService.deleteMapping(stackDefaultGroup,RelationshipType.owns,dashboard)
                            // TODO: Dump any user dashboard instances associated with this stack that were
                            // clones of this dashboard.  Perhaps find all the clones and associate them with the 
                            // default owf stack.
                            
                            // Delete the dashboard.
                            dashboard.delete(flush: true)
                            updatedDashboards << dashboard
                        }
                        else if (params.update_action == 'add') {
                            dashboardsToCopy << dashboard
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

                //Update the uniqueWidgetCount of the stack
                stack.uniqueWidgetCount = widgetDefinitionService.list([stack_id: stack.id]).results
                stack.save(flush: true, failOnError: true)
            }
        }

        return returnValue
    }
    
    def delete(params) {
        
        // Only admins may delete Stacks
        ensureAdmin()
        
        def stacks = []
        
        if (params.data) {
            def json = JSON.parse(params.data)
            stacks = [json].flatten()
        } else {
            stacks = params.list('id').collect {
                [id:it]
            }
        }
        
        stacks.each {
            def stack = Stack.findById(it.id, [cache: true])
            
            // Break the association with any existing dashboard instances.  
            def dashboards = Dashboard.findByStack(stack)
            dashboards.each { dashboard ->
                // TODO: Associate them with the default OWF stack if we go that design route.
                dashboard.stack = null;
                dashboard.save(flush: true)
            }
            
            stack?.groups?.each { group ->
                if (group?.stackDefault) { group?.delete() }
            }         
            
            stack?.delete(flush: true)
        }
        
        return [success: true, data: stacks]
    }
    
    def export(params, outputStream) {
        
        // Only admins may export Stacks
        ensureAdmin()
        
        if(params.id > -1) {
            def stack
            try {
                stack = Stack.findById(params.id, [cache: true])

                def dir = './lib/'
                if(grails.util.GrailsUtil.environment != 'production') dir = './src/resources/'

                def stackDescriptor = new File(dir + "empty_descriptor.html").text

                //Construct the list of dashboards for the descriptor
                def stackDefaultGroup = stack.findStackDefaultGroup()
                def dashboards = []
                if(stackDefaultGroup != null) {
                    domainMappingService.getMappings(stackDefaultGroup, RelationshipType.owns, Dashboard.TYPE).each {
                        dashboards.push(serviceModelService.createServiceModel(Dashboard.findById(it.destId)))
                    }
                }

                def stackData = [:]
                //Get only the parameters required for a stack descriptor
                stackData.put('name', stack.name)
                stackData.put('stackContext', stack.stackContext)
                stackData.put('description', stack.description)
                stackData.put('dashboards', dashboards)

                //Pretty print the JSON
                stackData = (stackData as JSON).toString(true)

                //Replace the empty stackData variable in the copied template with the stack data
                stackDescriptor = stackDescriptor.replaceFirst("var data;", "var data = ${stackData};")

                def out
                if(params.extension == 'zip') {
                    out = new java.util.zip.ZipOutputStream(outputStream)
                }
                else {
                    out = new java.util.jar.JarOutputStream(outputStream)
                }
                out.putNextEntry(new java.util.zip.ZipEntry(stack.stackContext + "_descriptor.html")) 
                out.write(stackDescriptor.getBytes(java.nio.charset.Charset.forName("UTF-8")))
                out.closeEntry()

                widgetDefinitionService.list([stack_id: stack.id]).data.eachWithIndex { widget, i ->

                    def widgetDefinition = widget.toDataMap().value
                    def widgetDescriptor = new File(dir + "empty_descriptor.html").text
                    def widgetData = [:]

                    //Get only the values required for a widget descriptor
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

                    //Pretty print the JSON
                    widgetData = (widgetData as JSON).toString(true)

                    widgetDescriptor = widgetDescriptor.replaceFirst("var data;", "var data = ${widgetData};")

                    out.putNextEntry(new java.util.zip.ZipEntry("widget_descriptors/widget" + (i + 1) + "_descriptor.html")) 
                    out.write(widgetDescriptor.getBytes(java.nio.charset.Charset.forName("UTF-8")))
                    out.closeEntry()
                }

                out.close()

            } catch(Exception e) {
                println e.getMessage()
                println e.getStackTrace()
                throw new OwfException(message: 'Server error while exporting stack' +
                    (stack?.name ? (' ' + stack?.name) : '') + ', please try again.',
                    exceptionType: OwfExceptionTypes.GeneralServerError)
            }
        }
        else {
            throw new OwfException(message: 'The stack id ' + params.id + ' is invalid, export failed.',
                exceptionType: OwfExceptionTypes.GeneralServerError)
        }
    }
    
    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }
}
