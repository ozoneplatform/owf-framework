/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.chrome = Ozone.chrome ? Ozone.chrome : {};

Ozone.chrome.OWFMenuChromeContainer = function(config) {

    var scope = this;
    this.channelName = "Ozone._OWFMenuChromeContainer";
    this.dashboard = null;
    scope.registerChromeMenuHandlers = function(menuConfig, sender) {
        if (menuConfig.menu) {
            // set css class on menu
            menuConfig.menu.componentCls = "widgetmenubar";
            menuConfig.menu.tabIndex = 0;

            // register handlers
            for (var j = 0; j < menuConfig.menu.items.length; j++) {
                var menuItem = menuConfig.menu.items[j];
                if (!menuItem.menu) {
                    // Regular menu item
                    menuItem.handler = function() {
                        //call click handler
                        var jsonString = gadgets.json.stringify({
                            itemId: this.itemId
                        });
                        gadgets.rpc.call(sender, scope.channelName, null, '..', jsonString);
                    };
                } else {
                    // Sub-menu 
                    scope.registerChromeMenuHandlers(menuItem, sender);
                }
            }
        } else {
            // Regular menu item
            menuConfig.handler = function() {
                //call click handler
                var jsonString = gadgets.json.stringify({
                    itemId: this.itemId
                });
                gadgets.rpc.call(sender, scope.channelName, null, '..', jsonString);
            };
        }
    };

    //private

    /**
     * Returns an object containing only the properties listed in propList.
     * Also htmlEncode all properties on the returned object
     */
    var secureProperties = function(obj, propList) {
        var retval = {};

        if (obj === undefined) return;

        for (var i = 0; i < propList.length; i++) {
            if (obj[propList[i]])
                retval[propList[i]] = Ext.htmlEncode(obj[propList[i]]);
        }

        return retval;
    },
        secureButton = function(btnConfig) {
            //only support these properties.  This minimizes the risk of security problems
            var item = secureProperties(btnConfig, ['itemId', 'xtype', 'type', 'icon', 'text', 'disabled']);
            item.tooltip = secureProperties(btnConfig.tooltip, ['title', 'text']);

            return item;
        },
        secureMenu = function(menuConfig) {
            //secure this item
            var retval = secureProperties(menuConfig, ['itemId', 'parentId', 'icon', 'text', 'disabled']);

            //secure sub-menu
            if (menuConfig.menu) {
                retval.menu = {};
                retval.menu.items = Ext.Array.map(menuConfig.menu.items, secureMenu);
            }

            return retval;
        };

    var handleAdd = function(sender, data) {
        var returnValue = {
            success: false
        }, newMenuItems, newMenuItem;

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
                }
            }
        }

        throw "handleAdd empty";
    };
    var handleInsert = function(sender, data) {
        throw "handleInsert empty";
    };

    var handleUpdate = function(sender, data) {
        throw "handleUpdate empty";
    };

    var handleRemove = function(sender, data) {
        throw "handleRemove empty";
    };
    var handleList = function(sender, data) {
        throw "handleList empty"
    };

    var isModified = function(sender, data) {
        var returnValue = {
            success: false
        };
        //parse out widgetid from sender
        var widgetCfg = Ozone.util.parseJson(sender);
        if (widgetCfg != null) {
            var cmp = Ext.getCmp(widgetCfg.id);
            if (cmp != null) {
                returnValue.success = true;
                returnValue.modified = (cmp.headerModified == true);
            }
        }
        return gadgets.json.stringify(returnValue);
    };

    var addMenuCloseHandler = function(item) {
        if (item.menu) {
            item.menu.listeners = {
                hide: function(cmp) {
                    var constrainTo = Ext.getCmp(cmp.constrainTo.id);
                    if (constrainTo) {
                        constrainTo.getFocusEl().focus();
                    }
                }
            };
        }
    };

    var getTitle = function(sender) {
        var returnValue = {
            success: false
        };
        //parse out widgetid from sender
        var widgetCfg = Ozone.util.parseJson(sender);
        if (widgetCfg != null) {
            var cmp = Ext.getCmp(widgetCfg.id);
            if (cmp != null) {
                returnValue.success = true;
                returnValue.title = cmp.title;
            }
        }
        return gadgets.json.stringify(returnValue);
    };

    var setTitle = function(sender, data) {
        var returnValue = {
            success: false
        };
        //parse out widgetid from sender
        var widgetCfg = Ozone.util.parseJson(sender);
        if (widgetCfg != null) {
            var cmp = Ext.getCmp(widgetCfg.id);
            if (cmp != null && cmp.setTitle != null) {
                returnValue.success = true;
                cmp.setTitle(data.title);
                returnValue.title = cmp.title;
            }
        }
        return gadgets.json.stringify(returnValue);
    };

    if (config != null && config.eventingContainer != null) {
        this.eventingContainer = config.eventingContainer;
        this.eventingContainer.registerHandler(this.channelName, function(sender, msg) {
            var returnValue = true;

            //msg will always be a json string
            var data = Ozone.util.parseJson(msg);

            switch (data.action) {
                case 'isModified':
                    returnValue = isModified(sender, data);
                    break;
                case 'addOWFMenuItems':
                    returnValue = handleAdd(sender, data);
                    break;
                case 'updateOWFMenuItems':
                    returnValue = handleUpdate(sender, data);
                    break;
                case 'insertOWFMenuItems':
                    returnValue = handleInsert(sender, data);
                    break;
                case 'removeOWFMenuItems':
                    returnValue = handleRemove(sender, data);
                    break;
                case 'listOWFMenuItems':
                    returnValue = handleList(sender, data);
                    break;
                case 'getTitle':
                    returnValue = getTitle(sender, data);
                    break;
                case 'setTitle':
                    returnValue = setTitle(sender, data);
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