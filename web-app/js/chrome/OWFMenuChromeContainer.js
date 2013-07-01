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
 * NOTE: This class is unused currently, but it and OWFMenuChrome illustrate how a widget
 * can add a button to OWF's User Menu.
 */
Ozone.chrome.OWFMenuChromeContainer = function(config) {

    var scope = this;
    this.channelName = "Ozone._OWFMenuChromeContainer";
    this.dashboard = null;

    var secureProperties = function(obj, propList) {
        var retval = {};

        if (obj === undefined) return;

        for (var i = 0; i < propList.length; i++) {
            if (obj[propList[i]])
                retval[propList[i]] = Ext.htmlEncode(obj[propList[i]]);
        }

        return retval;
    };

    var secureButton = function(btnConfig) {
        //only support these properties.  This minimizes the risk of security problems
        var item = secureProperties(btnConfig, ['itemId', 'xtype', 'type', 'icon', 'text', 'disabled']);
        item.tooltip = secureProperties(btnConfig.tooltip, ['title', 'text']);

        return item;
    };

    var handleAdd = function(sender, data) {
        var newMenuItems, newMenuItem;

        var menuItemCfg = Ozone.util.parseJson(sender);
        if (widgetCfg) {
            var menu = Ext.getCmp(widgetCfg.id);
            if (cmp) {
                if (data.items) {
                    newMenuItems = data.items;

                    if (!Ext.isArray(newMenuItems)) {
                        newMenuItems = [newMenuItems];
                    }

                    for (var i = 0; i < newMenuItems.length; ++i) {
                        newMenuItem = secureButton(items[i]);

                        newMenuItem.handler = function() {
                            var jsonString = gadgets.json.stringify({
                                itemId: this.itemId
                            });
                            gadgets.rpc.call(sender, scope.channelName, null, '..', jsonString);
                        }

                        cmp.addMenuItem(item);
                    }

                    return {
                        success: true
                    };
                }
            }
        }
    };

    if (config != null && config.eventingContainer != null) {
        this.eventingContainer = config.eventingContainer;
        this.eventingContainer.registerHandler(this.channelName, function(sender, msg) {
            var returnValue = true;

            //msg will always be a json string
            var data = Ozone.util.parseJson(msg);

            switch (data.action) {
                case 'addOWFMenuItems':
                    returnValue = handleAdd(sender, data);
                    break;
                default:
            }

            return returnValue;
        });
    } else {
        throw {
            name: 'OWFMenuChromeContainerException',
            message: 'eventingContainer is null'
        }
    }
};