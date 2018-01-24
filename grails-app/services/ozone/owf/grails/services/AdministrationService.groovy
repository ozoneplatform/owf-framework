package ozone.owf.grails.services

import grails.converters.JSON

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*


class AdministrationService {

	AccountService accountService

	WidgetDefinitionService widgetDefinitionService

	PersonWidgetDefinitionService personWidgetDefinitionService

	PreferenceService preferenceService

	DashboardService dashboardService

    ServiceModelService serviceModelService

	def getPreferenceEditEntities(params)
	{
		if (params.personId == null)
		{
			throw new OwfException(	message:'A fatal validation error occurred during the fetch of a personID from a preference. personId is required. Params: ' + params.toString() ,
									exceptionType: OwfExceptionTypes.Validation)
		}

		def user = Person.findByUsername(params.personId)

		if (user == null)
		{
			throw new OwfException(message:'User ' + params.personId + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}

		def preference = preferenceService.findByUserAndNamespaceAndPath(user, params.namespace, params.path,null)
		if (preference == null)
		{
			throw new OwfException(message:'Preference not found. Params: ' + params.toString(), exceptionType: OwfExceptionTypes.NotFound)
		}

		def actionType = "edit"
		return [success:true, preference:preference, actionType:actionType]
	}


    def getPreferenceAddCopyEntities(params){
		def allUsers = accountService.getAllUsers().collect{serviceModelService.createServiceModel(it)}
		def actionType
		def preference = null

		if (params.namespace != null && params.path != null && params.userid != null &&
            params.namespace.length() > 0 && params.path.length() > 0 && params.userid.length() > 0)
		{
			preference = Preference.findWhere(path:params.path, namespace:params.namespace, user:Person.findByUsername(params.userid))
			actionType = "copy"
		}
		else
		{
			//Note, this dashboard does not have enough information to pass validation.
			//It's only a skeleton for the add/copy window.
			preference = new Preference()
			preference.namespace = "com.company.widget"
			preference.path = java.util.UUID.randomUUID().toString()
            preference.user = accountService.getLoggedInUser()
            actionType = "add"
		}
		return [preference:preference, allUsers: allUsers, actionType:actionType]
    }

	def updatePreference(params)
	{
		ensureAdmin()
		if (params.data != null) {
			def data = JSON.parse(params.data)[0]
			params.namespace = data.namespace
			params.originalNamespace = data.originalNamespace
			params.path = data.path
			params.originalPath = data.originalPath
			params.userid = Person.findByUsername(data.username).id
			params.value = data.value
		}
		if (params.namespace != params.originalNamespace || params.path != params.originalPath)
		{
			//Namespace and path are part of the identity of the preference.
			//If they changed 'em, we need to delete the old preference.
			def tempParams = new HashMap()
			tempParams.namespace = params.originalNamespace
			tempParams.path = params.originalPath
			tempParams.userid = params.userid
			preferenceService.delete(tempParams)
		}
		preferenceService.update(params)
	}

	def clonePreference(params) {
		ensureAdmin()
		def resultOfClone = null
		def assignedTo

		if (params.checkedTargets){
			def checkedTargets = []
			if (params.checkedTargets.class.name != "java.lang.String"){
				params.checkedTargets.each{checkedTargets << it}
			}else{
				checkedTargets << params.checkedTargets
			}

			checkedTargets.each{
				resultOfClone = preferenceService.deepClone(params, it)
			}
			assignedTo = checkedTargets
		}
		else if (params.data) {
			def data = JSON.parse(params.data)[0]
			def userId = Person.findByUsername(data['username']).id
			resultOfClone = preferenceService.deepClone(data, userId)
			assignedTo = [data['username']]
		}

		return [success:true, resultOfClone: resultOfClone, assignedTo: assignedTo]
	}

	def getPersonWidgetDefinitionApplyEntities(params){
		def allUsers = accountService.getAllUsers().collect{serviceModelService.createServiceModel(it)}
		def personWidgetDefinitions = []

        //hasPWD = has Personal Widget Definition
		allUsers.each{	it.hasPWD = personWidgetDefinitions.findAll{pwd -> pwd.person.username == it.username} != []	}
		def allWidgets = WidgetDefinition.list().collect{serit.toServiceModel()}
		return [success:true, allUsers: allUsers, allWidgets: allWidgets]
	}

    def getWidgetDefinitionEditEntities(params)
	{
		def allUsers = accountService.getAllUsers().collect{serviceModelService.createServiceModel(it)}
		def widgetDefinition
		def personWidgetDefinitions
		def actionType
		if (params.widgetGuid != null && params.widgetGuid.length() > 0)
		{
			widgetDefinition = WidgetDefinition.findByWidgetGuid(params.widgetGuid)
			personWidgetDefinitions = PersonWidgetDefinition.findAllByWidgetDefinition(widgetDefinition)
			actionType = "edit"
		}
		else
		{
			widgetDefinition = new WidgetDefinition()
            widgetDefinition.widgetVersion = '1.0'
			widgetDefinition.widgetGuid = java.util.UUID.randomUUID().toString()
			widgetDefinition.universalName = widgetDefinition.widgetGuid
			widgetDefinition.height = 200
			widgetDefinition.width = 200
			widgetDefinition.displayName = 'New Empty Widget'
			widgetDefinition.imageUrlMedium = './themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif'
			widgetDefinition.imageUrlSmall = './themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif'
			widgetDefinition.widgetUrl = './examples/walkthrough/widgets/NearlyEmptyWidget.html'
			personWidgetDefinitions = []
			actionType = "add"
		}

        //hasPWD = has Personal Widget Definition
		allUsers.each{
          //should only be one pwd per user because personWidgetDefinitions is already filtered by widgetdef
          def pwd = personWidgetDefinitions.find{pwd -> pwd.person.username == it.username}

          if (pwd != null) {
            it.hasPWD = true

          }
          else {
            it.hasPWD = false
          }
        }

		def readOnly = params.readOnly ?: 'false'

		return [widgetDefinition:widgetDefinition, allUsers: allUsers, readOnly: readOnly, actionType:actionType]
	}

    def getDashboardEditEntities(params){
		def user = Person.findByUsername(params.personId)
		def actionType = "edit"

		if (user == null)
		{
			throw new OwfException(message:'User ' + params.personId + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}

		def dashboard = Dashboard.findByUserAndGuid(user,params.guid)

		if (dashboard == null)
		{
			throw new OwfException(message:'Dashboard ' + params.guid + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
		}
		return [dashboard:dashboard, actionType:actionType]
    }


    def getDashboardAddCopyEntities(params){
		def allUsers = accountService.getAllUsers().collect{serviceModelService.createServiceModel(it)}
		def actionType

		def dashboard = null

		if (params.guid != null && params.guid.length() > 0)
		{//Copy
			dashboard = Dashboard.findByGuid(params.guid)
			actionType = "copy"
		}
		else
		{//Add
			//Note, this dashboard does not have enough information to pass validation.
			//It's only a skeleton for the add/copy window.
			dashboard = new Dashboard()
			dashboard.name = "New Dashboard"
			dashboard.guid = java.util.UUID.randomUUID().toString()
			dashboard.layout = "desktop"
			dashboard.isdefault = false
            dashboard.user = accountService.getLoggedInUser()
            actionType = "add"
		}
		return [dashboard:dashboard, allUsers: allUsers, actionType:actionType]
    }

    def getPersonEditEntities(params){
    	def user
    	def actionType

    	if (params.username != null && params.username.length() > 0)
		{
    		user = Person.findByUsername("" + params.username)
	    	if (user == null)
			{
				throw new OwfException(message:'User ' + params.username + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
			}

	    	if((!(accountService.getLoggedInUser().username.equals(params.username))) && (!accountService.getLoggedInUserIsAdmin()))
			{
				throw new OwfException(message:'You are not authorized to edit another user.', exceptionType: OwfExceptionTypes.Authorization)
			}
	    	actionType = "edit"
		}else{
			user = new Person()
			user.username = ""
			user.userRealName = ""
			user.passwd = ""
			user.enabled = true
			user.email = ""
			user.emailShow = true
			actionType = "add"
		}

    	return [person:user, actionType:actionType, roleCount: Role.count()]
    }

    def listPersonRoles(params){
    	ensureAdmin()
    	def personRoleList = Role.list()

    	if (personRoleList) {
	      return [success: true, personRoleList: personRoleList, count: Role.count()]
	    }
	    else {
	      return [success: true, personRoleList: [], count: 0]
	    }
    }

    def createOrUpdatePerson(params){
    	def resultOfCreate = accountService.createOrUpdate(params)

    }

	def createOrUpdateWidgetDefinition(params)
	{
		def resultOfCreate = widgetDefinitionService.createOrUpdate(params)

		def checkedTargets = []
		def uncheckedTargets = []

        if (params.checkedTargets){
            JSON.parse(params.checkedTargets).each{checkedTargets << it}
        }

		if (params.uncheckedTargets){
			if (params.uncheckedTargets.class.name != "java.lang.String"){
				params.uncheckedTargets.each{uncheckedTargets << it}
			}else{
				uncheckedTargets << params.uncheckedTargets
			}
		}
		def resultOfBulkAssignment = personWidgetDefinitionService.bulkAssignForSingleWidgetDefinitionMultipleUsers(resultOfCreate.widgetDefinition.widgetGuid, checkedTargets, uncheckedTargets, params.adminEnabled)
		resultOfBulkAssignment.widgetDefinition = resultOfCreate.widgetDefinition

		return resultOfBulkAssignment
	}

    def createDashboard(params) {
        ensureAdmin()
        dashboardService.create(params)
    }

	def cloneDashboards(params) {
		ensureAdmin()

		if ((params.checkedTargets == null) || (params.checkedTargets == "")){
			throw new OwfException(	message:'A fatal validation error occurred. There is no checkedTargets (did you forget to select a user?). Params: ' + params.toString(),
				exceptionType: OwfExceptionTypes.Validation)
		}

		def checkedTargets = []

		if (params.checkedTargets){
			if (params.checkedTargets.class.name != "java.lang.String"){
				params.checkedTargets.each{checkedTargets << it}
			}else{
				checkedTargets << params.checkedTargets
			}
		}

		def clonedDashboardResult = null

		checkedTargets.each{
			clonedDashboardResult = dashboardService.deepClone(params, it)
		}

		return [success:true, name:clonedDashboardResult.dashboard.name, assignedTo:checkedTargets]
	}

    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }
}
