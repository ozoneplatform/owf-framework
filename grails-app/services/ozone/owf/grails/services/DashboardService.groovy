package ozone.owf.grails.services

import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.JSONObject
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Group
import org.hibernate.CacheMode
import ozone.owf.grails.domain.DomainMapping
import ozone.owf.grails.domain.RelationshipType
import ozone.owf.grails.domain.EDashboardLayout

class DashboardService extends BaseService {

  final def uniqueIdRegex = /"uniqueId"\s*:\s*"[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}"/ // /"uniqueId"\s*\:\s*"[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}"/
  final def guidRegex = /[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}/

    def domainMappingService
    def serviceModelService

    def addOrRemove(params) {
      def returnValue = [:]

      if (!accountService.getLoggedInUserIsAdmin()) {
          throw new OwfException(message:'You are not authorized to update dashboards assocations.', exceptionType: OwfExceptionTypes.Authorization)
      }

      def dashboard = Dashboard.findByGuid(params.guid,[cache:true])
      if (dashboard == null) {
          throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
      }

      if (params.update_action != null && params.update_action != '' && 'groups'==params.tab) {
          def updatedGroups = []
          def groups = JSON.parse(params.data);

          groups.each { it ->
              def group = Group.findById(it.id,[cache:true])

              if (group) {
                  if (params.update_action == 'add') {
                      domainMappingService.createMapping(group, RelationshipType.owns, dashboard)
                  }
                  else if (params.update_action == 'remove') {
                      domainMappingService.deleteMapping(group, RelationshipType.owns, dashboard)
                  }
                  updatedGroups << group
              }
          }
          if (!updatedGroups.isEmpty()) {
              returnValue = updatedGroups.collect{ serviceModelService.createServiceModel(it) }
          }
      }


      return [success:true, data:returnValue]
    }

    private def processGroupDashboards(groups,user) {
      def privateGroupDashboardToGroupsMap = [:]

      //loop through group dashboards
      domainMappingService.getBulkMappings(groups,RelationshipType.owns,Dashboard.TYPE).each { dm ->

        //if there is no user then there is no need to create private user copies
        if (user != null) {
          //check if this group dashboard already has a private copy for this user
          def userFilter = {
              eq('user',user)
          }
          def privateGroupDashboards = domainMappingService.getMappedObjects([id:dm.destId,TYPE:dm.destType],
                  RelationshipType.cloneOf,Dashboard.TYPE,[:],userFilter,'dest')

          //create private copy of the group dashboard for the user if they don't have one
          if (privateGroupDashboards.isEmpty()) {
            def args = [:]
            def groupDash = Dashboard.get(dm.destId)
            if (groupDash != null) {
              //use a new guid
              args.guid = java.util.UUID.randomUUID().toString()

              args.columnCount = groupDash.columnCount
              args.isdefault = groupDash.isdefault
              args.layout = groupDash.layout
              args.name = groupDash.name
              args.description = groupDash.description
              args.locked = groupDash.locked

              args.defaultSettings = groupDash.defaultSettings
              args.layoutConfig = groupDash.layoutConfig
              args.intentConfig = groupDash.intentConfig

              def privateDash = deepClone(args,user.id)

              //save mapping
              domainMappingService.createMapping(privateDash.dashboard,RelationshipType.cloneOf,[id:dm.destId,TYPE:dm.destType])

              //save privateGroupDashboardInfo
              addGroupToDashboardToGroupsMap(dm.srcId, privateGroupDashboardToGroupsMap, privateDash.dashboard.id)
            }
          }
          else {
            //loop through each private group dashboard and save
            privateGroupDashboards.each {
              //save privateGroupDashboardInfo
              addGroupToDashboardToGroupsMap(dm.srcId, privateGroupDashboardToGroupsMap, it.id)
            }
          }
        }

		    //Save Group for Group Dashboard as well
		    addGroupToDashboardToGroupsMap(dm.srcId, privateGroupDashboardToGroupsMap, dm.destId)
      }
      return privateGroupDashboardToGroupsMap
    }

	private def addGroupToDashboardToGroupsMap(def groupId, def groupDashboardToGroupsMap, def mapKey){
		  if (groupDashboardToGroupsMap[mapKey] == null) {
			groupDashboardToGroupsMap[mapKey] = [] as Set
		  }
		  Group group = Group.get(groupId)
		  if (group != null) {
			groupDashboardToGroupsMap[mapKey] << group
		  }
	}
	
