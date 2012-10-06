/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.state = Ozone.state ? Ozone.state : {};

/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.state.WidgetState.getInstance</a>

 * @constructor
 * @param {Object} [cfg] config object see below for properties
 * @param {String} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit] Whether or not to automatically start listening to the state channel.  Default is true.
 * @param {String} [cfg.widgetGuid]  The guid of the widget to monitor. Default is itself.
 * @param {String} [cfg.onStateEventReceived]  The callback function when an event is received.
 * @description The Ozone.state.WidgetState object manages the two-way communication between an OWF widget and its OWF Container.
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @example
 *
 * var widgetState = new Ozone.state.WidgetState({
 *     onStateEventReceived: function(sender, msg) {
 *     		// do something
 *     }
 * });
 *
 */
Ozone.state.WidgetState = function(cfg) {

  if (Ozone.state.WidgetState.instance == null) {

	var STATE_EVENT_CHANNEL_NAME_prefix = "_WIDGET_STATE_CHANNEL_";

    cfg = cfg || {};

	// initialize the state handling
    this.widgetEventingController = cfg.widgetEventingController || Ozone.eventing.Widget.instance;
	this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance(this.widgetEventingController);
	this.widgetIdJSON = Ozone.util.parseJson(this.widgetEventingController.getWidgetId());
	this.widgetGuid = cfg.widgetGuid ? cfg.widgetGuid : this.widgetIdJSON.id;
    this.stateChannel = STATE_EVENT_CHANNEL_NAME_prefix + this.widgetGuid;
	this.onStateEventReceived = cfg.onStateEventReceived ? cfg.onStateEventReceived : this.onStateEventReceived;
	
	if (cfg.autoInit !== false) {
		this.init();
	}

     Ozone.state.WidgetState.instance = this;
  }

  return Ozone.state.WidgetState.instance;
};

