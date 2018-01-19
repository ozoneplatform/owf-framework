package ozone.owf.grails.controllers

import grails.converters.JSON

import org.springframework.http.HttpStatus

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.DashboardService
import ozone.owf.grails.services.PersonWidgetDefinitionService
import ozone.owf.grails.services.SyncService


class PersonController extends BaseOwfRestController {

    AccountService accountService

    DashboardService dashboardService

    PersonWidgetDefinitionService personWidgetDefinitionService

    SyncService syncService

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

        def jsonResult = [person: person, roleNames: roleNames] as JSON

        renderResult(jsonResult, HttpStatus.OK)
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

    /**
     * Person save action.
     */
    def createOrUpdate = {
        def result

        try {
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

    def myData () {
        def user = accountService.getLoggedInUser()
        def json
        try {
            syncService.syncPerson(user)
            json = [
                dashboards: dashboardService.myDashboards(user)*.asJSON(),
                widgets: personWidgetDefinitionService.myWidgets(user)*.asJSON()
            ] as JSON

            renderResult(json, 200)
        }
        catch (Exception e) {
            log.error(e);
            renderResult([
                error: 'Error syncing user'
            ], 500)
        }
    }

}
