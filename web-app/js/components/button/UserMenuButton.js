//TODO reimplement that class as a proper Ext.menu.Menu, the way it is now the menu this button creates uses a hardcoded
//z-index and does not participate in Ext's ZindexManagement.  This makes it hard to use tooltips on the menu items
Ext.define('Ozone.components.button.UserMenuButton', {
    extend: 'Ext.button.Button',
    alias: ['widget.usermenubutton', 'widget.Ozone.components.button.UserMenuButton'],

    iconAlign: 'right',
    iconCls: 'userMenuIcon',

    menuAlign: 'tr-br',

    isMenuHidden: true,
    hideDelay: 100,
    showDelay: 800,

    scale: 'banner-large',

    initComponent: function() {
        var me = this;

        me.buildDisplayText();
        me.initializeMarketplaceUserMenuClient();
        me.buildMenu();

        me.on('afterrender', me.onAfterRender, me);

        this.callParent(arguments);
    },

    buildDisplayText: function() {
        this.text = Ext.htmlEncode(this.user.userRealName);
    },

    initializeMarketplaceUserMenuClient: function() {
        this.marketplaceUserMenuClient =
            new Ozone.marketplace.MarketplaceUserMenuClient(Ozone.eventing.Container, this.dashboardContainer);
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
                            height: 200,
                            items: me.buildOwfMenuItems()
                        }, {
                            xtype: 'buttongroup',
                            columns: 1,
                            id: 'marketplaceMenu',
                            width: 183,
                            height: 200,
                            items: me.buildMarketplaceMenuItems()
                        }
                    ]
                }
            ]
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
                    height: 25,
                    clickable: true
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
                        me.profileWindow.show();
                    }, me)
                }, {
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
                                aboutWindow.show();
                                aboutWindow.center();
                            } else {
                                aboutWindow.hide();
                            }
                        }
                    })()
                }
            ];

        if (Ozone.config.logoutURL != null) {
            owfMenuItems = me.addOwfLogoutMenuItem(owfMenuItems);
        }

        return owfMenuItems;
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
            }
        ]);

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
                        me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceUserProfile');
                    }, me)
                }, {
                    text: 'Themes',
                    id: 'marketplaceThemes',
                    height: 25,
                    clickable: true,
                    handler: Ext.bind(function(evt, obj) {
                        me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceThemes');
                    }, me)
                }, {
                    text: 'My Listings',
                    id: 'marketplaceMyListings',
                    height: 25,
                    clickable: true,
                    handler: Ext.bind(function(evt, obj) {
                        me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceMyListings');
                    }, me)
                }, {
                    text: 'Create Listing',
                    id: 'marketplaceCreateListing',
                    height: 25,
                    clickable: true,
                    handler: Ext.bind(function(evt, obj) {
                        me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceCreateListing');
                    }, me)
                }
            ];

        if (me.user.isAdmin) {
            marketplaceMenuItems = me.addMarketplaceAdminMenuItems(marketplaceMenuItems);
        }

        return marketplaceMenuItems;
    },

    addMarketplaceAdminMenuItems: function(existingMenuItems) {
        var me = this;

        existingMenuItems.push([{
                spacer: true,
                cls: 'spacer',
                disabled: true
            }, {
                text: 'Configuration Pages',
                id: 'marketplaceConfigurationPages',
                height: 25,
                clickable: true,
                handler: Ext.bind(function(evt, obj) {
                    me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceConfigurationPages');
                }, me)
            }, {
                text: 'Franchise Administration',
                id: 'marketplaceFranchiseAdministration',
                height: 25,
                clickable: true,
                handler: Ext.bind(function(evt, obj) {
                    me.marketplaceUserMenuClient.activateMarketplaceMenuAction('marketplaceFranchiseAdministration');
                }, me)
            }
        ]);

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
        me.mon(me.menu, 'mouseleave', me.hideUserMenu, me);

        Ext.Array.each(me.clickables, function(c) {
            me.mon(c, 'click', me.hideMenu, me);
        });
    },

    showUserMenu: function() {
        var me = this;

        me.isMenuHidden = false;

        if (!me.showTask) {
            me.showTask = Ext.create('Ext.util.DelayedTask', function() {
                me.showMenu();
            });
        }
        me.showTask.delay(Ext.isNumber(me.showDelay) ? me.showDelay : 800, null);
    },

    hideUserMenu: function(menu, event, eventOpts) {
        var me = this;

        me.isMenuHidden = true;

        if (!me.hideTask) {
            me.hideTask = Ext.create('Ext.util.DelayedTask', function() {
                me.hideMenu();
            });
        }
        me.hideTask.delay(Ext.isNumber(me.hideDelay) ? me.hideDelay : 100, null);
    },

    collectAndCacheClickableMenuItems: function(cmp) {
        var me = cmp,
            owfMenu = me.menu.down('#owfMenu'),
            marketplaceMenu = me.menu.down('#marketplaceMenu');

        me.clickables = [];

        var owfClickables = owfMenu.items.filterBy(function(rec, id) {
            return rec.clickable && rec.clickable === true;
        }).items;

        var marketplaceClickables = marketplaceMenu.items.filterBy(function(rec, id) {
            return rec.clickable && rec.clickable === true;
        }).items;

        me.clickables = owfClickables.concat(marketplaceClickables);
    },

    enableMarketplaceMenu: function() {
        var element = this.menu.down("#marketplaceMenu");

        this.menu.width = 368
        element.show();
    },

    disableMarketplaceMenu: function() {
        var element = this.menu.down("#marketplaceMenu");

        this.menu.width = 188;
        element.hide();
    },

    enableMarketplaceAdminSubMenu: function() {
        var m = this.menu.down("#marketplaceMenu"),
            configurationPagesAdminItem = m.down("#marketplaceConfigurationPages"),
            franchiseAdminMenuItem = m.down("#marketplaceFranchiseAdministration");

        configurationPagesAdminItem.enable();
        franchiseAdminMenuItem.enable();
    },

    disableMarketplaceAdminSubMenu: function() {
        var m = this.menu.down("#marketplaceMenu"),
            configurationPagesAdminItem = m.down("#marketplaceConfigurationPages"),
            franchiseAdminMenuItem = m.down("#marketplaceFranchiseAdministration");

        configurationPagesAdminItem.disable();
        franchiseAdminMenuItem.disable();
    }
});