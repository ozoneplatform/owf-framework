
/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.marketplace = Ozone.marketplace ? Ozone.marketplace : {};

Ozone.marketplace.MarketplaceUserMenuContainer = function(widgetEventingController, dashboardContainer) {
    if (Ozone.marketplace.MarketplaceUserMenuContainer.instance == null) {
        var scope = this;

        scope.menuItemClickChannelName = "_MARKETPLACE_MENU_ITEM_CLICK";
        scope.menuAdminToggleChannelName = "_MARKETPLACE_MENU_ADMIN_TOGGLE";

        scope.widgetEventingController = widgetEventingController || Ozone.eventing.Container;
        scope.dashboardContainer = dashboardContainer;

        Ozone.marketplace.MarketplaceUserMenuContainer.instance = scope;

        scope.widgetEventingController.registerHandler(scope.menuAdminToggleChannelName, function(sender, msg) {
            return scope.toggleMarketplaceAdminMenu(sender);
        });
    }

    return Ozone.marketplace.MarketplaceUserMenuContainer.instance;
};

Ozone.marketplace.MarketplaceUserMenuContainer.prototype = {
    getMarketplaceWidgetId: function() {
        var activeDashboard = this.dashboardContainer.activeDashboard;
        if (activeDashboard.configRecord.isMarketplaceDashboard()) {
            var activeMarketplaceWidget = activeDashboard.activeWidget;

            // when there's more than 1 marketplace widget open in the current dashboard
            if (activeMarketplaceWidget) {
                return gadgets.json.stringify({
                    id: activeMarketplaceWidget.id
                });
                // when there's only 1 marketplace widget open in the current dashboard
            } else {
                var activeWidget = this.dashboardContainer.getOpenedWidgets()[0];

                return gadgets.json.stringify({
                    id: activeWidget.id
                });
            }
        } else {
            return {};
        }
    },

    activateMarketplaceMenuAction: function(menuActionDescriptor) {
        var msg = gadgets.json.stringify({
            itemId: menuActionDescriptor
        });

        this.widgetEventingController.send(this.getMarketplaceWidgetId(), this.menuItemClickChannelName, null, msg);
    },

    toggleMarketplaceAdminMenu: function(marketplaceAdminData) {
        var userMenuBtn = Ext.getCmp('userMenuBtn'),
            isAdmin = gadgets.json.parse(marketplaceAdminData).isAdmin;

        if (userMenuBtn) {
            if (isAdmin) {
                userMenuBtn.enableMarketplaceAdminSubMenu();
            } else {
                userMenuBtn.disableMarketplaceAdminSubMenu();
            }
        }
    }
};

Ozone.marketplace.MarketplaceUserMenuContainer.getInstance = function(widgetEventingController, dashboardContainer) {
    if (Ozone.marketplace.MarketplaceUserMenuContainer.instance == null) {
        Ozone.marketplace.MarketplaceUserMenuContainer.instance =
            new Ozone.marketplace.MarketplaceUserMenuContainer(widgetEventingController, dashboardContainer);
    }

    return Ozone.marketplace.MarketplaceUserMenuContainer.instance;
};