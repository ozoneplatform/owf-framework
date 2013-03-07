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
    OWF.IntentsContainer = function () {

        var INTENTS_SERVICE_NAME = '_intents',
            INTENTS_SERVICE_RECEIVE_NAME = '_intents_receive',

            cbMap = {
                onRoute:[],
                onIntentsReady:[]
            },
            widgetIntentMap = {},
            config = {};


        /**
         * routes intent messages to dest widgets.  executes any onRoute handlers.  This function is the shindig
         * listener function for the intents
         * @param sender
         * @param intent
         */
        function route(sender, intent, data, dest) {
            var returnValue = undefined;            
            var container = {
                send: OWF.IntentsContainer.send,
                addListener: OWF.IntentsContainer.addListener,
                removeListener: OWF.IntentsContainer.removeListener,
                callback:this.callback
            };

            //execute any listeners which may return a widget for the intent to be sent
            var onRouteList = [];
            for (var i = 0, len = cbMap.onRoute.length; i < len; i++) {
                var destinationWidget = cbMap.onRoute[i].fn.call(cbMap.onRoute[i].scope, sender, intent, data, dest, container);
                if (destinationWidget != null) {
                    if (returnValue == null) {
                        returnValue = [];
                    }
                    returnValue = returnValue.concat(destinationWidget)
                }
                if (!cbMap.onRoute[i].single) {
                    onRouteList.push(cbMap.onRoute[i]);
                }
            }
            cbMap.onRoute = onRouteList;

            //if returnValue is undefined that means the shindig callback will not be executed
            return returnValue;

        }

        return /** @lends OWF.IntentsContainer */ {

            /**
             * Initializes the IntentsContainer
             * @param {Object} cfg
             * @param {Function|Function[]} cfg.onRoute
             * @example
             * OWF.IntentsContainer.init({
             *    onRoute: function(sender, intent, data, container) {
             *    //...
             * });
             */
            init:function (cfg) {
                config = cfg || {};

                if (config.onRoute != null) {
                    cbMap.onRoute = cbMap.onRoute.concat(config.onRoute);
                }

                //hook intents service so to route function
                Ozone.eventing.Container.registerHandler(INTENTS_SERVICE_NAME, route);

                //hook intents receive to register which widgets are ready to receive which intents
                Ozone.eventing.Container.registerHandler(INTENTS_SERVICE_RECEIVE_NAME, function (intent, destWidgetId) {

                    //save that this widget and intent pair have been registered
                    if (widgetIntentMap[destWidgetId] == null) {
                        widgetIntentMap[destWidgetId] = {};
                    }
                    widgetIntentMap[destWidgetId][owfdojo.toJson(intent)] = true;

                    //lookup any listeners that need to be executed
                    var onIntentsReady = cbMap.onIntentsReady.slice(0);
                    for (var i = 0, len = onIntentsReady.length; i < len; i++) {
                        onIntentsReady[i].fn.call(onIntentsReady[i].scope, intent, destWidgetId);
                        if (onIntentsReady[i].single) {
                            var toRemove = cbMap.onIntentsReady.indexOf(onIntentsReady[i]);
                            if (toRemove > -1) {
                              cbMap.onIntentsReady.splice(toRemove,1)
                            }
                        }
                    }

                    return true;
                });
            },

            /**
             * Add onRoute handler to the WidgetsIntentsContainer.
             * @param {function} handler The listener function
             * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
             *   of the message.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
             *   for a description of this id.
             * @param {Object} [handler.intent] The second argument passed to the handler function is the intent itself.
             * @param {Object} [handler.data] The third argument passed to the handler function is the intent data.
             * @param {Object} [handler.container] The fourth argument passed to the handler function is the intents container.
             *  The intents container is used to actually send the intent to desired widgets and notify the sending widget
             * @param {Object} scope The scope to be used to execute the listener
             * @param {Object} single A flag to determine if the listener is removed upon a single execution
             * @example
             * OWF.IntentsContainer.onRoute(
             *   function(sender,intent,data,container) {
             *     //determine destination widget(s) based on sender, intent or the data
             *     //widgets could be already on the dashboard, or need to be launched
             *     var dest = ['widget1Id','widget2Id'];
             *
             *     //actually send the intent data to the dest widget(s)
             *     container.send(sender,intent,data,dest);
             *
             *     container.callback(dest);
             *   },
             *   scope);
             */
            onRoute:function (handler, scope, single) {
                this.addListener('onRoute', handler, scope, single);
            },


            /**
             * Add onIntentsReady handler to the WidgetsIntentsContainer.  Executes listeners a destination widget
             * is ready to receive an intent
             * @param {function} handler The listener function
             * @param {Object} [handler.intent] The first argument passed to the handler function is the intent itself.
             * @param {Object} [handler.destWidgetId] The second argument passed id to the destination widget.
             * @param {Object} scope The scope to be used to execute the listener
             * @param {Object} single A flag to determine if the listener is removed upon a single execution
             * @example
             * OWF.IntentsContainer.onRoute(
             *   function(sender,intent,data,container) {
             *     //determine destination widget(s) based on sender, intent or the data
             *     //widgets could be already on the dashboard, or need to be launched
             *     var dest = ['widget1Id','widget2Id'];
             *
             *     //actually send the intent data to the dest widget(s)
             *     container.send(sender,intent,data,dest);
             *
             *     container.callback(dest);
             *   },
             *   scope);
             */
            onIntentsReady:function (handler, scope, single) {
                this.addListener('onIntentsReady', handler, scope, single);
            },

            /**
             * @description  sends a content to a specific widget.
             * @param {String} sender id of the intent
             * @param {Object} intent data
             * @param {Object} data
             * @param {Function} handler
             * @param {String|String[]} handler.sender The first argument passed to the handler function is the id(s) of the recipient(s)
             *   of the message.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
             *   for a description of this id.
             * @param {Object} handler.intent The second argument passed to the handler function is the intent.
             * @param {Object} handler.data The thrid argument passed to the handler function is the data for the intent.
             * @param {String|String[]} dest
             * @return {Boolean} true if all intents were sent, false if one or more failed
             */
            send:function (sender, intent, data, handler, dest) {

                var destWidgetIds = [].concat(dest);
                var sentIds = {};
                var successCount = 0;
                
                //check if the dest widget has registered for the intent, if so then send
                function sendIntent(index, ids, successCount) {
                	var destWidgetId = ids[index];
                	if (destWidgetId) {
		              	var widgetId = Ozone.util.parseJson(destWidgetId).id;
		              	if (widgetIntentMap[destWidgetId] != null && 
		                   		widgetIntentMap[destWidgetId][owfdojo.toJson(intent)] &&
		                   		!sentIds[widgetId]) {
		              	  
		              		sentIds[widgetId] = true;
		              		Ozone.util.hasAccess({
		              			widgetId: widgetId, 
		                  	  	accessLevel: data.accessLevel, 
		                  	  	senderId: Ozone.util.parseJson(sender).id,
		                  	  	callback: function(response) {
		                  	  		if (response.hasAccess) {
		    	                        Ozone.eventing.Container.send(destWidgetId, INTENTS_SERVICE_NAME, handler, sender, intent, data);
		    	                        successCount++;
		                  	  		}
		                  	  		index++;
		                  	  		
		                  	  		if (index < ids.length) {
		                  	  			sendIntent(index, ids, successCount);
		                  	  		}
		                  	  	}
		              		});
		                }
                	}
                }
                
      	  		sendIntent(0, destWidgetIds, successCount);
                
      	  		// TO DO: This still needs to be reworked because Ozone.util.hasAccess is asynchronous
      	  		// so successCount will always be 0 here (since asynchrounous calls won't finish before
      	  		// this line is reached).
                return successCount == destWidgetIds.length;
            },

            addListener:function (event, handler, scope, single) {
                if (cbMap[event] != null) {
                    cbMap[event].push({fn:handler, scope:scope, single:single});
                }
            },
            removeListener:function (event, handler, scope) {
                if (cbMap[event] != null) {
                    for (var i = 0; i < cbMap[event].length; i++) {
                        var cb = cbMap[event][i];
                        if (cb.fn == handler && cb.scope == scope) {
                            cbMap[event].splice(i, 1);
                        }
                    }
                }
            },
            clearListeners:function (event) {
                if (cbMap[event] != null) {
                    cbMap[event] = [];
                }
            },
            clearAllListeners:function () {
                cbMap = {
                    onRoute:[]
                };
            }
        };

    }();


}(window, document));