  private def listDashboards(params) {
      def dashboardServiceModelList = []
    def opts = [:]

    //handle paging and sorting params
    if (params?.offset != null) {
      opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
    }
    else if (params?.start != null) {
      params.offset = params.start
      opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
    }

    if (params?.max != null) {
      opts.max = (params.max instanceof String ? Integer.parseInt(params.max) : params.max)
    }
    else if (params?.limit != null) {
      params.max = params.limit
      opts.max = (params.max instanceof String ? Integer.parseInt(params.max) : params.max)
    }

    if (params?.dir != null && params?.order == null) {
      params.order = params.dir
    }

      if (params.guid == null && params.id != null) {
        params.guid = params.id
      }

      if (params.user_id != null) {
        def person = Person.get(params.user_id)
        if (person) {
          params.user = person
        }
      }

      //get groups
      def groups = Group.withCriteria {

		  
		if (params.user != null) {
			people {
				eq('id',params.user.id)
			}
		}
        
        eq('status','active')
        cache(true)

        //turn cache mode to GET which means don't use instances from this query for the 2nd level cache
        //seems to be a bug where the people collection is cached with only one person due to the people association filter above
        cacheMode(CacheMode.GET)
      }

      def groupDashboardIds = [] as Set
      if (params.group_id != null) {
        Group group = Group.get(params.group_id)
        if (group != null) {
           domainMappingService.getMappings(group,RelationshipType.owns,Dashboard.TYPE).each {
             groupDashboardIds << it.destId
           }
        }
      }
      else if (params.isGroupDashboard == true || params.isGroupDashboard == 'true') {
  //      domainMappingService.getBulkMappings(groups,RelationshipType.owns,Dashboard.TYPE).each {
  //        groupDashboardIds << it.destId
  //      }
         groupDashboardIds = Dashboard.withCriteria {
           isNull('user')
         }.id
      }

      //if group params are set then only group dashboards should be returned, if none are found an empty list should be returned
      if ((params.group_id != null || params.isGroupDashboard?.toString()?.toBoolean()) && groupDashboardIds.isEmpty()) {
        return [success: true, dashboardList: [], count: 0]
      }

      //process any groupDashboards for this user
      def privateGroupDashboardToGroupsMap = [:]
        privateGroupDashboardToGroupsMap = processGroupDashboards(groups,params.user)

      //get group dashboards
    def criteria = Dashboard.createCriteria()
      def userDashboardList = criteria.list(opts) {

        //filter by fields
        if (params.filters) {
           if (params.filterOperator?.toUpperCase() == 'OR') {
              or {
               JSON.parse(params.filters).each { filter ->
                 ilike(filter.filterField, '%' + filter.filterValue + '%')
               }
             }
           }
           else {
             JSON.parse(params.filters).each { filter ->
               ilike(filter.filterField, '%' + filter.filterValue + '%')
             }
           }
       }

      if (params.user != null) {
        eq('user',params.user)
      }

        if (params.guid) {
        eq('guid', params.guid)
      }

        //filter by group dashboard ids
        if (groupDashboardIds != null && !groupDashboardIds.isEmpty()) {
          inList('id',groupDashboardIds)
        }

      if (params.isdefault != null) {
        eq('isdefault', convertStringToBool(params.isdefault) )
      }

      if (params.layout != null) {
        eq('layout', params.layout)
      }

      if (params.locked != null) {
        eq('locked', convertStringToBool(params.locked) )
      }

      if (params?.sort != null) {
        order(convertJsonParamToDomainField(params.sort), params?.order?.toLowerCase() ?: 'asc')
      }
      else {
        //default sort
        order('dashboardPosition', params?.order?.toLowerCase() ?: 'asc')
      }
      cache(true)
    }

      //loop through each dashboard and get group info and turn into json
      userDashboardList.each {
         def args = [:]

//         if (params.group_id != null || (params.isGroupDashboard?.toString()?.toBoolean())) {
//           args['isGroupDashboard'] = true
//         }
//         else {
//           args['isGroupDashboard'] = false
//         }

         args['isGroupDashboard'] = it.user == null ? true : false

         if (privateGroupDashboardToGroupsMap[it.id] != null) {
           args['groups'] = privateGroupDashboardToGroupsMap[it.id]
  }

         dashboardServiceModelList << serviceModelService.createServiceModel(it, args)
      }

      return [success: true, dashboardList: dashboardServiceModelList, count: userDashboardList.totalCount]

    }

  def listForAdmin(params) {
    if (!accountService.getLoggedInUserIsAdmin()) {
      throw new OwfException(message: 'You are not authorized to list Admin dashboards.', exceptionType: OwfExceptionTypes.Authorization)
    }
    return listDashboards(params)
  }

  def listForUser(params) {
    params.user = accountService.getLoggedInUser()
    return listDashboards(params)
  }

	def showForUser(params) {
          if (params.guid == null && params.id != null) {
            params.guid = params.id
          }
		def dashboard = Dashboard.findByGuid(params.guid,[cache:true])
          if (dashboard == null) {
              throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}
          if (accountService.getLoggedInUserIsAdmin() || dashboard.user.username.equals(accountService.getLoggedInUsername())) {

              //should only be one
              def groupDashboardMappings = domainMappingService.getMappings(dashboard,RelationshipType.cloneOf,Dashboard.TYPE)
              def groups = []
              if (groupDashboardMappings[0] != null) {
                def groupDash = Dashboard.get(groupDashboardMappings[0].destId)
                if (groupDash != null) {
                  groups = domainMappingService.getMappedObjects(groupDash,RelationshipType.owns,Group.TYPE,[:],null,'dest')
		}
              }

              def dash = serviceModelService.createServiceModel(dashboard, ['groups':groups,isGroupDashboard:true])

              return [success:true, dashboard: dash]
          }
          else {
			throw new OwfException(message:'You are not authorized to view this dashboard.', exceptionType: OwfExceptionTypes.Authorization)
		}
	}

