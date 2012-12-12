Ext.define('Ozone.components.admin.grid.WidgetsTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.widgetstabpanel'],

    //The editor widget the tab is open in
    editPanel: null,
    
    initComponent: function() {
        var me = this;
        
        Ext.apply(this, {

            layout: {
                type: 'fit'
            },
            preventHeader: true,
            border: true,
            padding: 5,
    
            //gridWidgets: null,
            widgetLauncher: null,
            widgetEventingController: null,
            widgetStateHandler: null,
            initDisabled: true,
    
            items: [{
                xtype: 'widgetsgrid',
                itemId: 'widgetsGrid',
                preventHeader: true,
                border: false
            }],

            dockedItems: [{
                xtype: 'toolbar',
                itemId: 'tbWidgetsGridHdr',
                cls: 'tbWidgetsGridHdr',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    itemId: 'lblWidgetsGrid',
                    cls: 'tbWidgetsGridHdr',
                    text: 'Widgets'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('widgetsGrid');
                                if (grid != null) {
                                    grid.applyFilter(value, ['displayName', 'universalName']);
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }, {
                xtype: 'toolbar',
                itemId: 'tbWidgetsGridFtr',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 80
                },
                items: [{
                    xtype: 'button',
                    itemId: 'btnAdd',
                    text: 'Add',
                    handler: function() {
                      this.onAddClicked();
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    itemId: 'btnRemove',
                    text: 'Remove',
                    handler: function() {
                      var grid = this.getComponent('widgetsGrid');
                      var store = grid.store;
                      var records = grid.getSelectionModel().getSelection();
                      if (records && records.length > 0) {
                          store.remove(records);
                          store.save();
                      } else {
                          me.editPanel.showAlert("Error", "You must select at least one widget to remove.");
                      }
                    },
                    scope: this
                }]
            }]
        });
        
        this.on({
            activate: {
                scope: this,
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('widgetsGrid');
                    //var tbf = cmp.getDockedComponent('tbWidgetsGridFtr');
                    var tb = cmp.getDockedComponent('tbWidgetsGridHdr');
                    var lbl = tb.getComponent('lblWidgetsGrid');
                    var comp = cmp.ownerCt;
                    var compId = -1;
                    
                    OWF.Preferences.getUserPreference({
                        namespace: 'owf.admin.WidgetEditCopy',
                        name: 'guid_to_launch',
                        onSuccess: function(result) {
                            cmp.guid_EditCopyWidget = result.value;
                        },
                        onFailure: function(err) { /* No op */
                            me.editPanel.showAlert('Preferences Error', 'Error looking up Widget Editor: ' + err);
                        }
                    });
    
                    // Create modified widget store and bind to grid
                    grid.setStore(Ext.create('Ozone.data.stores.AdminWidgetStore', cmp.storeCfg));
                    var refreshPagingToolbar = function(operation) {
                        cmp.refreshWidgetLaunchMenu();
                        if (operation.action == "destroy" || operation.action == "create") {
                            var ptb = grid.getBottomToolbar();
                            ptb.doRefresh();
                        }
                    };
                    grid.store.proxy.callback = refreshPagingToolbar;

                    grid.store.on('write', function(store, action, result, records, rs) {
                        //Refresh whatever manager lauched this editor widget
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
                            tab: 'widgets'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
                    }
                    
                    // Set the title
                    if (comp.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('title'), 25));
                        if(!titleText) {
                            titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('name'), 25)) || 'Widgets';
                        }
                        lbl.setText(titleText);
                    }
                    
                    if (grid != null) {
                        grid.on({
                            itemdblclick: {
                                fn: function() {
                                    var records = grid.getSelectionModel().getSelection();
                                    if (records && records.length > 0) {
                                        for (var i = 0; i < records.length; i++) {
                                            cmp.doEdit(records[i].data.id, records[i].data.name);
                                        }
                                    }
                                    else {
                                        me.editPanel.showAlert("Error", "You must select at least one widget to edit.");
                                    }
                                },
                                scope: this
                            }
                        });
                    }
                },
                single: true
            }
        });
        
        this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

        this.on({
           activate: {
             fn: function() {
               var grid = this.getComponent('widgetsGrid');
               var store = grid.getStore();

               if (store) {
                    /*
                    store.on(
                        'datachanged',
                        function(store, opts) {
                            if (store && lbl) {
                                var s = '<span class="heading-bold">- Widgets</span> <span class="heading">(' + store.getCount() + ' Results';
                                if (this.lastAction) {
                                    s += ', ' + this.lastAction;
                                }
                                s += ')</span>';
                                lbl.setText(s);
                            }
                        }
                    );
                    */

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

        this.callParent(arguments);
    },
    
    refreshWidgetLaunchMenu: function() {
        if (this.widgetStateHandler) {
            this.widgetStateHandler.handleWidgetRequest({
                fn: 'refreshWidgetLaunchMenu'
            });
        }
    },
    
    doEdit: function(id, title) {
        var me = this;
        var dataString = Ozone.util.toString({
            id: id,
            copyFlag: false
        });

        OWF.Launcher.launch({
            title: '$1 - ' + title,
            titleRegex: /(.*)/,
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
            data: dataString
        }, function(response) {
            if (response.error) {
                me.editPanel.showAlert('Launch Error', 'Widget Editor Launch Failed: ' + response.message);
            }
        });
    },
    
    onAddClicked: function(button, e) {
        var win = Ext.widget('admineditoraddwindow', {
            addType: 'Widget',
            itemName: this.ownerCt.record.get('title'),
            editor: this.editor,
            focusOnClose: this.down(),
            existingItemsStore: this.getComponent('widgetsGrid').getStore(),
            searchFields: ['displayName'],
            grid: Ext.widget('widgetsgrid', {
                itemId: 'widgetsaddgrid',
                border: false,
                enableColumnHide: false,
                sortableColumns: false
            })
        });
        win.show();
    }
});