package ozone.owf.grails.services

import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Stack
import grails.converters.JSON
import ozone.owf.grails.domain.WidgetDefinition
import org.hibernate.CacheMode
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Dashboard

class GroupService {

    def accountService
    def dashboardService
    def domainMappingService
    def serviceModelService
    def widgetDefinitionService
    
    private static def addFilter(name, value, c) {
        c.with {
            switch (name) {
                case 'automatic':
                    eq(name, value)
                    break
                case 'status':
                    eq(name, value)
                    break
                case 'user_id':
                    people {
                        eq('id', value.toLong())
                    }
                    break
                case 'stack_id':
                    stacks {
                        eq('id', value.toLong())
                    }
                    break
                default:
                    ilike(name, "%" + value + "%")
            }
        }
    }

    def list(params) {
        def person = accountService.getLoggedInUser()
        def criteria = Group.createCriteria()
        def opts = [:]

        if (params?.offset != null) opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
        if (params?.max != null) opts.max =(params.max instanceof String ? Integer.parseInt(params.max) : params.max)

        //if there is a widget filter we must filter by widget first
        def filteredIds = [];
        if (params.widget_id) {
            def widget = WidgetDefinition.findByWidgetGuid(params.widget_id,[cache:true])
            if (widget != null) {
                def mappings = domainMappingService.getMappings(widget, RelationshipType.owns, Group.TYPE, 'dest');
                mappings?.each { filteredIds << it.srcId }
            }
        }
        if (params.dashboard_id) {
            def dashboard = Dashboard.findByGuid(params.dashboard_id,[cache:true])
            if (dashboard != null) {
                def mappings = domainMappingService.getMappings(dashboard, RelationshipType.owns, Group.TYPE, 'dest');
                mappings?.each { filteredIds << it.srcId }
            }
        }
        if ((params.widget_id != null || params.dashboard_id != null) && filteredIds.isEmpty()) {
            return [success: true, data: [], results: 0]
        }
        else {

            def results = criteria.list(opts) {
                
                eq("stackDefault", false)

                if (params.id)
                    eq("id",Long.parseLong(params.id))

                if (params.automatic) {
                    eq('automatic', Boolean.parseBoolean(params.automatic))
                }
                //if a regular user then only show groups they are in
                if (!accountService.getLoggedInUserIsAdmin()) {
                    people {
                        eq('id', person.id)
                    }
                }

                //filter by fields
                if (params.filters) {
                    if (params.filterOperator?.toUpperCase() == 'OR') {
                        or {
                            JSON.parse(params.filters).each { filter ->
                                addFilter(filter.filterField,filter.filterValue,criteria)
                            }
                        }
                    }
                    else {
                        JSON.parse(params.filters).each { filter ->
                            addFilter(filter.filterField,filter.filterValue,criteria)
                        }
                    }
                }
                else if (params.filterName && params.filterValue) {
                    def filterNames = params.list('filterName')
                    //def filterOps = params.list('filterOps')
                    def filterValues = params.list('filterValue')

                    if (params.filterOperator?.toUpperCase() == 'OR') {
                        or {
                            filterNames.eachWithIndex { filterName, i ->
                                addFilter(filterName,
                                        //filterOps[i],
                                        filterValues[i],criteria)
                            }
                        }
                    }
                    else {
                        filterNames.eachWithIndex { filterName, i ->
                            addFilter(filterName,
                                    //filterOps[i],
                                    filterValues[i],criteria)
                        }
                    }
                }

                if (params.user_id) {
                    addFilter('user_id',params.user_id,criteria)
                }
                
                if (params.stack_id) {
                    addFilter('stack_id', params.stack_id, criteria)
                }

                //sorting -- only single sort
                if (params?.sort) {
                    order(params.sort, params?.order?.toLowerCase() ?: 'asc')
                }
                else {
                    //default sort
                    order('displayName', params?.order?.toLowerCase() ?: 'asc')
                }

                if (!filteredIds.isEmpty()) {
                    inList('id',filteredIds)
                }
                cache(true)
                cacheMode(CacheMode.GET)
            }

            def processedResults = results.collect { g ->

                def userCount = Person.withCriteria {
                    cacheMode(CacheMode.GET)
                    groups {
                        eq('id', g.id)
                    }
                    projections { rowCount() }
                }
                
                def stackCount = Stack.withCriteria {
                    cacheMode(CacheMode.GET)
                    groups {
                        eq('id', g.id)
                    }
                    projections { rowCount() }
                }

                serviceModelService.createServiceModel(g,[
                            totalStacks: stackCount[0],
                            totalUsers: userCount[0],
                            totalWidgets: domainMappingService.countMappings(g, RelationshipType.owns, WidgetDefinition.TYPE)
                        ])

            }
            return [data: processedResults, results: results.totalCount]
        }

    }

