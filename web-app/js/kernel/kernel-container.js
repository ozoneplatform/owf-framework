//Top level namespace defs
var Ozone           = Ozone               || {};
Ozone.eventing      = Ozone.eventing      || {};
Ozone.eventing.priv = Ozone.eventing.priv || {};

if (typeof JSON === 'undefined') {
    JSON = gadgets.json;
}

(function(o) {


    //////////////////////////////////////////////////////////////////////////
    // private objects and functions
    //////////////////////////////////////////////////////////////////////////

    var activeWidgets = [];

    function isOldIE() {
         return !(typeof window.postMessage === 'function' || typeof window.postMessage === 'object')
    }

    function windownameEncode(object) {
        return JSON.stringify(object);
    }

    function augmentConfig(config, id, tunnelURI, securityToken) {
          //kernel compat
        var relay = getRelayUrl(tunnelURI);

        if (typeof config === 'undefined') {
            config = {
                id: id,

                inContainer: true,
                containerName: 'kernel',
                containerVersion: '1.0',
                containerUrl: getContainerUrl(),

//                //kernel compat remove this
//                parent : tunnelURI,
//
                relayUrl : tunnelURI

//                //kernel compat remove this
//                relay : relay,
//
//                forcesecure : true,
//                rpctoken : securityToken,
//                kernel : true
            };
        } else {
            config.id = id;

            config.inContainer = true;
            config.containerName = 'kernel';
            config.containerVersion = '1.0';
            config.containerUrl = getContainerUrl();

            //kernel compat remove this
//            config.parent = tunnelURI;

            config.relayUrl = tunnelURI;

            //kernel compat remove this
//            config.relay = relay;
//
//            config.forcesecure = true;
//            config.rpctoken = securityToken;
//            config.kernel = true;
        }
        return config;
    }

    function getContainerUrl() {
        var lastSlash = window.location.pathname.lastIndexOf('/');
        var shortPath = window.location.pathname.substr(0, lastSlash);
        if (window.location.port != "80" &&
            window.location.port != "443") {
            return window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + shortPath;
        } else {
            return window.location.protocol + "//" + window.location.hostname + shortPath;
        }
    }

    function getTunnelUrl() {
        return getContainerUrl() + "/rpc_relay.html";
    }

    var blankNum = 0;

    function getBlankPageUrl() {
        blankNum++;
        return getContainerUrl() + "/blank.html?id=" + blankNum;
    }

    function getRelayUrl(url) {
        var protocolIdx = url.indexOf("//");
        var protocolEndIdx = url.indexOf("/", protocolIdx + 2);
        var appEndIdx = url.indexOf("/", protocolEndIdx + 1);
        var relay = url.substring(0, appEndIdx + 1) + "rpc_relay.html";
        return relay;
    }

    function generateSecurityToken( tokenLength ) {
        return null;
    }

    function notdefined(x) {
        return (typeof x == 'undefined' || x == null);
    }

    function createIframe(uri, id, parent, config, x,y, doc) {
        var theDocument = doc || document;
        var span = theDocument.createElement( "span" );
        parent.appendChild( span );

        o[id].iframeId = '{\"id\":\"' + id + '\"}';
        var iframeName = windownameEncode(config).replace(/"/g,'&quot;');
        var iframeId = o[id].iframeId.replace(/"/g,'&quot;');

        var iframeText =
                '<iframe id="' + iframeId +
                '" name="' + iframeName +
                '" src="javascript:\'<html></html>\'"' +
                ' style="width:'+x+';height:'+y+';border:0px;" ' +
                '></iframe>';

        span.innerHTML = iframeText;

        theDocument.getElementById( o[id].iframeId ).src = uri;
    }

    function createDialogIframe(uri, id, config, doc, backgroundColor, opacity, alpha) {

        var div = document.createElement( "div" );
        document.body.appendChild( div );

        if(notdefined(backgroundColor)) backgroundColor="transparent";
        if(notdefined(opacity)) opacity="100";
        if(notdefined(alpha)) alpha="100";

        o[id].iframeId = '{\"id\":\"' + id + '\"}';
        var iframeName = windownameEncode(config).replace(/"/g,'&quot;');
        var iframeId = o[id].iframeId.replace(/"/g,'&quot;');

        var iframeText = '<iframe id="' + iframeId + '"';
        iframeText += ' name="' + iframeName + '"';
        iframeText += ' src="javascript:\'<html></html>\'"';
        if(isOldIE())
            iframeText += " ALLOWTRANSPARENCY=true FRAMEBORDER=0 ";
        iframeText += ' style="position: absolute;';
        iframeText += 'top: 0px;left: 0px;width: 100%;height: 100%;';
        iframeText += 'border: 0px;x-index: 7500;frameBorder: 0';
        iframeText += 'background-color: '+ backgroundColor+';';
        iframeText += 'filter alpha(opacity=' + alpha + ')';
        iframeText += '"></iframe>';

        div.innerHTML = iframeText;

        document.getElementById( o[id].iframeId ).src = uri;
    }

    //////////////////////////////////////////////////////////////////////////
    // public objects and functions
    //////////////////////////////////////////////////////////////////////////

	/**
	 * initializeContainer - Setup browser window as widget container
	 *                       Required initialization method to support the creation of widgets,
	 */
    function initializeContainer(cfg) {
        cfg = cfg || {};

        Ozone.eventing.rpc.init({
            getIframeId: o.getIframeId
        });

        o.priv.container_init = function (iframeId, data, functions) {

          o.rpc.priv.clientToldUsFunctionsHandler(iframeId, data, functions);

            if (!cfg.dontInitEventing) {
              //set iframe relay file
              var relayUrl = JSON.parse(data).relayUrl;
              var useMultiPartMessagesForIFPC = JSON.parse(data).useMultiPartMessagesForIFPC;

              var widgetID = JSON.parse(iframeId).id;
              gadgets.rpc.setRelayUrl(o.getIframeId(widgetID), relayUrl, false, useMultiPartMessagesForIFPC);
              gadgets.rpc.setAuthToken(o.getIframeId(widgetID),0);

              var jsonString = '{\"id\":\"' + window.name + '\"}';
              gadgets.rpc.call(o.getIframeId(widgetID), 'after_container_init', null, window.name, jsonString);
            }
        };

		gadgets.rpc.register("container_init", function(iframeId, data, functions) {
          o.priv.container_init(iframeId,data,functions);
        });

		function listWidgetsHandler() {
			return activeWidgets;
		}
		gadgets.rpc.register("LIST_WIDGETS", listWidgetsHandler);

        if (!cfg.dontInitAdditionalFeatures) {
          //todo this is kernel-container only
          //detect if gadgets.pubsubrouter is loaded, if so initialize
          if (gadgets.pubsubrouter != null) {
            gadgets.pubsubrouter.init(function(id) {
              return id;
            },
            {
              onRoute : function (sender, subscriber, channel, message) {
                //allow all messages to be sent, true means to prevent routing
                return false;
              }
            }
            );
          }

          //detect if dragndrop is loaded
          if (Ozone.dragAndDrop != null && Ozone.dragAndDrop.WidgetDragAndDropContainer != null) {
            var wdd = new Ozone.dragAndDrop.WidgetDragAndDropContainer({
                eventingContainer: gadgets.pubsubrouter
            });
          }
          //todo this is kernel-container only
        }

	}

	/**
	 * createWidget - Create a widget on this page in another iframe,
	 *                so that it can be used (i.e. add events, call public functions)
	 *
	 * @params        url             - url of the widget
	 *                widgetId        - id of this widget, must be a valid javascript identifier
	 *                parentElementId - the id of a parent element or actual parent element for this widget
	 *                x               - optional width, a la css width ( "100%", "100px", ...)
	 *                y               - optional height, a la css height ( "100%", "100px", ...)
	 *                config          - optional json element with custom data that will be munged into the
	 *                                  iframes's window.name property.
	 *                                  Useful for initital configuration for the widget
	 *                ready           - optional callback to invoke when the widget has been created
	 *
	 * @returns       a proxy object that can be used to send direct messages, handle events,
	 *                or call functions \
	 *
	 *  Note that once created, the proxy will be available in the global Ozone.eventing
	 *  collection
	 *    For example
	 *        createWidget("http://maps.com/widgetMap", "MyMapWidget", "div1", "100%", "100%", ok);
	 *        function ok() {
	 *           Ozone.eventing.MyMapWidget.plot(1.1,2.2);
	 *        }
	 */
	function createWidget(url, widgetId, parentElement, x, y, config) {
		o[widgetId] = {};
        o[widgetId].callback = function() {
        }
		o[widgetId].sendMessage = function(dataToSend, callback) {
			gadgets.rpc.call(o.getIframeId(widgetId), 'DIRECT_MESSAGEL_CLIENT', callback, dataToSend);
		}

		parentElement = (typeof parentElement == "string") ? document.getElementById(parentElement) : parentElement;

        var tunnel = getTunnelUrl();
        var securityToken = generateSecurityToken();

        x = x || "100%";
        y = y || "100%";

        config = augmentConfig(config, widgetId, tunnel, securityToken);

        createIframe(url, widgetId, parentElement, config, x, y);
        gadgets.rpc.setRelayUrl(o.getIframeId(widgetId), getRelayUrl(url));

        activeWidgets.push({id:widgetId, name:widgetId, url:url});
        if(typeof ready == 'function') ready.call(this, o[widgetId]);
        return o[widgetId];
	}

	/**
	 * createDialogWidget - Create a widget that consumes the entire browser window,
	 *
	 * @params        url             - url of the widget
	 *                widgetId        - id of this widget, must be a valid javascript identifier
	 *                parentElementId - the id of a parent element or actual parent element for this widget
	 *                opacity         - optional background css opacity for the screen
	 *                alpha           - optional background css alpha for the screen
	 *                config          - optional json element with custom data that will be munged into the
	 *                                  iframes's window.name property.
	 *                                  Useful for initital configuration for the widget
	 *                ready           - optional callback to invoke when the widget has been created
	 *
	 * @returns       a proxy object that can be used to send direct messages, handle events,
	 *                or call functions \
	 *
	 *  Note that once created, the proxy will be available in the global Ozone.widets
	 *  collection
	 *    For example
	 *        createWidget("http://maps.com/widgetMap", "MyMapWidget", "div1", "100%", "100%", ok);
	 *        function ok() {
	 *           Ozone.widgets.MyMapWidget.plot(1.1,2.2);
	 *        }
	 */
    function createDialogWidget(url, widgetId, backgroundColor, opacity, alpha, config, ready) {
		var proxy = {};
		proxy.sendMessage = function(dataToSend, callback) {
			gadgets.rpc.call(o.getIframeId(widgetId), 'DIRECT_MESSAGEL_CLIENT', callback, dataToSend);
		}
        o[widgetId] = proxy;

        var tunnel = getTunnelUrl();
        var securityToken = generateSecurityToken();

        config = augmentConfig(config, widgetId, tunnel, securityToken);

        createDialogIframe(url, widgetId, config, backgroundColor, opacity, alpha);
        gadgets.rpc.setRelayUrl(o.getIframeId(widgetId), getRelayUrl(url));

        activeWidgets.push({id:widgetId, url:url});
        if(typeof ready == 'function') ready.call(this, o[widgetId]);
        return proxy;
    }

	/**
	 * createWindowWidget - Create a widget in a popup window,
	 *
	 * @params        url             - url of the widget
	 *                widgetId        - id of this widget, must be a valid javascript identifier
	 *                parentElementId - the id of a parent element or actual parent element for this widget
	 *                width           - optional width in pixels of the popup window
	 *                height          - optional height in pixels of the popup window
	 *                resizable       - optional 1 to make the popup resizable, 0 not
	 *                scrollbars      - optional 1 to show scrollbars, 0 not
	 *                blankPageUrl    - optional url of blank page to host the widget
	 *                config          - optional json element with custom data that will be munged into the
	 *                                  iframes's window.name property.
	 *                                  Useful for initital configuration for the widget
	 *                ready           - optional callback to invoke when the widget has been created
	 *
	 * @returns       a proxy object that can be used to send direct messages, handle events,
	 *                or call functions \
	 *
	 *  Note that once created, the proxy will be available in the global Ozone.widets
	 *  collection
	 *    For example
	 *        createWidget("http://maps.com/widgetMap", "MyMapWidget", "div1", "100%", "100%", ok);
	 *        function ok() {
	 *           Ozone.widgets.MyMapWidget.plot(1.1,2.2);
	 *        }
	 */
	function createWindowWidget(url, widgetId, width, height, resizable, scrollbars, blankPageUrl, config, ready) {
		var proxy = {};
		proxy.sendMessage = function(dataToSend, callback) {
			gadgets.rpc.call(o.getIframeId(widgetId), 'DIRECT_MESSAGEL_CLIENT', callback, dataToSend);
		}

        if(notdefined(width)) width=100;
        if(notdefined(height)) height=100;
        if(notdefined(resizable)) resizable=0;
        if(notdefined(scrollbars)) scrollbars=0;
        var windowOptions = "width=" + width + ",height=" + height + ",resizable=" + resizable + ",scrollbars=" + scrollbars;

        if(notdefined(blankPageUrl)) blankPageUrl = getBlankPageUrl();

        var childWindow = window.open(blankPageUrl,'_blank',windowOptions);

        if (typeof window.parent._childWindows === 'undefined') {
            window.parent._childWindows = [];
        }
        window.parent._childWindows.push(childWindow);

        function initializeChildWindow() {
            var parentElement = childWindow.document.getElementsByTagName("body")[0];

            var tunnel = getTunnelUrl();
            var securityToken = generateSecurityToken();

            config = augmentConfig(config, widgetId, tunnel, securityToken);

            createIframe(url, widgetId, parentElement, config, "100%", "100%", childWindow.document);
            gadgets.rpc.setRelayUrl(o.getIframeId(widgetId), getRelayUrl(url));

            if(typeof ready == 'function') ready.call(this);
        }

        function delayInit() {
            setTimeout(initializeChildWindow, 1000);
        }

        if ( childWindow.addEventListener ) {
            childWindow.addEventListener( "load", initializeChildWindow, false );
        } else if ( window.attachEvent ) {
            //this doesn't seem to work in IE
            //childWindow.attachEvent( "onload", delayInit );
            delayInit();
        }

        o[widgetId] = proxy;
        activeWidgets.push({id:widgetId, url:url});
        return proxy;
	}

    o.createWidget = createWidget;
    o.createWindowWidget = createWindowWidget;
    o.createDialogWidget = createDialogWidget;
	o.initializeContainer = initializeContainer;
    o.getIframeId = function (widgetId) {
              return o[widgetId].iframeId;
    };

})(Ozone.eventing);

