package ozone.owf.grails.services

import grails.converters.JSON

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Preference


class PreferenceService extends BaseService {

    def list(params = [:]) {
    	if (!accountService.getLoggedInUserIsAdmin())
			params.user = accountService.getLoggedInUser()
    	def preference = findPagedPreferences(params)
    	return [success: true, preference: preference, count: preference.totalCount]
    }

	private findPagedPreferences(params) {
		def listParams = [:]
		if (params?.max != null) listParams.max = Integer.parseInt(params.max)
		if (params?.offset != null) listParams.offset = Integer.parseInt(params.offset)
		if (params?.sort != null) listParams.sort = convertJsonParamToDomainField(params.sort)
		listParams.order = params?.order?.toLowerCase() ?: 'asc'

		return Preference.createCriteria().list(listParams) {
			and {
				if (params?.user != null) eq("user", params.user)
				else if (params?.username != null) eq("user", Person.findByUsername(params.username))
				if (params?.namespace != null) eq("namespace", params.namespace)
				if (params?.path != null) eq("path", params.path)
				if (params?.filters != null)
					or {
						JSON.parse(params.filters).each {
							like(it.filterField, '%' + it.filterValue + '%')
						}
					}
			}
		}
	}

	Preference findPreference(params) {
		return (Preference) Preference.createCriteria().get() {
			if (params?.id != null && params?.id != "") eq("id", Long.parseLong(params.id))
			else {
				and {
					if (params?.user != null) eq("user", params.user)
					else if (params?.username != null) eq("user", Person.findByUsername(params.username))
					if (params?.namespace != null) eq("namespace", params.namespace)
					if (params?.path != null) eq("path", params.path)
				}
			}
		}
	}

    def showForUser(params)
    {
		params.user = accountService.getLoggedInUser()
    	def preference = findPreference(params)

    	if (preference)
    	{
            return [success: true, preference: preference]
    	}
    	else
    	{
            return [success: true, preference: null]
    	}
    }

	def create(params) {

      	def preference = new Preference()
		preference.namespace = params.namespace
		preference.path = params.path
		if (params.value != null)
		{
			preference.value = params.value.replaceAll("\n","\\\n")
		} else {
			// not expecting a null preference value - log as a warn
			log.warn("Creating a null preference value: (namespace: " + preference.namespace + ", path: " + preference.path +")")

		}

		Person user = accountService.getLoggedInUser()

		if (params.userid != null)
		{
			user = Person.get(params.userid)
		}

		preference.user = user

		preference.validate()

      	if (preference.hasErrors())
		{
	      	throw new OwfException(	message:'A fatal validation error occurred during the updating of a preference. Params: ' + params.toString() + ' Validation Errors: ' + preference.errors.toString(),
									exceptionType: OwfExceptionTypes.Validation)
      	}
		if (!preference.save(flush: true, failOnError: true))
		{
          	throw new OwfException (message: 'A fatal error occurred while trying to save a preference. Params: ' + params.toString(),
									exceptionType: OwfExceptionTypes.Database)
        }
		return [success: true, preference: preference]
	}


	def deepClone(params){
		deepClone(params,accountService.getLoggedInUser().id)
	}

	def deepClone(params, userid){
		if (userid != accountService.getLoggedInUser().id && !accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to clone preferences for other users.',
   	 									exceptionType: OwfExceptionTypes.Authorization)
		}

