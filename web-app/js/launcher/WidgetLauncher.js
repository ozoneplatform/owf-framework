/**
 * @namespace
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.launcher = Ozone.launcher ? Ozone.launcher : {};

(function() {

    var launchChannelName = "_WIDGET_LAUNCHER_CHANNEL";

    /**
     *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.launcher.WidgetLauncher.getInstance</a>
     *  @constructor  widgetEventingController - Ozone.eventing.Widget object
     *  @param  {Ozone.eventing.Widget} [widgetEventingController] - widget eventing object which handles eventing for the widget
     *  @description This object is used launch other widgets.  To do so it requires a widgetEventingController
     *
     */
    Ozone.launcher.WidgetLauncher = function() {
        if (Ozone.launcher.WidgetLauncher.instance == null) {
            this.version = Ozone.version.owfversion + Ozone.version.widgetLauncher

            Ozone.launcher.WidgetLauncher.instance = this;
        }

        return Ozone.launcher.WidgetLauncher.instance;
    };

    Ozone.launcher.WidgetLauncher.prototype = {

      /**
       * @description launches a Widget based on the config
       * @param {Object} config object see example for structure
       * @param {Function} callback a function to be called once after the launchWidget is executed
       *
       * @example
       *
       * //Example for launching a widget
       * var widgetEventingController = Ozone.eventing.Widget.getInstance();
       * var widgetLauncher = Ozone.launcher.WidgetLauncher.getInstance(this.widgetEventingController);
       * var data = {
       *   channel: channel,
       *   message: message
       * };
       * var dataString = Ozone.util.toString(data);
       * widgetLauncher.launchWidget({
       *     universalName: 'universal name of widget to launch',  //universalName or guid maybe identify the widget to be launched
       *     guid: 'guid of widget to launch',
       *     title: 'title to replace the widgets title' the title will only be changed if the widget is opened.
       *     titleRegex: optional regex used to replace the previous title with the new value of title
       *     launchOnlyIfClosed: true, //if true will only launch the widget if it is not already opened.
       *                               //if it is opened then the widget will be restored
       *     data: dataString  //initial launch config data to be passed to a widget only if the widget is opened.  this must be a string
       * });
       *
       */
        launchWidget: function(config,callback) {
            //send message to launch a widget

            if (config.titleRegex != null && config.titleRegex instanceof RegExp) {
                config.titleRegex = config.titleRegex.toString();
            }

            var jsonString = gadgets.json.stringify(config);
            gadgets.rpc.call('..', launchChannelName, callback, OWF.getIframeId(), jsonString);
        }
    };

    /**
     *  @constructor none
     *  @description Utility functions for a widget that has been launched
     *
     */
    Ozone.launcher.WidgetLauncherUtils = {
      /**
       * @description gets initial launch config data for this widget if it was just launched
       * @returns {Object} data object which contains initial information for the widget 
       * @example
       *
       * var launchConfig = Ozone.launcher.WidgetLauncherUtils.getLaunchConfigData();
       * if (launchConfig != null) {
       *   var data = Ozone.util.parseJson(launchConfig);  //in this example the data object has two fields: channel and message
       *   if (data != null) {
       *       //do something with the data
       *       scope.subscribeToChannel(data.channel);
       *       scope.addToGrid(null,data.message,data.channel);
       *   }
       * }
       *
       */
        getLaunchConfigData: function() {
            var launchConfig = null;

            //check for data in window.name
            var configParams = Ozone.util.parseWindowNameData();
            if (configParams != null) {

                //get launchConfig
                launchConfig = configParams.data;
            }

            return launchConfig;
        }
    };

    /**
     *  @description Retrieves Ozone.eventing.Widget Singleton instance. This object is used launch other widgets.
     *  @example
     *  this.widgetLauncher = Ozone.launcher.WidgetLauncher.getInstance(this.widgetEventingController);
     */
    Ozone.launcher.WidgetLauncher.getInstance = function() {
        if (Ozone.launcher.WidgetLauncher.instance == null) {
            Ozone.launcher.WidgetLauncher.instance = new Ozone.launcher.WidgetLauncher();
        }
        return Ozone.launcher.WidgetLauncher.instance;
    };

}());
