Ext.define('Ozone.components.admin.grid.WidgetsTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.widgetstabpanel'],
    
    initComponent: function() {
        
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
                                    grid.applyFilter(value, ['displayName']);
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
                          Ext.Msg.alert("Error", "You must select at least one widget to remove.");
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
                            Ext.Msg.alert('Preferences Error', 'Error looking up Widget Editor: ' + err);
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
                    if (grid && comp) {
                        comp.record = comp.recordId ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                        compId = comp.recordId ? comp.recordId : -1;
                        var p = {
                            tab: 'widgets'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
                    }
                    
                    // Set the title
                    if (comp.record) {
                    	var titleText = comp.record.get('title') || 'Widgets';
                        lbl.setText(titleText);
                    }
                    
                    if (grid != null) {
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
                                        Ext.Msg.alert("Error", "You must select at least one widget to edit.");
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
                Ext.Msg.alert('Launch Error', 'Widget Editor Launch Failed: ' + response.message);
            }
        });
    },
    
    onAddClicked: function(button, e) {
        var me = this;
        var vpSize = Ext.getBody().getViewSize();
        var win = Ext.create('Ext.window.Window', {
            title: me.generateTitle(),
            itemId: 'addwidgetwindow',
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
                itemId: 'widgetsaddpanel',
                cls: 'widgetsaddpanel',
                layout: 'fit',
                flex: 1,
                items: [{
                    xtype: 'widgetsgrid',
                    itemId: 'widgetsaddgrid',
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
                    itemId: 'widgetsaddtoolbar',
                    dock: 'top',
                    items: [{
                        itemId: 'tbtext',
                        xtype: 'tbtext',
                    	cls: 'tbWidgetsGridHdr',
                        text: 'Widgets'
                    },
                    '->',
                    {
                        xtype: 'searchbox',
                        listeners: {
                            searchChanged: function (cmp, queryString) {
                                var grid = win.getComponent('widgetsaddpanel').getComponent('widgetsaddgrid');
                                var filters = [];
                                if(queryString.length > 0){
                                    grid.applyFilter(queryString, ['displayName']);
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
                    var grdWidgets = me.getComponent('widgetsGrid');
                    var storeWidgets = grdWidgets.getStore();
                    var wap = win.getComponent('widgetsaddpanel');
                    var grdWidgetsAdd = wap.getComponent('widgetsaddgrid');
                    var recordsToAdd = [];
                    
                    var records = grdWidgetsAdd.getSelectionModel().getSelection();
                    
                    for (var i = 0 ; i < records.length ; i++) {
                        var rec = records[i];

                        // skip records already in store
                        if (storeWidgets.findExact('id', rec.data.id) == -1) {
                            var newRec = storeWidgets.createModel(rec);
                            newRec.phantom = true;
                            recordsToAdd.push(newRec);
                        }
                    }
                    if (recordsToAdd.length > 0) {
                        storeWidgets.insert(0, recordsToAdd);
                        storeWidgets.save();
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
    generateTitle: function() {

        var title = "Add Widget(s)";

        var data = this.ownerCt.store.data.items[0].data;
        if(data.name) {
            //Adding widget to a group
            title += " to " + data.name;
        } else if (data.userRealName) {
            //Adding widget to a person
            title += " to " + data.userRealName;
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
