/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.marketplace = Ozone.marketplace ? Ozone.marketplace : {};

Ozone.marketplace.MarketplaceUserMenuClient = function(widgetEventingController, dashboardContainer) {
    if (Ozone.marketplace.MarketplaceUserMenuClient.instance == null) {
        var scope = this;

        scope.menuItemClickChannelName = "_MARKETPLACE_MENU_ITEM_CLICK";
        scope.menuAdminToggleChannelName = "_MARKETPLACE_MENU_ADMIN_TOGGLE";

        scope.widgetEventingController = widgetEventingController || Ozone.eventing.Container;
        scope.dashboardContainer = dashboardContainer;

        Ozone.marketplace.MarketplaceUserMenuClient.instance = scope;

        scope.widgetEventingController.registerHandler(scope.menuAdminToggleChannelName, function(sender, msg) {
            return scope.toggleMarketplaceAdminMenu(sender);
        });
    }

    return Ozone.marketplace.MarketplaceUserMenuClient.instance;
};

Ozone.marketplace.MarketplaceUserMenuClient.prototype = {
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

Ozone.marketplace.MarketplaceUserMenuClient.getInstance = function(widgetEventingController, dashboardContainer) {
    if (Ozone.marketplace.MarketplaceUserMenuClient.instance == null) {
        Ozone.marketplace.MarketplaceUserMenuClient.instance =
            new Ozone.marketplace.MarketplaceUserMenuClient(widgetEventingController, dashboardContainer);
    }

    return Ozone.marketplace.MarketplaceUserMenuClient.instance;
};