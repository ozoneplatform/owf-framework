/**
 * This class is component which manages two widgetview components one for widgetdefinitions and the other for open widgets
 */
Ext.define('Ozone.components.launchMenu.WidgetViewContainer', {
    extend:'Ext.Container',
    alias:'widget.widgetviewcontainer',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    showOpenedWidgets:false,
    iconOrGrid: true,
    initComponent:function () {
        //var me = this;
        Ext.apply(this, {
            items:[
                {
                    xtype: 'component',
                    itemId:'openedwidgetsviewtitle',
                    cls: 'title',
                    //todo remove this hardcoded style
//                    style: 'font-weight:normal;font-size:16px;color:#DDF891;padding:10px;',
                    html: 'Current Instances',
                    hidden:!this.showOpenedWidgets

                },
                {
                    xtype:'widgetview',
                    itemId:'openedwidgetsview',
                    flex:1,
                    hidden:!this.showOpenedWidgets,
                    widgetStore:this.openedWidgetStore,
                    disableDragAndDrop: true,
                    disableDragLaunching: true,
                    alreadyOpenedWidget: true
                },
                {
                    xtype: 'component',
                    itemId:'widgetsviewtitle',
                    cls: 'title',
                    //todo remove this hardcoded style
//                    style: 'font-weight:normal;font-size:16px;color:#DDF891;padding:10px;',
                    html: 'Open a new Instance',
                    hidden:!this.showOpenedWidgets
                },
                {
                    xtype:'widgetview',
                    itemId:'widgetsview',
                    flex:1,
                    widgetStore:this.widgetStore
                }
            ]
        });

        this.callParent(arguments);

        this.on('itemclick', this.frameClickedWidgetInstance);

//        this.addEvents(['dragStarted', 'dragEnd', 'invalidDrop', 'itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);
//        this.enableBubble(['dragStarted', 'dragEnd', 'invalidDrop', 'itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);
    },

    showIconOrGridView:function (iconOrGrid) {
        var flag = false,
            widgetsView = this.getComponent('widgetsview'),
            openedWidgetsView = this.getComponent('openedwidgetsview');

        if (iconOrGrid != null) {
            flag = iconOrGrid;
            this.iconOrGrid = iconOrGrid;
        }
        else {
            flag = this.iconOrGrid;
        }

        if (flag) {
            widgetsView.getLayout().setActiveItem('view');
            if (openedWidgetsView.isVisible()) {
              openedWidgetsView.getLayout().setActiveItem('view');
            }
        }
        else {
            widgetsView.getLayout().setActiveItem('grid');
            if (openedWidgetsView.isVisible()) {
              openedWidgetsView.getLayout().setActiveItem('grid');
            }
        }
    },

    showOpenedWidgetsView:function (showHide) {
        this.showOpenedWidgets = showHide;
        if (this.showOpenedWidgets && this.openedWidgetStore.getCount() > 0) {
            this.getComponent('openedwidgetsview').show();
            this.getComponent('widgetsviewtitle').show();
            this.getComponent('openedwidgetsviewtitle').show();
            this.showIconOrGridView();
        }
        else {
            this.getComponent('openedwidgetsview').hide();
            this.getComponent('widgetsviewtitle').hide();
            this.getComponent('openedwidgetsviewtitle').hide();
        }
    },

    setOpenedWidgets:function (store) {
        var openedStore = this.openedWidgetStore;

        openedStore.removeAll();
        openedStore.add(store.getRange());
        openedStore.sort('name','ASC');

    },

    setItemSize:function (sizeObj) {
        var widgetsview = this.getComponent('widgetsview').down('#view');
        var openedwidgetsview = this.getComponent('openedwidgetsview').down('#view');

        widgetsview.setItemSize(sizeObj);
        openedwidgetsview.setItemSize(sizeObj);
    },

    deselectAll:function (suppressEvent) {
        var widgetsview = this.getComponent('widgetsview').down('#view');
        var openedwidgetsview = this.getComponent('openedwidgetsview').down('#view');
        var widgetgrid = this.getComponent('widgetsview').down('#grid');
        var openedwidgetsgrid = this.getComponent('openedwidgetsview').down('#grid');

        widgetsview.getSelectionModel().deselectAll(suppressEvent);
        openedwidgetsview.getSelectionModel().deselectAll(suppressEvent);
        widgetgrid.getSelectionModel().deselectAll(suppressEvent);
        openedwidgetsgrid.getSelectionModel().deselectAll(suppressEvent);
    },

    getFirstActiveViewOrGrid: function() {
        var openedwidgets = this.getComponent('openedwidgetsview');
        var widgets = this.getComponent('widgetsview');
        var returnValue = null;

        if (openedwidgets.isVisible()) {
            returnValue = openedwidgets.getLayout().getActiveItem();
        }
        else {
            returnValue = widgets.getLayout().getActiveItem();
        }

        return returnValue;
    },

    frameClickedWidgetInstance: function (view, record) {
        var uniqueId = record.get('uniqueId');
        if(uniqueId) {
            Ext.getCmp(uniqueId).el.frame('#f00');
        }
    }
});
