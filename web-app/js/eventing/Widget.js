/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.eventing = Ozone.eventing ? Ozone.eventing : {};

//-----------------------------------------------------------------
//Ozone Eventing Widget Object
//-----------------------------------------------------------------
/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @constructor
 * @param {String} widgetRelay The URL for the widget relay file. The relay file must be specified with full location details, but without a fully
 * qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 * widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @param {Function} afterInit - callback to be executed after the widget is finished initializing.
 * @description The Ozone.eventing.Widget object manages the eventing for an individual widget (Deprecated).  This constructor is deprecated.
 *  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @example
 * this.widgetEventingController = new Ozone.eventing.Widget(
 * 'owf-sample-html/js/eventing/rpc_relay.uncompressed.html', function() {
 * 
 *  //put code here to execute after widget init - perhaps immediately publish to a channel
 * 
 * });
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.eventing.Widget = function(widgetRelay, afterInit) {
  if (Ozone.eventing.Widget.instance == null) {
    Ozone.eventing.Widget.instance = this;
    this.isAfterInit = false;
    //connect passed in function to the internal callback function
    if (afterInit != null) {
      owfdojo.connect(
              this,'afterInitCallBack',
              this,afterInit);
    }
    this.setWidgetRelay(widgetRelay);
    try {
        this.widgetInit();
    } catch (error) {
        throw 'Widget relay init failed. Relaying will not work. Inner Exception: ' + error.name + ": " + error.message;
    }
  }
  else {
    if (afterInit != null) {
      if (this.isAfterInit === false) {
        //connect passed in function to the internal callback function
        owfdojo.connect(
                this,'afterInitCallBack',
                this,afterInit);
    }
      else {
        //already initialized just execute the supplied callback
        setTimeout(afterInit,50);
  }
    }
  }
  return Ozone.eventing.Widget.instance;
};

/**
 * @description The location of the widget relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html. The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *       //...
 * &lt;/script&gt;
 *
 */
Ozone.eventing.Widget.widgetRelayURL = Ozone.eventing.Widget.widgetRelayURL ? Ozone.eventing.Widget.widgetRelayURL : null;