Ozone.state.WidgetState.prototype = {
	/**
	 * @field
	 * @description version number
	 */
	version: Ozone.version.owfversion + Ozone.version.state,

	/**
     * @description Initializes the WidgetState object.  Using this function is only required if autoInit config is false
     * in the constructor.  This function is sometimes useful when it is necessary to defer event handling after
     * creating the Ozone.state.WidgetState object
     * @param {Object} [cfg] config object
     * @see <a href="#constructor">constructor</a>
     */
	init : function () {
		this.widgetEventingController.subscribe(this.stateChannel, this.onStateEventReceived);
//		this.widgetEventingController.registerHandler(this.stateChannel, this.onStateEventReceived);
	},
	
	/**
	 * @description The default callback function when an event is received. 
	 */
	onStateEventReceived: function () {
		return true;
	},
	
	getStateChannel: function () {
		return this.stateChannel;
	},

	/**
	 * @description Gets current widget state.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose state should be retrieved. Defaults to current widget guid.
     * @param {Function} [cfg.callback] Function to be called once after the state is retrieved.
     * This method will be passed the state object which has following properties. <br>
     * <br>
     *     {String} name: name of the widget <br>
     *     {Number} x: x-coordinate value of the top left corner of the widget<br>
     *     {Number} y: y-coordinate value of the top left corner of the widget<br>
     *     {Number} width: width of the widget <br>
     *     {Number} height: height of the widget <br>
     *     {Boolean} active: true if the widget is active, or else false. This property is applicable for desktop layout only. <br>
     *     {Boolean} maximized: true if the widget is maximized, or else false <br>
     *     {Boolean} minimized: true if the widget is minimized, or else false <br>
     *     {Boolean} collapsed: true if the widget is collapsed, or else false <br>
     *     {Boolean} singleton: true if the widget is singleton, or else false <br>
     *     {Boolean} pinned: true if the widget is pinned, or else false <br>
     *     {String} uniqueId: unique id of the widget <br>
     *     {String} widgetGuid: guid of the widget <br>
     *     {String} paneGuid: guid of the pane <br>
     *     {String} dashboardGuid: guid of the dashboard the widget is opened on <br>
     *     {String} region: region of the widget. This property is applicable for accordion layout only. Possible values for accordion layout are "accordion", "center" and "south". In other layouts, its value is "none". <br>
     *     {Number} columnPos: column the widget is opened in. This property is applicable for portal layout only. Possible values for portal layout are 0, 1 and 2. In other layouts, its value is 0. <br>
     *     {Number} zIndex: z-index of the widget. <br>
	 *
	 * @example
	 *
	 * widgetState.getWidgetState({
     *     callback: function(state) {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	getWidgetState: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "getWidgetState",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Gets registered widget state events
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be retrieved. Defaults to current widget guid.
     * @param {Function} [cfg.callback] Function to be called once after the stateWidget is executed.
	 *
	 * @example
	 *
	 * widgetState.getRegisteredStateEvents({
	 *     callback: function(events) {
	 *     		for (var i = 0; i < events.length; i++) {
	 *     			// Do something
	 *     		}
	 *     }
	 * });
	 *
	 */
	getRegisteredStateEvents: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "getWidgetStateEvents",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
    /**
     * @description Activates a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget to activate. Defaults to current widget's guid.
     * @param {Function} [cfg.callback] Function to be called once after the widget has been activated.
     * This function is passed back the following parameters. <br>
     * <br>
     *          {Boolean} result: true if the widget has been activated, or else false.
     *
     * @example
     *
     * widgetState.activateWidget({
     *     guid: "GUID_OF_A_WIDGET",
     *     callback: function(result) {
     *     		// Do something
     *     }
     * });
     *
     */
    activateWidget: function(cfg) {
        cfg = cfg ? cfg : {};

        var config = {
            fn: "activateWidget",
            params: {
                guid: cfg.guid ? cfg.guid : this.widgetGuid
            }
        };
        this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
    },

	/**
	 * @description Closes a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget to close. Defaults to current widget's guid.
     * @param {Function} [cfg.callback] Function to be called once after the widget is closed. Only use this if the widget is not closing itself.
     * This function is passed back the following parameters. <br>
     * <br>
     *          {Boolean} result: true if the widget has been closed, or else false.
	 *
	 * @example
	 *
	 * widgetState.closeWidget({
     *     guid: "GUID_OF_A_WIDGET",
     *     callback: function(result) {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	closeWidget: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "closeWidget",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Adds custom state event handlers to listen to widget events.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will add listeners to all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is added.
	 *
	 * @example
	 *
	 * widgetState.addStateEventListeners({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	addStateEventListeners: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "addStateEventListeners",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Removes custom state event listeners from a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will remove only custom listeners from all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is removed.
	 *
	 * @example
	 *
	 * widgetState.removeStateEventListeners({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	removeStateEventListeners: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "removeStateEventListeners",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Adds custom state event handlers to override a widget event.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will add listeners to all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is added.
	 *
	 * @example
	 *
	 * widgetState.addStateEventOverrides({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	addStateEventOverrides: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "addStateEventOverrides",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Removes custom state event listeners from a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will remove only custom listeners from all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is removed.
	 *
	 * @example
	 *
	 * widgetState.removeStateEventOverrides({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	removeStateEventOverrides: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "removeStateEventOverrides",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	}

};

/**
 * @param {Object} [cfg] config object see below for properties
 * @param {String} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit] Whether or not to automatically start listening to the state channel.  Default is true.
 * @param {String} [cfg.widgetGuid]  The guid of the widget to monitor. Default is itself.
 * @param {String} [cfg.onStateEventReceived]  The callback function when an event is received.
 * @description Retrieves Ozone.state.WidgetState Singleton instance. Manages the two-way communication between an OWF widget and its OWF Container.
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @since OWF 3.7.0
 * @example
 * var widgetState = Ozone.state.WidgetState.getInstance({
 *     onStateEventReceived: function(sender, msg) {
 *          // do something
 *     }
 * });
 *
 */
Ozone.state.WidgetState.getInstance = function(cfg) {
  if (Ozone.state.WidgetState.instance == null) {
    Ozone.state.WidgetState.instance = new Ozone.state.WidgetState(cfg);
  }
  return Ozone.state.WidgetState.instance;
};
