package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.DashboardController
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Person


@Integration
@Rollback
class DashboardControllerSpec extends Specification
        implements ControllerTestMixin<DashboardController>, OwfSpecMixin, SecurityMixin {

    public static final String NEW_DASHBOARD_GUID = '12345678-1234-1234-1234-1234567890a0'
    public static final String NEW_DASHBOARD_NAME = 'dashboard1'

    Person admin1
    Person admin2
    Person user1

    List<Dashboard> dashboards = new ArrayList<>()

    private void setupUsers() {
        admin1 = createAdmin('admin1')
        admin2 = createAdmin('admin2')
        user1 = createUser('user1')
    }

    private void createDashboards(int num, Person user = admin1) {
        (0..<num).each { createDashboard(user) }
    }

    private void createDashboard(Person user = admin1, Boolean isDefault = false) {
        assert user != null

        def count = dashboards.size()

        def dashboard = save new Dashboard(
                name: "Dashboard $count",
                guid: UUID.randomUUID().toString(),
                user: user,
                dashboardPosition: count,
                isdefault: isDefault)

        dashboards << dashboard
    }

    void testDashboardList() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 10
        }
    }

    void testDashboardListWithPagingWithFilterOnName() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max           : 5,
                offset        : 0,
                filterOperator: "OR",
                filters       : /[ { "filterField": "name", "filterValue": "${dashboards[0].name}" } ]/])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 1
            data[0].name == this.dashboards[0].name
        }
    }

    void testDashboardListWithPaging() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 5, offset: 0])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 5
            data[0].name == this.dashboards[0].name
            data[4].name == this.dashboards[4].name
        }
    }

    void testDashboardListWithPagingGetSecondPage() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 5, offset: 5])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 5
            data[0].name == this.dashboards[5].name
            data[4].name == this.dashboards[9].name
        }
    }

    void testDashboardListWithPagingZeroMax() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 0, offset: 0])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 10
        }
    }

    void testDashboardListWithPagingOffsetGreaterThanMax() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 5, offset: 100])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 0
        }
    }

    void testDashboardListWithPagingMaxIsOne() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 1, offset: 0])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 1
        }
    }

    void testDashboardListWithPagingOffsetSetToTotalMinusOne() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: 20, offset: 9])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 1
        }
    }

    void testDashboardListWithPagingNegativeValuesIgnored() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(10)

        when:
        params([max: -5, offset: -100])

        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 10
        }
    }

    void testCreateDashboardForAdmin() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([guid: NEW_DASHBOARD_GUID,
                name: NEW_DASHBOARD_NAME])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == NEW_DASHBOARD_NAME
            guid == NEW_DASHBOARD_GUID
        }

        Dashboard.findByName(NEW_DASHBOARD_NAME) != null
    }

    void testCreateDashboardForUser() {
        given:
        setupUsers()
        loggedInAs user1

        when:
        params([guid: NEW_DASHBOARD_GUID,
                name: NEW_DASHBOARD_NAME])

        controller.create()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == NEW_DASHBOARD_NAME
            guid == NEW_DASHBOARD_GUID
        }

        Dashboard.findByName(NEW_DASHBOARD_NAME) != null
    }

    void testCreateDuplicateDashboardName() {
        given:
        setupUsers()
        loggedInAs admin2

        save new Dashboard(
                name: 'dashboard1',
                guid: '12345678-1234-1234-1234-1234567890a0',
                user: admin2,
                dashboardPosition: 0)

        when:
        params([guid    : '12345678-1234-1234-1234-1234567890a1',
                name    : 'dashboard1',
                personId: admin2.id])

        controller.create()

        then:
        // TODO: This should fail, as per the old test.

        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == 'dashboard1'
            guid == '12345678-1234-1234-1234-1234567890a1'
        }
    }


    void testListDashboards() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(3, admin2)

        when:
        controller.list()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 3
        }
    }

    void testDeleteDashboardFromPreferenceAPI() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(1, admin2)

        assert Dashboard.findAllByUserAndName(admin2, dashboards[0].name).size() == 1

        when:
        params([guid: dashboards[0].guid])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            name == this.dashboards[0].name
            guid == this.dashboards[0].guid
        }

        Dashboard.findAllByUserAndName(admin2, dashboards[0].name).size() == 0
    }

    void testDeleteDashboardsByUserId() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(3, admin2)

        assert Dashboard.findAllByUserAndName(admin2, dashboards[2].name).size() == 1

        when:
        params([data        : /[ { "guid": "${dashboards[2].guid}", "user_id": ${admin2.id} } ]/,
                adminEnabled: true])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 1
            data.guid[0] == this.dashboards[2].guid
            data.name[0] == this.dashboards[2].name
        }

        assert Dashboard.findAllByUserAndName(admin2, dashboards[2].name).size() == 0
    }

    void testDeleteDashboardsByUser() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(3, admin2)

        assert Dashboard.findAllByUserAndName(admin2, dashboards[2].name).size() == 1

        when:
        params([data        : /[ { "guid": "${dashboards[2].guid}" } ]/,
                adminEnabled: true])

        controller.delete()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            data.size() == 1
            data.guid[0] == this.dashboards[2].guid
            data.name[0] == this.dashboards[2].name
        }

        assert Dashboard.findAllByUserAndName(admin2, dashboards[2].name).size() == 0
    }

    void testDeleteNonExistentDashboard() {
        given:
        setupUsers()
        loggedInAs admin2

        String fakeGuid = UUID.randomUUID().toString()

        when:
        params([data        : /[ { "guid": "${fakeGuid}", "user_id": ${admin2.id} } ]/,
                adminEnabled: true])

        controller.delete()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString == /"Error during delete: The requested entity was not found. Dashboard ${fakeGuid} not found."/
    }

    void testUpdateDashboard() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(1, admin2)

        when:
        params([guid    : dashboards[0].guid,
                name    : 'New Dashboard',
                personId: admin2.id])

        controller.update()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == this.dashboards[0].guid
            name == 'New Dashboard'
        }
    }

    void testShowDashboard() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboards(1, admin2)

        when:
        params([guid: dashboards[0].guid])

        controller.show()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == this.dashboards[0].guid
            name == this.dashboards[0].name
        }
    }

    void testShowNonExistentDashboard() {
        given:
        setupUsers()
        loggedInAs admin2

        String fakeGuid = UUID.randomUUID().toString()

        when:
        params([guid: fakeGuid])

        controller.show()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString == /"Error during show: The requested entity was not found. Dashboard ${fakeGuid} not found."/
    }

    void testBulkDeleteWithoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(2)

        when:
        controller.bulkDelete()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString == /"Error during bulkDelete: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"/
    }

    void testBulkUpdateWithoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(2)

        when:
        controller.bulkUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString == /"Error during bulkUpdate: The requested entity failed to pass validation. A fatal validation error occurred. viewsToUpdate param required. Params: [:]"/
    }

    void testBulkDeleteAndUpdateWithoutParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(2)

        when:
        controller.bulkDeleteAndUpdate()

        then:
        responseStatus == HttpStatus.BAD_REQUEST

        responseString == /"Error during bulkDeleteAndUpdate: The requested entity failed to pass validation. A fatal validation error occurred. ViewGuidsToDelete param required. Params: [:]"/

    }

    void testGetDefault() {
        given:
        setupUsers()
        loggedInAs admin2

        createDashboard(admin2, true)

        when:
        params([personId: admin2.id])

        controller.getdefault()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == this.dashboards[0].guid
        }
    }

}
