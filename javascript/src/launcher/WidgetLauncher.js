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
        @description Launches a Widget based on the config.
        @param {Object} config object see example for structure
        @param {String} config.pane optional, valid values are 'sibling' or a pane guid. Value of 'sibling' launches the widget into the sibling pane if it exists. If a pane is not found, widget is launched in the same pane. See <a href="OWF.html#.getPanes">OWF.getPanes</a> to find out how to get panes.
        @param {String} config.universalName universalName or guid maybe identify the widget to be launched
        @param {String} config.guid widget definition guid of the widget to launch
        @param {String} config.title title to use for the widget
        @param {String} config.titleRegex optional regex used to replace the previous title with the new value of title
        @param {Boolean} config.launchOnlyIfClosed If true, Widget will only be launched if it is not already opened. If it is opened, then the widget will be restored.
        @param {String} config.data initial launch config data to be passed to a widget only if the widget is opened.
        @param {Function} callback a function to be called once after the launchWidget is executed
        @see <a href="#WidgetState.getState">widget state</a> for more info

        @example

        // launch widget in following preference: empty pane, sibling, or same pane.
        // this is done by sorting panes by no of widgets, and picking the pane with the lowest no of widgets.
        OWF.getPanes(function (panes) {
            var pane;

            if(panes.length <= 2) {
                pane = 'sibling';
            }
            else {
                panes = Ext.Array.sort(panes, function (a, b) {
                    if(a.widgets.length === b.widgets.length)
                        return 0;
                    else if(a.widgets.length < b.widgets.length)
                        return -1;
                    else if(a.widgets.length > b.widgets.length)
                        return 1;
                });
                pane = panes[0].widgets.length === 0 ? panes[0].id : 'sibling'
            }

            widgetLauncher.launchWidget({
                pane: pane,
                universalName: 'universal name of widget to launch',
                guid: 'guid of widget to launch',
                title: 'title to replace the widgets title',
                titleRegex: 'regex',
                launchOnlyIfClosed: true,
                data: 'dataString'
            });
        });

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
