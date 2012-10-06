Ext.define('Ozone.components.SettingsWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: ['widget.settingswindow', 'widget.Ozone.components.SettingsWindow'],

    title: 'Settings',
    id: 'settingsWindow',
    cls: 'system-window settings-window',
    iconCls: 'settings-header-icon',
    ui: 'system-window',
    layout: 'auto',
    closable: false,
    resizable: false,
    draggable: false,
    modal: true,
    modalAutoClose: true,
    shadow: false,
    autoScroll: false,
    
    minToolsInRow: 3,
    maxToolsInRow: 5,
    
    items: [],

    plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.SETTINGS),

    store: Ext.create('Ext.data.Store', {
        fields: ['name', 'image', 'caption'],
        data: [
            {name: 'Dashboards', image: 'themes/common/images/settings/DashboardsIcon.png'},
            {name: 'Themes', image: 'themes/common/images/settings/ThemeIcon.png'},
            {name: 'Widgets', image: 'themes/common/images/settings/WidgetsIcon.png'}
        ]
    }),

    initComponent: function() {
        
        var me = this;
        
        this.view = Ext.create('Ozone.components.view.ToolDataView', {
            store: this.store,
            multiSelect: false,
            singleSelect: true,
            autoScroll: true,
            listeners: {
                refresh: {
                    fn: this.setupModalFocus,
                    scope: this
                },
                viewready: {
                    fn: this.updateWindowSize,
                    scope: this,
                    single: true
                }
            }
        });

        this.items = [this.view];
        
        this.on('resize', this.center, this);

        this.callParent(arguments);
    },

    setupModalFocus: function() {
        var view = this.down('tooldataview');
        this.setupFocus(Ext.get(view.getNode(0)), Ext.get(view.getNode(view.store.getCount()-1)));
        
        Ext.defer(function() {
            Ext.get(view.getNode(0)).focus();
        }, 100);
    },
    
    openDashboardMgr: function() {
        var winId = "user-manage-dashboards";
        var win = Ext.getCmp(winId);
        if(win) {
            win.show();
            return;
        }

        Ext.create('Ozone.components.window.DashboardsManager', {
            ownerCt: this.dashboardContainer,
            dashboardContainer: this.dashboardContainer,
            id: winId,
            itemId: winId,
            modal: true,
            border: false,
            bodyBorder: false
        }).show();
    },

    callBtnHandler: function(btnText, btn) {
        switch(btnText){
            case 'Dashboards':
                this.mngDashBtnHandler(btn);
                break;
            case 'Themes':
                this.themeBtnHandler(btn);
                break;
            case 'Widgets':
                this.widgetsBtnHandler(btn);
                break;
        }

        //moved the close after the open of the
        //other window to prevent focus from sometimes
        //going to a button widget in FF 3.6
        this.close();
    },

    mngDashBtnHandler: function(btn) {
        var activeDash = Ext.getCmp(this.dashboardContainer.activeDashboard.id);
        if (activeDash) {
            // activeDash.on({
            //     serversave: {
            //         fn: function(dash, success) {
            //             if (success) {
            //                 this.openDashboardMgr();
            //             }
            //         },
            //         scope: this,
            //         single: true
            //     }
            // });
            if (activeDash.hasChanged) {
                // Dashboard has changed, save before opening the dashboard manager
                activeDash.saveToServer();
            }
            this.openDashboardMgr();
        }
    },

    themeBtnHandler: function(btn) {
        Ext.create('Ozone.components.theming.ThemeSwitcherWindow', {
            ownerCt: this.dashboardContainer,
            dashboardContainer: this.dashboardContainer,
            height: 650,
            width : 810,
            title : Ozone.layout.ThemeSwitcherWindowConstants.title,
            modal: true,
            
            layout: 'border',
            border: false,
            bodyBorder: false
        }).show();
    },

    widgetsBtnHandler: function(btn) {
        
        var manageWidgetsWindowId = 'manageWidgetsWindowId';
        var win = Ext.getCmp(manageWidgetsWindowId);
        if(!win){
            var manageWidgetsWindowConfig = {
                id: manageWidgetsWindowId,
                title: Ozone.layout.tooltipString.carouselManageWidgetsTitle,
                ownerCt: this.dashboardContainer,
                dashboardContainer: this.dashboardContainer,
                constrain: Ext.isIE,
                constrainHeader: true,
                cls: "manageContainer",
                iconCls: 'manageWidgetsContainer-header-icon',
                draggable: true,
                items: [{
                    xtype: 'owfManageWidgetsContainer',
                    dashboardContainer: this.dashboardContainer,
                    winId: manageWidgetsWindowId
                }],
                width: 593,
                height: 425
            };
            win = Ext.widget('managerwindow', manageWidgetsWindowConfig);
        }
        win.on('beforeclose', function(cmp) {
            cmp.destroy();
        });
        win.show();
        
        Ext.defer(win.focus, 500, win);
    },
    
    updateWindowSize: function(item) {
        var toolWidth, newWidth, tool;
        
        tool = item.getNode(0);

        if(!tool)
            return;
        
        var toolEl = Ext.get(tool),
            margin = toolEl.getMargin('r'),
            totalTools = item.getStore().getCount(),
            toolsInRow = 0;

        toolWidth = toolEl.getWidth();

        if (totalTools < this.minToolsInRow) {
            toolsInRow = this.minToolsInRow;
        } else if (totalTools > this.maxToolsInRow) {
            toolsInRow = this.maxToolsInRow;
        } else {
            toolsInRow = totalTools;
        }

        newWidth = (toolWidth + margin) * toolsInRow;

        this.view.doComponentLayout(newWidth);
    }
});
