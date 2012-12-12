Ext.define('Ozone.components.admin.StacksTabPanel',{
    extend: 'Ext.panel.Panel',
    alias: ['widget.stackstabpanel','widget.Ozone.components.admin.StacksTabPanel'],

    //The editor widget the tab is open in
    editPanel: null,
    
    initComponent: function () {
        var self = this;
        Ext.apply(this, {
            layout: 'fit',
            preventHeader:true,
            border:true,
            initDisabled: true,
            widgetLauncher: null,
            widgetEventingController: null,
            widgetStateHandler: null,
            items:[{
                xtype:'stacksgrid',
                itemId:'stacksgrid',
                preventHeader:true,
                border:false
            }],
            dockedItems:[{
                xtype:'toolbar',
                itemId: 'tbStacksGridHdr',
                cls: 'tbStacksGridHdr',
                dock:'top',
                items:[{
                    xtype:'tbtext',
                    itemId: 'lblStacksGrid',
                    cls: 'tbStacksGridHdr',
                    text:'Stacks'
                },'->',{
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('stacksgrid');
                                if (grid != null) {
                                    grid.applyFilter(value, ['name', 'description']);
                                }
                            },
                            scope: this
                        }
                    }
                }]
            },{
                xtype:'toolbar',
                dock:'bottom',
                ui:'footer',
                defaults: {
                    minWidth: 80
                },
                items:[{
                    xtype:'button',
                    text:'Add',
                    itemId: 'addButton',
                    handler: function() {
                      this.onAddClicked();
                    },
                    scope: this
                },{
                    xtype:'button',
                    text:'Remove',
                    itemId: 'removeButton',
                    handler: function() {
                        var grid = this.down('#stacksgrid');
                        //TODO make sure this is filtered by the passed in id
                        if(grid) {
                            var records = grid.getSelectionModel().getSelection();
                            if(records && records.length>0) {
                                var store = grid.store;
                                store.remove(records);
                                store.on({
                                    save: {
                                        fn: function(s,b,data) {
                                            store.reload();
                                        }
                                    }
                                });
                                store.save();
                            }
                            else {
                                self.editPanel.showAlert("Error", "You must select at least one stack to remove.")
                            }
                        }
                    },
                    scope:this
                }]
            }]
        });

        this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

        this.on({
            activate: {
                scope: this,
                fn: function (cmp, opts) {
                    //load store with proper filter
                    var owner = cmp.ownerCt;
                    var grid = cmp.down('#stacksgrid');
                    
                    grid.setStore(Ext.create('Ozone.data.StackStore',cmp.storeCfg));
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
                    
                    if (grid && owner) {
                        owner.record = owner.recordId ? owner.store.getAt(owner.store.findExact('id', owner.recordId)) : undefined;
                    }
                    
                    // Set the title
                    if (owner.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(owner.record.get('title'), 25)) || 'Stacks';
                        var title = cmp.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblStacksGrid');
                        title.setText(titleText);
                    }

                    OWF.Preferences.getUserPreference({
                        namespace: 'owf.admin.StackEditCopy',
                        name: 'guid_to_launch',
                        onSuccess: function(result) {
                            cmp.guid_EditCopyWidget = result.value;
                        },
                        onFailure: function(err) { /* No op */
                            self.editPanel.showAlert('Preferences Error', 'Error looking up Stack Editor: ' + err);
                        }
                    });
                    
                    if(grid && owner) {
                        var compId = owner.recordId ? owner.recordId: -1;
                        var p = {
                            tab:'stacks'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
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
                                        self.editPanel.showAlert("Error", "You must select at least one stack to edit.");
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

        //reload store everytime the tab is activated
        this.on({
           activate: {
             fn: function() {
               var grid = this.getComponent('stacksgrid');
               var store = grid.getStore();
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

        this.callParent();
    },
    onAddClicked: function (button, e) {
        var record = this.ownerCt.record,
            itemName = record.get('name') ? record.get('name') : record.get('userRealName');

        var win = Ext.widget('admineditoraddwindow', {
            addType: 'Stack',
            itemName: itemName,
            editor: this.editor,
            focusOnClose: this.down(),
            existingItemsStore: this.getComponent('stacksgrid').getStore(),
            searchFields: ['displayName'],
            grid: Ext.widget('stacksgrid', {
                itemId: 'stacksaddgrid',
                border: false,
                preventHeader:true,
                enableColumnHide: false,
                sortableColumns: false
            })
        });
        win.show();
    },
    doEdit: function(id, title) {
        var self = this;
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
                self.editPanel.showAlert('Launch Error', 'Stack Editor Launch Failed: ' + response.message);
            }
        });
    },
    refreshWidgetLaunchMenu: function() {
        if (this.widgetStateHandler) {
            this.widgetStateHandler.handleWidgetRequest({
                fn: 'refreshWidgetLaunchMenu'
            });
        }
    }
});