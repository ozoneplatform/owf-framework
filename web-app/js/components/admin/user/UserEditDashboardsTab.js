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
                            fn: function(store, action, result, records, rs) {
                                if (grid && grid.store) {
                                    OWF.Eventing.publish(this.ownerCt.channel, {
                                        action: action,
                                        domain: this.ownerCt.domain,
                                        records: result
                                    });
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
    doEdit: function(cmp, record, item, index, e) {
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
                title: 'Dashboard Editor - ' + data.name ? Ext.htmlEncode(data.name) : '',
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
            this.editPanel.showAlert("Error", "You must select at least one dashboard to edit.");
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
            this.editPanel.showAlert("Error", "You must select at least one dashboard to copy.");
        }
    },
    openCopyWindow: function (dashboardData) {
        var me = this;
        var addTitle = "Select one or more groups and click 'OK':";
        if (me.editor) {
            addTitle = "To copy the selected dashboards, select one or more groups and click 'OK':";
        }

        var win = Ext.widget('admineditoraddwindow', {
            addType: 'Group',
            itemName: dashboardData.length === 1 ? dashboardData[0].name : 'Dashboards',
            editor: this.editor,
            focusOnClose: this.down(),
            instructions: addTitle,
            searchFields: ['name', 'description'],
            grid: Ext.widget('groupsgrid', {
                itemId: 'groupsaddgrid',
                preventHeader:true,
                border: false,
                enableColumnHide: false,
                sortableColumns: false
            }),
            okFn: function() {
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
                                me.editPanel.showAlert("Error", "Error while " +
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
            }
        });
        win.show();
    },
    doDelete: function(button, e) {
        var grid = this.getComponent('dashboardsgrid'),
            store = grid.getStore()
            records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            var msg = 'This action will permanently delete the selected dashboard(s)';
            if (records.length == 1) {
                msg = 'This action will permanently delete <span class="heading-bold">' 
                        + Ext.htmlEncode(records[0].data.name) + '</span>.';
            } else {
                msg = 'This action will permanently delete the selected <span class="heading-bold">' 
                        + records.length + ' dashboards</span>.';
            }
            var okFn = function(btn, text, opts) {
                if (btn == 'ok') {
                    store.remove(records);
                    store.save();
                }
            };
            this.editPanel.showConfirmation('Warning', msg, okFn);
        } else {
            this.editPanel.showAlert("Error", "You must select at least one dashboard to delete.");
        }
    }


});
