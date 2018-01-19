package owf.grails.test.integration.controllers

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.http.HttpStatus

import owf.grails.test.integration.OwfSpecMixin
import owf.grails.test.integration.SecurityMixin

import ozone.owf.grails.controllers.AdministrationController
import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Person

import static owf.grails.test.integration.JsonUtil.asJsonString


@Integration
@Rollback
class AdministrationController_DashboardSpec extends Specification
        implements ControllerTestMixin<AdministrationController>, OwfSpecMixin, SecurityMixin {

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

    private Dashboard createDashboard(Person user = admin1, Boolean isDefault = false) {
        assert user != null

        def count = dashboards.size()

        def dashboard = save new Dashboard(
                name: "Dashboard $count",
                guid: UUID.randomUUID().toString(),
                user: user,
                dashboardPosition: count,
                isdefault: isDefault)

        dashboards << dashboard

        dashboard
    }

    void testAddDashboardNameDuplicatesForCurrentUser() {
        given:
        setupUsers()
        loggedInAs admin1

        when:
        params([name          : 'dashboard1',
                guid          : '12345678-1234-1234-1234-1234567890a2',
                checkedTargets: admin1.id])

        controller.addCopyDashboardSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            name == 'dashboard1'
            assignedCount == 1
        }
    }

    void testAddDashboardNameDuplicatesForCurrentUser_Duplicate() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard()

        when:
        params([name          : dashboard.name,
                guid          : dashboard.guid,
                checkedTargets: admin1.id])

        controller.addCopyDashboardSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            name == dashboard.name
            assignedCount == 1
        }

        Dashboard.findAllByUser(admin1).size() == 2
    }

    void testCopyDashboardNameDuplicatesForCurrentUser() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard()

        when:
        params([name          : dashboard.name,
                guid          : dashboard.guid,
                checkedTargets: admin1.id])

        controller.addCopyDashboardSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            name == dashboard.name
            assignedCount == 1
        }

        Dashboard.findAllByUser(admin1).size() == 2
    }

    void testAddSameDashboardNameForDifferentUser() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard(admin1)

        when:
        loggedInAs admin2

        params([name          : dashboard.name,
                guid          : dashboard.guid,
                checkedTargets: admin2.id])

        controller.addCopyDashboardSubmit()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            name == dashboard.name
            assignedCount == 1
        }

        Dashboard.findAllByUser(admin2).size() == 1
    }

    void testListDashboards() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        when:
        controller.listDashboards()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 3
            rows*.name == this.dashboards*.name
        }
    }

    void testListDashboardsByGuidParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        when:
        params([guid: dashboards[2].guid])

        controller.listDashboards()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 1
            rows*.name == [this.dashboards[2].name]
            rows*.guid == [this.dashboards[2].guid]
        }
    }

    void testListDashboardsByIsDefaultParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboard(admin1, true)
        createDashboards(3)

        when:
        params([isdefault: false,
                sort: 'name'])

        controller.listDashboards()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            success
            results == 3
            rows*.name == this.dashboards[1..3]*.name
            rows*.guid == this.dashboards[1..3]*.guid
        }
    }

    void testUpdateDashboards() {
        given:
        setupUsers()
        loggedInAs admin1

        def dashboard = createDashboard()

        when:
        params([personId: admin1.id,
                guid: dashboard.guid,
                name: 'New Name'])

        controller.updateDashboard()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == dashboard.guid
            name == 'New Name'
        }
    }

    void testDeleteDashboardByPersonIdParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        when:
        params([guid: dashboards[2].guid,
                personId: admin1.id])

        controller.deleteDashboards()

        then:
        responseStatus == HttpStatus.OK

        with(responseJson) {
            guid == this.dashboards[2].guid
            name == this.dashboards[2].name
        }

        Dashboard.count() == 2
    }

    // TODO: The username param does not seem to apply
    void testDeleteDashboardByPersonUsernameParams() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        when:
        params([guid: dashboards[2].guid,
                username: admin1.username])

        controller.deleteDashboards()

        then:
        responseStatus == HttpStatus.OK

        Dashboard.count() == 2
    }

    void testDeleteNonexistentDashboard() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        def fakeGuid = UUID.randomUUID().toString()

        when:
        params([guid: fakeGuid,
                username: admin1.username])

        controller.deleteDashboards()

        then:
        responseStatus == HttpStatus.NOT_FOUND

        responseString == /"Error during delete: The requested entity was not found. Dashboard $fakeGuid not found."/

        Dashboard.count() == 3
    }

    void testBulkDeleteDashboardsForAdmin() {
        given:
        setupUsers()
        loggedInAs admin1

        createDashboards(3)

        when:
        params([viewGuidsToDelete: asJsonString(dashboards*.guid)])

        controller.deleteDashboards()

        then:
        responseStatus == HttpStatus.OK

        responseJson.success

        Dashboard.count() == 0
    }

}