    def createDashboardWidgetStateObject(stateObject, personWidgetDefinition, dashboard, index, uniqueIdMap){
    if(stateObject.x && stateObject.x < 0) stateObject.x = 0;
    if(stateObject.y && stateObject.y < 0) stateObject.y = 0;
	//TODO Edit default values for blank items (they should never be blank, but we need to make sure we get it right).
	def dws = new DashboardWidgetState(
		uniqueId	        	:stateObject.uniqueId		?: ''       ,
        widgetGuid	        	:stateObject.widgetGuid		?: ''       ,
		name                	:stateObject.name   		?: '',
		active              	:stateObject.active 		?: false    ,
		width               	:stateObject.width  		?: 0        ,
		height              	:stateObject.height  		?: 0       	,
		x                   	:stateObject.x        		?: 0      	,
		y                   	:stateObject.y         		?: 0     	,
		zIndex              	:stateObject.zIndex    		?: 0     	,
		minimized           	:stateObject.minimized  	?: false 	,
		maximized           	:stateObject.maximized  	?: false  	,
		pinned              	:stateObject.pinned     	?: false  	,
		collapsed           	:stateObject.collapsed    	?: false  	,
		columnPos           	:stateObject.columnPos     	?: 0 		,
		buttonId            	:stateObject.buttonId != JSONObject.NULL && stateObject.buttonId != null ? stateObject.buttonId: '',
		buttonOpened        	:stateObject.buttonOpened  	?: false 	,
		region  	        	:stateObject.region      	?: 'none'   ,
		statePosition       	:index,
		dashboard	        	:dashboard				    			,
		personWidgetDefinition	:personWidgetDefinition			    	,
	)

	return dws
  }

	private def createState(params, dashboard, state, cloned = false) {
          def uniqueIdMap = [:]
		if (cloned){
			state.eachMatch(uniqueIdRegex){
                def origId = (it =~ guidRegex)[0]
                def newId = java.util.UUID.randomUUID().toString()
                uniqueIdMap[origId] = newId
                state = state.replaceAll(origId,newId)
			}
		}

		def stateAsJSON = JSON.parse(state)
		def size = stateAsJSON.size()
		for (int i in 0..<size)
		{
		  	def stateElement = stateAsJSON[i]
			if (stateElement instanceof String)
			{
				throw new OwfException(	message:'A fatal validation error occurred during the creation of a dashboard. An element of the state parameter was not parsable as JSON. Guilty Element: '
                   + stateElement + ' Params: ' + params.toString(),
											exceptionType: OwfExceptionTypes.Validation)
			}
			def widgetGuid = stateElement.widgetGuid
			def widgetDefinition = WidgetDefinition.findByWidgetGuid(widgetGuid)
			def pwd = PersonWidgetDefinition.findByPersonAndWidgetDefinition(dashboard.user, widgetDefinition)
              def dws = createDashboardWidgetStateObject(stateElement, pwd, dashboard, i, uniqueIdMap)
		      	dashboard.addToState(dws)

				dws.validate()
		      	if (dws.hasErrors()) {
                throw new OwfException(	message:'A fatal validation error occurred during the creation of a dashboard widget state element. Params: '
							+ params.toString() + ' Validation Errors: ' + dws.errors.toString(), exceptionType: OwfExceptionTypes.Validation)
		      	}
		}

	}

	private def updateOldDefault(params){
		def isDefault = (params.isdefault == true || params.isdefault == "true" || params.isdefault== "on")
		if ( !isDefault || !isDefaultDashboardExists(params))
		{
			return
		}
		def oldDefault = null;
		try
		{
			oldDefault = getDefault(params).dashboard
		}
		catch (e){
			//Swallow, it's ok
		}
		if (oldDefault != null)
		{
			update([name: oldDefault.name, guid: oldDefault.guid, layout: oldDefault.layout, columnCount: oldDefault.columnCount, defaultSettings: oldDefault.defaultSettings, showLaunchMenu: oldDefault.showLaunchMenu, locked: oldDefault.locked, personId: params.personId, isdefault: false, doNotEnsureDefault: true])
		}
	}

    def createOrUpdate(params) {
       if (params.guid != null) {
         if (Dashboard.findByGuid(params.guid) == null) {
           params.cloned = true
           create(params)
         }
         else {
           update(params)
         }
       }
    }

