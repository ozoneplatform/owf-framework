//Top level namespace defs
var Ozone = Ozone || {};
Ozone.eventing = Ozone.eventing || {};
Ozone.eventing.priv = Ozone.eventing.priv || {};

// if (typeof JSON === 'undefined') {
//     JSON = gadgets.json;
// }

(function (ozoneEventing) {

    if (typeof JSON === 'undefined') {
        var JSON = gadgets.json;
    }

    //////////////////////////////////////////////////////////////////////////
    // private objects and functions
    //////////////////////////////////////////////////////////////////////////

    var WIDGET_READY_SERVICE_NAME = '_widgetReady',
        GET_WIDGET_READY_SERVICE_NAME = '_getWidgetReady',
        config = null,
        fnMap = {},
        widgetProxyMap = {};

    function getConfig() {
        if (config == null) {
            config = {};
            if (window.name.charAt(0) != '{') {
                config.rpcId = window.name;
            }
            else {
                config = JSON.parse(window.name);
                config.rpcId = config.id;
                return config;
            }
        }
        else {
            return config;
        }
    }

    function getWidgetProxyMap() {
        return widgetProxyMap;
    }

    function getIdFromWindowName() {
        return getConfig().rpcId;
    }

    function handleDirectMessageWrapper(message) {
        if (ozoneEventing.handleDirectMessage) ozoneEventing.handleDirectMessage(message);
        else {
            if (console && console.log) {
                console.log("ChildWidget: Kernel: Default direct message handler, doing nothing.  Override by defining Ozone.eventing.handleDirectMessage");
            }
        }
    }

    function handleFunctionCall() {
        var var_args = Array.prototype.slice.call(arguments);
        var fn_args = Array.prototype.slice.call(arguments, 3);
        var widgetId = var_args[0];
        var widgetIdCaller = var_args[1];

        var fnName = var_args[2];
        var fnObj = fnMap[fnName];

        //id of the calling widget
        fnObj.fn.widgetIdCaller = widgetIdCaller;

        var result = fnObj.fn.apply(fnObj.scope, fn_args[0]);

        gadgets.rpc.call("..", 'FUNCTION_CALL_RESULT', null, widgetId, widgetIdCaller, fnName, result);
    }

    function handleFunctionCallResult(widgetId, functionName, result) {
        var wproxy = widgetProxyMap[widgetId];
        if (wproxy != null) {
            var cb = wproxy.callbacks[functionName];
            if (typeof cb === 'function') {
                cb.call(window, result);
            }
        }
    }

    function handleEventCall(eventName) {
        var fn = ozoneEventing.priv.clientEventNameToHandler[eventName];
        var var_args = Array.prototype.slice.call(arguments, 1);
        fn.apply(window, var_args);
    }

    ozoneEventing.priv.clientEventNameToHandler = {};

    ozoneEventing.after_container_init = function () {
    };

    //Record all public functions from a widget
    function getFunctionNames(functions) {
        if (functions) {
            var funcNames = [];
            for (var ii = 0; ii < functions.length; ii++) {
                var fnName = functions[ii].name;
                funcNames.push(fnName);
            }
            return funcNames;
        }
    }

    function createClientSideFunctionShims(widgetId, functions, initialProxy) {
        widgetProxyMap[widgetId] = new Ozone.eventing.WidgetProxy(widgetId, functions, getIdFromWindowName(), initialProxy);
        return widgetProxyMap[widgetId];
    }

    function getRelayUrl(url) {
        var protocolIdx = url.indexOf("//");
        var protocolEndIdx = url.indexOf("/", protocolIdx + 2);
        var appEndIdx = url.indexOf("/", protocolEndIdx + 1);
        var relay = url.substring(0, appEndIdx + 1) + "rpc_relay.html";
        return relay;
    }

    function cacheFunctions(functions) {
        var fnObj;

        for (var i = 0, len = functions.length; i < len; i++) {
            fnObj = functions[i];

            if (!fnObj.name)
                throw 'Error: name is not set'
            if (!fnObj.fn)
                throw 'Error: fn is not set'

            fnMap[fnObj.name] = fnObj;
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // public objects and functions
    //////////////////////////////////////////////////////////////////////////


    /**
     * clientInitialize - Initialize a widget
     *
     * @params        publicFucnctions - optional array of functions to expose to other widgets
     *
     *    For example
     *        function plot(lat, lon) { //do some plotting }
     *        function center(lat, lon) { //do some centering }
     */
    function clientInitialize(publicFunctions, relayUrl) {
        gadgets.rpc.setRelayUrl("..", getConfig().relayUrl, false, true);
        gadgets.rpc.register("after_container_init", ozoneEventing.after_container_init);

        publicFunctions = [].concat(publicFunctions);
        cacheFunctions(publicFunctions);

        var fnNames = getFunctionNames(publicFunctions);
        var id = getIdFromWindowName();

        if (relayUrl == null) {
            relayUrl = getRelayUrl(document.location.href);
        }

//        gadgets.rpc.call("..", "TELL_FUNCTIONS", null, id, fnNames, relayUrl);

        //this rpc call must be consistent with OWF container_init
        var idString = '{\"id\":\"' + id + '\"}';
        var data = {
            id:idString,
            version:'1.0',
            useMultiPartMessagesForIFPC:true,
            relayUrl:relayUrl
        };
        var dataString = JSON.stringify(data);
        gadgets.rpc.call("..", "container_init", null, idString, dataString, fnNames);
    }

    function registerFunctions(functions) {
        functions = [].concat(functions);

        cacheFunctions(functions);
        gadgets.rpc.call("..", "register_functions", null, window.name, getFunctionNames(functions));
    }

    /**
     * importWidget - Get a proxy to another widget in the container
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
    function importWidget(widgetId, ready, accessLevel) {
        // assume JSON
        if(widgetId.charAt(0) === '{') {
            widgetId = OWF.Util.parseJson(widgetId).id;
        }

        var proxy = createClientSideFunctionShims(widgetId);

        function processFunctionsFromContainer(functions) {
            proxy = createClientSideFunctionShims(widgetId, functions, proxy);
            gadgets.rpc.call("..", GET_WIDGET_READY_SERVICE_NAME, function(isReady) {
                if (isReady) {
                  proxy.fireReady();
                }
                if (typeof ready == 'function') ready.call(this, proxy);
            }, widgetId, srcWidgetIframeId);
        }

        var id = getIdFromWindowName();
        var srcWidgetIframeId = '{\"id\":\"' + id + '\"}';

        gadgets.rpc.call("..", 'GET_FUNCTIONS', processFunctionsFromContainer, widgetId, srcWidgetIframeId);

        return proxy;
    }

    /**
     * Listen for events of a given name using the specified handler function
     */
    function addEventHandler(eventName, handler) {
        ozoneEventing.priv.clientEventNameToHandler[eventName] = handler;
        var widgetId = getIdFromWindowName();
        gadgets.rpc.call("..", 'ADD_EVENT', null, widgetId, eventName);
    }

    /**
     * Raise and event with a json payload
     */
    function raiseEvent(eventName, payload) {
        gadgets.rpc.call("..", 'CALL_EVENT', null, eventName, payload);
    }

    /**
     * closeDialog - Close current dialog widget, returning a json payload to the container.
     */
    function closeDialog(payload) {
        document.body.display = "none";
        gadgets.rpc.call("..", 'CLOSE_EVENT', null, getIdFromWindowName(), payload);
    }

    /**
     * getAllWidgets - Get an array of objects containing the url and id of all currently
     *                 open widgets.
     *
     *   eg [ { url: "http://www.example.com", id: "foo" }, ... ]
     */
    function getAllWidgets(handlerFn) {
        function listResultHandler(widgetList) {
            handlerFn(widgetList);
        }

        gadgets.rpc.call("..", 'LIST_WIDGETS', listResultHandler);
    }

    gadgets.rpc.register('DIRECT_MESSAGEL_CLIENT', handleDirectMessageWrapper);
    gadgets.rpc.register("FUNCTION_CALL_CLIENT", handleFunctionCall);
    gadgets.rpc.register("FUNCTION_CALL_RESULT_CLIENT", handleFunctionCallResult);
    gadgets.rpc.register("EVENT_CLIENT", handleEventCall);
    gadgets.rpc.register(WIDGET_READY_SERVICE_NAME, function (widgetId) {
        var wproxy = widgetProxyMap[widgetId];
        if (wproxy != null) {
            wproxy.fireReady();
        }
    });



    ozoneEventing.clientInitialize = clientInitialize;
    ozoneEventing.registerFunctions = registerFunctions;
    ozoneEventing.importWidget = importWidget;
    ozoneEventing.addEventHandler = addEventHandler;
    ozoneEventing.raiseEvent = raiseEvent;
    ozoneEventing.closeDialog = closeDialog;
    ozoneEventing.getAllWidgets = getAllWidgets;
    ozoneEventing.getWidgetProxyMap = getWidgetProxyMap;

})(Ozone.eventing);
