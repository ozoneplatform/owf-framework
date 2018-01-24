/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.launcher = Ozone.launcher ? Ozone.launcher : {};

Ozone.launcher.WidgetLauncherContainer = function(eventingContainer) {

  this.launchChannelName = "_WIDGET_LAUNCHER_CHANNEL";
  this.windowManager = null;

  if (eventingContainer != null) {
    this.eventingContainer = eventingContainer;
    //register on widget launcher channel
    var scope = this;
    this.eventingContainer.registerHandler(this.launchChannelName, function(sender, msg) {
      return scope.launchWidget(Ozone.util.parseJson(sender), Ozone.util.parseJson(msg), this);
    });
  } else {
    throw {
      name: 'WidgetLauncherContainerException',
      message: 'eventingContainer is null'
    }
  }

};

Ozone.launcher.WidgetLauncherContainer.prototype = {

  launchWidget: function(sender, cfg, rpc) {
    var window_manager = null;
    var returnValue = null;

    //find window_manager for now there will only ever be one
    window_manager = this.windowManager;

    //find the widget we're going to launch
    var widget = window_manager.findWidget(cfg);

    Ozone.util.hasAccess({
        widgetId: widget.data.widgetGuid,
        accessLevel: cfg.accessLevel,
        senderId: sender.id,
        callback: function(response) {
          if (!response.hasAccess) {
            // don't send data
            cfg.data = null;
          }

          if (window_manager != null) {
            returnValue = window_manager.launchWidgetInstance(sender, cfg);
            rpc.callback(returnValue);
          } else {
            throw {
              name :'WidgetLauncherContainerException',
              message :'window_manager is null'
            };
          }
        }
    });
  },

  registerWindowManager: function(window_manager) {
    this.windowManager = window_manager;
  }
};