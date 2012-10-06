Ext.define('Ozone.components.admin.GroupsTabPanel',{
    extend: 'Ext.panel.Panel',
    alias: ['widget.groupstabpanel','widget.Ozone.components.admin.GroupsTabPanel'],
	
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
                                Ext.Msg.alert("Error", "You must select at least one group to remove.");
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
                    	cmp.refreshWidgetLaunchMenu();
                    	if (operation.action == "destroy" || operation.action == "create") {
	                        var ptb = grid.getBottomToolbar();
	                        ptb.doRefresh();
                    	}
                    };
                    grid.store.proxy.callback = refreshPagingToolbar;
                    
                    if (grid && owner) {
                        owner.record = owner.recordId ? owner.store.getAt(owner.store.findExact('id', owner.recordId)) : undefined;
                    }
                    
                    // Set the title
                    if (owner.record) {
                    	var titleText = Ext.htmlEncode(owner.record.get('title')) || 'Groups';
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
                            Ext.Msg.alert('Preferences Error', 'Error looking up Group Editor: ' + err);
                        }
                    });
                    
                    if(grid && owner) {
                        var compId = owner.recordId ? owner.recordId: -1;
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
                                            cmp.doEdit(records[i].data.id);
                                        }
                                    }
                                    else {
                                        Ext.Msg.alert("Error", "You must select at least one group to edit.");
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
        var me = this;
        var vpSize = Ext.getBody().getViewSize();
        var win = Ext.create('Ext.window.Window',{
            title: me.generateTitle(),
            closable: true,
            draggable: false,
            resizable: false,
            border: false,
            minWidth: 250,
            minHeight: 200,
            width: Math.round(vpSize.width * .9),
            height: Math.round(vpSize.height * .9),
            modal:true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'panel',
                itemId: 'groupsaddpanel',
                cls: 'groupsaddpanel',
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype:'groupsgrid',
                    itemId: 'groupsaddgrid',
                    preventHeader:true,
                    border: false,
                    enableColumnHide: false,
                    sortableColumns: false
                }],
                dockedItems: [{
                    xtype:'toolbar',
                    dock:'bottom',
                    ui:'footer',
                    defaults:{
                        minWidth:80
                    },
                    items:['->',{
                        xtype:'button',
                        text:'OK',
                        handler: function() {
                            var grid = win.down('#groupsaddgrid');
                            if(grid) {
                                var records = grid.getSelectionModel().getSelection();
                                if (records && records.length>0) {
                                    var groupgrid = me.down('#groupsgrid');
                                    if(groupgrid) {
                                        var store = groupgrid.getStore();
                                        var uniqueRecords = [];
									
                                        for(var i = 0, length = records.length; i<length; i++) {
                                            //if it doesn't exist in the store, add it to the unique records list
                                            if(store.getById(records[i].data.id)===null){
                                                var recordToPush = records[i];
                                                recordToPush.phantom = true;
                                                uniqueRecords.push(recordToPush);
                                            }
                                        }
									
                                        store.insert(0,uniqueRecords);
                                        store.sync();
                                    }
                                }

                            }
                            win.close();
                        },
                        scope: this
                    },{
                        xtype:'button',
                        text:'Cancel',
                        handler: function() {
                            win.close();
                        },
                        scope: this
                    }]
                },{
                    xtype:'toolbar',
                    dock:'top',
                    items:[{
                        xtype:'tbtext',
                    	cls: 'tbGroupsGridHdr',
                        text:'Groups'
                    },'->',{
                        xtype: 'searchbox',
                        listeners: {
                            searchChanged: function (cmp, queryString) {
                                var grid = win.getComponent('groupsaddpanel').getComponent('groupsaddgrid');
                                var filters = [];
                                if(queryString.length > 0){
                                    grid.applyFilter(queryString, ['name', 'description']);
                                } else {
                                    grid.applyFilter();
                                }
                            }
                        }
                    }
                    ]
                }]
            }]
        });
        win.on(
            'activate',
            function(cmp,opts) {
                var grid = cmp.getComponent('groupsaddpanel').getComponent('groupsaddgrid');
                if (this.addFilter) {
                   grid.setBaseParams(this.addFilter)
               }
                grid.store.load({
                    params: {
                        offset: 0,
                        max: this.pageSize
                    }
                });
            },
            this);
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
                Ext.Msg.alert('Launch Error', 'Group Editor Launch Failed: ' + response.message);
            }
        });
    },
    refreshWidgetLaunchMenu: function() {
        if (this.widgetStateHandler) {
            this.widgetStateHandler.handleWidgetRequest({
                fn: 'refreshWidgetLaunchMenu'
            });
        }
    },
    generateTitle: function() {

        var title = "Add Group(s)";

        var data = this.ownerCt.store.data.items[0].data;
        if((this.editor === "Widget" || this.editor === "Dashboard") && data.name) {
            title = "Add " + data.name + " to Group(s)";
        } else if(this.editor === "User" && data.userRealName) {
            title = "Add " + data.userRealName + " to Groups(s)";
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
