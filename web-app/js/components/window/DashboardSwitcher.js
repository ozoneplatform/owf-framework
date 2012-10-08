Ext.define('Ozone.components.window.DashboardSwitcher', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.dashboardswitcher',
    
    closeAction: 'hide',
    modal: true,
    modalAutoClose: true,
    shadow: false,
    layout: 'auto',
    ui: 'system-window',
    store: null,
    closable: false,
    title: 'Dashboards',
    iconCls: 'dashboard-switcher-header-icon',
    cls: 'system-window',
    resizable: false,
    draggable: false,

    viewId: 'dashboard-switcher-dashboard-view',

    dashboardContainer: null,

    //dashboard unit sizes
    dashboardItemHeight: 0,
    dashboardItemWidth: 0,

    //size of switcher in dashboard units
    minDashboardsWidth: 3,
    maxDashboardsWidth: 5,
    maxDashboardsHeight: 3,

    storeLengthChanged: true,
    
    initComponent: function() {
        //this may need to move into an onShow or something.
        var me = this;
        var numCols = Math.max(this.minDashboardsWidth,
                        Math.min(this.maxDashboardsWidth, this.dashboardStore.count()));
        var numRows = Math.min(this.maxDashboardsHeight,Math.floor((this.dashboardStore.count()-1)/numCols) + 1);
        
        this.view = Ext.create("Ozone.components.focusable.FocusableView", {
            itemId: this.viewId,
            itemSelector: '.dashboard',
            overItemCls: 'dashboard-over',
            selectedItemCls: 'dashboard-selected',
            trackOver: true,
            singleSelect: true,
            store: this.dashboardStore,
            autoScroll: true,
            // width:numCols*this.dashboardItemWidth+20,
            // height:numRows*this.dashboardItemHeight,
            tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="dashboard" tabindex="0" data-qtip="{[Ext.htmlEncode(Ext.htmlEncode(values.name))]}">',
                            '<div class="thumb-wrap">',
                                '<div class="thumb {layout}">',
                                '</div>',
                            '</div>',
                            '<div class="dashboard-name">',
                                '{[this.encodeAndEllipsize(values.name)]}',
                            '</div>',
                            //'<tpl if="groups.length &gt; 0">',
                            //    '<div class="dashboard-groups">',
                            //        '{[this.getGroupText(values.groups)]}',
                            //    '</div>',
                            //'</tpl>',
                        '</div>',
                    '</tpl>'
                ,
                {
                    compiled: true,
                    getGroupText: function(groups) {
                        var text = "";
                        text += groups[0].name;
                        if(groups.length>1) {
                            text += " (+" + (groups.length-1) + " others)";
                        }
                        return text;
                    },
                    encodeAndEllipsize: function(str) {
                        //html encode the result since ellipses are special characters
                        return Ext.util.Format.htmlEncode(
                            Ext.Array.map (
                                //get an array containing the first word of rowData.name as one elem, and the rest of name as another
                                Ext.Array.erase (/^([\S]+)\s*(.*)?/.exec(Ext.String.trim(str)), 0, 1),
                                function(it) {
                                    //for each elem in the array, truncate it with an ellipsis if it is longer than 11 characters
                                    return Ext.util.Format.ellipsis(it, 14);
                                }
                            //join the array back together with spaces
                            ).join(' ')
                        );
                    }
                }
            ),
            listeners: {
                itemclick: {
                    fn: this.itemClick,
                    scope: this
                },
                itemkeydown: {
                    fn: this.itemKeyDown,
                    scope: this
                },
                add: {
                    fn: this.onAddRemove,
                    scope: this
                },
                remove: {
                    fn: this.onAddRemove,
                    scope: this
                },
                refresh: {
                    fn: this.reSetupFocus,
                    scope: this
                },
                viewready: {
                    fn: this.focusSelectedDashboard,
                    scope: this,
                    single: true
                }
            }
        });

        this.items = [this.view];
        
        this.callParent(arguments);

        this.on({
            beforeshow: {
                fn: function(cmp) {
                    if(this.dashboardItemWidth > 0 && this.dashboardItemHeight > 0)
                        this.updateWindowSize();
                },
                scope:this
            },
            resize: {
                fn: function(cmp) {
                    if(this.isVisible()) {
                        this.center();
                    }
                },
                scope: this
            },
            show: {
                fn: this.focusSelectedDashboard,
                scope: this
            }
        });

        this.on({
            show: this.updateWindowSize, 
            scope: this, 
            delay: 1 //for IE7
        });
    },

    onAddRemove: function() {
        this.storeLengthChanged = true;
    },

    itemClick: function(view, record, item, index, event, eOpts) {
        this.activateDashboard(record.get('guid'));
    },

    itemKeyDown: function(view, record, item, index, event, eOpts) {
        switch (event.getKey()) {
            case event.ENTER:
            case event.SPACE:
                event.preventDefault();
                this.activateDashboard(record.get('guid'));
        }
    },

    activateDashboard: function (guid) {
        this.close();
        this.dashboardContainer.activateDashboard(guid);
    },

    refresh: function() {
        if (this.rendered) {
            this.view.refresh();
        }
    },
    
    reSetupFocus: function() {
        var widgetEls = this.view.getEl().query(this.view.itemSelector),
        len = widgetEls.length;
        if(len > 0) {
            this.setupFocus(Ext.get(widgetEls[0]), Ext.get(widgetEls[len-1]));
        }
    },

    focusSelectedDashboard: function() {
        var selectedDB = this.view.getNode(this.view.store.getById(this.dashboardContainer.activeDashboard.id));
        var me = this;

        if(selectedDB) {
            setTimeout(function() {
                try {   
                    selectedDB.focus();
                    me.reSetupFocus();
                }
                catch(e) {}
            }, 100);
        }
    },

    updateWindowSize: function() {
        var newWidth,
            newHeight,
            item = this.view.getNode(0);
        
        if(!item)
            return;
        
        var itemEl = Ext.get(item),
            windowEl = this.getEl(),
            widthMargin = itemEl.getMargin('lr'),
            heightMargin = itemEl.getMargin('tb'),
            totalDashboards = this.view.getStore().getCount(),
            dashboardInRow = 0;

        this.dashboardItemWidth = itemEl.getWidth();
        this.dashboardItemHeight = itemEl.getHeight();

        if(totalDashboards < this.minDashboardsWidth) {
            dashboardInRow = this.minDashboardsWidth;
        }
        else if (totalDashboards > this.maxDashboardsWidth) {
            dashboardInRow = this.maxDashboardsWidth;
        }
        else {
            dashboardInRow = totalDashboards;
        }

        newWidth = (this.dashboardItemWidth + widthMargin) * dashboardInRow;

        if(totalDashboards > this.maxDashboardsWidth * this.maxDashboardsHeight) {
            // add 30 to accomodate for scrollbar
            newWidth += 30;
        }
        if(totalDashboards > this.maxDashboardsWidth * this.maxDashboardsHeight) {
            newHeight = (this.dashboardItemHeight + heightMargin) * this.maxDashboardsHeight;
        }

        //update the layout
        this.view.doComponentLayout(newWidth, newHeight);
    }
});
