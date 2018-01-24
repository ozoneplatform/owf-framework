//TODO reimplement that class as a proper Ext.menu.Menu, the way it is now the menu this button creates uses a hardcoded
//z-index and does not participate in Ext's ZindexManagement.  This makes it hard to use tooltips on the menu items
/*Ext.define('Ozone.components.button.UserMenuButton', {
    extend: 'Ext.button.Button',
    alias: ['widget.usermenubutton', 'widget.Ozone.components.button.UserMenuButton'],

    iconAlign: 'right',
    iconCls: 'userMenuIcon',

    menuAlign: 'tr-br',

    isMenuShown: false,
    hideDelay: 100,
    showDelay: 800,

    scale: 'banner-large',

    hasAdminBtn: false,

    initComponent: function() {
        var me = this;

        me.buildDisplayText();
        me.initializeMarketplaceUserMenuContainer();
        me.buildMenu();

        me.on('afterrender', me.onAfterRender, me);

        this.callParent(arguments);
    },

    buildDisplayText: function() {
        this.text = Ext.htmlEncode(this.user.userRealName);
    },

    initializeMarketplaceUserMenuContainer: function() {
        this.marketplaceUserMenuContainer =
            new Ozone.marketplace.MarketplaceUserMenuContainer(Ozone.eventing.Container, this.dashboardContainer);
    },

    buildMenu: function() {
        var me = this;

        me.menu = {
            xtype: 'menu',
            id: 'userMenu',
            shadow: false,
            shadowOffset: 0,
            allowOtherMenus: true,
            items: [{
                xtype: 'panel',
                width: 368,
                layout: 'hbox',
                frame: false,
                shadow: false,
                shadowOffset: 0,
                items: [{
                    xtype: 'buttongroup',
                    columns: 1,
                    id: 'owfMenu',
                    width: 193,
                    items: me.buildOwfMenuItems()
                }, {
                    xtype: 'buttongroup',
                    columns: 1,
                    id: 'marketplaceMenu',
                    width: 183,
                    items: me.buildMarketplaceMenuItems()
                }]
            }]
        };
    },

    buildOwfMenuItems: function() {
        var me = this,
            owfMenuItems = [{
                text: 'OWF Options',
                id: 'owfMenuTitle',
                width: '100%',
                height: 28
            }, {
                text: 'Previous Sign In ' + me.user.prettyPrevLogin,
                id: 'prevLogin',
                height: 25
            }, {
                text: 'Profile',
                id: 'profile',
                height: 25,
                clickable: true,
                handler: Ext.bind(function() {
                    if (me.profileWindow == null || me.profileWindow.isDestroyed) {
                        me.profileWindow = Ext.widget('profileWindow', {
                            ownerCt: me.dashboardContainer,
                            dashboardContainer: me.dashboardContainer,
                            user: me.user
                        });
                    }
                    me.dashboardContainer.hideAppComponentsView();
                    me.profileWindow.show();
                }, me)
            }, {
                text: 'Themes',
                id: 'owfThemes',
                height: 25,
                clickable: true,
                handler: Ext.bind(function() {
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
                }, me)
            }];

        if (me.user.isAdmin) {
            me.hasAdminBtn = true;
            owfMenuItems = me.addOwfAdminMenuItem(owfMenuItems);
        }

        if (me.dashboardContainer.hasMetricsWidget()) {
            me.hasMetricBtn = true;
            owfMenuItems = me.addOwfMetricsMenuItem(owfMenuItems);
        }

        owfMenuItems.push([{
            text: 'About',
            id: 'about',
            height: 25,
            clickable: true,
            handler: (function() {
                //save the about window between calls
                var aboutWindow;

                return function toggleAboutWindow() {
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
                }
            })()
        }]);

        if (Ozone.config.logoutURL != null) {
            owfMenuItems = me.addOwfLogoutMenuItem(owfMenuItems);
        }

        return owfMenuItems;
    },

    addOwfAdminMenuItem: function(existingMenuItems) {
        var me = this;

        existingMenuItems.push([{
            text: 'Administration',
            id: 'admin',
            cls: 'admin',
            clickable: true,
            height: 25,
            handler: Ext.bind(function() {
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
            }, me)
        }]);

        return existingMenuItems;
    },

    addOwfMetricsMenuItem: function(existingMenuItems) {
        var me = this;

        existingMenuItems.push([{
            text: 'Metrics',
            id: 'metrics',
            height: 25,
            clickable: true,
            handler: Ext.bind(function() {
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
            }, me)
        }]);

        return existingMenuItems;
    },

    addOwfLogoutMenuItem: function(existingMenuItems) {
        var me = this;

        existingMenuItems.push([{
            spacer: true,
            cls: 'spacer',
            disabled: true,
            height: 25
        }, {
            text: 'Sign Out',
            id: 'logout',
            cls: 'logout',
            clickable: true,
            height: 25,
            handler: me.logout
        }]);

        return existingMenuItems;
    },

    buildMarketplaceMenuItems: function() {
        var me = this,
            marketplaceMenuItems = [{
                text: 'Store Options',
                id: 'marketplaceMenuTitle',
                height: 25
            }, {
                text: 'User Profile',
                id: 'marketplaceUserProfile',
                height: 28,
                clickable: true,
                handler: Ext.bind(function(evt, obj) {
                    me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceUserProfile');
                }, me)
            }, {
                text: 'Themes',
                id: 'marketplaceThemes',
                height: 25,
                clickable: true,
                handler: Ext.bind(function(evt, obj) {
                    me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceThemes');
                }, me)
            }, {
                text: 'Create Listing',
                id: 'marketplaceCreateListing',
                height: 25,
                clickable: true,
                handler: Ext.bind(function(evt, obj) {
                    me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceCreateListing');
                }, me)
            }];

        // Add the Marketplace Admin items even if the current OWF user
        // is not an AML admin - eventing is hooked up for admin item toggling
        // based on the current AML user info passed from Marketplace
        marketplaceMenuItems = me.addMarketplaceAdminMenuItems(marketplaceMenuItems);

        return marketplaceMenuItems;
    },

    addMarketplaceAdminMenuItems: function(existingMenuItems) {
        var me = this;

        existingMenuItems.push([{
            spacer: true,
            cls: 'spacer',
            id: 'marketplaceAdminSpacer',
            disabled: true
        }, {
            text: 'Configuration Pages',
            id: 'marketplaceConfigurationPages',
            height: 25,
            clickable: true,
            handler: Ext.bind(function(evt, obj) {
                me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceConfigurationPages');
            }, me)
        }, {
            text: 'Franchise Administration',
            id: 'marketplaceFranchiseAdministration',
            height: 25,
            clickable: true,
            handler: Ext.bind(function(evt, obj) {
                me.marketplaceUserMenuContainer.activateMarketplaceMenuAction('marketplaceFranchiseAdministration');
            }, me)
        }]);

        return existingMenuItems;
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

    loadAboutModalContent: function(aboutWindow) {
        Ext.Ajax.request({
            url: Ozone.util.contextPath() + "/about.jsp",
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

    logout: function() {
        window.location.href = Ozone.util.contextPath() + Ozone.config.logoutURL;
    },

    onAfterRender: function(cmp) {
        var me = cmp;

        me.collectAndCacheClickableMenuItems(cmp);

        me.on('mouseover', me.showUserMenu, me);
        me.mon(me.menu, 'mouseover', me.showUserMenu, me);

        me.on('mouseout', me.hideUserMenu, me);
        me.mon(me.menu, 'mouseleave', me.hideUserMenu, me);

        Ext.Array.each(me.clickables, function(c) {
            me.mon(c, 'click', function() {
                me.hideUserMenu();
            }, me);
        });
    },

    showUserMenu: function() {
        var me = this;

        // check if there's an active hide task, and cancel if it is active
        if (me.hideTask) {
            me.hideTask.cancel();
        }

        if (!me.showTask) {
            me.showTask = Ext.create('Ext.util.DelayedTask', function() {
                me.showMenu();
                me.isMenuShown = true;
            });
        }

        me.showTask.delay(Ext.isNumber(me.showDelay) ? me.showDelay : 800, null);
    },

    hideUserMenu: function() {
        var me = this;

        // check if there's an active show task, and cancel if it is active
        if (me.showTask) {
            me.showTask.cancel();
        }

        if (!me.hideTask) {
            me.hideTask = Ext.create('Ext.util.DelayedTask', function() {
                me.hideMenu();
                me.isMenuShown = false;
            });
        }

        me.hideTask.delay(Ext.isNumber(me.hideDelay) ? me.hideDelay : 100, null);
    },

    collectAndCacheClickableMenuItems: function(cmp) {
        var me = cmp,
            owfMenu = me.getOwfMenu(),
            marketplaceMenu = me.getMarketplaceMenu();

        me.clickables = [];

        var owfClickables = owfMenu.items.filterBy(function(rec, id) {
            return rec.clickable && rec.clickable === true;
        }).items;

        var marketplaceClickables = marketplaceMenu.items.filterBy(function(rec, id) {
            return rec.clickable && rec.clickable === true;
        }).items;

        me.clickables = owfClickables.concat(marketplaceClickables);
    },

    getMetricsBtn: function() {
        if (!this.metricsBtn) {
            this.metricsBtn = this.menu.down("#metrics");
        }

        return this.metricsBtn;
    },

    getAdminBtn: function() {
        if (!this.adminBtn) {
            this.adminBtn = this.menu.down("#admin");
        }

        return this.adminBtn;
    },

    getOwfMenu: function() {
        if (!this.owfMenu) {
            this.owfMenu = this.menu.down("#owfMenu");
        }

        return this.owfMenu;
    },

    getMarketplaceMenu: function() {
        if (!this.marketplaceMenu) {
            this.marketplaceMenu = this.menu.down("#marketplaceMenu");
        }

        return this.marketplaceMenu;
    },

    enableMetricsMenuItem: function() {
        this.hasMetricBtn && this.getMetricsBtn().enable();
    },

    disableMetricsMenuItem: function() {
        this.hasMetricBtn && this.getMetricsBtn().disable();
    },

    enableAdminMenuItem: function() {
        this.hasAdminBtn && this.getAdminBtn().enable();
    },

    disableAdminMenuItem: function() {
        this.hasAdminBtn && this.getAdminBtn().disable();
    },

    enableMarketplaceMenu: function() {
        var element = this.getMarketplaceMenu();

        this.menu.width = 368;
        element.show();
    },

    disableMarketplaceMenu: function() {
        var element = this.getMarketplaceMenu();

        this.menu.width = 188;
        element.hide();
    },

    enableMarketplaceAdminSubMenu: function() {
        var m = this.getMarketplaceMenu(),
            configurationPagesAdminItem = m.down("#marketplaceConfigurationPages"),
            franchiseAdminMenuItem = m.down("#marketplaceFranchiseAdministration")
            spacer = m.down("#marketplaceAdminSpacer");

        configurationPagesAdminItem.show();
        franchiseAdminMenuItem.show();
        spacer.show();
    },

    disableMarketplaceAdminSubMenu: function() {
        var m = this.getMarketplaceMenu(),
            configurationPagesAdminItem = m.down("#marketplaceConfigurationPages"),
            franchiseAdminMenuItem = m.down("#marketplaceFranchiseAdministration");
        spacer = m.down("#marketplaceAdminSpacer");

        configurationPagesAdminItem.hide();
        franchiseAdminMenuItem.hide();
        spacer.hide();
    }
});*/
