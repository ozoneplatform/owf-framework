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
 * NOTE: This class is unused currently, but it and OWFMenuChromeContainer illustrate how a widget
 * can add a button to OWF's User Menu.
 */
Ozone.chrome.OWFMenuChrome = function(config) {
    if (Ozone.chrome.OWFMenuChrome.instance == null) {
        var scope = this;
        scope.channelName = "Ozone._OWFMenuChromeContainer";
        scope.version = Ozone.version.owfversion + Ozone.version.OWFMenuChrome;
        scope.items = {};

        var pub = {

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

Ozone.chrome.OWFMenuChrome.getInstance = function(cfg) {
    if (Ozone.chrome.OWFMenuChrome.instance == null) {
        Ozone.chrome.OWFMenuChrome.instance = new Ozone.chrome.OWFMenuChrome(cfg);
    }
    return Ozone.chrome.OWFMenuChrome.instance;
};