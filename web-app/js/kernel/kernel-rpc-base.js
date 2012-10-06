//kernel-rpc-base.js contains shared rpc logic that is used both in kernel-container.js and Container.js

//Top level namespace defs
var Ozone = Ozone || {};
Ozone.eventing = Ozone.eventing || {};
Ozone.eventing.rpc = Ozone.eventing.rpc || {};
Ozone.eventing.rpc.priv = Ozone.eventing.rpc.priv || {};

if (typeof JSON === 'undefined') {
    JSON = gadgets.json;
}

(function (o) {
    var WIDGET_READY_SERVICE_NAME = '_widgetReady',
        GET_WIDGET_READY_SERVICE_NAME = '_getWidgetReady',
        magicFunctionMap = {},
        eventToInterestedClient = {},
        proxyMap = {},
        widgetReadyMap = {};

    function init(cfg) {
        cfg = cfg || {};

        o.getIframeId = cfg.getIframeId;

        function directHandler(widgetId, payload) {
            gadgets.rpc.call(o.getIframeId(widgetId), 'DIRECT_MESSAGEL_CLIENT', null, payload);
        }

        gadgets.rpc.register("DIRECT_MESSAGE", directHandler);

        function functionCallHandler(widgetId, widgetIdCaller, functionName, var_args) {
            gadgets.rpc.call(o.getIframeId(widgetId), 'FUNCTION_CALL_CLIENT', null, widgetId, widgetIdCaller, functionName, var_args);
        }

        gadgets.rpc.register("FUNCTION_CALL", functionCallHandler);

        function functionCallResultHandler(widgetId, widgetIdCaller, functionName, result) {
            gadgets.rpc.call(o.getIframeId(widgetIdCaller), 'FUNCTION_CALL_RESULT_CLIENT', null, widgetId, functionName, result);
        }

        gadgets.rpc.register("FUNCTION_CALL_RESULT", functionCallResultHandler);


        function addEventHandler(widgetId, eventName) {
            var interestedClients = eventToInterestedClient[eventName] || [];
            interestedClients.push(widgetId);
            eventToInterestedClient[eventName] = interestedClients;
        }

        gadgets.rpc.register("ADD_EVENT", addEventHandler);

        function callEventHandler(eventName, payload) {
            var interestedClients = eventToInterestedClient[eventName];
            for (var ii = 0; ii < interestedClients.length; ii++) {
                var widgetId = interestedClients[ii];
                gadgets.rpc.call(o.getIframeId(widgetId), 'EVENT_CLIENT', null, eventName, payload);
            }
        }

        gadgets.rpc.register("CALL_EVENT", callEventHandler);

        function closeEventHandler(widgetId, payload) {
            var iframe = document.getElementById(o.getIframeId(widgetId));
            //gadgets.rpc.removeReceiver( widgetId );
            setTimeout(function () {
                document.body.removeChild(iframe.parentNode);
            }, 500);
        }

        gadgets.rpc.register("CLOSE_EVENT", closeEventHandler);


        function getFunctionsForWidgetHandler(widgetID, sourceWidgetId) {
            var functions = magicFunctionMap[widgetID];

            //save the fact that the sourceWidgetId has a proxy of the widgetId
            if (proxyMap[widgetID] == null) {
                proxyMap[widgetID] = [];
            }
            if (sourceWidgetId != null) {
                proxyMap[widgetID].push(sourceWidgetId);
            }

            return functions != null ? functions : [];
        }

        gadgets.rpc.register("GET_FUNCTIONS", getFunctionsForWidgetHandler);

        o.priv.clientToldUsFunctionsHandler = function (iframeId, data, functions) {
            var widgetID = JSON.parse(iframeId).id;
            magicFunctionMap[widgetID] = functions;
        };

//		gadgets.rpc.register("container_init", function(iframeId, data, functions) {
//          o.priv.clientToldUsFunctionsHandler(iframeId,data,functions);
//        });

        o.priv.clientToldUsFunctionsHandlerAfterInit = function (iframeId, functions) {
            var widgetID = JSON.parse(iframeId).id;

            if (!magicFunctionMap[widgetID]) {
                magicFunctionMap[widgetID] = functions;
                return;
            }

            // don't add duplicates
            var found;

            for (var i = 0, len = functions.length; i < len; i++) {
                found = false;
                for (var j = 0, len2 = magicFunctionMap[widgetID].length; j < len2; j++) {
                    if (functions[i] === magicFunctionMap[widgetID][j]) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    magicFunctionMap[widgetID].push(functions[i]);
                }
            }
        };

        gadgets.rpc.register("register_functions", function (iframeId, functions) {
            o.priv.clientToldUsFunctionsHandlerAfterInit(iframeId, functions);
        });


        //hook widgetReady callbacks
        gadgets.rpc.register(WIDGET_READY_SERVICE_NAME, function (widgetId) {

            //mark this widget as ready
            widgetReadyMap[widgetId] = true;

            //loop through any widgets that have reference to widgetId and send messages that widgetId widget is ready
            var proxyHolders = proxyMap[widgetId];
            if (proxyHolders != null) {
                for (var i = 0, len = proxyHolders.length; i < len; i++) {
                    var proxyHolder = proxyHolders[i];
                    if (proxyHolder != null) {
                        gadgets.rpc.call(proxyHolder, WIDGET_READY_SERVICE_NAME, null, widgetId);
                    }
                }
            }
        });

        gadgets.rpc.register(GET_WIDGET_READY_SERVICE_NAME, function (widgetId, srcWidgetId) {
            return widgetReadyMap[widgetId] == true;
        });

        //o.priv.getFunctions = getFunctionsForWidgetHandler;
    }

    o.init = init;

})(Ozone.eventing.rpc);

