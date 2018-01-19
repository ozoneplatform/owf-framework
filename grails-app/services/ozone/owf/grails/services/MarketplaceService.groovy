// OZP-476: MP Synchronization
// This class was added to ease the initial merge pain of adding this
// functionality to the WidgetDefinitionService, which is the primary user
// of this particular service. We'd also need to consider the
// MarketplaceController, which was introduced for similar reasons (avoiding
// merge issues). Entirely possible that we'd want to eliminate this class
// and fold its function back into the WidgetDefinitionService; similar may
// also apply to the controller class.
package ozone.owf.grails.services

import java.security.KeyStore
import java.security.cert.CertificateException
import java.security.cert.X509Certificate

import grails.config.Config
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.util.Environment
import grails.util.Holders as ConfigurationHolder

import org.apache.http.client.ClientProtocolException
import org.apache.http.client.HttpResponseException
import org.apache.http.client.methods.HttpGet
import org.apache.http.conn.scheme.Scheme
import org.apache.http.conn.ssl.AllowAllHostnameVerifier
import org.apache.http.conn.ssl.SSLSocketFactory
import org.apache.http.conn.ssl.TrustStrategy
import org.apache.http.impl.client.BasicResponseHandler
import org.apache.http.impl.client.DefaultHttpClient
import org.grails.web.json.JSONObject

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*


class MarketplaceService extends BaseService {

    GrailsApplication grailsApplication

    DomainMappingService domainMappingService

    AccountService accountService

    StackService stackService

    WidgetDefinitionService widgetDefinitionService

    Config config = ConfigurationHolder.config

    // Performs some of the function of addExternalWidgetsToUser, found in the
    // WidgetDefinitionService.
    def addListingsToDatabase(Collection stMarketplaceJson) {

        def listings = stMarketplaceJson.collect { Map obj ->
            if (obj?.widgetGuid) {
                return addWidgetToDatabase(obj)
            } else if (obj?.stackContext) {
                return addStackToDatabase(obj)
            }
        }

        createRelationships(stMarketplaceJson)

        return listings
    }

    def createRelationships(widgets) {
        widgets?.each { requiringWidget ->
            String requiringWidgetGuid = requiringWidget.widgetGuid
            def requiringWidgetDefinition = WidgetDefinition.findByWidgetGuid(requiringWidgetGuid, [cache: true])
            if(requiringWidgetDefinition) {
                domainMappingService.deleteAllMappings(requiringWidgetDefinition, RelationshipType.requires, 'src')
            }

            if(requiringWidget.directRequired) {
                requiringWidget.directRequired.each { String requiredWidgetGuid ->
                    def requiredWidgetDefinition = WidgetDefinition.findByWidgetGuid(requiredWidgetGuid, [cache: true])
                    if(requiredWidgetDefinition) {
                        domainMappingService.createMapping(requiringWidgetDefinition, RelationshipType.requires, requiredWidgetDefinition)
                    }
                }
            }
        }
    }

    private Stack addStackToDatabase(Map obj) {
        def stack = Stack.findByStackContext(obj.stackContext)

        if (!stack) {
            obj.dashboards?.each { it.publishedToStore = true }
            accountService.runAsAdmin {
                stack = stackService.importStack([data: obj.toString()])
            }
        }
        // if the listing in marketplace has been approved, set it to approved here
        if (obj?.approved) {
            stack.approved = obj.approved
        }
        return stack
    }

