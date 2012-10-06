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
 *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.state.WidgetStateHandler.getInstance</a>
 *  @constructor  WidgetStateHandler - Handles eventing from OWF widget to OWF container
 *  @param  {Ozone.eventing.Widget} widgetEventingController - widget eventing object which handles eventing for the widget
 *  @description This object is used handle widget requests.  To do so it requires a widgetEventingController
 *
 */
Ozone.state.WidgetStateHandler = function(widgetEventingController) {
  if (Ozone.state.WidgetStateHandler.instance == null) {
    this.stateChannelName = "_WIDGET_STATE_CHANNEL_";
    this.widgetEventingController = widgetEventingController || Ozone.eventing.Widget.instance;
    this.widgetIdJSON = Ozone.util.parseJson(this.widgetEventingController.getWidgetId());
    this.version = Ozone.version.owfversion + Ozone.version.widgetStateHandler

    Ozone.state.WidgetStateHandler.instance = this;
  }

  return Ozone.state.WidgetStateHandler.instance;
};

Ozone.state.WidgetStateHandler.prototype = {

  /**
   * @description handles a widget state request based on the config
   * @param {Object} config object see example for structure
   * @param {Function} callback a function to be called once after the stateWidget is executed
   *
   * @example
   *
   * //Example for closing a widget
   * var widgetEventingController = new Ozone.eventing.Widget(Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html');
   * var widgetStateHandler = new Ozone.state.WidgetStateHandler(this.widgetEventingController);
   * widgetStateHandler.handleStateRequest({
   *     fn: 'closeWidget',
   *     params: {
   *     	guid: <widgetGuid>
   *     }
   * });
   *
   */
	handleWidgetRequest: function(config, callback) {

		//send state request to a widget
		var stateChannel = this.stateChannelName + this.widgetIdJSON.id;
	    gadgets.rpc.call('..', stateChannel, callback, this.widgetIdJSON, config);	
	}
};

/**
 *  @description Retrieves Ozone.eventing.Widget Singleton instance.
 *    This object is used handle widget requests.  To do so it requires a widgetEventingController
 *  @param  {Ozone.eventing.Widget} widgetEventingController - widget eventing object which handles eventing for the widget
 *  @example
 *  this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance(this.widgetEventingController);
 */
Ozone.state.WidgetStateHandler.getInstance = function(widgetEventingController) {
  if (Ozone.state.WidgetStateHandler.instance == null) {
    Ozone.state.WidgetStateHandler.instance = new Ozone.state.WidgetStateHandler(widgetEventingController);
  }
  return Ozone.state.WidgetStateHandler.instance;
};
