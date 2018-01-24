/**
 * A Ext wrapper for the UserMenu Backbone view
 */

Ext.define('Ozone.components.button.UserMenuButtonWrapper', {
    extend: 'Ozone.components.ExtBackboneViewWrapper',
    alias: 'widget.usermenubutton',

    ViewClass: Ozone.views.usermenu.UserMenuButton,

    backboneArgs: null,
    menuCollection: null,
    displayName: 'User',
    adminMenuEnabled: true, //combined with user.isAdmin to determine if the menu option is displayed
    marketplaceAdminMenuEnabled: false,
    metricsMenuEnabled: false,
    marketplaceMenuEnabled: false,

    activeGroupIndex: function () {
        var me = this;

        return function () {
            return me.marketplaceMenuEnabled ? 1 : 0;
        };
    },

    initComponent: function () {
        this.displayName = Ext.htmlEncode(this.user.userRealName);
        this.menuCollection = new Backbone.Collection();
        this.backboneArgs = {
            menuCollection: this.menuCollection,
            displayName: this.displayName,
            activeGroupIndex: this.activeGroupIndex()
        };
        this.marketplaceUserMenuContainer =
            new Ozone.marketplace.MarketplaceUserMenuContainer(Ozone.eventing.Container, this.dashboardContainer);
        this.callParent(arguments);
    },

    onRender: function () {
        this.callParent(arguments);
        this.buildMenuCollection();
    },

    buildMenuCollection: function () {
        var menuGroups = [];

        menuGroups.push(this.owfMenuGroup());

        this.marketplaceMenuEnabled && menuGroups.push(this.marketplaceMenuGroup());

        this.menuCollection.reset(menuGroups);
    },

    enableAdminMenuItem: function () {
        this.adminMenuEnabled = true;
        this.buildMenuCollection();
    },

    disableAdminMenuItem: function () {
        this.adminMenuEnabled = false;
        this.buildMenuCollection();
    },

    enableMetricsMenuItem: function () {
        this.metricsMenuEnabled = true;
        this.buildMenuCollection();
    },

    disableMetricsMenuItem: function () {
        this.metricsMenuEnabled = false;
        this.buildMenuCollection();
    },

    disableMarketplaceMenu: function () {
        this.marketplaceMenuEnabled = false;
        this.buildMenuCollection();
    },

    enableMarketplaceMenu: function () {
        this.marketplaceMenuEnabled = true;
        this.buildMenuCollection();
    },

    enableMarketplaceAdminSubMenu: function () {
        this.marketplaceAdminMenuEnabled = true;
        this.buildMenuCollection();
    },

    disableMarketplaceAdminSubMenu: function () {
        this.marketplaceAdminMenuEnabled = false;
        this.buildMenuCollection();
    },

    profileHandler: function () {
        var me = this;

        return function () {
            if (me.profileWindow == null || me.profileWindow.isDestroyed) {
                me.profileWindow = Ext.widget('profileWindow', {
                    ownerCt: me.dashboardContainer,
                    dashboardContainer: this.dashboardContainer,
                    user: me.user
                });
            }
            me.dashboardContainer.hideAppComponentsView();
            me.profileWindow.show();
        };
    },

    themesHandler: function () {
        var me = this;

        return function () {
            me.dashboardContainer.hideAppComponentsView();
            Ext.create('Ozone.components.theming.ThemeSwitcherWindow', {
                ownerCt: me.dashboardContainer,
                dashboardContainer: me.dashboardContainer,
                height: 650,
                width: 810,
                title: Ozone.layout.ThemeSwitcherWindowConstants.title,
                constrain: true,
                renderTo: !Ext.isIE ? me.dashboardContainer.el : null,
                layout: 'border',
                border: false,
                bodyBorder: false
            }).show();
        };
    },

    administrationHandler: function () {
        var me = this;

        return function () {
            if (!me.administrationWindow || me.administrationWindow.isDestroyed)
                me.administrationWindow = Ext.widget('admintoolswindow', {
                    dashboardContainer: me.dashboardContainer
                });

            if (me.administrationWindow.isVisible()) {
                me.administrationWindow.hide();
            } else {
                me.dashboardContainer.hideAppComponentsView();
                me.administrationWindow.show();
            }
        };
    },

    aboutHandler: function () {
        var me = this,
            aboutWindow;

        return function () {
            if (!aboutWindow || aboutWindow.isDestroyed) {
                aboutWindow = me.buildAboutModalContainer();

                me.loadAboutModalContent(aboutWindow);
            }

            if (!aboutWindow.isVisible()) {
                me.dashboardContainer.hideAppComponentsView();

                aboutWindow.show();
                aboutWindow.center();
            } else {
                aboutWindow.hide();
            }
        };
    },

    buildAboutModalContainer: function() {
        var me = this;

        return Ext.create("Ozone.components.window.ModalWindow", {
            id: 'about-window',
            ui: 'system-window',
            cls: 'system-window',
            modalAutoClose: true,
            preventHeader: false,
            closable: true,
            width: 550,
            draggable: false,
            resizable: false,
            shadow: false,
            dashboardContainer: me.dashboardContainer,
            listeners: {
                show: function() {
                    Ozone.KeyMap.disable();
                },
                hide: function() {
                    Ozone.KeyMap.enable();
                }
            }
        });
    },

    metricsHandler: function () {
        var me = this;

        return function() {
            if (!me.metricWindow || me.metricWindow.isDestroyed) {
                me.metricWindow = Ext.widget('metricwindow', {
                    dashboardContainer: me.dashboardContainer
                });
            }
            if (me.metricWindow.isVisible()) {
                me.metricWindow.close();
            } else {
                me.dashboardContainer.hideAppComponentsView();
                me.metricWindow.show();
            }
        }
    },

    loadAboutModalContent: function(aboutWindow) {
        Ext.Ajax.request({
            url: Ozone.util.contextPath() + "/about",
            success: function(response) {
                var text = response.responseText;

                function setupWindow() {
                    Ext.DomHelper.append(aboutWindow.body, text);
                    aboutWindow.setupFocus();
                    aboutWindow.center();
                }

                if (aboutWindow.isVisible())
                    setupWindow();
                else {
                    aboutWindow.on('show', function() {
                        setupWindow();
                    });
                }
            }
        });
    },

    owfMenuGroup: function () {
        var group = {
            groupName: 'OWF Options',
            items: [{
                itemText: 'User Profile',
                handler: this.profileHandler()
            },{
                itemText: 'Themes',
                handler: this.themesHandler()
            }]
        };

        if(this.metricsMenuEnabled && this.dashboardContainer.hasMetricsWidget()) {
            group.items.push({
                itemText: 'Metrics',
                handler: this.metricsHandler()
            });
        }

        if(this.user.isAdmin && this.adminMenuEnabled) {
            group.items.push({
                itemText: 'Administration',
                handler: this.administrationHandler()
            });
        }

        group.items.push({
            itemText: 'About',
            handler: this.aboutHandler()
        });

        return new Backbone.Model(group);
    },

    marketplaceMenuGroup: function () {
        var me = this,
            group = {
                groupName: 'Store Options',
                items: [{
                    itemText: 'User Profile',
                    handler: function () {
                        me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceUserProfile');
                    }
                },{
                    itemText: 'Create Listing',
                    handler: function () {
                        me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceCreateListing');
                    }
                }]
            };

        if(this.marketplaceAdminMenuEnabled) {
            group.items.push({
                itemText: 'Configuration',
                handler: function () {
                    me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceConfigurationPages');
                }
            });
        }

        return new Backbone.Model(group);
    }
});
