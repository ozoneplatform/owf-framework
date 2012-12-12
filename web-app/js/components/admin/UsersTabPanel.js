Ext.define('Ozone.components.admin.UsersTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.userstabpanel'],
    layout: {
        type: 'fit'
    },
    preventHeader: true,
    border: true,
    padding: 5,
    initDisabled: true,

    //The editor widget the tab is open in
    editPanel: null,
    
    initComponent: function() {
        var me = this;

        Ext.apply(this,{
          dockedItems: [{
            xtype: 'toolbar',
            itemId: 'usersHeader',
            cls: 'tbUsersGridHdr',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                itemId: 'usersHeaderLabel',
                cls: 'tbUsersGridHdr',
                text:'Users'
            },
            '->',
            {
                xtype: 'searchbox',
                listeners: {
                    searchChanged: {
                        fn: function(cmp, value) {
                            var grid = this.getComponent('usersgrid');
                            if (grid != null) {
                                grid.applyFilter(value, grid.quickSearchFields);
                            }
                        },
                        scope: this
                    }
                }
            }]
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            itemId: 'usersFooter',
            defaults: {
                minWidth: 80
            },
            items: [{
                xtype: 'button',
                text: 'Add',
                itemId: 'add',
                handler: function() {
                  this.onAddClicked();
                },
                scope: this
            }, {
                xtype: 'button',
                text: 'Remove',
                itemId: 'remove',
                handler: function() {
                  var grid = this.getComponent("usersgrid");
                  var store = grid.getStore();
                  var records = grid.getSelectionModel().getSelection();
                  if (records && records.length > 0) {
                      store.remove(records);
                      store.save();
                  }
                  else {
                    me.editPanel.showAlert("Error", "You must select at least one user to remove.");
                  }
                },
                scope: this
            }]
        }],
          items: [{
              xtype: 'usersgrid',
              itemId: 'usersgrid',
              preventHeader: true,
              border: false
          }]
        });

        this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();
        
        this.on({
            activate: {
                scope: this,
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('usersgrid');
                    var comp = cmp.ownerCt;
                    var compId = -1;
                    
                    // Enable/Disable Add and Remove buttons based on whether or not tab
                    // is editable.
                    var usersFooterToolbar = cmp.getDockedComponent('usersFooter');
                    var addBtn = usersFooterToolbar.getComponent('add');
                    var removeBtn = usersFooterToolbar.getComponent('remove');
                    var record = comp.store.getAt(comp.store.findExact('id', comp.recordId));
                    if (record.data.automatic) {
                        addBtn.setDisabled(true);
                        removeBtn.setDisabled(true);
                    }
                    
                    OWF.Preferences.getUserPreference({
                        namespace: 'owf.admin.UserEditCopy',
                        name: 'guid_to_launch',
                        onSuccess: function(result) {
                            cmp.guid_EditCopyWidget = result.value;
                        },
                        onFailure: function(err) { /* No op */
                            me.editPanel.showAlert('Preferences Error', 'Error looking up User Editor: ' + err);
                        }
                    });
                    
                    // Create modified widget store and bind to grid
                    grid.setStore(Ext.create('Ozone.data.UserStore', cmp.storeCfg));
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

                    if (grid && comp) {
                        if (Ext.isNumeric(comp.recordId)) {
                            comp.record = comp.recordId > -1 ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                            compId = comp.recordId > -1 ? comp.recordId: -1;
                        } else {
                            comp.record = comp.recordId ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                            compId = comp.recordId ? comp.recordId: -1;
                        }
                        var p = {
                            tab: 'users'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
                        grid.on({
                            itemdblclick: {
                                fn: function() {
                                    var records = grid.getSelectionModel().getSelection();
                                    if (records && records.length > 0) {
                                        for (var i = 0; i < records.length; i++) {
                                            cmp.doEdit(records[i].data.id,records[i].data.userRealName);
                                        }
                                    }
                                    else {
                                        me.editPanel.showAlert("Error", "You must select at least one user to edit.");
                                    }
                                },
                                scope: this
                            }
                        });
                    }
                    
                    // Set the title
                    if (comp.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('title'), 25));
                        if(!titleText) {
                            titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('name'), 25)) || 'Users';
                        }
                        var title = cmp.getDockedItems('toolbar[dock="top"]')[0].getComponent('usersHeaderLabel');
                        title.setText(titleText);
                    }
                },
                single: true
            }
        });

        //reload store everytime the tab is activated
        this.on({
           activate: {
             fn: function() {
               var grid = this.getComponent('usersgrid');
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

        this.callParent(arguments);
    },
    refreshWidgetLaunchMenu: function() {
        if (this.widgetStateHandler) {
            this.widgetStateHandler.handleWidgetRequest({
                fn: 'refreshWidgetLaunchMenu'
            });
        }
    },
    onAddClicked: function(button, e) {
        var itemName = this.ownerCt.record.get('title');
        if(!itemName){
            itemName = this.ownerCt.record.get('name');
        }
        var win = Ext.widget('admineditoraddwindow', {
            addType: 'User',
            itemName: itemName,
            editor: this.editor,
            focusOnClose: this.down(),
            existingItemsStore: this.getComponent('usersgrid').getStore(),
            grid: Ext.widget('usersgrid', {
                itemId: 'usersaddgrid',
                border: false,
                enableColumnHide: false,
                sortableColumns: false
            })
        });
        win.show();
    },
    doEdit: function(id, title) {
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
                this.editPanel.showAlert('Launch Error', 'User Editor Launch Failed: ' + response.message);
            }
        });
    }
});
