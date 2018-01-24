/**
 * @class Ozone.components.Banner
 * @extends Ext.Panel
 */
Ext.define('Ozone.components.banner.Banner', /** @lends Ozone.components.Banner.prototype */ {
    extend: 'Ext.toolbar.Toolbar',
    alias: ['widget.owfbanner', 'widget.Ozone.components.banner.Banner'],

    itemId: 'banner',
    cls: 'banner',

    mixins: {
        focus: 'Ozone.components.focusable.CircularFocus'
    },

    plugins: [
        new Ozone.components.focusable.Focusable(),
        new Ozone.plugins.Banner()
    ],

    state: 'docked',

    dashboardContainer: null,

    toolbarButtons: null,

    noItemsToShow: 2,

    collapseDelay: 5000,

    marketplaceButtonIndex: 3,

    hasMarketplaceButton: false,
    hasMetricButton: false,

    buttonSelectedCls: 'x-btn-default-toolbar-banner-large-selected',

    getAppComponentsBtn: function() {
        if (!this.appComponentsBtn) {
            this.appComponentsBtn = this.getComponent('appComponentsBtn');
        }

        return this.appComponentsBtn;
    },

    enableAppComponentsBtn: function() {
        this.getAppComponentsBtn().removeCls('x-item-disabled x-disabled x-btn-disabled disabled');
        //in case user clicked button while disabled remove its selected class
        this.getAppComponentsBtn().removeCls('x-btn-default-toolbar-banner-large-over x-btn-default-toolbar-banner-large-pressed ');

        if (Ext.getCmp('appComponentsBtnToolTip')) {
            Ext.getCmp('appComponentsBtnToolTip').destroy();
        }

        Ext.create('Ext.tip.ToolTip', {
            id: 'appComponentsBtnToolTip',
            target: this.getAppComponentsBtn().id,
            title: Ozone.layout.tooltipString.addWidgetsTitle,
            html: Ozone.layout.tooltipString.addWidgetsContent,
            anchor: 'bottom',
            anchorToTarget: true,
            anchorOffset: -5,
            mouseOffset: [5, 0],
            width: 500,
            maxWidth: 500
        });
    },

    disableAppComponentsBtn: function() {
        if (this.dashboardContainer.appComponentsView && this.dashboardContainer.appComponentsView.isVisible()) {
            this.dashboardContainer.hideAppComponentsView();
        }

        this.getAppComponentsBtn().addCls('x-item-disabled x-disabled x-btn-disabled disabled');

        if (Ext.getCmp('appComponentsBtnToolTip')) {
            Ext.getCmp('appComponentsBtnToolTip').destroy();
        }

        Ext.create('Ext.tip.ToolTip', {
            id: 'appComponentsBtnToolTip',
            target: this.getAppComponentsBtn().id,
            html: Ozone.layout.tooltipString.addWidgetsContentDisabled,
            anchor: 'bottom',
            anchorToTarget: true,
            anchorOffset: -5,
            mouseOffset: [5, 0],
            width: 500,
            maxWidth: 500
        });
    },

    getUserMenuBtn: function() {
        if (!this.userMenuBtn) {
            this.userMenuBtn = this.getComponent('banner-right-container')
                .getComponent('userMenuBtn');
        }

        return this.userMenuBtn;
    },

    openMarketplaceWindow: function() {
        if (this.hasMarketplaceButton) {
            if (!this.mpWindow) {
                this.mpWindow = Ext.widget('marketplace');
            }

            if (this.mpWindow.isVisible()) {
                this.mpWindow.close();
            } else {
                this.mpWindow.show();
            }
        } else {
            //Reset to enable all hotkeys since show wasn't executed
            Ozone.components.keys.KeyMap.reset();
        }
    },

    openMarketplaceModalWindow: function(btn, e) {
        var me = this;

        if (this.hasMarketplaceButton) {
            if (!this.marketplaceToggle) {
                if (this.marketplaceWidget) {
                    var keyboard = ('keyup' == e.type) ? true : false;
                    e.stopEvent();
                    this.getMarketplaceLauncher().gotoMarketplace(this.marketplaceWidget, keyboard);
                } else {
                    this.getMarketplaceLauncher().gotoMarketplace(this.marketplaceWidget, null);
                }
            } else {
                this.dashboardContainer.activatePreviousDashboard();
                // This will be called as part of the previous dashboard change, but not if the previous
                // dashboard was the Marketplace dashboard, so call it here just to be safe.
                this.clearMarketplaceToggle();

                //Reset to enable all hotkeys since show wasn't executed
                Ozone.components.keys.KeyMap.reset();
            }
        } else {
            //Reset to enable all hotkeys since show wasn't executed
            Ozone.components.keys.KeyMap.reset();
        }
    },

    getMarketplaceLauncher: function() {
        if (!this.mpLauncher) {
            this.mpLauncher = Ext.create('Ozone.components.marketplace.MarketplaceLauncher', {
                dashboardContainer: this.dashboardContainer
            });
            this.mpLauncher.addListener(OWF.Events.Marketplace.OPENED, this.setMarketplaceToggle, this);
        }
        return this.mpLauncher;
    },

    getMarketBtn: function() {
        if (!this.marketBtn) {
            this.marketBtn = this.getComponent('marketBtn');
        }

        return this.marketBtn;
    },

    clearMarketplaceToggle: function() {
        var btn = this.getMarketBtn();

        if (btn) {
            this.marketplaceToggle = false;
            btn.removeCls(this.buttonSelectedCls);
        }
    },

    setMarketplaceToggle: function() {
        var btn = this.getMarketBtn();

        if (btn) {
            this.marketplaceToggle = true;
            btn.addCls(this.buttonSelectedCls);
        }
    },

    openHelpWindow: function() {
        if (!this.helpWindow || this.helpWindow.isDestroyed) {
            this.helpWindow = Ext.widget('helpwindow', {
                constrain: true,
                renderTo: this.dashboardContainer.el,
                dashboardContainer: this.dashboardContainer
            });
        }

        if (this.helpWindow.isVisible()) {
            this.helpWindow.close();
        } else {
            this.dashboardContainer.hideAppComponentsView();
            this.helpWindow.show();
        }
    },

    addKeyBindings: function() {
        Ozone.KeyMap.addBinding([
            Ext.apply(Ozone.components.keys.HotKeys.LAUNCH_MENU, {
                scope: this.dashboardContainer,
                fn: this.dashboardContainer.showAppComponentsView
            }),
            Ext.apply(Ozone.components.keys.HotKeys.DASHBOARD_SWITCHER, {
                scope: this.dashboardContainer,
                fn: this.dashboardContainer.showMyAppsWindowButtonHandler
            }),
            Ext.apply(Ozone.components.keys.HotKeys.MARKETPLACE, {
                scope: this,
                exclusive: this.dashboardContainer.widgetStore.findWidgetsByType('marketplace').length > 1,
                fn: this.openMarketplaceModalWindow
            }),
            Ext.apply(Ozone.components.keys.HotKeys.HELP, {
                scope: this,
                fn: this.openHelpWindow
            })
        ]);
    },

    initComponent: function() {
        var me = this;

        me.addKeyBindings();


        var bannerRightItems = [/*{
            xtype: 'usermenubutton',
            arrowCls: '',
            id: 'userMenuBtn',
            height: '100%',
            user: this.user,
            dashboardContainer: this.dashboardContainer
        }*/{
            xtype: 'usermenubutton',
            id: 'userMenuBtn',
            user: this.user,
            dashboardContainer: this.dashboardContainer
        }];

        //only add the notifications UI if notifications are enabled
        if (Ozone.config.notificationsEnabled) {
            bannerRightItems.unshift({ xtype: 'notificationsbutton' });
        }

        me.items = [];
        me.items.push([{
                xtype: 'button',
                id: 'myAppsBtn',
                text: 'My Apps',
                cls: 'bannerBtn myAppsBtn',
                scale: 'banner-large',
                scope: this.dashboardContainer,
                handler: this.dashboardContainer.showMyAppsWindowButtonHandler,
                listeners: {
                    afterrender: {
                        fn: me.myAppsAfterRender,
                        scope: me
                    }
                }
            }, '-', {
                xtype: 'button',
                text: 'App Components',
                id: 'appComponentsBtn',
                itemId: 'appComponentsBtn',
                // custom scale required for IE in quirks mode dropping all but last class on elements
                // TODO: revisit when a doctype is added
                scale: 'banner-large',
                cls: 'bannerBtn appComponentsBtn',
                enableToggle: true,
                scope: this.dashboardContainer,
                handler: this.dashboardContainer.showAppComponentsView
            },
            '-', {
                xtype: 'button',
                itemId: 'helpBtn',
                cls: 'bannerBtn helpBtn',
                iconCls: 'helpBtnIcon',
                scale: 'banner-large',
                iconAlign: 'top',
                text: null,
                handler: this.openHelpWindow,
                scope: this,
                listeners: {
                    afterrender: {
                        fn: function(btn) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: btn.getEl().id,
                                title: Ozone.layout.tooltipString.helpTitle,
                                html: Ozone.layout.tooltipString.helpContent,
                                anchor: 'bottom',
                                anchorToTarget: true,
                                anchorOffset: -5,
                                mouseOffset: [5, 0],
                                width: 500,
                                maxWidth: 500
                            });
                        }
                    }
                }
            }, '-', {
                xtype: 'component',
                itemId: 'logoImg',
                flex: 6.75,
                cls: 'logo-img'
            }, {
                xtype: 'component',
                flex: 1
            }, {
                xtype: 'container',
                id: 'banner-right-container',
                cls: 'banner-right-container',
                items: bannerRightItems
            }
        ]);

        me.on('afterrender', function(cmp) {
            Ozone.components.focusable.Focusable.clearOutline(this.getEl());
        });

        me.callParent(arguments);

        this.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, this.clearMarketplaceToggle, this);
        this.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, this.blinkMarketBtnAfterDashboardSwitch, this);
    },

    addMarketplaceButton: function(widget) {
        this.marketplaceWidget = widget;

        if (!this.hasMarketplaceButton) {
            var banner = this;

            banner.insert(this.marketplaceButtonIndex, {
                xtype: 'tbseparator',
                itemId: 'mpSeparator'
            });

            banner.insert(this.marketplaceButtonIndex + 1, {
                xtype: 'button',
                itemId: 'marketBtn',
                cls: 'bannerBtn marketBtn',
                scale: 'banner-large',
                text: 'Store',
                scope: this,
                handler: this.openMarketplaceModalWindow,
                listeners: {
                    afterrender: {
                        fn: function(btn) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: btn.getEl().id,
                                title: Ozone.layout.tooltipString.marketplaceWindowTitle,
                                html: Ozone.layout.tooltipString.marketplaceWindowContent,
                                anchor: 'bottom',
                                anchorToTarget: true,
                                anchorOffset: -5,
                                mouseOffset: [5, 0],
                                width: 500,
                                maxWidth: 500
                            });
                        }
                    }
                }
            });

            this.hasMarketplaceButton = true;
        }
    },

    removeMarketplaceButton: function() {
        if (this.hasMarketplaceButton) {
            var marketBtnIndex = this.items.indexOf(this.getComponent('marketBtn'));
            this.remove(marketBtnIndex);
            this.remove(marketBtnIndex - 1); //Remove separator

            this.hasMarketplaceButton = false;
        }
    },

    myAppsAfterRender: function(btn) {
        Ext.create('Ext.tip.ToolTip', {
            target: btn.getEl().id,
            title: Ozone.layout.tooltipString.myAppsWindowTitle,
            html: Ozone.layout.tooltipString.myAppsWindowContent,
            anchor: 'bottom',
            anchorToTarget: true,
            anchorOffset: -5,
            mouseOffset: [5, 0],
            width: 500,
            maxWidth: 500
        });
    },

    blinkMarketBtnAfterDashboardSwitch: function(guid, activeDashboard, previousActiveDashboard) {
        var btn = this.getComponent('marketBtn');

        if (previousActiveDashboard) {
            if (btn && (activeDashboard.configRecord.isMarketplaceDashboard() )) {
                if (!Modernizr.cssanimations) {
                    // wait 6 seconds if dashboard hasn't rendered
                    // otherwise frame animation won't be visible to user
                    setTimeout(function() {
                        btn.blink();
                    }, activeDashboard.rendered ? 0 : 6000);
                } else {
                    btn.blink();
                }
            }
        }
    }
});
