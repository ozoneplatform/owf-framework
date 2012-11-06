package ozone.owf.grails.services

import grails.converters.JSON
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import org.hibernate.CacheMode
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.WidgetType

class WidgetDefinitionService {

    def loggingService = new AuditOWFWebRequestsLogger()
    def accountService
    def dashboardService
    def domainMappingService
    def serviceModelService

    def grailsApplication

    //TODO: implement ignoreCase and fetch params
    def list(params) {
        def widgetDefinition = null
        def opts = [:]
        if (params?.offset) opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
        if (params?.max) opts.max =(params.max instanceof String ? Integer.parseInt(params.max) : params.max)

        if(params?.filters) {
            JSON.parse(params.filters).each {
                if (it.filterField == 'tags') {
                    params.tags = it.filterValue
                }
            }
        }

        def stackFilteredIds = []
        if(params?.stack_id) {
            def widgetGuids = []
            def stack = Stack.findById(params?.stack_id)

            //Reuse DashboardService's method to list the dashboards of the stack's default group
            def dashboards = dashboardService.listDashboards(['group_id': stack.findStackDefaultGroup().id]).dashboardList
            for(def i = 0; i < dashboards.size(); i++) {
                //Id isn't returned, so extract the widgetGuid
                def widgets = JSON.parse(dashboards[i].layoutConfig).widgets
                for(def j = 0; j < widgets.size(); j++) {
                    widgetGuids.push(widgets[j].widgetGuid)
                }
            }
            widgetGuids.unique()

            def widgetDefinitions
            if(widgetGuids) {
                //Get the widget definitions by the list of widget guids
                widgetDefinitions = WidgetDefinition.createCriteria().list([:]) {
                    inList("widgetGuid", widgetGuids)
                }
            }

            widgetDefinitions?.each {
                stackFilteredIds << it.id
            }

            //If stackFilteredIds empty now, return no results
            if(stackFilteredIds.isEmpty()) {
                return [success: true, results: 0, data: []]
            }
        }
        
        def tagFilteredIds = []
        if(params?.tags) {
            for(tag in JSON.parse(params?.tags)) {
                def tempTagFilteredIds = []
                WidgetDefinition.findAllByTag(tag).each {
                    tempTagFilteredIds << it.id
                }

                if(tagFilteredIds.isEmpty()) {
                    tagFilteredIds = tempTagFilteredIds
                } else {
                    tagFilteredIds = tagFilteredIds.intersect(tempTagFilteredIds)
                }

                //If tagFilteredIds empty now, return no results
                if(tagFilteredIds.isEmpty()) {
                    return [success: true, results: 0, data: []]
                }
            }
        }

        // Either group_id or groupIds is passed, but not both
        if (params?.group_id) {
            def tempArr = []
            params.groupIds = "[" + params.group_id + "]"
        }
    
        //filter by any groups passed first
        def groupFilteredIds = []
        if(params?.groupIds) {
            for(groupId in JSON.parse(params?.groupIds)) {
                def tempGroupFilteredIds = []
                def group = Group.get(groupId.toLong())
                if (group != null) {
                    def mappings = domainMappingService.getMappings(group,RelationshipType.owns,WidgetDefinition.TYPE)
                    mappings?.each {
                        tempGroupFilteredIds << it.destId
                    }
                }

                if(groupFilteredIds.isEmpty()) {
                    groupFilteredIds = tempGroupFilteredIds
                } else {
                    groupFilteredIds = groupFilteredIds.intersect(tempGroupFilteredIds)
                }

                //If groupFilteredIds empty now, return no results
                if(groupFilteredIds.isEmpty()) {
                    return [success: true, results: 0, data: []]
                }
            }
        }
    
        //actually query the widgetdef table
        widgetDefinition = WidgetDefinition.createCriteria().list(opts) {
            if (params?.id)
              inList("widgetGuid",params.list('id'))
            if (params?.sort)
              order(convertJsonParamToDomainField(params.sort), params?.order?.toLowerCase() ?: 'asc')
            if(params?.widgetGuid) like("widgetGuid", params.widgetGuid)
            if(params?.universalName) like("universalName", params.universalName)
            if(params?.widgetName) like("displayName", params.widgetName)
            if(params?.widgetVersion) like("widgetVersion", params.widgetVersion)
            if(params?.filters) {
                if(params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        JSON.parse(params.filters).each {
                            if (it.filterField == 'singleton') {
                                if (it.filterValue) {
                                    eq('singleton', true)
                                } else {
                                    or {
                                        eq('singleton', false)
                                        isNull('singleton')
                                    }
                                }
                            } else if (it.filterField == 'visible') {
                                if (it.filterValue) {
                                    eq('visible', true)
                                } else {
                                    or {
                                        eq('visible', false)
                                        isNull('visible')
                                    }
                                }
                            } else {
                                if (it.filterField != 'tags') ilike(it.filterField, '%' + it.filterValue + '%')
                            }
                        }
                    }
                } else {
                    JSON.parse(params.filters).each {
                        if (it.filterField == 'singleton') {
                            if (it.filterValue) {
                                eq('singleton', true)
                            } else {
                                or {
                                    eq('singleton', false)
                                    isNull('singleton')
                                }
                            }
                        } else if (it.filterField == 'visible') {
                            if (it.filterValue) {
                                eq('visible', true)
                            } else {
                                or {
                                    eq('visible', false)
                                    isNull('visible')
                                }
                            }
                        } else {
                            if (it.filterField != 'tags') ilike(it.filterField, '%' + it.filterValue + '%')
                        }
                    }
                }
            }
            if (params?.user_id) {
                personWidgetDefinitions {
                    person {
                        eq('id',Long.parseLong(params.user_id))
                    }

                    //only list widgets that are explicitly assigned
                    //to this user
                    eq("groupWidget", false)
                }
            }
            if (params?.intent) {
                if(JSON.parse(params.intent).action) {
                    widgetDefinitionIntents {
                        intent {
                            eq('action',JSON.parse(params.intent).action)
                        }
                    }
                }
                if(JSON.parse(params.intent).dataType) {
                    widgetDefinitionIntents {
                        dataTypes {
                            eq('dataType',JSON.parse(params.intent).dataType)
                        }
                    }
                }
                if(JSON.parse(params.intent).send) {
                    widgetDefinitionIntents {
                        eq('send',JSON.parse(params.intent).send.toBoolean())
                    }
                }
                if(JSON.parse(params.intent).receive) {
                    widgetDefinitionIntents {
                        eq('receive',JSON.parse(params.intent).receive.toBoolean())
                    }
                }
            }
            if (!groupFilteredIds.isEmpty()) {
                inList('id',groupFilteredIds)
            }
            if (!tagFilteredIds.isEmpty()) {
                inList('id',tagFilteredIds)
            }
            if (!stackFilteredIds.isEmpty()) {
                inList('id',stackFilteredIds)
            }
            cache(true)
            cacheMode(CacheMode.GET)
        }
        def processedWidgets = widgetDefinition.collect { w ->
            //calc user count
            def userCount = PersonWidgetDefinition.withCriteria {
                eq('widgetDefinition',w)
                projections {
                    rowCount()
                }
            }

            serviceModelService.createServiceModel(w,[
                    totalUsers: userCount[0],
                    totalGroups: domainMappingService.countMappings(w, RelationshipType.owns, Group.TYPE, 'dest')
                ])
        }
        
