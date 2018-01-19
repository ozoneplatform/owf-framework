package ozone.owf.grails.services

class BaseService {

    AccountService accountService

    def routeRequest(doAsAdmin, doAsUser, params) {
        if (accountService.getLoggedInUserIsAdmin() && (params.adminEnabled?.toString()?.toBoolean())) {
            return doAsAdmin(params)
        } else {
            return doAsUser(params)
        }

    }

    // base CRUD operations
    def list(params) {
        routeRequest this.&listForAdmin, this.&listForUser, params
    }

    def show(params) {
        routeRequest this.&showForAdmin, this.&showForUser, params
    }

    def delete(params) {
        routeRequest this.&deleteForAdmin, this.&deleteForUser, params
    }

    def update(params) {
        routeRequest this.&updateForAdmin, this.&updateForUser, params
    }

    // default empty list/show method
    def listForAdmin(params) { [] };

    def listForUser(params) { [] }

    def showForAdmin(params) { [] };

    def showForUser(params) { [] }
}
