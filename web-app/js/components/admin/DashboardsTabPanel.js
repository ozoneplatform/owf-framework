Ext.define('Ozone.components.admin.DashboardsTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboardstabpanel'],
    
    layout: {
        type: 'fit'
    },
    preventHeader: true,
    border: true,
    padding: 5,
    initDisabled: true,
    
    widgetLauncher: null,
    widgetEventingController: null,
    widgetStateHandler: null,
    isGroupDashboard: false,

    //The editor widget the tab is open in
    editPanel: null,
    
    initComponent: function() {
        
        var self = this;

        Ext.apply(this,{
        items: [{
            xtype: 'dashboardsgrid',
            itemId: 'dashboardsgrid',
            preventHeader: true,
            border: false,
            listeners: {
              itemdblclick: {
                fn: this.doEdit,
                scope: this
              }
            }
        }],

        dockedItems: [{
                xtype: 'toolbar',
                itemId: 'tbDashboardsGridHdr',
                cls: 'tbDashboardsGridHdr',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    cls: 'tbDashboardsGridHdr',
                    itemId: 'lblDashboardsGrid',
                    text:'Dashboards'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('dashboardsgrid');
                                if (grid != null) {
                                    grid.applyFilter(value, ['name']);
                                }
                            },
                            scope: this
                        }
                    }

                }]
            }]
        });

        this.on({
        //setup panel on the first activate
        'activate': {
            scope: this,
            fn: function(cmp, opts) {
                var grid = cmp.getComponent('dashboardsgrid');
                //var tbf = cmp.getDockedComponent('tbDashboardsGridFtr');
                var tb = cmp.getDockedComponent('tbDashboardsGridHdr');
                var lbl = tb.getComponent('lblDashboardsGrid');
                var comp = cmp.ownerCt;
                var compId = -1;
                // Create modified widget store and bind to grid
                grid.setStore(Ext.create('Ozone.data.stores.AdminDashboardStore', cmp.storeCfg));
                var refreshPagingToolbar = function(operation) {
                    if (operation.action == "destroy" || operation.action == "create") {
                        var ptb = grid.getBottomToolbar();
                        ptb.doRefresh();
                    }
                };
                grid.store.proxy.callback = refreshPagingToolbar;

                grid.store.on('write', function(store, action, result, records, rs) {
                    //Refresh whatever manager launched this editor widget
                    OWF.Eventing.publish(this.ownerCt.channel, {
                        action: action,
                        domain: this.ownerCt.domain,
                        records: result
                    });
                }, this);

                if (grid && comp) {
                    comp.record = comp.recordId > -1 ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                    compId = comp.recordId > -1 ? comp.recordId : -1;
                    var p = {
                        tab: 'dashboards',
                        adminEnabled: true
                    };
                    p[cmp.componentId] = compId;
                    grid.setBaseParams(p);
                }
            },
            single: true
        }

        });

        //reload store everytime the tab is activated
        this.on({
            activate: {
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('dashboardsgrid');
                    var store = grid.getStore();

                    // Set the title
                    if (cmp.ownerCt.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(cmp.ownerCt.record.get('title'), 25));
                        if(!titleText) {
                            titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(cmp.ownerCt.record.get('name'), 25)) || 'Dashboards';
                        }
                        var title = this.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblDashboardsGrid');
                        title.setText(titleText);
                    }

                    if (store) {
                        store.load({
                            params: {
                                offset: 0,
                                max: store.pageSize
                            }
                        });
                    }
                },
                scope: this
            }
        });

        OWF.Preferences.getUserPreference({
            namespace: 'owf.admin.DashboardEditCopy',
            name: 'guid_to_launch',
            onSuccess: function(result) {
                self.guid_DashboardEditCopyWidget = result.value;
            },
            onFailure: function(err) { /* No op */
                self.editPanel.showAlert('Preferences Error', 'Error looking up Dashboard Editor: ' + err);
            }
        });

        this.callParent();
    },

    launchFailedHandler: function(response) {
        if (response.error) {
            this.editPanel.showAlert('Launch Error', 'Dashboard Editor Launch Failed: ' + response.message);
        }
    },

    onStoreException: function(proxy, response, operation, eOpts) {
        var decodedResponse;
        try {
            decodedResponse = Ext.JSON.decode(response);
        }
        catch (e) {
            decodedResponse = response;
        }

        decodedResponse && this.editPanel.showAlert('Server Error', decodedResponse);
    },

    onAddClicked: function () {
        var win = Ext.widget('admineditoraddwindow', {
            addType: 'Dashboard',
            itemName: this.ownerCt.record.get('displayName'),
            editor: this.editor,
            focusOnClose: this.down(),
            existingItemsStore: this.getComponent('dashboardsgrid').getStore(),
            grid: Ext.widget('dashboardsgrid', {
                itemId: 'dashboardsaddgrid',
                border: false,
                enableColumnHide: false,
                sortableColumns: false,
                listeners: {
                    render: {
                        fn: function(cmp) {
                            cmp.setBaseParams({
                                adminEnabled: true,
                                isGroupDashboard: true,
                                isStackDashboard: false
                            });
                        },
                        scope: this
                    }
                }
            })
        });
        win.show();
    },
    
    doEdit: function(cmp, record, item, index, e) {
        var grid = this.getComponent('dashboardsgrid');
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var id = records[i].data.guid;//From Id property of Dashboard Model
                var dataString = Ozone.util.toString({
                    id: id,
                    copyFlag: false,
                    isGroupDashboard: this.isGroupDashboard
                });

                OWF.Launcher.launch({
                    guid: this.guid_DashboardEditCopyWidget,
                    title: '$1 - ' + records[i].get('name'),
                    titleRegex: /(.*)/,
                    launchOnlyIfClosed: false,
                    data: dataString
                }, this.launchFailedHandler);
            }
        }
        else {
            this.editPanel.showAlert("Error", "You must select at least one dashboard to edit");
        }
    },

    doDelete: function(button, e) {
        var grid = this.getComponent('dashboardsgrid');
        var store = grid.getStore();
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            store.remove(records);
            store.save();
        } else {
            this.editPanel.showAlert("Error", "You must select at least one dashboard to remove.");
        }
    }
});
