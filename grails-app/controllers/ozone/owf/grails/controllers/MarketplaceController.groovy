// OZP-476: MP Synchronization
// This class was added to ease the initial merge pain of adding this
// functionality to the Widget/WidgetDefinition controllers, which would be
// the primary entry points for managing widget definitions via OMP.
// Entirely possible that we'd want to eliminate this class and fold it's
// function back into another controller.
package ozone.owf.grails.controllers

import grails.converters.JSON
import grails.util.Holders as ConfigurationHolder

import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.MarketplaceService


class MarketplaceController extends BaseOwfRestController {

    MarketplaceService marketplaceService

    AccountService accountService

    def config = ConfigurationHolder.config

    def retrieveFromMarketplace = {
        // Initial setup to include testing that there's a meaningful GUID supplied.
        def stMarketplaceJson = new HashSet()

        // defensive defaults
        def statusCode = 500
        def statusKey = 'updateFailed'
        def statusMessage = "GUID ${params.guid} not found"
        boolean foundStack = false;

        if (params.guid) {
            if (config.owf.mpSync.enabled) {
                // Prevent a new widget from being automatically added from MP

                // One item of interest. Since we don't have a really good
                // way to determine the URL of the marketplace that
                // triggering the update, we actually give the service a
                // null URL. No matter as the service will, in turn, look
                // into the current marketplaces configured in OWF and grab
                // the URLs for each returning the first match it finds for
                // the GUID among all the MPs.
                stMarketplaceJson.addAll(marketplaceService.buildWidgetListFromMarketplace(params.guid))

                // since there is no way to tell from the parameters passed in whether it's a widget or stack,
                // we're going to look through for a stakccontext object to know whether a stack was found or not
                stMarketplaceJson.each {
                    if (it.stackContext) {
                        foundStack = true;
                    }
                }

                if (!config.owf.mpSync.autoCreateWidget &&
                    null == WidgetDefinition.findByWidgetGuid(params.guid, [cache:true]) &&
                    !foundStack) {
                        statusKey = 'updateDisabled'
                        statusMessage += ". Automatic creation is disabled or no app was found."
                        statusCode = 200
                        log.info("MP Sync: ${statusMessage}")
                } else {
                    if (!stMarketplaceJson.isEmpty()) {
						
						//This is the listing that matches the GUID passed in.  We can make the assumption that the editedBy value
						//is who kicked off this event
						def editedListing =	stMarketplaceJson.find{params.guid == it.widgetUuid}
						
						accountService.createSecurityContext(editedListing?.editedBy)
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
            } else {
                statusMessage = "AppsMall sync is disabled"
                log.error("MP Sync: Got GUID ${params.guid} but sync is disabled")
            }
        }

        def jsonResult = ["${statusKey}": statusMessage] as JSON
        renderResult(jsonResult, statusCode)
    }
}