    private WidgetDefinition addWidgetToDatabase(Map obj) {
        def widgetDefinition = WidgetDefinition.findByWidgetGuid(obj.widgetGuid, [cache: true])

        if (widgetDefinition == null) {
            log.info "Creating new widget definition for ${obj.widgetGuid}"

            widgetDefinition = new WidgetDefinition()
        }

        def universalNameIsNull = obj.isNull("universalName")
        def descriptorUrlIsNull = obj.isNull("descriptorUrl")
        boolean universalNameIsChanged = !universalNameIsNull && obj.universalName != widgetDefinition.universalName

        if (universalNameIsChanged && !widgetDefinitionService.canUseUniversalName(widgetDefinition, obj.universalName)) {
            throw new OwfException(message: 'Another widget uses ' + obj.universalName + ' as its Universal Name. '
                    + 'Please select a unique Universal Name for this widget.', exceptionType: OwfExceptionTypes.Validation_UniqueConstraint)
        }

        widgetDefinition.with {
            displayName = obj.displayName
            description = obj.isNull("description") ? '' : obj.description
            height = obj.isNull("height") ? 650 : (obj.height as Integer)
            width = obj.isNull("width") ? 1050 : (obj.width as Integer)
            imageUrlMedium = obj.isNull("imageUrlMedium") ? obj.imageUrlLarge : obj.imageUrlMedium
            imageUrlSmall = obj.imageUrlSmall
            universalName = universalNameIsNull ? null : obj.universalName
            widgetGuid = obj.widgetGuid
            widgetUrl = obj.widgetUrl
            widgetVersion = obj.isNull("widgetVersion") ? '' : obj.widgetVersion
            singleton = obj.singleton
            visible = obj.widgetUrl.isAllWhitespace() ? false : obj.visible
            background = obj.background
            mobileReady = obj.mobileReady
            descriptorUrl = descriptorUrlIsNull ? null : obj.descriptorUrl
            save(flush: true, failOnError: true)
        }

        if (obj.widgetTypes) {
            // for each widget type T in the listing from MP, add the corresponding OWF widget
            // type to widgetTypes or add standard if there's no corresponding type.
            widgetDefinition.widgetTypes = []

            obj.widgetTypes.each { widgetType ->
                def widgetTypeFromMP = widgetType == null ? WidgetType.standard.name : widgetType;
                def typeFound = WidgetType.findByName(widgetTypeFromMP)
                if (typeFound) {
                    widgetDefinition.widgetTypes << typeFound
                } else {
                    widgetDefinition.widgetTypes << WidgetType.standard
                }
            }
        } else {
            widgetDefinition.widgetTypes = [WidgetType.standard]
        }

        // This is the MP-Sync intents that are part of the listing's custom field definitions
        // TODO: Remove this when everyone has switched to the new Intents code (seen below in the else block)
        // Marketplace may not be configured to provide intents. In such
        // a case the send and receive lists are empty. DO NOT overwrite
        // intents that are already in OWF if MP is not providing them.
        if (obj.intents && obj.intents != null &&
                ((obj.intents.send && obj.intents.send.size() > 0) ||
                        (obj.intents.receive && obj.intents.receive.size() > 0))) {
            // Structure of the intents field (forgive the bastardized BNF/schema mix)
            //   send: [ $intent ]
            //   receive: [ $intent ]
            //  where
            //   $intent => [ {action: $action, dataTypes: [$dataType]}]
            //  and $action and $dataType are strings

            // The post-conditions that seem to be needed to successfully add an intent to a WidgetDefinition
            // IntentDataType
            //    - Unique by the dataType field.
            //    - An expensive string.
            // Intent object
            //    - Unique by "action".
            //    - Relationships to ALL IntentDataType that any widget, anywhere has associated with that action.
            // WidgetDefinitionIntent object
            //    - Owned by the WidgetDefinition
            //    - Points to an Intent
            //    - Gets the action from the Intent, but has it's own collection of IntentDataType
            //    - Has send and receive flags, but they seem to be mutually exclusive.  Not sure if it's a hard
            //      constraint, but I can't find anyplace where one is built with both flags set the same way
            // WidgetDefinition
            //    - Has a collection of WidgetDefinitionIntent objects

            // Enjoy the ride...
            //

            // wipe the slate clean, this ain't no PATCH action
            WidgetDefinitionIntent.findAllByWidgetDefinition(widgetDefinition).collect {
                def intent = it.intent
                intent.removeFromWidgetDefinitionIntents(it)
                widgetDefinition.removeFromWidgetDefinitionIntents(it)
                intent.save()
                widgetDefinition.save()
                it.delete()
            }
            // This helper takes a $intent and makes the Intent object consistent with it
            def addIntent = { intent, isSend, isReceive ->
                // We're going to need the IntentDataTypes for multiple actions, below
                def allIntentDataTypes = intent.dataTypes.collect {
                    IntentDataType.findByDataType(it) ?: new IntentDataType(dataType: it)
                }
                // Patch together the Intent object
                def intentModel = Intent.findByAction(intent.action)
                if (!intentModel) {
                    // If it's a new one, we can just assign it all of the data types.
                    intentModel = new Intent(action: intent.action, dataTypes: allIntentDataTypes)
                } else {
                    // According to the GORM reference docs, a hasMany relationship is a set
                    // So this *should* eliminate duplicates.
                    intentModel.dataTypes.addAll(allIntentDataTypes)
                }
                // Shouldn't be needed, in theory, it's too much effort to figure out if
                // cascading saves is set up properly
                intentModel.save()

                // First two post conditions have been met, now for the actual WidgetDefinition
                // Since we cleared them out to start with, we don't have to
                def newWidgetDefinitionIntent = new WidgetDefinitionIntent(
                        widgetDefinition: widgetDefinition,
                        intent: intentModel,
                        send: isSend,
                        receive: isReceive,
                        dataTypes: allIntentDataTypes
                )
                widgetDefinition.addToWidgetDefinitionIntents(newWidgetDefinitionIntent)
            }

            // Now use the helper twice, once for send, once for receive
            obj.intents.receive?.each { addIntent(it, false, true) }
            obj.intents.send?.each { addIntent(it, true, false) }
        }
        //OP-31: Intents as part of a listing. These are the intents directly from the ServiceItem
        else if (obj.listingIntents && obj.intents != null && obj.listingIntents.size() > 0) {
            System.out.println("Adding listingIntents")
            //Convert the AppsMall listing's intents to OWF's intents and add them to the widget definition
            obj.listingIntents.each {
                def dataType
                dataType = IntentDataType.findByDataType(it.dataType.title)
                if (!dataType) {
                    dataType = new IntentDataType(dataType: it.dataType.title)
                }
                def intentModel = Intent.findByAction(it.action.title)
                if (!intentModel) {
                    intentModel = new Intent(action: it.action.title, dataTypes: [dataType])
                } else {
                    intentModel.dataTypes.add(dataType)
                }
                intentModel.save()

                def newWidgetDefinitionIntent = new WidgetDefinitionIntent(
                        widgetDefinition: widgetDefinition,
                        intent: intentModel,
                        send: it.send,
                        receive: it.receive,
                        dataTypes: [dataType]
                )
                widgetDefinition.addToWidgetDefinitionIntents(newWidgetDefinitionIntent)
            }
        }

        widgetDefinition.save(flush: true)
        return widgetDefinition
    }

