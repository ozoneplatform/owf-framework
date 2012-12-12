Ext.define('Ozone.components.admin.GroupsTabPanel',{
    extend: 'Ext.panel.Panel',
    alias: ['widget.groupstabpanel','widget.Ozone.components.admin.GroupsTabPanel'],

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
                xtype:'groupsgrid',
                itemId:'groupsgrid',
                preventHeader:true,
                border:false
            }],
            dockedItems:[{
                xtype:'toolbar',
                itemId: 'tbGroupsGridHdr',
                cls: 'tbGroupsGridHdr',
                dock:'top',
                items:[{
                    xtype:'tbtext',
                    itemId: 'lblGroupsGrid',
                    cls: 'tbGroupsGridHdr',
                    text:'Groups'
                },'->',{
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('groupsgrid');
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
                        var grid = this.down('#groupsgrid');
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
                                self.editPanel.showAlert("Error", "You must select at least one group to remove.")
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
                    var grid = cmp.down('#groupsgrid');
                    
                    grid.setStore(Ext.create('Ozone.data.GroupStore',cmp.storeCfg));
                    var refreshPagingToolbar = function(operation) {
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
                        if (Ext.isNumeric(owner.recordId)) {
                            owner.record = owner.recordId > -1 ? owner.store.getAt(owner.store.findExact('id', owner.recordId)) : undefined;
                        } else {
                            owner.record = owner.recordId ? owner.store.getAt(owner.store.findExact('id', owner.recordId)) : undefined;
                        }
                    }
                    
                    // Set the title
                    if (owner.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(owner.record.get('title'), 25));
                        if(!titleText) {
                            titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(owner.record.get('name'), 25)) || 'Groups';
                        }
                        var title = cmp.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblGroupsGrid');
                        title.setText(titleText);
                    }

                    OWF.Preferences.getUserPreference({
                        namespace: 'owf.admin.GroupEditCopy',
                        name: 'guid_to_launch',
                        onSuccess: function(result) {
                            cmp.guid_EditCopyWidget = result.value;
                        },
                        onFailure: function(err) { /* No op */
                            self.editPanel.showAlert('Preferences Error', 'Error looking up Group Editor: ' + err);
                        }
                    });
                    
                    if(grid && owner) {
                        var compId
                        if (Ext.isNumeric(owner.recordId)) {
                            compId = owner.recordId > -1 ? owner.recordId: -1;
                        } else {
                            compId = owner.recordId ? owner.recordId: -1;
                        }
                        var p = {
                            tab:'groups'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
                        grid.on({
                            itemdblclick: {
                                fn: function() {
                                    var records = grid.getSelectionModel().getSelection();
                                    if (records && records.length > 0) {
                                        for (var i = 0; i < records.length; i++) {
                                            cmp.doEdit(records[i].data.id, records[i].data.displayName);
                                        }
                                    }
                                    else {
                                        self.editPanel.showAlert("Error", "You must select at least one group to edit.");
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
               var grid = this.getComponent('groupsgrid');
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
            addType: 'Group',
            itemName: itemName,
            editor: this.editor,
            focusOnClose: this.down(),
            existingItemsStore: this.getComponent('groupsgrid').getStore(),
            searchFields: ['displayName'],
            grid: Ext.widget('groupsgrid', {
                itemId: 'groupsaddgrid',
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
            guid: this.guid_EditCopyWidget,
            title: '$1 - ' + title,
            titleRegex: /(.*)/,
            launchOnlyIfClosed: false,
            data: dataString
        }, function(response) {
            if (response.error) {
                self.editPanel.showAlert('Launch Error', 'Group Editor Launch Failed: ' + response.message);
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
