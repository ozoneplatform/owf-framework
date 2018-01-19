package ozone.owf.grails.services

import grails.core.GrailsApplication

import ozone.owf.grails.domain.Dashboard


class AppMigrationService {

    GrailsApplication grailsApplication

    DashboardService dashboardService

    StackService stackService

    static transactional = true

    def migrate() {
        processDashboards()
    }

    private Map processDashboards() {

        Map results = [:]
        List<Dashboard> result

        // Process group dashboards that belong to a stack
        result = processStackDashboards()
        results.stackDashboards = result

        // Process remaining group dashboards
        result = processGroupDashboards()
        results.groupDashboards = result

        // Process personal dashboards that are not links to group dashboards
        result = processPersonalDashboards()
        results.personalDashboards = result

        results
    }

    private List<Dashboard> processStackDashboards() {
        List<Dashboard> stackDashboards = getAllStackDashboards()
        stackDashboards = stackDashboards.findAll { !it.publishedToStore }
        stackDashboards.each {
            it.publishedToStore = true
            log.info("Processed stack dashboard $it")
            it.save()
        }
        stackDashboards
    }

    private List<Dashboard> processGroupDashboards() {
        List<Dashboard> groupDashboards = getAllNonStackGroupDashboards()
        groupDashboards.each {
            convertGroupDashboardToPage(it)
            log.info("Processed group dashboard $it")
        }
        groupDashboards
    }

    private List<Dashboard> processPersonalDashboards() {
        List<Dashboard> personalDashboards = getAllStandalonePersonalDashboards()
        personalDashboards.each {
            convertPersonalDashboardToPage(it)
            log.info("Processed personal dashboard $it")
        }
        personalDashboards
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
                and not exists ( from DomainMapping as dm where d.id = dm.srcId and dm.srcType = 'dashboard' and dm.relationshipType = 'cloneOf') ")
    }

    private void convertGroupDashboardToPage(Dashboard groupDashboard) {
        stackService.createAppForGroupDashboard(groupDashboard)
    }

    private void convertPersonalDashboardToPage(Dashboard personalDashboard) {
        stackService.createAppForPersonalDashboard(personalDashboard)
    }
}