    def addExternalStackToUser(params) {
        def stMarketplaceJson = new HashSet()
        stMarketplaceJson.addAll(buildWidgetListFromMarketplace(params.guid))

        if (!stMarketplaceJson.isEmpty()) {
            def listings = addListingsToDatabase(stMarketplaceJson)
            if (listings.size() == 1) {
                stackService.addToUser(listings.get(0), accountService.getLoggedInUser())
            }
        }
        else {
            throw new OwfException(message:'No data received from Marketplace',
                exceptionType: OwfExceptionTypes.GeneralServerError)
        }
    }

    /**
     * Add widgets from marketplace/store.
     * Since we're allowing system-system synchronization (OMP -> OWF, OMP -> OMP), we don't require a user to be an
     * admin to add a listing from a well-known location.
     * @param params
     * @return
     */
    def addExternalWidgetsToUser(params) {
        def mpSourceUrl = params.marketplaceUrl ?: "${grailsApplication.config.owf.marketplaceLocation}"
        def user = accountService.getLoggedInUser()
        def widgetDefinition = null
        def mapping = null
        def usedMpPath = false

        //add widgets to db also add pwd mappings to current user
        def widgetDefinitions = []
        params.widgets = JSON.parse(params.widgets)
        params.widgets.each { JSONObject obj ->
            if (obj.widgetGuid == null) {
                throw new OwfException(message: 'WidgetGuid must be provided',
                        exceptionType: OwfExceptionTypes.Validation)
            }

            widgetDefinition = WidgetDefinition.findByWidgetGuid(obj.widgetGuid, [cache: true])
            if (widgetDefinition == null) {
                // OZP-476: MP Synchronization
                // The default is to fetch a widget from a well-known MP.  If we can't do that
                // or if the fetch fails, then fall back to the original behavior, which reads
                // the supplied JavaScript and creates a widget from that.
                Set setWidgets = new HashSet()
                try {
                    log.debug("Widget not found locally, building from marketplace with guid=${obj.widgetGuid} and mpUrl=${mpSourceUrl}")
                    setWidgets.addAll(addListingsToDatabase(buildWidgetListFromMarketplace(obj.widgetGuid, mpSourceUrl)))
                    log.debug("Found ${setWidgets.size()} widgets ${setWidgets.collect { it.toString() }} from the ${mpSourceUrl}")
                    usedMpPath = true
                } catch (Exception e) {
                    log.error "addExternalWidgetsToUser: unable to build widget list from Marketplace, message -> ${e.getMessage()}", e
                }

                if (setWidgets.isEmpty()) {
                    // If set is empty, then call to MP failed.  Fallback path.
                    log.debug("Importing from the JSON provided to us, since marketplace failed")
                    setWidgets.addAll(addListingsToDatabase([obj]))
                }

                widgetDefinition = setWidgets.find {
                    if(it instanceof  Stack) {
                        stackService.addToUser(it, user)
                    }
                    it instanceof WidgetDefinition && it.widgetGuid == obj.widgetGuid
                }

                // added listing isn't widget definition, nothing to do
                if(!widgetDefinition) {
                    return;
                }
            }
            widgetDefinitions.push(widgetDefinition)

            def queryReturn = PersonWidgetDefinition.executeQuery("SELECT MAX(pwd.pwdPosition) AS retVal FROM PersonWidgetDefinition pwd WHERE pwd.person = ?", [user])
            def maxPosition = (queryReturn[0] != null) ? queryReturn[0] : -1
            maxPosition++

            mapping = PersonWidgetDefinition.findByPersonAndWidgetDefinition(user, widgetDefinition)
            if (mapping == null && (obj.isSelected || !grailsApplication.config.owf.enablePendingApprovalWidgetTagGroup)) {
                mapping = new PersonWidgetDefinition(
                        person: user,
                        widgetDefinition: widgetDefinition,
                        visible: true,
                        disabled: false,
                        pwdPosition: maxPosition,
                        userWidget: true
                )

                if (!mapping.validate()) {
                    throw new OwfException(message: 'A fatal validation error occurred during the creation of the person widget definition. Params: ' + params.toString() + ' Validation Errors: ' + mapping.errors.toString(),
                            exceptionType: OwfExceptionTypes.Validation)
                }

                if (!mapping.save(flush: true)) {
                    throw new OwfException(
                            message: 'A fatal error occurred while trying to save the person widget definition. Params: ' + params.toString() +
                                    "\n    on definition: " + obj.toString() + "\n    when trying to save mapping " + mapping.toString(),
                            exceptionType: OwfExceptionTypes.Database)
                }
            }
        }

        return [success: true, data: widgetDefinitions]
    }