Ozone.eventing.Widget.prototype = {

    version: Ozone.version.owfversion + Ozone.version.eventing,

    /**
     * @ignore
     * @returns The URL for the widgetRelay
     * @description This should not be called from usercode.
     */
    getWidgetRelay : function() {
        return this.widgetRelay;
    },
    /**
     * @ignore
     * @param The relaypath to set.
     * @description This should not be called from usercode.
     */
    setWidgetRelay : function(relaypath) {
      //if null figure out path
      if (relaypath == null) {
        //check if global path variable was set
        if (Ozone.eventing.Widget.widgetRelayURL != null) {
          relaypath = Ozone.eventing.Widget.widgetRelayURL;
        }
        //else calculate a standard relative path
        else {
          //find root context - assume relay file is at /<context/js/eventing/rpc_relay.uncompressed.html
          var baseContextPath = window.location.pathname;
          var baseContextPathRegex = /^(\/[^\/]+\/).*$/i;
          var matches = baseContextPath.match(baseContextPathRegex);
          if (matches != null && matches[1] != null && matches[1].length > 0) {
            baseContextPath = matches[1];
            //remove final /
            baseContextPath = baseContextPath.substring(0,baseContextPath.length-1);
          }
          else {
            baseContextPath = '';
          }
          relaypath = baseContextPath + '/js/eventing/rpc_relay.uncompressed.html';
        }
      }
      this.widgetRelay = window.location.protocol + "//" + window.location.host + (relaypath.charAt(0) != '/'? ('/'+relaypath) : relaypath);
    },
    /**
     * @description Returns the Widget Id
     * @returns {String} The widgetId is a complex JSON encoded string which identifies a widget for Eventing.
     *   Embedded in this string is the widget's uniqueId as the 'id' attribute.  There is other data is in the string
     *   which is needed for Eventing and other APIs to function properly. This complex widgetId string may be used in
     *   the <a href="#publish">Ozone.eventing.Widget.publish</a> function to designate a specific recipient for a message.
     *   Additionally, once subscribed to a channel via <a href="#subscribe">Ozone.eventing.Widget.subscribe</a> during the
     *   receipt of a message, the sender's widgetId is made available as the first argument to the handler function.
     * @example
     * //decode and retrieve the widget's unique id
     * var complexIdString = this.eventingController.getWidgetId();
     * var complexIdObj = owfdojo.toJson(complexIdString);
     *
     * //complexIdObj will look like
     * // {
     * //  //widget's uniqueId
     * //  id:"49cd21f0-3110-8121-d905-18ffa81b442e"
     * // }
     *
     * //get Widget's uniqueId
     * alert('widget id = ' + complexIdObj.id);
     */
    getWidgetId : function() {
        return this.widgetId;
    },
    /**
     * @ignore
     * @returns The containerRelay
     * @description This should not be called from usercode.
     */
    getContainerRelay : function() {
        return this.containerRelay;
    },
    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
    widgetInit : function() {
        var queryHash = {};
        var jsonString = null;

        //check for data in window.name
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null) {

          //the id is the whole contents of the window.name
          this.widgetId = '{\"id\":\"' + configParams.id + '\"}';
          this.locked = configParams.locked;

          //embedded in the id is the relay
          this.containerRelay = configParams.relayUrl;
        }
        else {
          throw {
            name :'WidgetInitException',
            message :'The call to container_init failed. Inner Exception: '
          };
        }

        gadgets.rpc.setRelayUrl("..", this.containerRelay, false, true);

        
        var onClickHandler,
            onKeyDownHandler;

        function activateWidget() {

             var config = {
                 fn: "activateWidget",
                 params: {
                    guid: configParams.id,
                    focusIframe: document.activeElement === document.body
                 }
             };

             var stateChannel = '_WIDGET_STATE_CHANNEL_' + configParams.id;
             if (!this.disableActivateWidget) {
               gadgets.rpc.call('..', stateChannel, null, this.widgetId, config);
             }
             else {
               this.disableActivateWidget = false;
             }
        }

        //register for after_container_init
        gadgets.rpc.register("after_container_init", owfdojo.hitch(this,function() {

            gadgets.rpc.unregister("after_container_init");
            
            //attach mouse click and keydown listener to send activate calls for the widget
            if(!onClickHandler) {
                onClickHandler = owfdojo.connect(document, 'click', owfdojo.hitch(this, activateWidget));
            }
            
            if(!onKeyDownHandler) {
                onKeyDownHandler = owfdojo.connect(document, 'onkeyup', owfdojo.hitch(this, activateWidget));
            }

            //execute callback
            this.afterContainerInit();

        }));

        gadgets.rpc.register("_widget_activated", owfdojo.hitch(this,function() {
            //console.log("_widget_activated => " + configParams.id);
            
            if(onClickHandler) {
                owfdojo.disconnect(onClickHandler);
            }
            if(onClickHandler) {
                owfdojo.disconnect(onKeyDownHandler);
            }
                        
            onClickHandler = null;
            onKeyDownHandler = null;

        }));

        gadgets.rpc.register("_widget_deactivated", owfdojo.hitch(this,function() {
            //console.log("_widget_deactivated => " + configParams.id);

            if(!onClickHandler) {
                onClickHandler = owfdojo.connect(document, 'click', owfdojo.hitch(this, activateWidget));
            }
            if(!onKeyDownHandler) {
                onKeyDownHandler = owfdojo.connect(document, 'onkeyup', owfdojo.hitch(this, activateWidget));
            }
        }));

        //register with container
        try {
            var idString = '{\"id\":\"' + configParams.id + '\"}';
            var data = {
              id: idString,
              version: this.version,
              useMultiPartMessagesForIFPC: true,
              relayUrl: this.widgetRelay
            };

            if (Ozone.util.pageLoad.loadTime != null && Ozone.util.pageLoad.autoSend) {
              data.loadTime = Ozone.util.pageLoad.loadTime;
            }

            //jsonString = gadgets.json.stringify(data);
            jsonString = Ozone.util.toString(data);
            gadgets.rpc.call('..', 'container_init', null, idString, jsonString);

        } catch (error) {
            throw {
                name :'WidgetInitException',
                message :'The call to container_init failed. Inner Exception: ' + error
            };
        }
    },

    isInitialized: function() {
      return this.isAfterInit;
    },

    /**
     * @ignore
     * default noop callback
     */
    afterInitCallBack: function(widgetEventingController) {

    },

    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
     afterContainerInit: function() {
       this.isAfterInit = true;
       if (this.afterInitCallBack != null) {
         this.afterInitCallBack(this);
       }
     },

    /**
     * @ignore
     */
    registerHandler : function(handlerName, handlerObject) {
      //Simple wrapper for manager objects to register handler functions
      gadgets.rpc.register(handlerName, handlerObject);
    },

    /**
     * @ignore
     * Wraps gadgets.rpc.call.
     */
    send:function () {
        gadgets.rpc.call.apply(gadgets.rpc, arguments);
    },

    /**
     * @description Subscribe to a named channel for a given function.
     * @param {String} channelName The channel to subscribe to.
     * @param {Function} handler The function you wish to subscribe.  This function will be called with three
     *   arguments: sender, msg, channel.
     * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
     *   of the message.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *   for a description of this id.
     * @param {Object} [handler.msg] The second argument passed to the handler function is the message itself.
     * @param {String} [handler.channel] The third argument passed to the handler function is the channel the message was
     *   published on.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.subscribe("ClockChannel", this.update);
     *
     * var update = function(sender, msg, channel) {
     *     document.getElementById('currentTime').innerHTML = msg;
     * }
     *
     */
    subscribe : function(channelName, handler) {
        gadgets.pubsub.subscribe(channelName, handler);
        return this;
    },
    /**
     * @description Unsubscribe to a named channel
     * @param {String} channelName The channel to unsubscribe to.
     * @example
     * this.widgetEventingController.unsubscribe("ClockChannel");
     */
    unsubscribe : function(channelName) {
        gadgets.pubsub.unsubscribe(channelName);
        return this;
    },
    /**
     * @description Publish a message to a given channel
     * @param {String} channelName The name of the channel to publish to
     * @param {Object} message The message to publish to the channel.
     * @param {String} [dest] The id of a particular destination.  Defaults to null which sends to all
     *                 subscribers on the channel.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *                 for a description of the id.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.publish("ClockChannel", currentTimeString);
     */
    publish : function(channelName, message, dest) {
        gadgets.pubsub.publish(channelName, message, dest);
        return this;
    }
};

