/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.eventing = Ozone.eventing ? Ozone.eventing : {};

(function (window, document, undefined) {

    Ozone.eventing.Container = function () {

        var cbMap = {
                widgetEventingReady:[],
                onRoute:[],
                onPublish:[],
                onSubscribe:[],
                onUnsubscribe:[]
            },
            iframeIds = {},
            config = {};

        function containerInit(sender, message) {
            //Handler used by container to parse out incoming initiation messages from gadgets
            //and set their relay URLs for communications downward

            if ((window.name === "undefined") || (window.name === "")) {
                window.name = "ContainerWindowName" + Math.random();
            }

            var initMessage = gadgets.json.parse(message);
            var useMultiPartMessagesForIFPC = initMessage.useMultiPartMessagesForIFPC;
            var idString = null;
            if (initMessage.id.charAt(0) != '{') {
                idString = initMessage.id;
            }
            else {
                var obj = gadgets.json.parse(initMessage.id);
                var id = obj.id;
                idString = gadgets.json.stringify({id:obj.id});
            }

            gadgets.rpc.setRelayUrl(idString, initMessage.relayUrl, false, useMultiPartMessagesForIFPC);
            gadgets.rpc.setAuthToken(idString, 0);

            //execute any widgetEventingReady callbacks
            for (var i = 0, len = cbMap.widgetEventingReady.length; i < len; i++) {
                cbMap.widgetEventingReady[i].fn.call(cbMap.widgetEventingReady[i].scope, sender, message);
            }

            //sent after_container_init message
            var jsonString = '{\"id\":\"' + window.name + '\"}';
            gadgets.rpc.call(idString, 'after_container_init', null, window.name, jsonString);
        }


        //public
        return /** @lends Ozone.eventing.Container */ {

            name:'OWF',
            version:Ozone.version.owfversion + Ozone.version.eventing,

            init:function (cfg) {
                config = cfg || {};

                //determine containerRelay
                this.setContainerRelay(config.containerRelay != null ? config.containerRelay : Ozone.util.getContainerRelay());

                //setup any widgetEventingReady callbacks
                if (config.widgetEventingReady != null) {
                    cbMap.widgetEventingReady.push(config.widgetEventingReady);
                }
                if (config.onRoute != null) {
                    cbMap.onRoute.push(config.onRoute);
                }
                if (config.onPublish != null) {
                    cbMap.onPublish.push(config.onPublish);
                }
                if (config.onSubscribe != null) {
                    cbMap.onSubscribe.push(config.onSubscribe);
                }
                if (config.onUnsubscribe != null) {
                    cbMap.onUnsubscribe.push(config.onUnsubscribe);
                }

                //check for overrides
                if (config.getIframeId != null) {
                    this.getIframeId = owfdojo.hitch(config.getIframeId.scope, config.getIframeId.fn);
                }
                if (config.getOpenedWidgets != null) {
                    this.getOpenedWidgets = owfdojo.hitch(config.getOpenedWidgets.scope, config.getOpenedWidgets.fn);
                }

                //initialize Ozone.eventing.rpc
                gadgets.rpc.register("LIST_WIDGETS", this.getOpenedWidgets);
                Ozone.eventing.rpc.init({
                    getIframeId:this.getIframeId
                });

                //hook containerInit for when widgets initialize with the container
                gadgets.rpc.register("container_init", function (sender, message, functions) {
                    //need to hook eventing.rpc to container_init
                    Ozone.eventing.rpc.priv.clientToldUsFunctionsHandler(sender, message, functions);

                    //initialize the widget with the container
                    containerInit(sender, message);
                });

                //initialize shindig pubsub
                gadgets.pubsubrouter.init(function (id) {
                    return id;
                }, {
                    onRoute:function (sender, subscriber, channel, message) {
                        var returnValue = true;

                        //execute any callbacks if any return false then stop the message
                        for (var i = 0, len = cbMap.onRoute.length; i < len; i++) {
                            returnValue = returnValue && !(cbMap.onRoute[i].fn.call(cbMap.onRoute[i].scope, sender, subscriber, channel, message) === false);
                        }

                        //shindig pubsubrouter expects true to means don't send the message
                        //so we reverse the value here so false means don't allow the action which makes more sense
                        return !returnValue;
                    },
                    onPublish:function (sender, channel, message) {
                        var returnValue = true;

                        //execute any callbacks if any return false then stop the message
                        for (var i = 0, len = cbMap.onPublish.length; i < len; i++) {
                            returnValue = returnValue && !(cbMap.onPublish[i].fn.call(cbMap.onPublish[i].scope, sender, channel, message) === false);
                        }

                        //shindig pubsubrouter expects true to means don't send the message
                        //so we reverse the value here so false means don't allow the action which makes more sense
                        return !returnValue;
                    },
                    onSubscribe:function (sender, message) {
                        var returnValue = true;

                        //execute any callbacks if any return false then stop the message
                        for (var i = 0, len = cbMap.onSubscribe.length; i < len; i++) {
                            returnValue = returnValue && !(cbMap.onSubscribe[i].fn.call(cbMap.onSubscribe[i].scope, sender, message) === false);
                        }

                        //shindig pubsubrouter expects true to means don't send the message
                        //so we reverse the value here so false means don't allow the action which makes more sense
                        return !returnValue;
                    },
                    onUnsubscribe:function (sender, message) {
                        var returnValue = true;

                        //execute any callbacks if any return false then stop the message
                        for (var i = 0, len = cbMap.onUnsubscribe.length; i < len; i++) {
                            returnValue = returnValue && !(cbMap.onUnsubscribe[i].fn.call(cbMap.onUnsubscribe[i].scope, sender, message) === false);
                        }

                        //shindig pubsubrouter expects true to means don't send the message
                        //so we reverse the value here so false means don't allow the action which makes more sense
                        return !returnValue;
                    }
                });

            },

            /**
             * @description Adds a widgetEventingReady handler function.  Each function will be executed for each widget that initializes
             * in the container
             * @param handler
             * @param scope
             */
            widgetEventingReady:function (handler, scope) {
                cbMap.widgetEventingReady.push({fn:handler, scope:scope});
            },
            onRoute:function (handler, scope) {
                cbMap.onRoute.push({fn:handler, scope:scope});
            },
            onPublish:function (handler, scope) {
                cbMap.onPublish.push({fn:handler, scope:scope});
            },
            onSubscribe:function (handler, scope) {
                cbMap.onSubscribe.push({fn:handler, scope:scope});
            },
            onUnsubscribe:function (handler, scope) {
                cbMap.onUnsubscribe.push({fn:handler, scope:scope});
            },
            addListener:function (event, handler, scope) {
                if (cbMap[event] != null) {
                    cbMap[event].push({fn:handler, scope:scope});
                }
            },
            removeListener:function (event, handler, scope) {
                if (cbMap[event] != null) {
                  for (var i = 0 ; i < cbMap[event].length ; i++) {
                      var cb = cbMap[event][i];
                      if (cb.fn == handler && cb.scope == scope) {
                          cbMap[event].splice(i,1);
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
                    widgetEventingReady:[],
                    onRoute:[],
                    onPublish:[],
                    onSubscribe:[],
                    onUnsubscribe:[]
                };
            },

            /**
             *
             * @param uniqueId
             */
            getIframeId:function (uniqueId) {
                return iframeIds[uniqueId];
            },

            getOpenedWidgets:function () {
                return iframeIds.length != null ? iframeIds : 0;
            },

            /**
             * @ignore
             * @description This method returns a string which contains the name and src parameters for an HTML iframe. Rather than setting these properties directly, call this method to autogenerate.
             * @param url
             * @param id
             */
            getIframeProperties:function (url, id, widget, paneType, launchData, isLocked) {
                url || (url = widget.url);

                var generatedIdText = Ozone.util.toString(this.generateIframeId(id));
                var generatedNameObj = this.generateIframeName(url, id, widget, paneType, launchData, isLocked);
                var generatedNameText = Ozone.util.toString(generatedNameObj);
                var htmlEncodedId = Ozone.util.HTMLEncodeReservedJS(generatedIdText);
                var htmlEncodedName = Ozone.util.HTMLEncodeReservedJS(generatedNameText);
                var a = url.split('?');
                var base = Ozone.util.HTMLEncodeReservedJS(a[0]);
                var qstring = '';
                if (a[1]) {
                    qstring = '&' + a[1];
                }
                qstring = Ozone.util.HTMLEncodeReservedJS(qstring);

                //put extra parameters into the frame src and use the generatedid for the id and name of the frame
                var ret = "id = \"" + htmlEncodedId + "\" name = \"" + htmlEncodedName + "\" src= \"" + base + "?lang=" + Ozone.lang.getLanguage() + "&owf=true" + qstring;
                if (generatedNameObj.currentTheme) {
                    var currentThemeName = Ozone.util.HTMLEncodeReservedJS(generatedNameObj.currentTheme.themeName);
                    var currentThemeContrast = Ozone.util.HTMLEncodeReservedJS(generatedNameObj.currentTheme.themeContrast);
                    var currentThemeFontSize = generatedNameObj.currentTheme.themeFontSize;

                    ret += '&themeName=' + currentThemeName;
                    ret += '&themeContrast=' + currentThemeContrast;
                    ret += '&themeFontSize=' + currentThemeFontSize;
                }
                ret += "\" ";

                iframeIds[id] = generatedIdText;
                iframeIds.length != null ? iframeIds.length++ : iframeIds.length = 0;

                return ret;
            },

            generateIframeName:function (url, objectId, widget, paneType, launchData, isLocked) {
                var iframeNameObj = {
                    id:objectId,

                    containerVersion:Ozone.version.owfversion,
                    webContextPath:Ozone.config.webContextPath,
                    preferenceLocation:Ozone.config.prefsLocation,

                    relayUrl:this.getContainerRelay(),
                    lang:Ozone.lang.getLanguage(),
                    currentTheme:Ozone.config.currentTheme,
                    owf:true,
                    layout:paneType || "",
                    url:url,
                    guid:widget.widgetGuid,
                    version:widget.version || 1,
                    locked: isLocked || false
                };

                if (launchData) {
                    iframeNameObj.data = launchData;
                }

                //return this json object as formatted string which is appropriate for being put in the name attribute of the
                //iframe tag.
                return iframeNameObj;

            },
            //Called by setIframeId function to reference a unique IframeId inside the container object
            /**
             * @ignore
             * @description This function is used to generate a unique id for use when instantiating an iframe. Do not call it from your code.
             * @private
             */
            generateIframeId:function (objectId) {
                return {
                    id:objectId
                };
            },

            /**
             * @returns A string which represents the address where the container relay file is located.
             */
            getContainerRelay:function () {
                return this.containerRelay;
            },
            /**
             * @ignore
             * @param A string representing the full or relative URL to the container relay file.
             * @description Call this method to set the location of the container relay file. You may specify either a full or a relative URL. <strong>An incorrectly set URL will result in relaying not working, but no error message will display.</strong>
             */
            setContainerRelay:function (relaypath) {

                if (relaypath === undefined || relaypath === '') {
                    throw 'Ozone.eventing.Container.setContainerRelay was called with a null or empty string. Please provide a valid URL.';
                }

                //For purposes of basic proxy safeguards the container relay is pulled from the current
                //window.location parameters and the relay path passed in by the manager object.

                //We should handle people passing in a full URL instead of a relative path. Let's accept both.

                var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

                // parse_url.exec will give us an array with entries of
                // ['url', 'scheme', 'slash', 'host', 'port','path', 'query', 'hash'];
                var result = parse_url.exec(relaypath);
                if (result[1] === undefined || result[1] === null || result[1] === '') {
                    // Meaning there is no scheme, so we can just use the relaypath that was passed in.
                    // (Extra regexp at the end ensures no double slashes, save for the one after protocol.)
                    this.containerRelay = window.location.protocol + "//" + (window.location.host + "/" + relaypath).replace(/\/{2,}/, '/');
                }
                else {
                    // There is a scheme, therefore this is a full url. Let's just use the path
                    // (Extra regexp at the end ensures no double slashes, save for the one after protocol.)
                    this.containerRelay = window.location.protocol + "//" + (window.location.host + "/" + result[5]).replace(/\/{2,}/, '/');
                }
            },

            /**
             * @description Use this method to register functions against the container.
             * @param handlerName The key to use for later making calls to this function.
             * @param handlerObject The function
             */
            registerHandler:function (handlerName, handlerObject) {
                //Simple wrapper for manager objects to register handler functions
                if (this.containerRelay === null) {
                    throw 'A call was made to Ozone.eventing.Container.registerHandler before the container relay was set. Please call setContainerRelay before attempting to register any handlers.';
                }
                gadgets.rpc.register(handlerName, handlerObject);
            },

            /**
             * Wraps gadgets.rpc.call.  This function calls a shindig service on a widget
             */
            send:function () {
                gadgets.rpc.call.apply(gadgets.rpc, arguments);
            },

            /**
             * @description Subscribe to a named channel for a given function.
             * @param channelName The channel to subscribe to.
             * @param handlerObject The function you wish to subscribe
             */
            subscribe:function (channelName, handlerObject) {
                gadgets.pubsubrouter.subscribe(channelName, handlerObject);
            },

            /**
             * @description UnSubscribe to a named channel
             * @param {String} channelName The channel to unsubscribe to.
             */
            unsubscribe:function (channelName) {
                gadgets.pubsubrouter.unsubscribe(channelName);
            },

            /**
             * @ignore
             * @description Publish a message to a given channel
             * @param {String} channelName The name of the channel to publish to
             * @param {Object} message The message to publish to the channel.
             * @param {String} [dest] The id of a particular destination.  Defaults to null which sends to all
             *                 subscribers on the channel
             */
            publish:function (channelName, message, dest) {
                gadgets.pubsubrouter.publish(channelName, message, dest);
            }
        };
    }();

}(window, document));