		params.userid = userid
		params.cloned = true
		//Update will call create if need be.
		//We should allow this to overwrite existing preferences... right?
		update(params)
	}

	def deleteForAdmin(params)
	{
		if (!accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to delete Admin preferences.', exceptionType: OwfExceptionTypes.Authorization)
		}

        Person user = (params.username)? Person.findByUsername(params.username) : Person.get(params.userid)

        if(!user)
        {
			throw new OwfException(message:'The username is invalid.', exceptionType: OwfExceptionTypes.NotFound)
        }
		params.user = user

		def preference = findPreference(params)

        try
		{
			preference?.each{ it?.delete() }
		 	return [success: true, preference: preference]
		}
		catch (e)
		{
			log.error(e)
			throw new OwfException (message: 'A fatal error occurred while trying to delete a preference. Params: ' + params.toString(),exceptionType: OwfExceptionTypes.Database)
		}
	}

	def deleteForUser(params)
	{
    	def preference

		Person user = accountService.getLoggedInUser()

		if (params.userid || params.username)
		{
			if (!accountService.getLoggedInUserIsAdmin())
			{
				throw new OwfException(message:'You are not authorized to delete preferences for other users.',
	   	 									exceptionType: OwfExceptionTypes.Authorization)
			}
			user = (params.username)? Person.findByUsername(params.username) : Person.get(params.userid)
		}

    	if(params.preference){
    		preference = params.preference
    	}else{
			params.user = user
    		preference = findPreference(params)
    	}

		//We don't need to check authorization since they can only get their own based on the query to begin with.
		//However we might need to change and check auth if this paradigm changes.
		try
		{
			preference?.each{ it?.delete() }
		 	return [success: true, preference: preference]
		}
		catch (e)
		{
			log.error(e)
			throw new OwfException (message: 'A fatal error occurred while trying to delete a preference. Params: ' + params.toString(),exceptionType: OwfExceptionTypes.Database)
		}
  	}

	def bulkDeleteForAdmin(params){
		if (!accountService.getLoggedInUserIsAdmin())
		{
			throw new OwfException(message:'You are not authorized to bulkDelete Admin preferences.', exceptionType: OwfExceptionTypes.Authorization)
		}
		if (params.preferencesToDelete == null){
			throw new OwfException(	message:'A fatal validation error occurred. PreferencesToDelete param required. Params: ' + params.toString(),
				exceptionType: OwfExceptionTypes.Validation)
		}

		JSON.parse(params.preferencesToDelete).each
		{
			Person user = Person.findByUsername(it['username'])
            def preference = findPreference([user: user, namespace: it['namespace'], path: it['path']])

			Map newParams = new HashMap()
			newParams.namespace = it['namespace']
	  		newParams.path = it['path']
	  		newParams.preference = preference
	  		newParams.adminEnabled = true
			def result = deleteForUser(newParams)
		}
		return [success: true]
	}

	def bulkDeleteForUser(params){

		if (params.preferencesToDelete == null){
			throw new OwfException(	message:'A fatal validation error occurred. PreferencesToDelete param required. Params: ' + params.toString(),
				exceptionType: OwfExceptionTypes.Validation)
		}

		JSON.parse(params.preferencesToDelete).each
		{
			def preference = findPreference([user: accountService.getLoggedInUser(), namespace: it['namespace'], path: it['path']])

			Map newParams = new HashMap()
			newParams.namespace = it['namespace']
	  		newParams.path = it['path']
	  		newParams.preference = preference
	  		def result = delete(newParams)
		}
		return [success: true]
	}

    def updateForUser(params) {

		Person user = accountService.getLoggedInUser()

		if (params.userid)
		{
			if (params.userid != accountService.getLoggedInUser().id && !accountService.getLoggedInUserIsAdmin())
			{
				throw new OwfException(message:'You are not authorized to edit preferences for other users.',
	   	 									exceptionType: OwfExceptionTypes.Authorization)
			}
			user = Person.get(params.userid)
		}

		params.user = user
		def preference = findPreference(params)

	    //if user has defined namespace & path then we need to create it per REST definition
	    if(!preference && params.namespace && params.path){
	        return create(params);
	    }

		if(preference) {
			preference.namespace = params.namespace
			preference.path = params.path
			preference.value = params.value

			preference.validate()

			if (preference.hasErrors()) {
			  	throw new OwfException(	message:'A fatal validation error occurred during the updating of a preference. Params: ' + params.toString() + ' Validation Errors: ' + preference.errors.toString(),
										exceptionType: OwfExceptionTypes.Validation)
			}
			if (!preference.save(flush: true, failOnError: true))
			{
			  	throw new OwfException (message: 'A fatal error occurred while trying to save a preference. Params: ' + params.toString(),
										exceptionType: OwfExceptionTypes.Database)
			}
			return [success: true, preference: preference]
		} else {
		  	throw new OwfException(	message:'A fatal validation error occurred during the updating of a preference. Params: ' + params.toString(),
									exceptionType: OwfExceptionTypes.Validation)
		}
	}

    //  TODO: refactor this out when we have time.  I don't like this logic here
    //      potentially a createListCriteriaFromJSONParams or something in the Service
    //      or a static translation of json param to database fields in the domain
	private def convertJsonParamToDomainField(jsonParam) {
	    switch(jsonParam) {
	        case 'namespace':
	            return 'namespace'
	        case 'path':
	            return 'path'
	        case 'value':
	            return 'value'
	        case 'user':
	            return 'user'
	        case 'user.userId':
	        	return 'user'
	        default :
	            log.error("JSON parameter: ${jsonParam} for Domain class Preference has not been mapped in PreferenceService#convertJsonParamToDomainField")
	            throw new OwfException (message: "JSON parameter: ${jsonParam}, Domain class: Preference",
	                                exceptionType: OwfExceptionTypes.JsonToDomainColumnMapping)
	    }
	}
}
