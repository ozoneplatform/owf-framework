package ozone.owf.grails.services

import grails.converters.JSON
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap
import org.codehaus.groovy.grails.web.util.AbstractTypeConvertingMap
import org.codehaus.groovy.grails.web.util.TypeConvertingMap
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import org.hibernate.CacheMode
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.domain.DomainMapping

class WidgetDefinitionService {

    def loggingService = new AuditOWFWebRequestsLogger()
    def accountService
    def domainMappingService
    def serviceModelService

    def grailsApplication

    //TODO: implement ignoreCase and fetch params
    //@param returnDomainObjects If true, returns domain objects instead of service items
    def list(params, returnDomainObjects=false) {
        return list(params instanceof AbstractTypeConvertingMap ? params : new TypeConvertingMap(params), returnDomainObjects)
    }

    def list(AbstractTypeConvertingMap params, returnDomainObjects=false) {
        def widgetDefinition = null
        def opts = [:]
        if (params?.offset) opts.offset = params.getInt("offset")
        if (params?.max) opts.max = params.getInt("max")
        if (params?.stack_id) params.stack_id = params.getInt("stack_id")

        def stackFilteredIds = []
        if(params?.stack_id > -1) {
            def widgetGuids = []
            def stack = Stack.findById(params?.stack_id)
            def stackDefaultGroup = stack.defaultGroup
            //If no stackDefaultGroup return no results, no widgets can belong to the stack
            if(!stackDefaultGroup) {
                return [success: true, results: 0, data: []]
            }

            // List the dashboards of the stack's default group
            def dashboards = domainMappingService.getMappings(stack.defaultGroup,RelationshipType.owns,Dashboard.TYPE)?.collect{
                Dashboard.get(it.destId)
            }

            for(def i = 0; i < dashboards.size(); i++) {
                //Get all the widgetGuids found in the layoutConfig
                widgetGuids.addAll(inspectForWidgetGuids(JSON.parse(dashboards[i].layoutConfig)))
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

        // Either group_id or groupIds is passed, but not both
        if (params?.group_id) {
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
              inList("widgetGuid", new ArrayList((List)params.list('id')))
            if (params?.sort)
              order(convertJsonParamToDomainField(params.sort), params?.order?.toLowerCase() ?: 'asc')
            if(params?.widgetGuid) like("widgetGuid", params.widgetGuid)
            if(params?.universalName) like("universalName", params.universalName)
            if(params?.widgetName) like("displayName", params.widgetName)
            if(params?.widgetVersion) like("widgetVersion", params.widgetVersion)

            if (params?.widgetTypes) {
                def widgetTypeList = [params.widgetTypes].flatten()

                widgetTypes {
                    widgetTypeList.each { widgetType ->
                        eq("displayName", widgetType)
                    }
                }
            }

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
                                ilike(it.filterField, '%' + it.filterValue + '%')
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
                            ilike(it.filterField, '%' + it.filterValue + '%')
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
                    eq("userWidget", true)
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
        return [
            success:true,
            results: widgetDefinition.totalCount,
            data : returnDomainObjects ? widgetDefinition : processedWidgets
        ]
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
        // if loaded from a stack descriptor and has universal name already in system, assume same widget
        else {
            if (params.stackDescriptor && !isNull(params.universalName)) {
                widgetDefinition = WidgetDefinition.findWhere(universalName: params.universalName.trim())
				if(widgetDefinition){
					params.widgetGuid = widgetDefinition.widgetGuid
				}
				else {
					widgetDefinition = new WidgetDefinition()
				}
            }
			else {
				widgetDefinition = new WidgetDefinition()
			}
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

            //Ensure parameters are String, if not set them to null
            if(!(params.descriptorUrl instanceof String)) params.descriptorUrl = null;
            if(!(params.universalName instanceof String)) params.universalName = null;
            if(!(params.description instanceof String)) params.description = null;

            //Fail if universalName is already in use by another widget and this isn't from a stackDescriptor
            if (!isNull(params.universalName) && !params.stackDescriptor && !canUseUniversalName(widgetDefinition, params.universalName)) {
                throw new OwfException(message: 'Another widget uses ' + params.universalName + ' as its Universal Name. '
                    + 'Please select a unique Universal Name for this widget.', exceptionType: OwfExceptionTypes.GeneralServerError)
            }

            // Convert null or whitespace universal names to null.
            def newUniversalName = null;
            if (!isNull(params.universalName)) {
                newUniversalName = (params.universalName.size() == 0 || params.universalName.isAllWhitespace()) ? null : params.universalName.trim()
            }
            // set fields
            widgetDefinition.properties = [
                universalName: (!isNull(params.universalName)) ? newUniversalName : widgetDefinition.universalName,
                widgetGuid: params.widgetGuid? params.widgetGuid : widgetDefinition.widgetGuid,
                displayName: params.displayName ?: params.name ?: widgetDefinition.displayName,
                description: !isNull(params.description) ? params.description : widgetDefinition.description,
                widgetUrl: params.widgetUrl ?: params.url ?: widgetDefinition.widgetUrl,
                imageUrlSmall: params.imageUrlSmall ?: params.headerIcon ?: widgetDefinition.imageUrlSmall,
                imageUrlMedium: params.imageUrlMedium ?: params.image ?: widgetDefinition.imageUrlMedium,
                width: (params.width != null)? params.width as Integer : widgetDefinition.width,
                height: (params.height != null)? params.height as Integer : widgetDefinition.height,
                widgetVersion: params.containsKey('widgetVersion') ? (!isNull(params.widgetVersion) ? params.widgetVersion : widgetDefinition.widgetVersion) : params.version.toString(),
                singleton: (params.singleton != null)? params.singleton as Boolean : widgetDefinition.singleton,
                visible: (params.visible != null)? params.visible as Boolean : widgetDefinition.visible,
                background: (params.background != null)? params.background as Boolean : widgetDefinition.background,
                mobileReady: (params.mobileReady != null)? params.mobileReady as Boolean : widgetDefinition.mobileReady,
                descriptorUrl: !isNull(params.descriptorUrl) ? params.descriptorUrl : widgetDefinition.descriptorUrl,
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

                    def newIntentDataTypes = []
                    intent.dataTypes.collect {
                        newIntentDataTypes.push(IntentDataType.findByDataType(it) ?: new IntentDataType(dataType: it))
                    }

                    if(!newIntent) {
                        //Intent doesn't exist, create a new intent
                        newIntent = new Intent(action: intent.action, dataTypes: newIntentDataTypes)
                    }

                    def existingDataTypes = []
                    newIntent.dataTypes.each { existingDataTypes.push(it.toString().toLowerCase()) }

                    //Add any data types to the intent that don't already exist
                    for(newIntentDataType in newIntentDataTypes) {
                        if(!existingDataTypes.contains(newIntentDataType.toString().toLowerCase())) {
                            newIntent.addToDataTypes(newIntentDataType)
                            existingDataTypes.push(newIntentDataType.toString().toLowerCase())
                        }
                    }

                    newIntent.save()

                    //Add new widget definition intent
                    def newWidgetDefinitionIntent
                    if(i < lastSendIntent) {
                        //Create a new sending widget definition intent if one doesn't already exist
                        newWidgetDefinitionIntent = WidgetDefinitionIntent.createCriteria().get {
                            eq('widgetDefinition', widgetDefinition)
                            eq('intent', newIntent)
                            eq('send', true)
                            eq('receive', false)
                        }
                        if(!newWidgetDefinitionIntent) {
                            newWidgetDefinitionIntent = new WidgetDefinitionIntent(widgetDefinition: widgetDefinition, intent: newIntent,
                                send: true, receive: false)
                            widgetDefinition.addToWidgetDefinitionIntents(newWidgetDefinitionIntent)
                        }
                    } else {
                        //Create a new receiving widget definition intent if one doesn't already exist
                        newWidgetDefinitionIntent = WidgetDefinitionIntent.createCriteria().get {
                            eq('widgetDefinition', widgetDefinition)
                            eq('intent', newIntent)
                            eq('receive', true)
                            eq('send', false)
                        }
                        if(!newWidgetDefinitionIntent) {
                            newWidgetDefinitionIntent = new WidgetDefinitionIntent(widgetDefinition: widgetDefinition, intent: newIntent,
                                send: false, receive: true)
                            widgetDefinition.addToWidgetDefinitionIntents(newWidgetDefinitionIntent)
                        }
                    }

                    //Add any data types to the widget definition intent that don't already exist
                    for(newIntentDataType in newIntentDataTypes) {
                        if(!newWidgetDefinitionIntent.dataTypes?.contains(newIntentDataType)) {
                            newWidgetDefinitionIntent.addToDataTypes(newIntentDataType)
                        }
                    }

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
                    def results = criteria.list {
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
                                userWidget: true,
                                pwdPosition: maxPosition)

                            person.addToPersonWidgetDefinitions(personWidgetDefinition)
                            widgetDefinition.addToPersonWidgetDefinitions(personWidgetDefinition)
                        }
                        else {
                            results.each { result ->
                                result.userWidget = true
                                result.save(flush:true)
                            }
                        }
                    }
                    else if (params.update_action == 'remove') {
                        results?.eachWithIndex { nestedIt, j ->
                            if (!nestedIt.groupWidget) {
                                // If widget is not assigned directly or via a group, remove the pwd.
                                person.removeFromPersonWidgetDefinitions(nestedIt)
                                widgetDefinition.removeFromPersonWidgetDefinitions(nestedIt)
                            }
                            else {
                                // Otherwise, just un-flag the direct widget to user association.
                                nestedIt.userWidget = false
                                nestedIt.save(flush:true)
                            }
                        }
                    }

                    updatedPeople << person
                }
            }
            if (!updatedPeople.isEmpty()) {
                returnValue = updatedPeople.collect{ serviceModelService.createServiceModel(it) }
            }
        }

        if (params.update_action != null && params.update_action != '' && 'groups'==params.tab) {
            def updatedGroups = []
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

                    group.syncPeople()
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
                    def results = criteria.list {
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
                                userWidget: true,
                                visible: true,
                                pwdPosition: maxPosition)

                            person.addToPersonWidgetDefinitions(personWidgetDefinition)
                            widgetDefinition.addToPersonWidgetDefinitions(personWidgetDefinition)
                        }
                        else {
                            results.each { result ->
                                result.userWidget = true
                                result.save(flush:true)
                            }
                        }
                    }
                    else if (params.update_action == 'remove') {
                        results?.eachWithIndex { nestedIt, j ->
                            if (!nestedIt.groupWidget) {
                                // If widget is not assigned directly or via a group, remove the pwd.
                                person.removeFromPersonWidgetDefinitions(nestedIt)
                                widgetDefinition.removeFromPersonWidgetDefinitions(nestedIt)
                            }
                            else {
                                // Otherwise, just un-flag the direct widget to user association.
                                nestedIt.userWidget = false
                                nestedIt.save(flush:true)
                            }
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

    def export(params) {
        // Only admins may export Widgets
        ensureAdmin()

        def widgetDefinition = WidgetDefinition.findByWidgetGuid(params.id)

        def widgetData = getWidgetDescriptorJson(widgetDefinition)

        // Get the empty descriptor with appropriate JavaScript
        def widgetDescriptor

        if (grails.util.GrailsUtil.environment != 'production') {
            widgetDescriptor = new File('./src/resources/empty_descriptor.html').text
        } else {
            // Search classpath since different servlet containers can store
            // files in any number of places
            def resource = grailsApplication.mainContext.getResource('classpath:empty_descriptor.html')
            widgetDescriptor = resource.getFile().text
        }

        widgetDescriptor = widgetDescriptor.replaceFirst("var data;", java.util.regex.Matcher.quoteReplacement("var data = ${widgetData};"))

        return widgetDescriptor
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

    // Looks through the nested layoutConfig of a dashboard and grabs
    // all of its widgetGuids
    public def inspectForWidgetGuids(layoutConfig) {
        def widgetGuids = []

        def widgets = layoutConfig.widgets
        for(def i = 0; i < widgets?.size(); i++) {
            widgetGuids.push(widgets[i].widgetGuid)
        }

        def items = layoutConfig.items
        for(def i = 0; i < items?.size(); i++) {
            widgetGuids.addAll(inspectForWidgetGuids(items[i]))
        }

        return widgetGuids
    }

    private def getWidgetDescriptorJson(widgetDefinition) {

        def widgetData = [:]
        //Get only the values required for a widget descriptor
        widgetData.put("displayName", widgetDefinition.displayName)
        widgetData.put("widgetUrl", widgetDefinition.widgetUrl)
        widgetData.put("imageUrlSmall", widgetDefinition.imageUrlSmall)
        widgetData.put("imageUrlMedium", widgetDefinition.imageUrlMedium)
        widgetData.put("width", widgetDefinition.width)
        widgetData.put("height", widgetDefinition.height)
        widgetData.put("visible", widgetDefinition.visible)
        widgetData.put("singleton", widgetDefinition.singleton)
        widgetData.put("background", widgetDefinition.background)
        widgetData.put("widgetTypes", widgetDefinition.widgetTypes?.name)
        if(widgetDefinition.mobileReady)
        {
            widgetData.put("mobileReady",widgetDefinition.mobileReady)
        }else {

            widgetData.put("mobileReady",false)
        }

        //Add non-required fields
        widgetDefinition.descriptorUrl && widgetData.put("descriptorUrl", widgetDefinition.descriptorUrl)
        widgetDefinition.universalName && widgetData.put("universalName", widgetDefinition.universalName)
        widgetDefinition.description && widgetData.put("description", widgetDefinition.description)
        widgetDefinition.widgetVersion && widgetData.put("widgetVersion", widgetDefinition.widgetVersion)

        def intents = [:], sendIntents = [], receiveIntents = []
        widgetDefinition.widgetDefinitionIntents.each {
            def intent = [action: it.intent.action, dataTypes: it.dataTypes.dataType]
            it.send && sendIntents.push(intent)
            it.receive && receiveIntents.push(intent)
        }
        sendIntents && intents.put('send', sendIntents)
        receiveIntents && intents.put('receive', receiveIntents)
        intents && widgetData.put("intents", intents)

        //Pretty print the JSON
        widgetData = (widgetData as JSON).toString(true)

        return widgetData
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
            case ['image','imageUrlMedium','value.mediumIconUrl','value.image']:
            return 'imageUrlMedium'
            case ['singleton','value.singleton']:
            return 'singleton'
            case ['visible','value.visible']:
            return 'visible'
            case ['background','value.background']:
            return 'background'
            case ['mobileReady','value.mobileReady']:
            return 'mobileReady'
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

    public def reconcileGroupWidgetsFromDashboards(group, addOnly = true) {

        // Get all dashboards for this group.
        def dashboards = domainMappingService.getMappedObjects(group, RelationshipType.owns, Dashboard.TYPE)
        def groupWidgets = domainMappingService.getMappedObjects(group, RelationshipType.owns, WidgetDefinition.TYPE)
        def widgetGuids = []

        dashboards?.each{ dashboard ->
            // For each dashboard get its list of widget guids.
            def dashGuids = inspectForWidgetGuids(JSON.parse(dashboard.layoutConfig))
            widgetGuids << dashGuids
        }
        widgetGuids = widgetGuids.flatten()
        widgetGuids.unique()

        // Remove any group widgets that aren't in the current dashboard layouts if we're not in add-only mode.
        if (!addOnly) {
            groupWidgets?.each { groupWidget ->
                if (!widgetGuids.contains(groupWidget.widgetGuid)) {
                    domainMappingService.deleteMapping(group,RelationshipType.owns,groupWidget)
                }
            }
        }

        // Loop over the widgetGuids.  if there's not already a mapping to that widget for this group, add it.
        widgetGuids.each { widgetGuid ->
            def widget = WidgetDefinition.findByWidgetGuid(widgetGuid,[cache:true])
            def widgetMapping = domainMappingService.getMapping(group, RelationshipType.owns, widget)
            if (widgetMapping.isEmpty()) {
                domainMappingService.createMapping(group,RelationshipType.owns,widget)
            }
        }
    }

    public def hasMarketplace() {
        def widgets = WidgetDefinition.createCriteria().list {
            widgetTypes {
                eq("name",'marketplace')
            }
        }
        return [data: widgets.size() > 0 ? true : false]
    }

    private def isNull(obj) {
        if (obj == null) {
            return true
        }
        else return obj.equals(null)
    }

	def groupOwnedWidget(widgetId, personId, isAdmin){
		def adminQuery = ""
		if(isAdmin as boolean)
			adminQuery = "OR g.name = 'OWF Administrators'"

		log.debug("admin query in groupOwnedWidget = " + adminQuery)

		def ownedDefinitions = DomainMapping.findAll(" \
			FROM DomainMapping dm, WidgetDefinition wd\
			WHERE dm.srcType = 'group' AND dm.destType = 'widget_definition' AND dm.destId = wd.id \
			AND wd.widgetGuid = :widgetId AND dm.srcId IN\
			(SELECT g.id FROM Group g\
					WHERE g.name = 'OWF Users' "+adminQuery+" OR exists (FROM g.people AS p WHERE p.id = :personId)) ", [widgetId: widgetId, personId: personId as long])

		ownedDefinitions = ownedDefinitions.collect { it[0]}

		log.debug("Got widget definitions: " + ownedDefinitions)
		if(ownedDefinitions)
			return true

		return false
	}
}
