/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.chrome = Ozone.chrome ? Ozone.chrome : {};

/**
 *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.chrome.OWFMenuChrome.getInstance</a>
 *  @constructor  widgetEventingController - Ozone.eventing.Widget object
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @description This object allows a widget to modify the button contained in the widget header (the chrome).
 *  To do so it requires a widgetEventingController
 *  @example
 *    this.wc = new Ozone.chrome.OWFMenuChrome({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.OWFMenuChrome = function(config) {
    if (Ozone.chrome.OWFMenuChrome.instance == null) {
        var scope = this;
        scope.channelName = "Ozone._OWFMenuChromeContainer";
        scope.version = Ozone.version.owfversion + Ozone.version.OWFMenuChrome;
        scope.items = {};
        scope.registerChromeMenu = function(menuConfig) {
            // Regular menu item
            scope.items[menuConfig.itemId != null ? menuConfig.itemId : menuConfig.id] = menuConfig;

            if (menuConfig.menu) {
                for (var j = 0; j < menuConfig.menu.items.length; j++) {
                    var menuItem = menuConfig.menu.items[j];
                    // Sub-menu
                    scope.registerChromeMenu(menuItem);
                }
            }
        };

        var pub = /** @lends Ozone.chrome.OWFMenuChrome.prototype */ {

            init: function(config) {

                config = config || {};

                scope.widgetEventingController = config.widgetEventingController || Ozone.eventing.Widget.instance;
                scope.widgetEventingController.registerHandler(scope.channelName, function(sender, msg) {
                    var returnValue = true;

                    //msg will always be a json string
                    var data = Ozone.util.parseJson(msg);

                    var id = data.itemId != null ? data.itemId : data.id;
                    var handler = scope.items[id].handler;
                    if (handler != null && owfdojo.isFunction(handler)) {
                        returnValue = handler.apply(data.scope != null ? data.scope : window, data.args != null ? data.args : []);
                    }

                    return returnValue;
                });
            },

            addOWFMenuItems: function(cfg) {
                var data = {};
                var items = null;

                if (!owfdojo.isArray(cfg.items)) {
                    items = [cfg.items];
                } else {
                    items = cfg.items;
                }

                data.action = 'addOWFMenuItems';
                data.items = items;
                for (var i = 0; i < items.length; i++) {
                    scope.items[items[i].itemId != null ? items[i].itemId : items[i].id] = items[i];
                }

                var jsonString = gadgets.json.stringify(data);
                gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

            },

            getTitle: function(cfg) {
                var data = {
                    action: 'getTitle'
                };
                var jsonString = gadgets.json.stringify(data);
                gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
            }
        };

        pub.init(config);
        Ozone.chrome.OWFMenuChrome.instance = pub;
    }
    return Ozone.chrome.OWFMenuChrome.instance;
};

/**
 *  @description Retrieves Ozone.chrome.OWFMenuChrome Singleton instance.  To do so it requires a widgetEventingController
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @example
 *    this.wc = Ozone.chrome.OWFMenuChrome.getInstance({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.OWFMenuChrome.getInstance = function(cfg) {
    if (Ozone.chrome.OWFMenuChrome.instance == null) {
        Ozone.chrome.OWFMenuChrome.instance = new Ozone.chrome.OWFMenuChrome(cfg);
    }
    return Ozone.chrome.OWFMenuChrome.instance;
};