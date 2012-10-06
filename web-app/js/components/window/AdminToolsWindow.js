 Ext.define('Ozone.components.window.AdminToolsWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: ['widget.admintoolswindow', 'widget.Ozone.components.window.AdminToolsWindow'],

    plugins: [
        new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.ADMINISTRATION),
        new Ozone.components.draggable.DraggableWidgetView({
            itemSelector: '.tool',
            dragNodeSelector: '.thumb-wrap'
        })
    ],

    title: 'Administration',
    id: 'admToolsWindow',
    cls: 'system-window settings-window',
    ui: 'system-window',
    iconCls: 'admin-tools-header-icon',
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
    activeDashboard: null,

    store: null,

    initComponent: function() {
        var me = this,
            widgetStore = me.dashboardContainer.widgetStore;
        
        //grab admin widgets to put in window
        me.store = Ext.create('Ext.data.Store', {
            fields: [{name:'name', sortType:Ext.data.SortTypes.asUCString}, 'image', 'guid', 'singleton']
        });
        me.dashboardContainer.activeDashboard.widgetStore.each(function(record) {
            var widgetTypes = record.get('widgetTypes');
            if(widgetTypes.length>0 && widgetTypes[0].name == 'administration' && record.get('definitionVisible')) {
                me.store.add(record);
            }
        });

        me.store.sort('name', 'ASC');
        
        this.view = Ext.create('Ozone.components.view.ToolDataView', {
            store: me.store,
            multiSelect: false,
            singleSelect: true,
            autoScroll: true,
            listeners: {
                refresh: {
                    fn: me.setupModalFocus,
                    scope: me
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

    callBtnHandler: function(btnText, btn, isKeyPress) {
        this.close();
        this.dashboardContainer.launchWidgets(this.store.getAt(this.store.find('name', btnText)), isKeyPress);
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
