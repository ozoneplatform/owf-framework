/**
 * @ignore
 * @namespace
 * @since OWF 5.0
 */
OWF = window.OWF ? window.OWF : {};

(function (window, document, undefined) {

    /**
     * @namespace
     */
    OWF.Intents = function () {
        var INTENTS_SERVICE_NAME = '_intents',
            INTENTS_SERVICE_RECEIVE_NAME = '_intents_receive',
            intentReceiverMap = {};

        return /** @lends OWF.Intents */ {

            /**
             * Starts an Intent.  This will send the intent and data to one or more widgets.  If this launches a widget, it sets the launch data to the JSON string { intents: true }.
             * @param {Object} intent Object representing the Intent
             * @param {String} intent.action Name of the Intent
             * @param {String} intent.dataType Describes the data that will be sent with the intent.  It is recommended
             *   that this be a MIME type.
             * @param {Object} data Data to be sent with the intent
             * @param {Function} handler Function to be executed once the Intent has been sent to a destination widget
             * @param {Object[]} [handler.dest] The first argument passed to the handler function is the id(s) of the recipient(s)
             *   of the message. See <a href="./OWF.html#.getIframeId">OWF.getIframeId</a>
             *   for a description of this id.
             * @param {Object[]} [dest] Explicitly define which widgets will get this intent using Widget Proxies
             * @example
             * OWF.Intents.startActivity(
             *   {
             *    action: 'Plot',
             *    dataType: 'application/vnd.owf.latlon'
             *   },
             *   {
             *     lat: 0,
             *     lon: 0
             *   },
             *   function(dest) {
             *     //dest is an array of destination widget proxies
             *   }
             * );
             */
            startActivity:function (intent, data, handler, dest) {
                var destIds = [];
        		var accessLevel = data.accessLevel;

                //pull destIds from any proxies passed in
                if (dest != null) {
                    for (var i = 0; i < dest.length; i++) {
                        destIds.push(dest[i].id);
                    }
                }

                gadgets.rpc.call('..', INTENTS_SERVICE_NAME,
                    //callback for when an intent has reached the destination widget(s)
                    function (ids) {
                        //exec handler
                        if (handler != null) {
                            var widgets = [];
                            if (ids != null) {
                                var destWidgetIds = [].concat(ids);
                                for (var i = 0; i < destWidgetIds.length; i++) {
                                    //get dest widget proxy
                                    var widget = Ozone.eventing.getWidgetProxyMap()[destWidgetIds];
                                    if (widget != null) {
                                        widgets.push(widget);
                                        if (widgets.length == destWidgetIds.length) {
                                            handler(widgets);
                                        }
                                    }
                                    //if null create new widget proxy
                                    else {
                                        Ozone.eventing.importWidget(destWidgetIds[i], function (wproxy) {
                                            widgets.push(wproxy);
                                            if (widgets.length == destWidgetIds.length) {
                                                handler(widgets);
                                            }
                                        }, accessLevel);
                                    }

                                }
                                if (destWidgetIds.length < 1) {
                                    //no dest ids were sent send back an empty array
                                    handler(widgets);
                                }
                            }
                            else {
                                //no dest ids were sent send back an empty array
                                handler(widgets);
                            }
                        }
                    }, OWF.getIframeId(), intent, data, destIds);
            },

            /**
             * Register to receive an Intent
             * @param {Object} intent Object representing the Intent
             * @param {String} intent.action Name of the Intent
             * @param {String} intent.dataType Describes the data that will be sent with the intent.  It is recommended
             *   that this be a MIME type.
             * @param {Function} handler Function to be executed once an Intent has been received
             * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
             *   of the message. See <a href="./OWF.html#.getIframeId">OWF.getIframeId</a>
             *   for a description of this id.
             * @param {Object} [handler.intent] The second argument passed to the handler function is the intent itself.
             * @param {Object} [handler.data] The third argument passed to the handler function is the intent data.
             * @example
             * OWF.Intents.receive(
             *   {
             *     action: 'Plot',
             *    dataType: 'application/vnd.owf.latlon'
             *   },
             *   function(sender,intent, data) {
             *     //do something with the data
             *   }
             * );
             */
            receive:function (intent, handler) {
                var intentKey = owfdojo.toJson(intent);

                //save a list of handlers per intent
                intentReceiverMap[intentKey] = handler;

                //register with shindig for when the intent message is sent
                gadgets.rpc.register(INTENTS_SERVICE_NAME, function(sender, intent, data) {
                     var intentKey = owfdojo.toJson(intent);

                    //execute the handler that matches the intent
                    var receiverHandler = intentReceiverMap[intentKey];
                    if (intentReceiverMap[intentKey] != null) {
                        receiverHandler.call(this, sender, intent, data);
                    }

                });
                gadgets.rpc.call('..', INTENTS_SERVICE_RECEIVE_NAME, null, intent, OWF.getIframeId());
            }
        };

    }();


}(window, document));