  def create(params) {
	updateOldDefault(params)
      //default person to current user
	def person = accountService.getLoggedInUser()

      if (params.personId != null || params.user_id != null) {
        def personId = params.personId ?: params.user_id
        if (person.id != (personId as Integer) && !accountService.getLoggedInUserIsAdmin()) {
          throw new OwfException(message: 'You are not authorized to create dashboards for other users.', exceptionType: OwfExceptionTypes.Authorization)
			}
        else {
          person = Person.get(personId);
		}
	  }

	def queryReturn = Dashboard.executeQuery("SELECT MAX(d.dashboardPosition) AS retVal FROM Dashboard d WHERE d.user = ?", [person])
	def maxPosition = (queryReturn[0] != null)? queryReturn[0] : -1
	maxPosition++

    def dashboard = new Dashboard(
            name: params.name,
            guid: (params.cloned)? ((Dashboard.findByGuid(params.guid) != null)? java.util.UUID.randomUUID().toString() : params.guid) : params.guid,
            layout: JSONObject.NULL.equals(params.layout) ? EDashboardLayout.Desktop.toString() : params.layout.toLowerCase(),
            columnCount: (params.columnCount != null)? params.columnCount : 0,
            isdefault: convertStringToBool(params.isdefault),
			dashboardPosition:maxPosition,
			description: JSONObject.NULL.equals(params.description) ? null : params.description,
			defaultSettings: JSONObject.NULL.equals(params.defaultSettings) ? null : params.defaultSettings,
			showLaunchMenu: params.showLaunchMenu != null ? params.showLaunchMenu : false,
      layoutConfig: params.layoutConfig.toString() ?: "",
      intentConfig: params.intentConfig.toString()?: "",
			locked: params.locked != null ? params.locked : false,
            state: [])

      //if this is not a group dashboard then assign it to the specified user
      //otherwise group dashboards are not associated with any user
      if (!params.isGroupDashboard?.toString()?.toBoolean()) {
        dashboard.user = person
      }

    //Now handle all of the state related stuff...

    if ((params.state) && (params.state != 'null')) {
      createState(params, dashboard, params.state, params.cloned)
    }

    if (params.cloned) {
  		//Dashboard original = Dashboard.findByGuid(params.guid)
      
      //if(original != null) {
        regenerateAllConfigs(dashboard)
      //}
  	}

    dashboard.validate()
	if (dashboard.hasErrors()) {
      	throw new OwfException(	message:'A fatal validation error occurred during the creating of a dashboard. Params: ' + params.toString() + ' Validation Errors: ' + dashboard.errors.toString(),
								exceptionType: OwfExceptionTypes.Validation)
    }

    //explicit flush here so subsequent calls will see the new dashboard
	if (!dashboard.save(flush:true)) {
        throw new OwfException (message: 'A fatal error occurred while trying to save a dashboard. Params: ' + params.toString(),
								exceptionType: OwfExceptionTypes.Database)
    } else {
        return [success: true, dashboard: dashboard]
    }
  }
  
  	def deleteForAdmin(params) 
  	{
  		if (!accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to delete Admin dashboards.', exceptionType: OwfExceptionTypes.Authorization)
		}
  		def dashboard = Dashboard.findByGuid(params.guid)
		if (dashboard == null)
		{
			throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}
  		params.dashboard = dashboard
  		deleteForUser(params)
	}

  	def deleteForUser(params) 
	{
		def dashboard = null
		if(params.dashboard != null){
			dashboard = params.dashboard
		}else{
			if (accountService.getLoggedInUserIsAdmin() && (params.adminEnabled == true)){
				dashboard = Dashboard.findByUserAndGuid(params.personId, params.guid)
			}else {
				dashboard = Dashboard.findByUserAndGuid(accountService.getLoggedInUser(), params.guid)
			}
		}
		
		if (dashboard == null)
		{
			throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}
		
		if (dashboard.user && !(dashboard.user.username.equals(accountService.getLoggedInUsername()))) {
			if (!(accountService.getLoggedInUserIsAdmin() && (params.adminEnabled == true)))
			{
				throw new OwfException(message:'You are not authorized to delete this dashboard.', exceptionType: OwfExceptionTypes.Authorization)
			}
		}
		
		try
		{

            //todo see if we need to delete all private copies of this dashboard

            //delete all mappings for this dashboard
            domainMappingService.purgeAllMappings(dashboard)

			//Manually remove DWS from their PWD parent.
			//Otherwise, we will get a re-save during cascade.
			dashboard.state.each{
				it.personWidgetDefinition?.dashboardWidgetStates?.remove(it)
			}
			dashboard.delete(flush:true)
			ensureDefault(dashboard.user)
			return [success: true, dashboard: dashboard]
		}
		catch (e)
		{
			log.error(e)
			throw new OwfException (message: 'A fatal error occurred while trying to delete a dashboard. Params: ' + params.toString(),exceptionType: OwfExceptionTypes.Database)
		}
	}
  
	def bulkDeleteAndUpdate(params){
	  	bulkDelete(params)
		bulkUpdate(params)
		return [success:true]
  	}

	def bulkDeleteForAdmin(params){
		if (!accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to bulkDelete Admin dashboards.', exceptionType: OwfExceptionTypes.Authorization)
		}
		if (params.viewGuidsToDelete == null){
			throw new OwfException(	message:'A fatal validation error occurred. ViewGuidsToDelete param required. Params: ' + params.toString(), 
				exceptionType: OwfExceptionTypes.Validation)
		}
		JSON.parse(params.viewGuidsToDelete).each {
			def dashboard = Dashboard.findByGuid(it)
  			if (dashboard == null)
			{
				throw new OwfException(message:'Dashboard ' + it + ' not found during bulk delete.', exceptionType: OwfExceptionTypes.NotFound)
			}
			Map newParams = new HashMap()
	  		newParams.guid = it
	  		newParams.dashboard = dashboard
	  		newParams.adminEnabled = true
	  		def result = delete(newParams)
		}
		return [success: true]
	}
	
	
	def bulkDelete(params){
		if (params.viewGuidsToDelete == null){
			throw new OwfException(	message:'A fatal validation error occurred. ViewGuidsToDelete param required. Params: ' + params.toString(), 
				exceptionType: OwfExceptionTypes.Validation)
		}
		JSON.parse(params.viewGuidsToDelete).each {
			def dashboard = findByGuidForUser(it,null)
  			if (dashboard == null)
			{
				throw new OwfException(message:'Dashboard ' + it + ' not found during bulk delete.', exceptionType: OwfExceptionTypes.NotFound)
			}
			Map newParams = new HashMap()
	  		newParams.guid = it
	  		def result = delete(newParams)
		}
		return [success: true]
	}
	
