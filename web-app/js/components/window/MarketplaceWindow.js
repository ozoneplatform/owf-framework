 Ext.define('Ozone.components.window.MarketplaceWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: ['widget.marketplacewindow', 'widget.Ozone.components.window.MarketplaceWindow'],

    title: 'Marketplaces',
    id: 'marketplaceWindow',
    cls: 'system-window settings-window',
    ui: 'system-window',
    iconCls: 'marketplace-header-icon',
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
    
    dashboardContainer: null,

    plugins: [
        new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.MARKETPLACE),
        new Ozone.components.draggable.DraggableWidgetView({
            itemSelector: '.tool',
            dragNodeSelector: '.thumb-wrap'
        })
    ],

    store: null,

    initComponent: function() {
        var me = this;
        //grab admin widgets to put in window
        me.store = Ext.create('Ext.data.Store', {
            fields: [{name:'name', sortType:Ext.data.SortTypes.asUCString}, 'image', 'caption', 'guid', 'singleton']
        });
        me.dashboardContainer.activeDashboard.widgetStore.each(function(record) {
            var widgetTypes = record.get('widgetTypes');
            if(widgetTypes.length>0 && widgetTypes[0].name == 'marketplace' && record.get('definitionVisible')) {
                me.store.add(record);
            }
        });

        me.store.sort('name', 'ASC');
        
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
            var node = view.getNode(0);
            if (node)
                Ext.get(node).focus();
        }, 100);
    },

    callBtnHandler: function(btnText, btn, isKeyPress) {
        this.close();
        this.launchMarketplaceWidget(this.store.getAt(this.store.find('name', btnText)), isKeyPress);
    },

     launchMarketplaceWidget: function(marketplaceWidget, keyboard) {
         var me = this;
         var dashboardStore = me.dashboardContainer.dashboardStore;
         var dashboardInd = dashboardStore.findExact('name', 'Marketplace');
         var dashboard;
         if (dashboardInd >= 0) {
             dashboard = dashboardStore.getAt(dashboardInd);
             if (dashboard.data.guid != me.dashboardContainer.activeDashboard.guid) {
                 // Go to the Marketplace dashboard and launch the Marketplace widget (this is a no-op if the widget is already running
                 me.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, function() { me.dashboardContainer.launchWidgets(marketplaceWidget, keyboard);  }, undefined, {single: true});
                 me.dashboardContainer.activateDashboard(dashboard.data.guid);
             } else {
                 // If we're already on the right dashboard, just launch the Marketplace widget
                 me.dashboardContainer.launchWidgets(marketplaceWidget, keyboard);
             }
         } else {
             // If the Marketplace dashboard doesn't exist, create it and then launch the Marketplace widget
             dashboard = Ext.create('Ozone.data.Dashboard', {
                 name: "Marketplace",
                 layoutConfig : {
                     xtype: 'container',
                     flex: 1,
                     height: '100%',
                     items: [],
                     paneType: 'fitpane',
                     widgets: []
                 }
             });
             me.dashboardContainer.saveDashboard(dashboard.data, 'create', function() {

             var guid = dashboard.get('guid');
             me.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, function() { me.dashboardContainer.launchWidgets(marketplaceWidget, keyboard);  }, undefined, {single: true});
             me.dashboardContainer.activateDashboard(guid);
             });
         }
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
