package ozone.owf.grails.controllers

import grails.converters.JSON

import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Role;
import org.codehaus.groovy.grails.web.json.JSONArray
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import org.apache.commons.lang.time.StopWatch
/**
 * User controller.
 */
class PersonController extends BaseOwfRestController
{

    def accountService
    def authenticateService

    // the delete, save and update actions only accept POST requests
    //   static Map allowedMethods = [delete: 'POST', save: 'POST', update: 'POST']

    def index = {
        redirect action: list, params: params
    }

    def list = {
        params.adminEnabled = true

        def statusCode
        def jsonResult

        log.info("Executing accountService: getAllUsersByParams");

        try {
            def result = accountService.getAllUsersByParams(params)
            statusCode = 200
			jsonResult = result as JSON
            /*def personList = new JSONArray()
            result.personList.collect { personList.add(it.toServiceModel()) }
            if (result.count != null)
            {
                jsonResult = [success:result.success, results: result.count, data : personList] as JSON
            }
            else
            {
                jsonResult = personList as JSON
            }*/
        }
        catch (OwfException owe) {
            handleError(owe)
            statusCode = owe.exceptionType.normalReturnCode
            jsonResult = "Error during getAllUsersByParams: " + owe.exceptionType.generalMessage + " " + owe.message
        }

        renderResult(jsonResult, statusCode)
    }

    def show = {

        def person = Person.get(params.id)
        if (!person) {
            flash.message = "Person not found with id $params.id"
            redirect action: list
            return
        }
        List roleNames = []
        for (role in person.authorities) {
            roleNames << role.authority
        }
        roleNames.sort { n1, n2 ->
            n1 <=> n2
        }
        [person: person, roleNames: roleNames]
    }

    /**
     * Person delete action. Before removing an existing person,
     * he should be removed from those authorities which he is involved.
     */
    def delete = {

        if (params.data) {
            params.personUserIDsToDelete = JSON.parse(params.data)
        }
        params.adminEnabled = true
        def statusCode
        def jsonResult
        StopWatch stopWatch = null;
        def result
        def methodName

        if (log.isInfoEnabled()) {
            stopWatch = new StopWatch();
            stopWatch.start();
            log.info("Executing accountService: deletePersons: params: "+params);
        }
        try {
            if (params.personUserIDsToDelete)
            {
                methodName = "bulkDeleteUsersForAdmin"
                result = accountService.bulkDeleteUsersForAdmin(params)
            }

            jsonResult = [msg: result as JSON, status: 200]
        }
        catch (Exception e) {
            jsonResult = handleError(e)
        }

        renderResult(jsonResult)

        if (log.isInfoEnabled()) {
            log.info("Executed accountService: " + methodName + " in "+stopWatch);
        }
    }

//  private def bulkDeleteUsersForAdmin(params){
//      if (!accountService.getLoggedInUserIsAdmin())
//      {
//          throw new OwfException(message:'You are not authorized to bulkDelete Admin users.', exceptionType: OwfExceptionTypes.Authorization)
//      }
//      if (params.personUserIDsToDelete == null){
//          throw new OwfException(	message:'A fatal validation error occurred. personUserIDsToDelete param required. Params: ' + params.toString(),
//              exceptionType: OwfExceptionTypes.Validation)
//      }
//
//      def persons = []
//      params.personUserIDsToDelete.each {
//          def person = Person.get(it.id)
//          if (person == null)
//          {
//              throw new OwfException(message:'User ' + it + ' not found during bulk delete.', exceptionType: OwfExceptionTypes.NotFound)
//          }
//          else if (person.username.equals(Person.NEW_USER)) {
//              throw new OwfException(message:'The default template user may not be deleted', exceptionType: OwfExceptionTypes.Authorization)
//          }
//
//          Map newParams = new HashMap()
//          newParams.person = person
//          newParams.adminEnabled = true
//          persons.add(person);
//
//          accountService.unAssignUserFromAllGroups(newParams)
//          def result = accountService.deleteUser(newParams)
//      }
//      return [success: true, data: params.personUserIDsToDelete]
//  }

    /**
     * Person save action.
     */
    def createOrUpdate = {

        def result

        try
        {
            def results = accountService.createOrUpdate(params)
            result = [msg: results as JSON, status: 200]
        }
        catch (Exception e)
        {
             result = handleError(e)
        }

       renderResult(result)

    }

    def whoami = {
        //TODO: get this from session OWF-1020
        def curUser = accountService.getLoggedInUser()

        log.debug("executing whoami for user:: "+curUser);

        def jsonResult = [
            currentUserName: curUser.username,
            currentUser:curUser.userRealName,
            currentUserPrevLogin: curUser.prevLogin,
            currentId:curUser.id,
            email: curUser.email
        ] as JSON
        renderResult(jsonResult, 200)
    }

//    private void addRoles(person) {
//        for (String key in params.keySet()) {
//            if (key.contains('ROLE') && 'on' == params.get(key)) {
//                Role.findByAuthority(key).addToPeople(person)
//            }
//        }
//    }

//    private Map buildPersonModel(person) {
//
//        List roles = Role.list()
//        roles.sort { r1, r2 ->
//            r1.authority <=> r2.authority
//        }
//        Set userRoleNames = []
//        for (role in person.authorities) {
//            userRoleNames << role.authority
//        }
//        LinkedHashMap<Role, Boolean> roleMap = [:]
//        for (role in roles) {
//            roleMap[(role)] = userRoleNames.contains(role.authority)
//        }
//
//        return [person: person, roleMap: roleMap]
//    }

}
