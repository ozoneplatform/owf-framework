// MP Synchronization
// This class was added to ease the initial merge pain of adding this functionality
// to the Widget/WidgetDefinition controllers, which would be the primary entry points
// for managing widget definitions via OMP.  Entirely possible that we'd want to eliminate
// this class and fold it's function back into another controller.
package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes

class MarketplaceController extends BaseOwfRestController {

    def marketplaceService

    def retrieveFromMarketplace = {
        // Initial setup to include testing that there's a meaningful GUID supplied.
        def stMarketplaceJson = new HashSet()

        // defensive defaults
        def statusCode = 500
        def statusKey = 'updateFailed'
        def statusMessage = "GUID ${params.guid} not found"

        // One item of interest. Since we don't have a really good way to determine
        // the URL of the marketplace that's triggering the update, we'll actually
        // give the service a null URL.  No matter as the service will, in turn, look
        // into the current Ozone's configured marketplaces and grab the URLs for each
        // returning the first match it finds for the GUID among all the MPs.
        if (params.guid) {
            stMarketplaceJson.addAll(marketplaceService.buildWidgetListFromMarketplace(params.guid))
            if (!stMarketplaceJson.isEmpty()) {
                marketplaceService.addListingsToDatabase(stMarketplaceJson)
                statusKey = 'updatedGuid'
                statusMessage = params.guid
                statusCode = 200
            }
        }

        def jsonResult = ["${statusKey}": statusMessage] as JSON
        renderResult(jsonResult, statusCode)
    }
}
