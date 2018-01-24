package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.services.ServiceUnitTest

import ozone.owf.grails.OwfException


class AdministrationServiceSpec extends Specification
        implements ServiceUnitTest<AdministrationService> {

    AccountService accountService = Mock()
    DashboardService dashboardService = Mock()

    void setup() {
        service.accountService = accountService
        service.dashboardService = dashboardService
    }

    void "if user is not admin, createDashboard throws an exception"() {
        given:
        accountService.getLoggedInUserIsAdmin() >> false

        when:
        service.createDashboard([:])

        then:
        thrown(OwfException)
    }


    void "createDashboard calls DashboardService.create"() {
        given:
        accountService.getLoggedInUserIsAdmin() >> true
        def params = "blah"

        when:
        service.createDashboard(params)

        then:
        1 * dashboardService.create(params)
    }

}
