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
	initComponent: function() {

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
				  	Ext.Msg.alert("Error", "You must select at least one user to remove.");
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
                            Ext.Msg.alert('Preferences Error', 'Error looking up User Editor: ' + err);
                        }
                    });
                    
                    // Create modified widget store and bind to grid
                    grid.setStore(Ext.create('Ozone.data.UserStore', cmp.storeCfg));
                    var refreshPagingToolbar = function(operation) {
                    	cmp.refreshWidgetLaunchMenu();
                    	if (operation.action == "destroy" || operation.action == "create") {
	                        var ptb = grid.getBottomToolbar();
	                        ptb.doRefresh();
                    	}
                    };
                    grid.store.proxy.callback = refreshPagingToolbar;
                    if (grid && comp) {
                        comp.record = comp.recordId ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                        compId = comp.recordId ? comp.recordId : -1;
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
                                            cmp.doEdit(records[i].data.id);
                                        }
                                    }
                                    else {
                                        Ext.Msg.alert("Error", "You must select at least one user to edit.");
                                    }
                                },
                                scope: this
                            }
                        });
                    }
                    
                    // Set the title
                    if (comp.record) {
                    	var titleText = comp.record.get('title') || 'Users';
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
        var me = this;
        var vpSize = Ext.getBody().getViewSize();
        var win = Ext.create('Ext.window.Window', {
            title: me.generateTitle(),
            itemId: 'adduserwindow',
            closable: true,
            draggable: false,
            resizable: false,
            border: false,
            minWidth: 250,
            minHeight: 200,
            width: Math.round(vpSize.width * .9),
            height: Math.round(vpSize.height * .9),
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            modal: true,
            items: [{
                xtype: 'panel',
                itemId: 'usersaddpanel',
                cls: 'usersaddpanel',
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype: 'usersgrid',
                    itemId: 'usersaddgrid',
                    border: false,
                    enableColumnHide: false,
                    sortableColumns: false,
                    listeners: {
                        afterrender: {
                            fn: function(cmp, opts) {
                                var store = cmp.getStore();
                                if (store) {
                                    
                                    store.load({
                                        params: {
                                            offset: 0,
                                            max: store.pageSize
                                        }
                                    });
                                }
                            }
                        }
                    }
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    itemId: 'usersaddtoolbar',
                    dock: 'top',
                    items: [{
                        itemId: 'tbtext',
                        xtype: 'tbtext',
                		cls: 'tbUsersGridHdr',
                        text: 'Users'
                    },
                    '->',
                    {
                        xtype: 'searchbox',
                        listeners: {
                            searchChanged: function (cmp, queryString) {
                                var grid = win.getComponent('usersaddpanel').getComponent('usersaddgrid');
                                var filters = [];
                                if(queryString.length > 0){
                                    grid.applyFilter(queryString, grid.quickSearchFields);
                                } else {
                                    grid.applyFilter();
                                }
                            }
                        }
                    }]
                }]
            }],
            buttons: [{
                text: 'OK',
                handler: function() {
                    var grdusers = me.getComponent('usersgrid');
                    var storeusers = grdusers.getStore();
                    var wap = win.getComponent('usersaddpanel');
                    var grdusersAdd = wap.getComponent('usersaddgrid');
                    var recordsToAdd = [];
                    
                    var records = grdusersAdd.getSelectionModel().getSelection();
                    
                    for (var i = 0 ; i < records.length ; i++) {
                        var rec = records[i];

                        // skip records already in store
                        if (storeusers.findExact('id', rec.data.id) == -1) {
                            var newRec = storeusers.createModel(rec);
                            newRec.phantom = true;
                            recordsToAdd.push(newRec);
                        }
                    }
                    if (recordsToAdd.length > 0) {
                        storeusers.insert(0, recordsToAdd);
                        storeusers.save();
                    }
                    win.close();
                }
            }, {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }
            }]
        });
        win.show();
    },
    doEdit: function(id) {
        var dataString = Ozone.util.toString({
            id: id,
            copyFlag: false
        });

        OWF.Launcher.launch({
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
            data: dataString
        }, function(response) {
            if (response.error) {
                Ext.Msg.alert('Launch Error', 'User Editor Launch Failed: ' + response.message);
            }
        });
    },
    generateTitle: function() {

        var title = "Add User(s)";
        
        var data = this.ownerCt.store.data.items[0].data;
        if(this.editor === "Group" && data.name) {
            title = "Add User(s) to " + data.name;
        } else if(this.editor === "Widget" && data.name) {
            title = "Add " + data.name + " to User(s)";
        }

        //Set a character limit to start at and truncate the title to it if necessary
        var charLimit = 100;
        title = Ext.util.Format.ellipsis(title, charLimit);

        //Get the size of the parent container
        var vpSize = Ext.getBody().getViewSize();

        //Use TextMetrics to get the pixel width of the title
        var textMetrics = new Ext.util.TextMetrics();
        var titleWidth = textMetrics.getWidth(title);

        //If the title's pixel width is too large for the window, decrease it
        //by 5 characters until its pixel width fits
        while(titleWidth > ((vpSize.width * .8))) {
            charLimit -= 5;
            title = Ext.util.Format.ellipsis(title, charLimit);
            titleWidth = textMetrics.getWidth(title);
        }

        textMetrics.destroy();

        return Ext.htmlEncode(title);
    }
});
