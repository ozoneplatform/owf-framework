package ozone.owf.grails.services

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.DomainMapping

class AppMigrationService {

    def dashboardService
    def stackService
    def grailsApplication

    static transactional = true

    def migrate() {
        processDashboards()
    }

    private void processDashboards() {

        // Process group dashboards that belong to a stack
        processStackDashboards()

        // Process remaining group dashboards
        processGroupDashboards()

        // Process personal dashboards that are not links to group dashboards
        processPersonalDashboards()

    }

    private void processStackDashboards() {
        List<Dashboard> stackDashboards = getAllStackDashboards()
        stackDashboards.each {
            it.publishedToStore = true
            log.info("Processed stack dashboard $it")
            it.save()
        }
    }

    private void processGroupDashboards() {
        List<Dashboard> groupDashboards = getAllNonStackGroupDashboards()
        groupDashboards.each {
            convertGroupDashboardToPage(it)
            log.info("Processed group dashboard $it")
        }
    }

    private void processPersonalDashboards() {
        List<Dashboard> personalDashboards = getAllStandalonePersonalDashboards()
        personalDashboards.each {
            convertPersonalDashboardToPage(it)
            log.info("Processed personal dashboard $it")
        }
    }

    def List<Dashboard> getAllStackDashboards() {
        def criteria = Dashboard.createCriteria()
        criteria.list {
            isNull('user')
            isNotNull('stack')
            stack {
                isNull('owner')
            }
        }
    }

    def List<Dashboard> getAllNonStackGroupDashboards() {
        def criteria = Dashboard.createCriteria()
        criteria.list {
            isNull('user')
            isNull('stack')
        }
    }

    def List<Dashboard> getAllStandalonePersonalDashboards() {
        Dashboard.findAll("\
            from Dashboard as d \
            where d.user is not null \
                and d.stack is null \
                and not exists ( from DomainMapping as dm where d.id = dm.srcId) ")
    }

    private void convertGroupDashboardToPage(Dashboard groupDashboard) {
        stackService.createAppForGroupDashboard(groupDashboard)
    }

    private void convertPersonalDashboardToPage(Dashboard personalDashboard) {
        stackService.createAppForPersonalDashboard(personalDashboard)
    }
}