    def show(params) {
        def group = Group.findById(params.long('id'), [cache: true])
        if (group == null) {
            throw new OwfException(message: 'Group ' + params.id + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
        }
        def person = accountService.getLoggedInUser()
        if (accountService.getLoggedInUserIsAdmin() || person.groups.contains(group)) {
            return [success: true, data: serviceModelService.createServiceModel(group)]
        }
        else {
            throw new OwfException(message: 'You are not authorized to view this group.', exceptionType: OwfExceptionTypes.Authorization)
        }

    }

    def createOrUpdate(params) {
        //only admins may update groups
        ensureAdmin()
        def groups = []

        if (params.update_action) {
            groups << params;
        } else {
            //json encoded params inside data
            if (params.data) {
                def json = JSON.parse(params.data)

                if (json instanceof List) {
                    groups = json
                } else {
                    groups << json
                }
            } else {
                //no embedded json data assume one group to be updated it's params are directly on the params
                groups << params
            }
        }

        //create each group
        def results = groups.collect { updateGroup(it) }

        [success:true,data:results.flatten()]

    }

    def copyDashboard(params) {
        def newGroupDashboards = []

        //copy dashboards to each gr
        if (params.groups != null && params.dashboards != null) {

            //loop through dashboards and create a group dashboard
            JSON.parse(params.dashboards).each {
                def dash = Dashboard.findByGuid(it.guid)
                if (dash != null) {
                    def dashConfig = [:]
                    //use a new guid
                    dashConfig.guid = java.util.UUID.randomUUID().toString()

                    dashConfig.isdefault = dash.isdefault
                    dashConfig.dashboardPosition = it.dashboardPosition
                    dashConfig.name = dash.name
                    dashConfig.description = dash.description
                    dashConfig.locked = dash.locked

                    dashConfig.layoutConfig = dash.layoutConfig
                    // If given a stack override, use that.  Otherwise, use the stack already associated
                    // with the dashboard to copy.
                    dashConfig.stack = (params.stack != null) ? params.stack : dash.stack
                    dashConfig.cloned = true
                    dashConfig.isGroupDashboard = params.isGroupDashboard  ?: false

                    newGroupDashboards << dashboardService.create(dashConfig).dashboard
                }
            }

            JSON.parse(params.groups).each { groupCfg ->
                //map the new dashboard to the groups
                Group group = Group.get(groupCfg.id)
                if (group != null) {
                    newGroupDashboards.each { newGroupDashboard ->
                        domainMappingService.createMapping(group, RelationshipType.owns, newGroupDashboard)
                    }
                }
            }
        }

        return [success: true, msg: newGroupDashboards.collect{ serviceModelService.createServiceModel(it) }]
    }

    private def isNull(obj) {
        if (obj == null) {
            return true
        }
        else return obj.equals(null)
    }

    private def updateGroup(params) {

        def group
        def returnValue = null

        //check for id param if exists this is an update
        if (params.id || params.group_id) {

            params.id = params.id ?: params.group_id

            group = Group.findById(params.id,[cache:true])
            if (!group ) {
                throw new OwfException(message: 'Group ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
        }
        else {
            group = new Group()
        }

        //only update group properties if this isn't a user/widget assignment call
        if (!params.update_action)
        {
            def isAutomatic = params?.automatic?.toString()?.equalsIgnoreCase('on') || params?.automatic?.toString()?.equalsIgnoreCase('true')

            //if this a new group creation check if an existing group with the same name and automatic true
            // prevent two groups of the same type (automatic or manual) with the same name
            def matches = Group.findAllByNameAndAutomatic(params.name, isAutomatic, [cache:true])
            if (matches != null && matches?.size() > 0) {
                matches.each{ it ->
                    if (it.id != params.id) {
                        // it already exists--throw exception
                        throw new OwfException(message: 'Group ' + params.name + ' where automatic is ' + isAutomatic + ' already exists.', exceptionType: OwfExceptionTypes.Validation_UniqueConstraint)
                    }
                }
            }

            group.properties = [
                        name: params.name,
                        displayName: !isNull(params.displayName) && params.displayName != "" ? params.displayName : params.name,
                        description: !isNull(params.description) ? params.description : '',
                        email: !isNull(params.email) ? params.email : null,
                        automatic: isAutomatic,
                        status: params.status ? params.status : 'active'
                    ]
        }
        else
        {

            //handle associations
            //persons
            def updatedPeople = []
            def user_ids = params.user_ids ? [params.user_ids].flatten() : []

            user_ids?.each { it ->
                def person = Person.findById(it.toLong(),[cache:true])
                if (person) {
                    if (params.update_action == 'add') {
                        group.addToPeople(person)
                    }
                    else if (params.update_action == 'remove') {
                        group.removeFromPeople(person)
                    }

                    updatedPeople << person
                }
            }
            if (!updatedPeople.isEmpty()) {
                returnValue = updatedPeople.collect{ serviceModelService.createServiceModel(it) }
            }
        }

        //explicit flush here so subsequent calls will see the new group
        group.save(flush: true, failOnError: true)

        if (params.update_action != null && params.update_action != '' && 'widgets' == params.tab) {

            //handle widgets associations after group has been saved
            def updatedWidgets = []
            def widgets = JSON.parse(params.data)

            widgets.each { it ->
                def widget = WidgetDefinition.findByWidgetGuid(it.id,[cache:true])
                if (widget) {
                    if (params.update_action == 'add') {
                        domainMappingService.createMapping(group,RelationshipType.owns,widget)
                    }
                    else if (params.update_action == 'remove') {
                        domainMappingService.deleteMapping(group,RelationshipType.owns,widget)
                    }
                    updatedWidgets << widget
                }
            }
            if (!updatedWidgets.isEmpty()) {
                returnValue = updatedWidgets.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else if (params.update_action != null && params.update_action != '' && 'users' == params.tab) {

            def updatedUsers = []
            def users = JSON.parse(params.data)

            users?.each { it ->
                def person = Person.findById(it.id.toLong(),[cache:true])
                if (person) {
                    if (params.update_action == 'add') {
                        group.addToPeople(person)
                    }
                    else if (params.update_action == 'remove') {
                        group.removeFromPeople(person)
                    }

                    updatedUsers << person
                }
            }
            if (!updatedUsers.isEmpty()) {
                returnValue = updatedUsers.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else if (params.update_action != null && params.update_action != '' && 'dashboards' == params.tab) {

            def updatedDashboards = []
            def dashboards = JSON.parse(params.data)

            dashboards?.each { it ->
                def dashboard = Dashboard.findByGuid(it.guid,[cache:true])
                if (dashboard) {
                    if (params.update_action == 'add') {
                        domainMappingService.createMapping(group,RelationshipType.owns,dashboard)
                    }
                    else if (params.update_action == 'remove') {
                        domainMappingService.deleteMapping(group,RelationshipType.owns,dashboard)
                    }

                    updatedDashboards << dashboard
                }
            }
            
            if (!updatedDashboards.isEmpty()) {
                // Reconcile any widgets missing from the group that have been added by a dashboard.
                widgetDefinitionService.reconcileGroupWidgetsFromDashboards(group)
                
                returnValue = updatedDashboards.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else if (params.update_action != null && params.update_action != '' && 'stacks' == params.tab) {

            def updatedStacks = []
            def stacks = JSON.parse(params.data)

            stacks?.each { it ->
                def stack = ozone.owf.grails.domain.Stack.findById(it.id.toLong(), [cache: true])
                if (stack) {
                    if (params.update_action == 'add') {
                        group.addToStacks(stack)
                    }
                    else if (params.update_action == 'remove') {
                        group.removeFromStacks(stack)
                    }

                    updatedStacks << stack
                }
            }
            if (!updatedStacks.isEmpty()) {
                returnValue = updatedStacks.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else {
            returnValue = serviceModelService.createServiceModel(group,[
                        totalStacks: group?.stacks?.size(),
                        totalUsers: group?.people?.size(),
                        totalWidgets: domainMappingService.countMappings(group, RelationshipType.owns, WidgetDefinition.TYPE)
                    ])
        }

        return returnValue
    }

    def delete(params) {
        //only admins may delete groups
        ensureAdmin()

        def groups = []

        //json encoded params inside data
        if (params.data) {
            def json = JSON.parse(params.data)
            if (json instanceof List) {
                groups = json
            }
            else {
                groups << json
            }
        }
        else {
            groups = params.list('id').collect { [id:it] }
        }

        groups.each {
            def group = Group.findById(it.id,[cache:true])
            if (group == null) {
                log.info('Group ' + params.guid + ' not found. for delete')
            }
            else {
                //delete all widget mappings
                domainMappingService.deleteAllMappings(group)

                //delete all user mappings
                def people = []
                if (group.people != null) {
                    people += group.people
                }
                people.each { group?.removeFromPeople(it) }

                //delete group
                group.delete(flush: true)
            }
        }

        return [success: true, data: groups]
    }

    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }

}