    // We allow for widgets to mutually refer to one another, which would normally result in
    // a stack overflow using a recursive algorithm.  Hence the "seen" set below to guard
    // against re-processing.
    def buildWidgetListFromMarketplace(guid, def mpSourceUrl = null, def seen = new HashSet()) {
        def widgetJsonMarketplace = new HashSet()

        def obj = getObjectListingFromMarketplace(guid, mpSourceUrl)
        seen.add(guid)
        obj?.directRequired?.each {
            if (!seen.contains(it)) {
                widgetJsonMarketplace.addAll(buildWidgetListFromMarketplace(it, mpSourceUrl, seen))
            }
        }
        if (obj)
            widgetJsonMarketplace.add(obj)
        widgetJsonMarketplace
    }

    // FIXME: This code would be simpler with the Grails REST plugin.
    private getObjectListingFromMarketplace(guid, mpSourceUrl) {
        // In some scenarios, the MP url could be null (for example, save a service item listing
        // in marketplace triggering an update in OWF). In these cases, build a list of possible
        // marketplaces to check for the GUID.  Those can be found by looking in widget definitions
        // for marketplace type listings and getting the URLs.
        def setMpUrls = new HashSet()
        if (mpSourceUrl && config.owf.mpSync.trustProvidedUrl) {
            setMpUrls.add(mpSourceUrl)
        } else {
            setMpUrls = getMarketplaceUrls()
        }
        def ompObj

        def socketFactory = createSocketFactory();
        def handler = new BasicResponseHandler()

        setMpUrls.find { mpUrl ->
            // Check each configured marketplace and stop when we get a match.
            def port
            try {
                def u = new URL(mpUrl)
                if (u.getPort() > -1) {
                    port = u.getPort()
                }
            } catch (Exception e) {}

            def client = new DefaultHttpClient()
            try {
                // More simplification to be gained here using the Grails REST plugin.
                def sch = new Scheme("https", port ?: 443 as int, socketFactory)
                client.getConnectionManager().getSchemeRegistry().register(sch)

                def get = new HttpGet(createMpDescriptorUrlFor(mpUrl, guid))
                def response = client.execute(get)
                def header = response.entity?.contentType

                if (header?.value.contains("json")) {
                    log.info "Received JSON response from MP (${mpUrl}); success"
                    def responseObj = JSON.parse(handler.handleResponse(response))

                    if (responseObj?.total > 0) {
                        ompObj = responseObj
                        log.debug "Received Object: ${ompObj}"
                        return true
                    }
                } else {
                    log.warn "Received non-parseable response from MP, content type -> ${response.entity.contentType}"
                }
            } catch (IOException ioE) {
                // Log and eat
                log.warn "The following stack trace may not actually denote an error and comes from an attempted sync with a marketplace instance (${mpUrl})"
                log.warn ioE
            } catch (ClientProtocolException cpE) {
                // Log and eat
                log.warn "The following stack trace may not actually denote an error and comes from an attempted sync with a marketplace instance (${mpUrl})"
                log.warn cpE
            } catch (HttpResponseException hrE) {
                // Log and eat
                log.warn "The following stack trace may not actually denote an error and comes from an attempted sync with a marketplace instance (${mpUrl})"
                log.warn hrE
            } finally {
                client.getConnectionManager().shutdown()
            }
        }
        if (ompObj) {
            return ompObj.data[0]
        } else {
            return null
        }
    }

