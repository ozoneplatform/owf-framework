/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.state = Ozone.state ? Ozone.state : {};

Ozone.state.WidgetStateContainer = function(eventingContainer) {

  this.stateChannelPrefix = "_WIDGET_STATE_CHANNEL_";
  this.windowManager = null;

  if (eventingContainer != null) {
    this.eventingContainer = eventingContainer;
  }
  else {
    throw {
      name :'WidgetStateContainerException',
      message :'eventingContainer is null'
    }
  }

};

Ozone.state.WidgetStateContainer.prototype = {
	registerHandler: function(guid) {
	    //register dedicated channel for widget state events
	    var scope = this;
	    var stateChannel = this.stateChannelPrefix + guid; 
	    this.eventingContainer.registerHandler(stateChannel, function(sender, msg) {
	    	return scope.handleWidgetRequest(msg);
	    });
	},

	handleWidgetRequest: function(config) {
	    var window_manager = null;
	    var returnValue = null;
	
	    //find window_manager for now there will only ever be one
	    window_manager = this.windowManager;
	
	    if (window_manager != null) {
	    	returnValue = window_manager.handleWidgetRequest(config);
	    } else {
	       throw {
	    	   name :'WidgetStateContainerException',
	    	   message :'window_manager is null'
	       };
	    }
	
	    //call request function on the window_manager
	    return returnValue;
	},

	registerWindowManager: function(window_manager) {
		this.windowManager = window_manager;
	}
};
