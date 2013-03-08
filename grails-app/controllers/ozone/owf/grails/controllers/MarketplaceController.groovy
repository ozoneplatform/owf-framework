// OZP-476: MP Synchronization
// This class was added to ease the initial merge pain of adding this
// functionality to the Widget/WidgetDefinition controllers, which would be
// the primary entry points for managing widget definitions via OMP.
// Entirely possible that we'd want to eliminate this class and fold it's
// function back into another controller.
package ozone.owf.grails.controllers

import grails.converters.JSON
import org.codehaus.groovy.grails.commons.ConfigurationHolder
import ozone.owf.grails.domain.*
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes

class MarketplaceController extends BaseOwfRestController {

    def config = ConfigurationHolder.config
    def marketplaceService

    def retrieveFromMarketplace = {
        // Initial setup to include testing that there's a meaningful GUID supplied.
        def stMarketplaceJson = new HashSet()

        // defensive defaults
        def statusCode = 500
        def statusKey = 'updateFailed'
        def statusMessage = "GUID ${params.guid} not found"

        if (params.guid) {
            // Prevent a new widget from being automatically added from MP
            if (!config.owf.mpSyncAutoCreateWidget &&
                null == WidgetDefinition.findByWidgetGuid(params.guid, [cache:true])) {
                    statusMessage += ". Automatic creation is disabled."
                    log.error("MP Sync: ${statusMessage}")
            } else {
                // One item of interest. Since we don't have a really good
                // way to determine the URL of the marketplace that
                // triggering the update, we actually give the service a
                // null URL. No matter as the service will, in turn, look
                // into the current marketplaces configured in OWF and grab
                // the URLs for each returning the first match it finds for
                // the GUID among all the MPs.
                stMarketplaceJson.addAll(marketplaceService.buildWidgetListFromMarketplace(params.guid))

                if (!stMarketplaceJson.isEmpty()) {
                    marketplaceService.addListingsToDatabase(stMarketplaceJson)
                    statusKey = 'updatedGuid'
                    statusMessage = params.guid
                    statusCode = 200
                } else {
                    statusMessage = "Failed to read descriptor with GUID" +
                        " ${params.guid} from configured marketplaces"
                    log.error("MP Sync: ${statusMessage}")
                }
            }
        }

        def jsonResult = ["${statusKey}": statusMessage] as JSON
        renderResult(jsonResult, statusCode)
    }
}