	def updateForAdmin(params) {
		if (!accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to update Admin dashboards.', exceptionType: OwfExceptionTypes.Authorization)
		}
		
		def person = getPersonByParams(params)
		if(person == null && params.isGroupDashboard == false){
			throw new OwfException(message:'Person not found.', exceptionType: OwfExceptionTypes.NotFound)
		}

        def dashboard = Dashboard.findByGuid(params.guid)
        if (dashboard == null) {
				throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
			}
        if (dashboard.user && !(dashboard.user.username.equals(accountService.getLoggedInUsername()))) {
				if (!(accountService.getLoggedInUserIsAdmin() && (params.adminEnabled == true)))
				{
					throw new OwfException(message:'You are not authorized to update this dashboard.', exceptionType: OwfExceptionTypes.Authorization)
				}
			}
			def retVal = updateDashboard(params, person, dashboard)
			return retVal
		}
  
	def updateForUser(params) {
		// look for a specified dashboard in db
		def dashboard = findByGuidForUser(params.guid, params.personId)
    	
		if (!dashboard)
		{
			//dashboard was not present in db could be either auth or db
  			if (Dashboard.findByGuid(params.guid))
 			{
 				throw new OwfException(message:'The requested dashboard was not found. Params: ' + params.toString(), 
 									exceptionType: OwfExceptionTypes.Authorization)
 			}
 			else
 			{
 				throw new OwfException(message:'The requested dashboard was not found. Params: ' + params.toString(), 
 								exceptionType: OwfExceptionTypes.NotFound)
 			}
		}
		
		def retVal = updateDashboard(params, accountService.getLoggedInUser(), dashboard)
		return retVal
	}
	
	private def updateDashboard(params, person, dashboard){
		/*
		 * Do we need to set an old dashboard to no longer default?
		 * This can be (and was originally) done with one giant if statement.
		 * The problem was it was incomprehensible.
		 */
		if (params.isdefault != null)
		{
			if ( params.isdefault.toString().equalsIgnoreCase("true") || params.isdefault.toString().equalsIgnoreCase("on") )
			{
				def defaultResult = null
				try {defaultResult = getDefault(params, person)}catch (e){}
				if (defaultResult != null && defaultResult.success == true)
				{
					def defaultDashboard = defaultResult.dashboard
					def guidsMatch = defaultResult.dashboard?.guid.toString().equals(params.guid.toString())
					if (defaultDashboard != null && !guidsMatch)
					{
						defaultDashboard.isdefault = false
						defaultDashboard.save(flush:true)
					}
				}
			}
		}
		// update values of user defined dashboard and
		// validate prior to save
		
		dashboard.guid = params.guid ?: dashboard.guid
		dashboard.name = params.name ? params.name : dashboard.name
		dashboard.columnCount = params.columnCount != null ? params.columnCount as Integer : dashboard.columnCount
		dashboard.isdefault = params.isdefault != null ? convertStringToBool(params.isdefault) : dashboard.isdefault
		dashboard.dashboardPosition = params.dashboardPosition != null ? params.dashboardPosition as Integer : dashboard.dashboardPosition
        if (params.description) {
            dashboard.description = JSONObject.NULL.equals(params.description) ? null : params.description
        }
        
		dashboard.defaultSettings = JSONObject.NULL.equals(params.defaultSettings) ? null : params.defaultSettings
    
	    dashboard.layoutConfig = params.layoutConfig ?: dashboard.layoutConfig
	    dashboard.intentConfig = params.intentConfig ?: dashboard.intentConfig
    
		dashboard.showLaunchMenu = params.showLaunchMenu instanceof Boolean ? params.showLaunchMenu : params.showLaunchMenu == "true"
		dashboard.locked = params.locked instanceof Boolean ? params.locked : params.locked == "true"
		
		// remove existing dashboard state
        def uniqueIdMap = [:]
		if (params.state) {
			if (params.regenerateStateIds){

        regenerateAllConfigs(dashboard);
				
        // Regenerate uniqueIds for state widgets
				params.state.eachMatch(uniqueIdRegex){
                  def origId = (it =~ guidRegex)[0]
                  def newId = java.util.UUID.randomUUID().toString()
                  uniqueIdMap[origId] = newId
                  params.state = params.state.replaceAll(origId,newId)
				}

			}
			
			def stateAsJSON = null
			try
			{
				def valString = params.state.replaceAll("\n","")				
				stateAsJSON = JSON.parse(valString)
			}
			catch (e)
			{
				throw new OwfException(	message:'A fatal validation error occurred during the updating of a dashboard. The overall state element was not parseable as JSON: '
				+ params.state + '\n(Exception = ' + e + ')', exceptionType: OwfExceptionTypes.Validation)
			}
			//This will wipe all the former state objects when the Dashboard is saved.
			//Manually remove DWS from their PWD parent.
			//Otherwise, we will get a re-save during cascade.
			dashboard.state.each{
				it.personWidgetDefinition?.dashboardWidgetStates?.remove(it)
			}
			dashboard.state*.delete()
			dashboard.state.clear()
			//We have to save it now to mark them as deleted before it attempts to save the others, 
			//in case the uniqueIds of the incoming elements match already existing uniqueIds (a likely scenario)
			dashboard.save(flush:true)
			def size = stateAsJSON.size()
			for (int i in 0..<size)
			{
				def stateElement = stateAsJSON[i]
				if (!((stateElement instanceof String) && (stateElement.equalsIgnoreCase("undefined")))){
					if (stateElement instanceof String)
					{
						throw new OwfException(	message:'A fatal validation error occurred during the updating of a dashboard. An element of the state parameter was not parsable as JSON. Guilty Element: '
						+ stateElement + ' Params: ' + params.toString(), 
						exceptionType: OwfExceptionTypes.Validation)
					}
					def widgetGuid = stateElement.widgetGuid
					def widgetDefinition = WidgetDefinition.findByWidgetGuid(widgetGuid)
					def pwd = PersonWidgetDefinition.findByPersonAndWidgetDefinition(person, widgetDefinition)
//					if (pwd != null)
//					{
						def dws = createDashboardWidgetStateObject(stateElement, pwd, dashboard, i, uniqueIdMap)
						dws.validate()
						if (dws.hasErrors()) {
							throw new OwfException(	message:'A fatal validation error occurred during the creation of a dashboard widget state element. Params: ' + params.toString() + ' Validation Errors: ' + dws.errors.toString(), 
							exceptionType: OwfExceptionTypes.Validation)
						}
						dashboard.addToState(dws)
//					}
//					else
//					{
//						//If null, don't worry. It was probably deleted via marketplace. Don't create DWS.
//						log.warn('While saving a dashboard, did not find a person widget definition with guid of: ' + widgetGuid)
//					}
				}
			}
		}
		
		if (params.layout && params.layout.toLowerCase() != dashboard.layout) {
			def bypassLayoutRearrange = false;
			if (params.bypassLayoutRearrange == "true") bypassLayoutRearrange = true
			convertDashboardLayout(dashboard, params.layout, bypassLayoutRearrange)
		}
		
		dashboard.validate()
		
		if (dashboard.hasErrors()) {
			throw new OwfException(	message:'A fatal validation error occurred during the updating of a dashboard. Params: ' + params.toString() + ' Validation Errors: ' + dashboard.errors.toString(), 
			exceptionType: OwfExceptionTypes.Validation)
		}
		if (!dashboard.save(flush:true)) {
			throw new OwfException (message: 'A fatal error occurred while trying to save a dashboard. Params: ' + params.toString(),
			exceptionType: OwfExceptionTypes.Database)
		} else {
			try
			{
				if (params.doNotEnsureDefault == null || params.doNotEnsureDefault == false)
				{
					ensureDefault(dashboard.user)
				}
			}
			catch(e)
			{
				throw new OwfException (message: 'A fatal error occurred while trying to ensure dashboard defaults after a save. Changes have been backed out. Params: ' + params.toString(), exceptionType: OwfExceptionTypes.Database)
			}
			return [success: true, dashboard: dashboard]
		}
		
	}