        return [success:true, results: widgetDefinition.totalCount, data : processedWidgets]
    }
    
    def listUserAndGroupWidgets(params) {
        def widgetResults = list(params)
        return widgetResults.data
    }

    def show(params) {
        def widgetDefinition = WidgetDefinition.findByWidgetGuid(params.widgetGuid)
        if (widgetDefinition == null)
        {
            throw new OwfException(message:'Widget Definition ' + params.widgetGuid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
        }
        return [success:true, widgetDefinition: widgetDefinition]
    }
    
    def create(params){
        createOrUpdate(params)
    }
    
    def update(params){
        createOrUpdate(params)
    }
    
    def createOrUpdate(params) {
        if (params?.addExternalWidgetsToUser){
            addExternalWidgetsToUser(params)
        } else {
            ensureAdmin()
            def widgets = []
        
            //json encoded params inside data
            if (params.data && !params.tab) {
                def json = JSON.parse(params.data)
        
                if (json instanceof List) {
                    widgets = json
                }
                else {
                    widgets << json
                }
            }
            else {
                //no embedded json data assume one widget to be updated it's params are directly on the params
                widgets << params
            }
        
            //create each group
            def results = widgets.collect {
                updateWidget(it)
            }
            [success:true,data:results.flatten()]
        }
    }
    
    def updateWidget(params) {
        def widgetDefinition
        def returnValue = null
    
        //check for id param if exists this is an update
        if (params.id || params.widget_id) {
    
            params.id = params.id ? params.id : params.widget_id
            widgetDefinition = WidgetDefinition.findByWidgetGuid(params.id, [cache:true])
            if (widgetDefinition == null) {
                throw new OwfException(message: 'WidgetDefinition ' + params.id + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
        }
        else {
            widgetDefinition = new WidgetDefinition()
        }
    
        if (params.update_action == null || params.update_action == '') {
            //determine widgetType
            def newWidgetTypes = []
            if (params.widgetTypes != null) {
              newWidgetTypes = params.widgetTypes.collect {
                  WidgetType.get(it.id)
              }
            }
            if (newWidgetTypes == null || newWidgetTypes.size() < 1) {
              newWidgetTypes = widgetDefinition.widgetTypes
            }
            if (newWidgetTypes == null || newWidgetTypes.size() < 1) {
              def standard = WidgetType.findByName('standard')
              if (standard != null) {
                newWidgetTypes = [standard]
              }
            }

            // Fail any with descriptor file and no universal id (null or blank) or
            // a universal name that is already used.
            if (params.descriptorUrl && params.descriptorUrl.size() > 0) {
                if (params.universalName && !canUseUniversalName(widgetDefinition, params.universalName)) {
                    throw new OwfException(message: 'Another widget uses ' + params.universalName + ' as its Universal Name. ' 
                        + 'Please select a unique Universal Name for this widget.', exceptionType: OwfExceptionTypes.GeneralServerError)
                }
            }
            
            // Convert null or whitespace universal names to null.
            def newUniversalName = null;
            if (params.universalName != null) {
                newUniversalName = (params.universalName.size() == 0 || params.universalName.isAllWhitespace()) ? null : params.universalName.trim()
            }
            // set fields
            widgetDefinition.properties = [
                universalName: (params.universalName != null) ? newUniversalName : widgetDefinition.universalName,
                widgetGuid: params.widgetGuid? params.widgetGuid : widgetDefinition.widgetGuid,
                displayName: params.displayName ?: params.name ?: widgetDefinition.displayName,
                description: params.description ?: params.description ?: widgetDefinition.description,
                widgetUrl: params.widgetUrl ?: params.url ?: widgetDefinition.widgetUrl,
                imageUrlSmall: params.imageUrlSmall ?: params.headerIcon ?: widgetDefinition.imageUrlSmall,
                imageUrlLarge: params.imageUrlLarge ?: params.image ?: widgetDefinition.imageUrlLarge,
                width: (params.width != null)? params.width as Integer : widgetDefinition.width,
                height: (params.height != null)? params.height as Integer : widgetDefinition.height,
                widgetVersion: params.containsKey('widgetVersion') ? params.widgetVersion : params.version,
                singleton: (params.singleton != null)? params.singleton as Boolean : widgetDefinition.singleton,
                visible: (params.visible != null)? params.visible as Boolean : widgetDefinition.visible,
                background: (params.background != null)? params.background as Boolean : widgetDefinition.background,
                descriptorUrl: params.descriptorUrl ?: widgetDefinition.descriptorUrl,
                widgetTypes: newWidgetTypes
            ]
            //if (widgetDefinition.universalName == null) {
            //  widgetDefinition.universalName = widgetDefinition.widgetGuid
            //}
            widgetDefinition.save(flush: true,failOnError: true)
            if (params.directRequired != null) {
                // delete and the recreate requirements
                domainMappingService.deleteAllMappings(widgetDefinition, RelationshipType.requires, 'src')
                
                params?.directRequired.each {
                    def requiredWidget = WidgetDefinition.findByWidgetGuid(it, [cache:true])
                    if (requiredWidget != null) {
                        domainMappingService.createMapping(widgetDefinition, RelationshipType.requires, requiredWidget)
                    }
                }
            }

            //Save the intents
            if(params.intents != null && !(params.intents instanceof String) && (params.intents?.send != null || params.intents?.receive != null)) {
                //Get all existing widget definition intents to clear them
                WidgetDefinitionIntent.findAllByWidgetDefinition(widgetDefinition).collect() {
                    def intent = it.intent
                    intent.removeFromWidgetDefinitionIntents(it)
                    widgetDefinition.removeFromWidgetDefinitionIntents(it)
                    intent.save()
                    widgetDefinition.save()
                }

                def allIntents = []
                if(params.intents.send != null) {
                    allIntents.addAll(params.intents.send)
                }
                if(params.intents.receive != null) {
                    allIntents.addAll(params.intents.receive) 
                }

                //Save the last send intent to save their flags appropriately
                def lastSendIntent = params.intents.send ? params.intents.send.size() : 0;

                for(int i = 0; i < allIntents.size(); i++) {
                    def intent = allIntents[i]
                    def newIntent = Intent.findByAction(intent.action)

                    def intentDataTypes = []
                    intent.dataTypes.collect() {
                        intentDataTypes.push(IntentDataType.findByDataType(it) ?: new IntentDataType(dataType: it))
                    }

                    if(!newIntent) {
                        //Intent doesn't exist, create a new intent
                        newIntent = new Intent(action: intent.action, dataTypes: intentDataTypes)
                    }

                    //Add any data types to the intent that don't already exist
                    for(intentDataType in intentDataTypes) {
                        if(!newIntent.dataTypes.contains(intentDataType)) {
                            newIntent.addToDataTypes(intentDataType)
                        }
                    }
                    newIntent.save()

                    //Add new widget definition intent
                    def newWidgetDefinitionIntent
                    if(i < lastSendIntent) {
                        newWidgetDefinitionIntent = new WidgetDefinitionIntent(widgetDefinition: widgetDefinition, intent: newIntent, 
                            dataTypes: intentDataTypes, send: true, receive: false)
                    } else {
                        //Check if one of the send intents has the same widgetDefinition, intent, and dataTypes, if so reuse it
                        newWidgetDefinitionIntent = WidgetDefinitionIntent.createCriteria().get() {
                            eq('widgetDefinition', widgetDefinition)
                            eq('intent', newIntent)
                            eq('send', true)
                        }
                        if(newWidgetDefinitionIntent?.dataTypes as Set == intentDataTypes as Set) {
                            newWidgetDefinitionIntent.receive = true
                        }
                        else {
                            newWidgetDefinitionIntent = new WidgetDefinitionIntent(widgetDefinition: widgetDefinition, intent: newIntent, 
                                dataTypes: intentDataTypes, send: false, receive: true)
                        }
                    }
                    widgetDefinition.addToWidgetDefinitionIntents(newWidgetDefinitionIntent)

                    newWidgetDefinitionIntent.save()
                    newIntent.save()
                    widgetDefinition.save(flush:true)
                }
            }
        }
        else {
            //handle associations
            //persons
            def updatedPeople = []
            def user_ids = []
            if (params.user_ids instanceof Object[]) {
                user_ids = params.user_ids as List
            }
            else if (params.user_ids != null) {
                user_ids << params.user_ids
            }
            user_ids?.eachWithIndex { it, i ->
                def person = Person.findById(it.toLong(),[cache:true])
                if (person) {
                    def criteria = PersonWidgetDefinition.createCriteria()
                    def results = criteria.list() {
                        eq("person", person)
                        eq("widgetDefinition", widgetDefinition)
                    }
                    if (params.update_action == 'add') {
                        if (results.size() == 0) {
                            def queryReturn = PersonWidgetDefinition.executeQuery("SELECT MAX(pwd.pwdPosition) AS retVal FROM PersonWidgetDefinition pwd WHERE pwd.person = ?", [person])
                            def maxPosition = (queryReturn[0] != null)? queryReturn[0] : -1
                            maxPosition++
                            
                            def personWidgetDefinition = new PersonWidgetDefinition(
                                person: person,
                                widgetDefinition: widgetDefinition,
                                visible: true,
                                pwdPosition: maxPosition)
                            
                            person.addToPersonWidgetDefinitions(personWidgetDefinition)
                            widgetDefinition.addToPersonWidgetDefinitions(personWidgetDefinition)
                            
                            personWidgetDefinition.setTags(personWidgetDefinition.widgetDefinition.getTags()?.collect {
                                ['name':it.tag.name,'visible':it.visible,'position':it.position]
                            });
                        }
                    }
                    else if (params.update_action == 'remove') {
                        results?.eachWithIndex { nestedIt, j ->
                            person.removeFromPersonWidgetDefinitions(nestedIt)
                            widgetDefinition.removeFromPersonWidgetDefinitions(nestedIt)
                        }
                    }
                    
                    updatedPeople << person
                }
            }
            if (!updatedPeople.isEmpty()) {
                returnValue = updatedPeople.collect{ serviceModelService.createServiceModel(it) }
            }
        }
            
        
        
        if (params.containsKey('tags')) {
            widgetDefinition.setTags(params.tags)
        }

        if (params.update_action != null && params.update_action != '' && 'groups'==params.tab) {
            def updatedGroups = []
            def group_ids = []
            def groups = JSON.parse(params.data);

            groups.each { it ->
                def group = Group.findById(it.id,[cache:true])

                if (group) {
                    if (params.update_action == 'add') {
                        domainMappingService.createMapping(group, RelationshipType.owns, widgetDefinition)
                    }
                    else if (params.update_action == 'remove') {
                        domainMappingService.deleteMapping(group, RelationshipType.owns, widgetDefinition)
                    }
                    updatedGroups << group
                }
            }
            if (!updatedGroups.isEmpty()) {
                returnValue = updatedGroups.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else if (params.update_action != null && params.update_action != '' && 'users' == params.tab) {
            def updatedPeople = []
            def users = JSON.parse(params.data)
            
            users?.eachWithIndex { it, i ->
                def person = Person.findById(it.id.toLong(),[cache:true])
                if (person) {
                    def criteria = PersonWidgetDefinition.createCriteria()
                    def results = criteria.list() {
                        eq("person", person)
                        eq("widgetDefinition", widgetDefinition)
                    }
                    if (params.update_action == 'add') {
                        if (results.size() == 0) {
                            def queryReturn = PersonWidgetDefinition.executeQuery("SELECT MAX(pwd.pwdPosition) AS retVal FROM PersonWidgetDefinition pwd WHERE pwd.person = ?", [person])
                            def maxPosition = (queryReturn[0] != null)? queryReturn[0] : -1
                            maxPosition++
                            
                            def personWidgetDefinition = new PersonWidgetDefinition(
                                person: person,
                                widgetDefinition: widgetDefinition,
                                visible: true,
                                pwdPosition: maxPosition)
                            
                            person.addToPersonWidgetDefinitions(personWidgetDefinition)
                            widgetDefinition.addToPersonWidgetDefinitions(personWidgetDefinition)
                            
                            personWidgetDefinition.setTags(personWidgetDefinition.widgetDefinition.getTags()?.collect { pwd ->
                                ['name':pwd.tag.name,'visible':pwd.visible,'position':pwd.position]
                            });
                        }
                    }
                    else if (params.update_action == 'remove') {
                        results?.eachWithIndex { nestedIt, j ->
                            person.removeFromPersonWidgetDefinitions(nestedIt)
                            widgetDefinition.removeFromPersonWidgetDefinitions(nestedIt)
                        }
                    }
                    
                    updatedPeople << person
                }
            }
            if (!updatedPeople.isEmpty()) {
                returnValue = updatedPeople.collect{ serviceModelService.createServiceModel(it) }
            }
        }
        else {
            returnValue = serviceModelService.createServiceModel(widgetDefinition)
        }
        
        return returnValue
    }
    
    def addExternalWidgetsToUser(params) {
        def user = null
        def widgetDefinition = null
        def mapping = null
        def tagLinks = null
        
        user = accountService.getLoggedInUser()
        if (params.userId != null) {
            ensureAdmin()
            user = Person.findById(params.userId)
            if (user == null) {
                throw new OwfException( message:'Invalid userId',
                    exceptionType: OwfExceptionTypes.Validation)
            }
        }

        //add widgets to db also add pwd mappings to current user
        def widgetDefinitions = []
        params.widgets = JSON.parse(params.widgets)
        params.widgets?.each {
            def obj = JSON.parse(it)
            if (obj.widgetGuid == null) {
                throw new OwfException( message:'WidgetGuid must be provided',
                    exceptionType: OwfExceptionTypes.Validation)
            }
            
            widgetDefinition = WidgetDefinition.findByWidgetGuid(obj.widgetGuid, [cache:true])
            if (widgetDefinition == null) {
                widgetDefinition = new WidgetDefinition(
                    displayName: obj.displayName,
                    description: obj.description,
                    height: obj.height as Integer,
                    imageUrlLarge: obj.imageUrlLarge,
                    imageUrlSmall: obj.imageUrlSmall,
                    universalName: obj.universalName,
                    widgetGuid: obj.widgetGuid,
                    widgetUrl: obj.widgetUrl,
                    widgetVersion: obj.widgetVersion,
                    width: obj.width as Integer,
                    singleton: obj.singleton,
                    visible: obj.visible,
                    background: obj.background,
                        descriptorUrl: obj.descriptorUrl,
                    widgetTypes: [WidgetType.findByName('standard')]
                )
                
                widgetDefinition.save(flush: true, failOnError: true)
            }
            widgetDefinitions.push(widgetDefinition)
            
            def queryReturn = PersonWidgetDefinition.executeQuery("SELECT MAX(pwd.pwdPosition) AS retVal FROM PersonWidgetDefinition pwd WHERE pwd.person = ?", [user])
            def maxPosition = (queryReturn[0] != null)? queryReturn[0] : -1
            maxPosition++

            mapping = PersonWidgetDefinition.findByPersonAndWidgetDefinition(user, widgetDefinition);
            if (mapping == null && (obj.isSelected || !grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup)) {
                mapping = new PersonWidgetDefinition(
                    person: user,
                    widgetDefinition: widgetDefinition,
                    visible : true,
                    disabled: grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup,
                    pwdPosition: maxPosition
                )
                
                if (mapping.hasErrors()){
                    throw new OwfException( message:'A fatal validation error occurred during the creation of the person widget definition. Params: ' + params.toString() + ' Validation Errors: ' + mapping.errors.toString(),
                        exceptionType: OwfExceptionTypes.Validation)
                }
                
                if (!mapping.save(flush: true)) {
                    throw new OwfException(message: 'A fatal error occurred while trying to save the person widget definition. Params: ' + params.toString(),
                        exceptionType: OwfExceptionTypes.Database)
                }
            
                if (obj.tags) {
                    def tags = JSON.parse(obj.tags)
                    tags.each {
                        mapping.addTag(it.name, it.visible, it.position, it.editable)
                    }
                }
            }
        }
        
        // Add requirements after all widgets have been added
        params.widgets?.each {          
            def obj = JSON.parse(it)
            if (obj.directRequired != null) {
                // delete and the recreate requirements
                widgetDefinition = WidgetDefinition.findByWidgetGuid(obj.widgetGuid, [cache:true])
                domainMappingService.deleteAllMappings(widgetDefinition, RelationshipType.requires, 'src')
                
                def requiredArr = JSON.parse(obj.directRequired)
                requiredArr.each {
                    def requiredWidget = WidgetDefinition.findByWidgetGuid(it, [cache:true])
                    if (requiredWidget != null) {
                        domainMappingService.createMapping(widgetDefinition, RelationshipType.requires, requiredWidget)
                    }
                }
            }
        }
        return [success: true, data: widgetDefinitions]
    }
    
    def delete(params){
        
        ensureAdmin()
        
        def widgets = []
        
        if (params.data)
        {
            def json = JSON.parse(params.data)
            widgets = [json].flatten()
        }
        else {
            widgets = params.list('id').collect {
                [id:it]
            }
        }
        
        widgets.each {
            def widgetDefinition = WidgetDefinition.findByWidgetGuid(it.id,[cache:true])
            it.value = [:] // Need this for JSONReader on client side
            if (widgetDefinition == null) {
                log.info('Widget ' + it.id + ' not found. for delete')
                //throw new OwfException(message: 'Group ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
            else {
                //delete all mappings
                domainMappingService.purgeAllMappings(widgetDefinition)
                
                //delete group
                widgetDefinition.delete(flush: true)
            }
        }
        
        return [success: true, data: widgets]
    }

    def saveWidgetLoadTime(params) {
      def success = false
      def msg = ''

      //just log for now
      if (params?.id != null && params?.loadTime != null) {
        msg = "Widget ${params.id} loaded in ${params.loadTime} (ms)"
        success = true
      }
      else {
        msg = "saveWidgetLoadTime was called with missing id or loadTime params - ${params}"
        success = false
      }

      log.info msg
      [success:success, msg:msg]
    }
    
    def getDependents(params) {
        
        def srcGuids = params.ids
        def widgetDefs
        
        widgetDefs = WidgetDefinition.withCriteria({
            inList('widgetGuid', srcGuids);
        });
    
        def srcIds = widgetDefs.collect{ it.id }
        def depIds = null
        def accDepIds = []
        
        def recs = domainMappingService.getDependentWidgets(srcIds)
        
        if (params.noRecurse) {
            accDepIds = recs.collect{it.srcId}
        }
        else while (recs) {
            depIds = recs.collect{ it.srcId }
            depIds = depIds.minus(accDepIds)
            if (depIds && depIds.size() > 0) {
                accDepIds.addAll(depIds)
                recs = domainMappingService.getDependentWidgets(depIds)
            } else {
                recs = null
            }
        }
        
        def processedWidgets = [];
        
        if (accDepIds && accDepIds.size() > 0) {
            widgetDefs = WidgetDefinition.withCriteria({
                inList('id', accDepIds);
            });
            
            processedWidgets = widgetDefs.collect {
                serviceModelService.createServiceModel(it,[
                    totalUsers: it.personWidgetDefinitions ? it.personWidgetDefinitions.size() : 0,
                    totalGroups: domainMappingService.countMappings(it, RelationshipType.owns, Group.TYPE)
                ])
            }
        }
        
        return [success: true, data: processedWidgets]
    }

    def getRequiredWidgetIds(params) {

        def srcGuids = params.ids
        def widgetDefs

        widgetDefs = WidgetDefinition.withCriteria({
            inList('widgetGuid', srcGuids);
        });

        def srcIds = widgetDefs.collect{ it.id }
        def reqIds = null
        def accRecIds = []

        def recs = domainMappingService.getRequiredWidgets(srcIds)

        if (params.noRecurse) {
            accRecIds = recs.collect{it.destId}
        }
        else while (recs) {
            reqIds = recs.collect{ it.destId }
            reqIds = reqIds.minus(accRecIds)
            if (reqIds && reqIds.size() > 0) {
                accRecIds.addAll(reqIds)
                recs = domainMappingService.getRequiredWidgets(reqIds)
            } else {
                recs = null
            }
        }

      def processedWidgetsIds = [];

      if (accRecIds && accRecIds.size() > 0) {
          widgetDefs = WidgetDefinition.withCriteria({
              inList('id', accRecIds);
          });

          processedWidgetsIds = widgetDefs.collect {
             it.widgetGuid
          }
      }

        return [success: true, data: processedWidgetsIds]
    }

    public def getDirectRequiredIds(widgetDef) {
        getRequiredWidgetIds(ids: widgetDef.widgetGuid, noRecurse: true)
            .data
    }

    public def getAllRequiredIds(widgetDef) {
        getRequiredWidgetIds(ids: widgetDef.widgetGuid, noRecurse: false)
            .data
    }

    private def canUseUniversalName(widgetDef, name) {
        if (widgetDef && name && !name.equals("") )  {
            // Search for this universal name.  Trim the name to disallow variations with
            // leading and trailing whitespace.
            def widget = WidgetDefinition.findWhere(universalName: name.trim())
            if (widget != null && widget.id != widgetDef.id) {
                return false;
            }
        }
        return true;
    }
    
    //TODO: refactor this out when we have time.  I don't like this logic here
    //      potentially a createListCriteriaFromJSONParams or something in the Service
    //      or a static translation of json param to database fields in the domain
    private def convertJsonParamToDomainField(jsonParam) {
        
        switch(jsonParam) {
            case ['name','displayName','value.namespace']:
            return 'displayName'
            case ['version','widgetVersion','value.widgetVersion']:
            return 'widgetVersion'
            case ['description', 'value.description']:
            return 'description'
            case ['widgetGuid','path']:
            return 'widgetGuid'
            case ['universalName']:
            return 'universalName'
            case ['url','widgetUrl','value.url']:
            return 'widgetUrl'
            case ['width','value.width']:
            return 'width'
            case ['height','value.height']:
            return 'height'
            case ['headerIcon','imageUrlSmall','value.smallIconUrl','value.headerIcon']:
            return 'imageUrlSmall'
            case ['image','imageUrlLarge','value.largeIconUrl','value.image']:
            return 'imageUrlLarge'
            case ['singleton','value.singleton']:
            return 'singleton'
            case ['visible','value.visible']:
            return 'visible'
            case ['background','value.background']:
            return 'background'
            case ['descriptorUrl']:
            return 'descriptorUrl'
            case ['widgetTypes', 'value.widgetTypes']:
            return 'widgetTypes'
            default :
            log.error("JSON parameter: ${jsonParam} for Domain class WidgetDefinition has not been mapped in WidgetDefinitionService#convertJsonParamToDomainField")
            throw new OwfException (message: "JSON parameter: ${jsonParam}, Domain class: WidgetDefinition",
                exceptionType: OwfExceptionTypes.JsonToDomainColumnMapping)
        }
    }
    
    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }
}