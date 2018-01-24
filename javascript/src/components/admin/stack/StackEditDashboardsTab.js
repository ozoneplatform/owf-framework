Ext.define('Ozone.components.admin.stack.StackEditDashboardsTab', {
    extend: 'Ozone.components.admin.DashboardsTabPanel',
    alias: [
        'widget.stackeditdashboards',
        'widget.stackeditdashboardstab',
        'widget.Ozone.components.admin.stack.StackEditDashboardsTab'
    ],

    cls: 'stackeditdashboardstab',

    isGroupDashboard: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(this, {
            layout: 'fit',
            itemId: 'tabDashboards',
            title: 'Pages',
            iconCls: 'dashboard-tab',
            editor: 'Stack',
            componentId: 'stack_id',
            storeCfg: {
                api: {
                    read: '/dashboard',
                    create: '/stack',
                    update: '/dashboard',
                    destroy: '/stack'
                },
                methods: {
                    read: 'GET',
                    load: 'GET',
                    create: 'PUT',
                    update: 'PUT',
                    save: 'POST',
                    destroy: 'PUT'
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
            items: [
            {
                xtype: 'button',
                tooltip: 'Move Up',
                tooltipType: 'title',
                itemId: 'btnMoveUp',
                iconCls: 'x-btn-text-color icon-arrow-up',
                handler: function() {
                    this.moveUp();
                },
                scope: this
            }, {
                xtype: 'button',
                tooltip: 'Move Down',
                tooltipType: 'title',
                itemId: 'btnMoveDown',
                iconCls: 'x-btn-text-color icon-arrow-down',
                handler: function() {
                    this.moveDown();
                },
                scope: this
            }, {
                xtype: 'button',
                text: 'Add',
                itemId: 'btnAdd',
                minWidth: 80,
                handler: function() {
                    this.onAddClicked();
                },
                scope: this
            }, {
                xtype: 'button',
                text: 'Remove',
                itemId: 'btnRemove',
                minWidth: 80,
                handler: function() {
                    this.doDelete();
                },
                scope: this
            }
            ]
        });

        this.on({
            activate: {
                scope: me,
                single: true,
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('dashboardsgrid');
                    grid.view.addElListener('keypress', function(evt, target) {
                        if(evt.getKey() == evt.ENTER) {
                            var selModel = grid.getSelectionModel();
                            grid.getStore().each(function(record) {
                                if(selModel.isFocused(record)) {
                                    me.doEdit(null, record);
                                }
                            });
                        }
                    });
                }
            }
        });
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
                            var user = Ozone.config.user;
                            cmp.setBaseParams({
                                adminEnabled: true,
                                user_id: user.id
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
        var me = this;
        var recId = this.ownerCt.recordId;
        var data = record ? record.data : record;
        var jsonString = null;
        if (data) {
            jsonString = owfdojo.toJson(data, true);
        }
        
        Ext.create('Ozone.components.admin.EditDashboardWindow', {
            title: 'Page Editor - ' + data.name ? Ext.htmlEncode(data.name) : '',
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
                    store.proxy.extraParams.adminEnabled = true;
                    store.proxy.extraParams.stack_id = recId;
                    store.add(oDefinition);
                    var record = store.data.items[0];
                    record.phantom = true;
                    
                    store.on({
                        write: {
                            fn: function(store, operation, eOpts) {
                                var grid = me.getComponent('dashboardsgrid');
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
                                scope: this,
                                single: true
                            }
                        });
                    }
                    
                    store.sync();
                }
            }
        }).show();
    },
    
    doDelete: function(button, e) {
        var grid = this.getComponent('dashboardsgrid');
        var store = grid.getStore();
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            store.remove(records);
            if (store.reorder) { store.reorder(); }
            store.save();
        } else {
            this.editPanel.showAlert("Error", "You must select at least one page to remove.");
        }
    },
    
    moveUp: function() {
        var grid = this.getComponent('dashboardsgrid');
        if (grid) { grid.doMoveRow('up'); }
    },
    
    moveDown: function() {
        var grid = this.getComponent('dashboardsgrid');
        if (grid) { grid.doMoveRow('down'); }
    }
});