    def restore(params) {

      def dashboard = Dashboard.findByGuid(params.guid,[cache:true])
      if (dashboard == null) {
          throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
      }
      if (accountService.getLoggedInUserIsAdmin() || dashboard.user.username.equals(accountService.getLoggedInUsername())) {

          //should only be one
          def groupDashboardMappings = domainMappingService.getMappings(dashboard,RelationshipType.cloneOf,Dashboard.TYPE)
          def groups = []
          if (groupDashboardMappings[0] != null) {
            def groupDash = Dashboard.get(groupDashboardMappings[0].destId)
            if (groupDash != null) {
              groups = domainMappingService.getMappedObjects(groupDash,RelationshipType.owns,Group.TYPE,[:],null,'dest')

                def args = [:]
                args.guid = dashboard.guid

                args.columnCount = groupDash.columnCount
                args.isdefault = groupDash.isdefault
                args.layout = groupDash.layout
                args.name = groupDash.name
                args.description = groupDash.description
                args.defaultSettings = groupDash.defaultSettings
                if (params.isdefault != null) {
                  args.isdefault = params.isdefault
                }
                args.locked = groupDash.locked
				
                //need to regenerate when updating an existing dash
                args.regenerateStateIds = true

                //need to make sure the dashboard layout is the same as the group dash layout
                dashboard.layout = groupDash.layout

                //todo someday simplify this - turns state into a json string so cloneDashboards method can be reused
                args.state = groupDash.state.collect {serviceModelService.createServiceModel(it) as JSON}.toString()
                
                args.layoutConfig = groupDash.layoutConfig
                args.intentConfig = groupDash.intentConfig

                updateDashboard(args,accountService.getLoggedInUser(),dashboard)
            }
          }

          return [success:true, data: [serviceModelService.createServiceModel(dashboard, ['groups':groups])]]
      }
      else {
          throw new OwfException(message:'You are not authorized to restore this dashboard.', exceptionType: OwfExceptionTypes.Authorization)
      }
    }

	def deepClone(params){
		return deepClone(params,accountService.getLoggedInUser().id)
	}

	def deepClone(params, userid){
		if (userid != accountService.getLoggedInUser().id && !accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to clone dashboards for other users.', 
   	 									exceptionType: OwfExceptionTypes.Authorization)
		}
		
