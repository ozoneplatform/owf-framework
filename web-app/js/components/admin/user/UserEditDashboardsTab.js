Ext.define('Ozone.components.admin.user.UserEditDashboardsTab', {
    extend: 'Ozone.components.admin.DashboardsTabPanel',
    alias: [
        'widget.usereditdashboards',
        'widget.usereditdashboardstab',
        'widget.Ozone.components.admin.user.UserEditDashboardsTab'
    ],
    
    cls: 'usereditdashboardstab',
    editor: 'User',
    
    initComponent: function () {
        //get widget to launch
        Ext.apply(this,{
            layout: 'fit',
            itemId: 'tabDashboards',
            title: 'Dashboards',
            iconCls: 'dashboard-tab',
            componentId: 'user_id',
            storeCfg: {
                api: {
                    read: '/dashboard',
                    create: '/dashboard',
                    update: '/dashboard',
                    destroy: '/dashboard'
                },
                methods: {
                    read: 'GET', 
                    load: 'GET',  
                    create: 'PUT', 
                    update: 'PUT', 
                    save: 'POST', 
                    destroy: 'DELETE'
                },
                updateActions: {
                    destroy: 'remove',
                    create: 'add'
                }
            }
        });
        this.callParent(arguments);

        this.addDocked({
            xtype: 'toolbar',
            itemId: 'tbDashboardsGridFtr',
            dock: 'bottom',
            ui: 'footer',
            defaults: {
                minWidth: 80
            },
            items: [{
                xtype: 'button',
                text: 'Create',
                itemId: 'btnCreate',
                handler: function(btn, evt) {
                    evt.stopPropagation();
                    this.doCreate();
                },
                scope: this
            },
            {
                xtype: 'splitbutton',
                text: 'Edit',
                handler:  function() {
                    this.doEdit();
                },
                scope: this,
                menuAlign: 'bl-tl?',
                menu: {
                    xtype: 'menu',
                    plain: true,
                    defaults: {
                        minWidth: 80
                    },
                    items: [
                    {
                        xtype: 'owfmenuitem',
                        text: 'Copy To Group',
                        handler: function() {
                            this.doCopy();
                        },
                        scope: this
                    }
                    ]
                }
            },
            {
                xtype: 'button',
                text: 'Delete',
                itemId: 'btnDelete',
                handler: function() {
                    this.doDelete();
                },
                scope: this
            }]
        });
    },
    doCreate: function(button, e) {

        var grid = this.getComponent('dashboardsgrid');
        var comp = this.ownerCt;
        var compId = comp.recordId ? comp.recordId : -1;
        
        Ext.create('Ozone.components.admin.EditDashboardWindow', {
            title: 'Dashboard Editor',
            width: Ext.getBody().getViewSize().width * .9,
            height: Ext.getBody().getViewSize().height * .9,
            scope: this,
            callback: function(values, button) {
                if (values != undefined) {
                    var oDefinition = Ext.decode(values.definition);
                    if (oDefinition) {
                        oDefinition.guid = guid.util.guid();
                        if (values.name) {
                            oDefinition.name = values.name;
                        }
                        if (values.description) {
                            oDefinition.description = values.description;
                        }
                    }
                    var store = Ext.StoreMgr.lookup({
                        type: 'admindashboardstore'
                    });
                    store.proxy.extraParams.user_id = compId;
                    store.add(oDefinition);
                    var record = store.data.items[0];
                    record.phantom = true;
                    
                    store.on({
                        write: {
                            fn: function(store, operation, eOpts) {
                                if (grid && grid.store) {
                                    grid.store.load();
                                }
                            },
                            scope: this
                        }
                    });
                    
                    if (store.proxy) {
                        store.proxy.on({
                            exception: {
                                fn: this.onStoreException,
                                scope: this
                            }
                        });
                    }
                    
                    store.sync();
                }
            }
        }).show();
    },
    doEdit: function(button, e) {
        var grid = this.getComponent('dashboardsgrid');
        var records = grid.getSelectedDashboards();
        var recId = this.ownerCt.recordId;
        if (records && records.length > 0) {
            var record = records[0];
            var data = record ? record.data : record;
            var jsonString = null;
            if (data) {
                jsonString = owfdojo.toJson(data, true);
            }
            
            Ext.create('Ozone.components.admin.EditDashboardWindow', {
                title: 'Dashboard Editor',
                guid: data.guid ? data.guid : '',
                name: data.name ? data.name : '',
                description: data.description ? data.description : '',
                definition: jsonString ? jsonString : '',
                width: Ext.getBody().getViewSize().width * .9,
                height: Ext.getBody().getViewSize().height * .9,
                scope: this,
                callback: function(values, button) {
                    if (values != undefined) {
                        var oDefinition = Ext.decode(values.definition);
                        if (oDefinition) {
                            if (values.guid) {
                                oDefinition.guid = values.guid;
                            }
                            if (values.name) {
                                oDefinition.name = values.name;
                            }
                            if (values.description) {
                                oDefinition.description = values.description;
                            }
                        }
                        var store = Ext.StoreMgr.lookup({
                            type: 'admindashboardstore'
                        });
                        store.proxy.extraParams.user_id = recId;
                        store.add(oDefinition);
                        var record = store.data.items[0];
                        record.phantom = true;
                        
                        store.on({
                            write: {
                                fn: function(store, operation, eOpts) {
                                    if (grid && grid.store) {
                                        grid.store.load();
                                    }
                                },
                                scope: this
                            }
                        });
                        
                        if (store.proxy) {
                            store.proxy.on({
                                exception: {
                                    fn: this.onStoreException,
                                    scope: this 
                                }
                            });
                        }
                        
                        store.sync();
                    }
                }
            }).show();
        }
        else {
            Ext.Msg.alert("Error", "You must select at least one dashboard to edit.");
        }
    },
    doCopy: function(button, e) {
        var grid = this.getComponent('dashboardsgrid');
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            var dashboardData = [];
            for (var i = 0 ; i < records.length ; i++) {
                dashboardData.push( Ozone.util.cloneDashboard(records[i].data, false, true) );
            }
            this.openCopyWindow(dashboardData);
        }
        else {
            Ext.Msg.alert("Error", "You must select at least one dashboard to copy.");
        }
    },
    openCopyWindow: function (dashboardData) {
        var me = this;
        var addTitle = "Select one or more groups and click 'OK':";
        if (me.editor) {
            addTitle = "To copy the selected dashboards, select one or more groups and click 'OK':";
        }
        var vpSize = Ext.getBody().getViewSize();
        var win = Ext.create('Ext.window.Window',{
            title: 'Add Groups',
            closable: true,
            draggable: false,
            resizable: false,
            border: false,
            minWidth: 250,
            minHeight: 200,
            width: vpSize.width * .9,
            height: vpSize.height * .9,
            modal:true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'label',
                border: false,
                //height: 20,
                text: addTitle,
                style: {
                    textAlign: 'left'
                //backgroundColor: '#CED9E7'
                }
            }, {
                xtype: 'panel',
                itemId: 'groupsaddpanel',
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
                                var groupRecords = grid.getSelectionModel().getSelection();
                                if (groupRecords && groupRecords.length > 0) {
                                    var groupData = [];
                                    for (var i = 0 ; i < groupRecords.length ; i++) {
                                        groupData.push(groupRecords[i].data);
                                    }

                                    //ajax call to the server
                                    Ozone.util.Transport.send({
                                        url : Ozone.util.contextPath() + '/group/copyDashboard',
                                        method : "POST",
                                        onSuccess: Ext.bind(function (json){
                                            var dashboardsgrid = this.down("#dashboardsgrid");
                                            if (dashboardsgrid) {
                                                dashboardsgrid.refresh();
                                            }
                                        },this),
                                        onFailure: function (errorMsg){
                                            Ext.Msg.alert("Error", "Error while " +
                                                "copying dashboard(s): " + 
                                                errorMsg);
                                        },
                                        autoSendVersion : false,
                                        content : {
                                            isGroupDashboard: true,
                                            groups: Ext.encode(groupData),
                                            dashboards: Ext.encode(dashboardData)
                                        }
                                    });

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
                        text:'Groups'
                    },'->',{
                        xtype: 'searchbox',
                        listeners: {
                            searchChanged: {
                                fn: function(cmp, value) {
                                    var grid = this.getComponent('groupsaddgrid');
                                    if (grid != null) {
                                        grid.applyFilter(value, ['name', 'description']);
                                    }
                                },
                                scope: this
                            }
                        }
                    }]
                }]
            }]
        });
        win.on(
            'activate',
            function(cmp,opts) {
                var grid = cmp.getComponent('groupsaddpanel').getComponent('groupsaddgrid');
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
    doDelete: function(button, e) {
        var grid = this.getComponent('dashboardsgrid');
        var store = grid.getStore();
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            var msg = 'This action will permanently<br>delete the selected dashboard(s)';
            if (records.length == 1) {
                msg = 'This action will permanently<br>delete <span class="heading-bold">' 
                        + Ext.htmlEncode(records[0].data.name) + '</span>.';
            } else {
                msg = 'This action will permanently<br>delete the selected <span class="heading-bold">' 
                        + records.length + ' dashboards</span>.';
            }
            Ext.Msg.show({
                title: 'Warning',
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                closable: false,
                modal: true,
                scope: this,
                fn: function(btn, text, opts) {
                    if (btn == 'ok') {
                        store.remove(records);
                        store.save();
                    }
                }
            });
        } else {
            Ext.Msg.alert("Error", "You must select at least one dashboard to delete.");
        }
    }


});