    private String createMpDescriptorUrlFor(String mpBaseUrl, String guid) {
        String separator = (mpBaseUrl.endsWith("/") ? "" : "/")
        return mpBaseUrl + separator + "public/descriptor/${guid}"
    }

    private HashSet getMarketplaceUrls() {
        HashSet mpUrls = new HashSet()
        WidgetType.findByName('marketplace').collect { tpe ->
            tpe.widgetDefinitions.each { wd ->
                mpUrls.add(wd.widgetUrl)
            }
        }
        return mpUrls
    }


    private SSLSocketFactory createSocketFactory() {
		//In dev bypass all the keystore stuff
        if (Environment.current == Environment.DEVELOPMENT || Environment.current == Environment.TEST) {
            return new SSLSocketFactory(new TrustStrategy() {
                @Override
                public boolean isTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
                    return true;
                }
            })
        }

        // Some initial setup pertaining to getting certs ready for
        // use (presuming SSL mutual handshake between servers).
        // Here is where the Grails REST plugin would really come to
        // the rescue -- the elimination of so much boilerplate.
        def keyStoreFileName = System.properties['javax.net.ssl.keyStore']
        def keyStorePw = System.properties['javax.net.ssl.keyStorePassword']
        def keyStore = KeyStore.getInstance(KeyStore.getDefaultType())
        def trustStoreFileName = System.properties['javax.net.ssl.trustStore']
        def trustStorePw = System.properties['javax.net.ssl.trustStorePassword']
        def trustStore = KeyStore.getInstance(KeyStore.getDefaultType())

        def trustStream = new FileInputStream(new File(trustStoreFileName))
        trustStore.load(trustStream, trustStorePw.toCharArray())
        trustStream.close()

        def keyStream = new FileInputStream(new File(keyStoreFileName))
        keyStore.load(keyStream, keyStorePw.toCharArray())
        keyStream.close()

        def factory = new SSLSocketFactory(keyStore, keyStorePw, trustStore)
        if (config.owf.mpSync.trustAllCerts) {
            def trustAllCerts = new TrustStrategy() {
                boolean isTrusted(X509Certificate[] chain, String authType) {
                    return true
                }
            }
            factory = new SSLSocketFactory(trustAllCerts, new AllowAllHostnameVerifier())
            log.warn "getObjectListingFromMarketplace: trusting all SSL hosts and certificates"
        }

        return factory
    }
}