		params.personId = userid
		params.cloned = true
		return create(params)
	}

	def bulkUpdate(params){
		if (params.viewsToUpdate == null){
			throw new OwfException(	message:'A fatal validation error occurred. viewsToUpdate param required. Params: ' + params.toString(),exceptionType: OwfExceptionTypes.Validation)
		}
		def position = 0
		JSON.parse(params.viewsToUpdate).each {
	  		def dashboard = findByGuidForUser(it.guid, params.personId)
	  		if (dashboard == null)
			{
				throw new OwfException(message:'Dashboard ' + it.guid + ' not found during bulk update.', exceptionType: OwfExceptionTypes.NotFound)
			}
			Map newParams = new HashMap()
			newParams.guid = it.guid
			newParams.name =  it.name //Updateable...
			newParams.isdefault = it.isdefault //Updatable...
			newParams.layout = it.layout	//Not Updatable...
			newParams.columnCount = null	//Not Updatable...
			newParams.state = null //Not Updatable...
			newParams.defaultSettings = it.defaultSettings
			newParams.showLaunchMenu = it.showLaunchMenu
			newParams.doNotEnsureDefault = true
			newParams.locked = it.locked //Updatable...
			if((params.updateOrder != null) && (convertStringToBool(params.updateOrder) == true))
			{
	  			newParams.dashboardPosition = "" + position //Update position...
			}
			else
			{
				newParams.dashboardPosition = null
			}
			def result = update(newParams)
			position ++
		}
		def person = Person.get(params.personId)
		ensureDefault(person)
		return [success:true]
	}

	def convertDashboardLayout(dashboard, type, bypassLayoutRearrange)
	{
	        type = type.toLowerCase()
	        dashboard.layout = type
	        switch(type) {
	            case "portal":
	                convertToPortal(dashboard, bypassLayoutRearrange)    
	            break
	            case "desktop":
	                convertToDesktop(dashboard, bypassLayoutRearrange)    
	            break

	            case "accordion":
	                convertToAccordion(dashboard, bypassLayoutRearrange)    
	            break
	            case "tabbed":
	                convertToTabbed(dashboard, bypassLayoutRearrange)    
	            break
	            default:
	                throw new OwfException(    message:'A fatal validation error occurred. Unknown dashboard layout: ' + type ,exceptionType: OwfExceptionTypes.Validation)
	            break
	        }
	}
	
	private def convertCommon(dashboardWidgetState){
		dashboardWidgetState.active = false
		dashboardWidgetState.minimized = false
		dashboardWidgetState.maximized = false
		dashboardWidgetState.pinned = false
		dashboardWidgetState.buttonId = null
		dashboardWidgetState.buttonOpened = false
		dashboardWidgetState.x = (dashboardWidgetState.x != null) ? dashboardWidgetState.x : 0
		dashboardWidgetState.y = (dashboardWidgetState.y != null) ? dashboardWidgetState.y : 0
		dashboardWidgetState.zIndex = (dashboardWidgetState.zIndex != null) ? dashboardWidgetState.zIndex : 0
		dashboardWidgetState.collapsed = false
		dashboardWidgetState.columnPos = (dashboardWidgetState.columnPos != null) ? dashboardWidgetState.columnPos : 0
		dashboardWidgetState.height = (dashboardWidgetState.height != null) ? dashboardWidgetState.height : 200
		dashboardWidgetState.width =  (dashboardWidgetState.width  != null) ? dashboardWidgetState.width  : 200
	}
	
	private def convertToPortal(dashboard, bypassLayoutRearrange){
	        // bypassLayoutRearrange is not used right now but is passed for uniformity
	        dashboard.columnCount = (dashboard.columnCount != null && dashboard.columnCount != 0) ? dashboard.columnCount : 3
	        def rotator = 0
	        dashboard.state.each{
	            convertCommon(it)
	            it.width = 200
	            it.x = 0
	            it.y = 0
	            it.columnPos = rotator
	            rotator = (++rotator <= dashboard.columnCount -1) ? rotator : 0
	        }
	}

	private def convertToDesktop(dashboard, bypassLayoutRearrange){
	        // bypassLayoutRearrange is not used right now but is passed for uniformity
	        def position = 0
	        dashboard.state.each{
	            convertCommon(it)
	            it.x = position
	            it.y = position
	            it.zIndex = position + 9000
	            position = position + 10
	        }
			try{
				dashboard.state?.last()?.active = true
			}catch(NoSuchElementException e){
				log.warn("No such element 'last()' for dashboard.state, dashboard.state is empty []? exception: ${e}")
			}
			
	}

	private def convertToAccordion(dashboard, bypassLayoutRearrange){
	        def first = null
	        def second = null
	        dashboard.state.each{
	            convertCommon(it)
	            first = (first) ?: it
	            if (it.width > first.width){
	                second = first
	                first = it
	            }else if (it != first){
	                second = (second) ?: it
	                second = ( (it.width > second.width) ? it : second )
	            }
	        }

	        if (bypassLayoutRearrange == false) {
	            if (first){
	                first.region = "rightSideNorth"
	            }
	            if (second){
	                second.region = "rightSideCenter"
	            }
	            dashboard.state.each{
	                if (it != first && it != second){
	                    it.width = 200
	                    it.region = "accordion"
	                    it.collapsed = true
	                }
	            }
	        }
	}

	private def convertToTabbed(dashboard, bypassLayoutRearrange){
	        if (bypassLayoutRearrange == false) {
	            dashboard.state.each{
	                convertCommon(it)
	            }
	        }
			try{
				dashboard.state?.first()?.active = true
			}catch(NoSuchElementException e){
				log.warn("No such element 'first()' for dashboard.state, dashboard.state is empty []? exception: ${e}")
			}
	}
	
	private def ensureDefault(user) {
		def dashboard = Dashboard.findByUserAndIsdefault(user, true)
		if (dashboard != null)
		{
			return
		}
		def dashboards = Dashboard.createCriteria().list{
			and{eq('user',user)}
			order("dashboardPosition","asc")
		}
		if (dashboards.size() != 0)
		{
			dashboard = dashboards.toArray()[0]
			dashboard.isdefault = true
			dashboard.save()
		}
	}
	
  def getDefault(params, personParam=null) {
    // look for a user's default dashboard
	def person = personParam != null? personParam : getPersonByParams(params)
	def dashboard = Dashboard.findByUserAndIsdefault(person, true)

    // dashboard was present
    if (dashboard) {
      return [success: true, dashboard: dashboard]
    }
    // dashboard was not present
    else {
      	throw new OwfException(message:'No default dashboard found. Params: ' + params.toString(), 
 								exceptionType: OwfExceptionTypes.NotFound)
    }

  }

  private def isDefaultDashboardExists(params) {
    // found a default?
	try
	{
		return getDefault(params).success;
	}
	catch (e)
	{
		return false
	}
  }

	private def getPersonByParams(params, returnSelf=true){
		def person = null
		
		if (params.personId != null)
		{
			if (accountService.getLoggedInUserIsAdmin())
			{
				person = Person.get(params.personId)
				if (person == null)
				{
					throw new OwfException(message:'Person with id of ' + params.personId + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
				}
			}
			else
			{
				throw new OwfException(message:'You are not authorized to modify dashboards for other users.', exceptionType: OwfExceptionTypes.Authorization)
			}
		}else if (params.username != null){
			
			if (accountService.getLoggedInUserIsAdmin())
			{
				person = Person.findByUsername(params.username)
				if (person == null)
				{
					throw new OwfException(message:'Person with username of ' + params.username + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
				}
			}
			else
			{
				throw new OwfException(message:'You are not authorized to modify dashboards for other users.', exceptionType: OwfExceptionTypes.Authorization)
			}
		}else if(returnSelf == true){
			person = accountService.getLoggedInUser()
		}
		return person
	}

  private def convertStringToBool(stringToConvert) {
	//Let's be lenient with what we accept.
	if (stringToConvert instanceof java.lang.Boolean)
	{
			return stringToConvert
	}
	
    (stringToConvert == "true" || stringToConvert == "on") ? true : false
  }

  private def findByGuidForUser(guid,userid) {
	Map newParams = new HashMap()
	newParams.personId = userid
	def person = getPersonByParams(newParams)
	def dashboard = Dashboard.findByGuidAndUser(guid, person)
	return dashboard
  }
  
  //  TODO: refactor this out when we have time.  I don't like this logic here
  //      potentially a createListCriteriaFromJSONParams or something in the Service
  //      or a static translation of json param to database fields in the domain
	private def convertJsonParamToDomainField(jsonParam) {
	    switch(jsonParam) {
	        case 'name':
	            return 'name'
	        case 'layout':
	            return 'layout'
	        case 'guid':
	            return 'guid'
	        case 'isdefault':
	            return 'isdefault'
	        case 'dashboardPosition':
	            return 'dashboardPosition'
	        case 'state':
	        	return 'guid'
	        case 'user.userId':
	        	return 'user'
	        default :
	            log.error("JSON parameter: ${jsonParam} for Domain class Preference has not been mapped in PreferenceService#convertJsonParamToDomainField")
	            throw new OwfException (message: "JSON parameter: ${jsonParam}, Domain class: Preference",
	                                exceptionType: OwfExceptionTypes.JsonToDomainColumnMapping)
	    }
	}

  private def findDashboardsByUserAndDashBoardName(username, dashboardname) {
    def person = Person.createCriteria().list {
        and {
            eq('username', username)
            dashboards {
                eq('name', dashboardname)
            }
        }
      cache(true)
    }
    return person.dashboards
  }

  private def regenerateAllConfigs( dashboard ) {

    def uniqueIdRegex = /\"uniqueId\"\:\"([A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12})\"/;
    def widgetInstanceIdMatcher = ( dashboard.layoutConfig =~ uniqueIdRegex );

    widgetInstanceIdMatcher.each {
      //println 'REPLACEING .... ' + it[1]
      def oldInstanceId = it[1];
      def newInstanceId = java.util.UUID.randomUUID().toString();

      dashboard.layoutConfig = dashboard.layoutConfig?.replaceAll( oldInstanceId, newInstanceId );
      dashboard.intentConfig = dashboard.intentConfig?.replaceAll( oldInstanceId, newInstanceId );
      dashboard.defaultSettings = dashboard.defaultSettings?.replaceAll( oldInstanceId, newInstanceId );
    }

    def jsonLayoutConfig = JSON.parse(dashboard.layoutConfig)

    removeLaunchData(jsonLayoutConfig);

    dashboard.layoutConfig = jsonLayoutConfig.toString()
  }

  private def removeLaunchData(cfg) {

    if(cfg?.items?.size() == 0) {
        cfg.widgets?.each {
          //println 'deleteing launchData' + it.launchData;
          it.launchData = null;
        }
    }
    else {
      cfg?.items?.each {
        removeLaunchData(it);
      }
    }
  }

}
