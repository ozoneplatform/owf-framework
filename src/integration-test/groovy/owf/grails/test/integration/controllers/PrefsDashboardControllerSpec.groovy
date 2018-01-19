package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.PrefsDashboardController
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Person

import static owf.grails.test.integration.DomainBuilders.createDashboard
import static owf.grails.test.integration.DomainBuilders.createDashboards


@Integration
@Rollback
class PrefsDashboardControllerSpec extends Specification
        implements ControllerTestMixin<PrefsDashboardController>, OwfSpecMixin, SecurityMixin {

    Person admin1
    Person user1

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        user1 = createUser('user1')
    }

    void list() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 10
        results*.name == dashboards*.name
    }

    void list_filterByName() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max           : 5,
                offset        : 0,
                filterOperator: "OR",
                filters       : /[{ "filterField": "name", "filterValue": "${dashboards[0].name}" }]/])

        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 1
        results[0].name == dashboards[0].name
    }

    void list_withPaging() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 5, offset: 0])

        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 5
        results*.name == dashboards[0..4]*.name
    }

    void list_withPaging_secondPage() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 5, offset: 5])

        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 5
        results*.name == dashboards[5..9]*.name
    }

    void list_withPaging_whenMaxIsZero() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 0, offset: 0])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        responseJson.size() == 10
    }

    void list_withPaging_whenOffsetGreaterThanMax() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 5, offset: 100])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        responseJson.size() == 0
    }

    void list_withPaging_whenMaxIsOne() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 1, offset: 0])

        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 1
        results[0].name == dashboards[0].name
    }

    void list_withPaging_whenOffsetIsTotalMinusOne() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: 20, offset: 9])

        controller.list()

        def results = responseJson

        then:
        responseStatus == HttpStatus.OK

        results.size() == 1
        results[0].name == dashboards[9].name
    }

    void list_withPaging_negativeValuesIgnored() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 10)

        when:
        params([max: -5, offset: -100])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        responseJson.size() == 10
    }

    void create_forAdmin() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([guid: '12345678-1234-1234-1234-1234567890a0',
                name: 'Dashboard 1'])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == 'Dashboard 1'
            guid == '12345678-1234-1234-1234-1234567890a0'
        }
    }

    void create_forUser() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        params([guid: '12345678-1234-1234-1234-1234567890a0',
                name: 'Dashboard 1'])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == 'Dashboard 1'
            guid == '12345678-1234-1234-1234-1234567890a0'
        }
    }

    void create_withDuplicateDashboardName() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard(admin1)

        when:
        params([guid    : dashboard.guid,
                name    : dashboard.name,
                personId: admin1.id])

        controller.create()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString =~ /^"Error during create: The requested entity failed to pass validation/
    }

    void delete_byGuidAndUserId() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 3)

        assert Dashboard.count() == 3
        assert Dashboard.findByGuid(dashboards[0].guid) != null

        when:
        params([guid    : dashboards[0].guid,
                personId: admin1.id])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == dashboards[0].guid
            name == dashboards[0].name
        }

        and:
        Dashboard.count() == 2
        Dashboard.findByGuid(dashboards[0].guid) == null
    }

    void delete_byGuid() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboards = createDashboards(admin1, 3)

        assert Dashboard.count() == 3
        assert Dashboard.findByGuid(dashboards[0].guid) != null

        when:
        params([guid: dashboards[0].guid])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == dashboards[0].guid
            name == dashboards[0].name
        }

        and:
        Dashboard.count() == 2
        Dashboard.findByGuid(dashboards[0].guid) == null
    }

    void delete_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([guid    : '12345678-1234-1234-1234-1234567890a3',
                personId: admin1.id])

        controller.delete()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString =~ /^"Error during delete: The requested entity was not found/
    }

    void update() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard(admin1)

        when:
        params([guid    : dashboard.guid,
                personId: admin1.id,
                name    : 'Dashboard Updated'])

        controller.update()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == dashboard.guid
            name == 'Dashboard Updated'
        }
    }

    void show() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard(admin1)

        when:
        params([guid: dashboard.guid])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == dashboard.guid
            name == dashboard.name
        }
    }

    void show_notFound() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([guid: '12345678-1234-1234-1234-1234567890a3'])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString =~ /^"Error during show: The requested entity was not found/
    }

    void bulkDelete_withoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(admin1, 3)

        when:
        controller.bulkDelete()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString =~ /^"Error during bulkDelete: The requested entity failed to pass validation/
    }

    void bulkUpdate_withoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(admin1, 3)

        when:
        controller.bulkUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString =~ /^"Error during bulkUpdate: The requested entity failed to pass validation/
    }

    void bulkDeleteAndUpdate_withoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(admin1, 3)

        when:
        controller.bulkDeleteAndUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString =~ /^"Error during bulkDeleteAndUpdate: The requested entity failed to pass validation/
    }

    void getdefault() {
        given:
        setupUsers()
        loggedInAs admin1

        def defaultDashboard = createDashboard(admin1, [isdefault: true])
        createDashboards(admin1, 2)

        when:
        params([personId: admin1.id])

        controller.getdefault()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == defaultDashboard.guid
        }
    }

}