/**
 * @description Retrieves Ozone.eventing.Widget Singleton instance
 * @param {Function} [afterInit] callback function to be executed after the Ozone.eventing.Widget singleton is initialized
 * @param {String} [widgetRelay] Optionally redefine the location of the relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html.  The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @throws {Error} throws an error with a message if widget initialization fails
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *
 *       owfdojo.addOnLoad(function() {
 *         //get widget instance
 *         var widgetEventingController = Ozone.eventing.Widget.getInstance();
 *         //do something
 *         widgetEventingController.publish("FooChannel", 'message goes here');
 *       });
 * &lt;/script&gt;
 */
Ozone.eventing.Widget.getInstance = function(afterInit, widgetRelay) {
  if (Ozone.eventing.Widget.instance == null) {
    Ozone.eventing.Widget.instance = new Ozone.eventing.Widget(widgetRelay, afterInit);
  }
  else {
    if (afterInit != null) {
      if (!Ozone.eventing.Widget.instance.isAfterInit) {
        //connect passed in function to the internal callback function
        owfdojo.connect(
                Ozone.eventing.Widget.instance,'afterInitCallBack',
                Ozone.eventing.Widget.instance,afterInit);
      }
      else {
        //already initialized just execute the supplied callback
      setTimeout(function() {
        afterInit(Ozone.eventing.Widget.instance)
      },50);
    }
  }
  }
  return Ozone.eventing.Widget.instance;
};
