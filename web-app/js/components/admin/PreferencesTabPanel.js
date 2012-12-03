Ext.define('Ozone.components.admin.grid.PreferencesTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.preferencestabpanel'],

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
                xtype: 'preferencesgrid',
                itemId: 'preferencesGrid',
                preventHeader: true,
                border: false
            }],

            dockedItems: [{
                xtype: 'toolbar',
                itemId: 'tbPreferencesGridHdr',
                cls: 'tbPreferencesGridHdr',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    itemId: 'lblPreferencesGrid',
                    cls: 'tbPreferencesGridHdr',
                    text: 'Preferences'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('preferencesGrid');
                                if (grid != null) {
                                    grid.applyFilter(value, ['namespace', 'path', 'value']);
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }, {
                xtype: 'toolbar',
                itemId: 'tbPreferencesGridFtr',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 80
                },
                items: [{
                    xtype: 'button',
                    itemId: 'btnCreate',
                    text: 'Create',
                    handler: this.onCreateClicked,
                    scope: this
                }, {
                    xtype: 'button',
                    itemId: 'btnEdit',
                    text: 'Edit',
                    handler: function() {
                        this.onEditClicked();
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    itemId: 'btnDelete',
                    text: 'Delete',
                    handler: function() {
                        var grid = this.getComponent('preferencesGrid');
                        var store = grid.store;
                        var records = grid.getSelectionModel().getSelection();
                        if (records && records.length > 0) {
                            me.editPanel.showConfirmation('Delete Preferences', 
                                'This action will permanently delete the selected ' + records.length + ' preference(s)?', 
                                function(btn, text, opts) {
                                    if (btn == 'ok') {
                                        store.remove(records);
                                        store.save();
                                    }
                                });
                        } else {
                            me.editPanel.showAlert("Error", "You must select at least one preferences to delete.");
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
                    var grid = cmp.getComponent('preferencesGrid');

                    var tb = cmp.getDockedComponent('tbPreferencesGridHdr');
                    var lbl = tb.getComponent('lblPreferencesGrid');
                    var comp = cmp.ownerCt;
                    
                    grid.setStore(Ext.create('Ozone.data.stores.PreferenceStore', cmp.storeCfg));
                    var refreshPagingToolbar = function(operation) {
                        if (operation.action == "destroy" || operation.action == "create") {
                            var ptb = grid.getBottomToolbar();
                            ptb.doRefresh();
                        }
                    };
                    grid.store.proxy.callback = refreshPagingToolbar;
                    if (grid && comp) {
                        comp.record = comp.recordId ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                        compId = comp.recordId ? comp.record.data.username : '';
                        var p = {
                            tab: 'preferences'
                        };
                        p[cmp.componentId] = compId;
                        grid.setBaseParams(p);
                    }
                    
                    // Set the title
                    if (comp.record) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('title'), 25)) || 'Preferences';
                        lbl.setText(titleText);
                    }
                    
                    if (grid != null) {
                        grid.on({
                            itemdblclick: {
                                fn: function() {
                                    var records = grid.getSelectionModel().getSelection();
                                    if (records && records.length > 0) {
                                        for (var i = 0; i < records.length; i++) {
                                            cmp.onEditClicked();
                                        }
                                    }
                                    else {
                                        me.editPanel.showAlert("Error", "You must select at least one preference to edit.");
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
               var grid = this.getComponent('preferencesGrid');
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
    onCreateClicked: function(btn, evt) {
        evt.stopPropagation();
        Ext.create('Ozone.components.admin.EditPreferenceWindow', {
            title: 'Create Preference',
            username: this.ownerCt.record.data.username,
            width: Math.round(Ext.getBody().getViewSize().width * .9),
            height: Math.round(Ext.getBody().getViewSize().height * .9),
            scope: this,
            callback: function(values, button) {
                if (values != undefined) {
                    var store = this.getComponent('preferencesGrid').getStore();
                    store.add(values);
                    store.save();
                }
            }
        }).show();
    },
    onEditClicked: function() {
        var records = this.getComponent('preferencesGrid').getSelectionModel().getSelection();
        if (records.length == 1) {
            Ext.create('Ozone.components.admin.EditPreferenceWindow', {
                title: 'Edit Preference',
                namespace: records[0].data.namespace,
                path: records[0].data.path,
                value: records[0].data.value,
                username: this.ownerCt.record.data.username,
                width: Math.round(Ext.getBody().getViewSize().width * .9),
                height: Math.round(Ext.getBody().getViewSize().height * .9),
                scope: this,
                callback: function(values, button){
                    if (values != undefined) {
                        var record = this.getComponent('preferencesGrid').getSelectionModel().getSelection()[0];
                        var store = this.getComponent('preferencesGrid').getStore();
                        record.beginEdit()
                            for (var field in values) {
                                if (!Ext.isFunction(field)) {
                                    record.set(field, values[field]);
                                }
                            }
                        record.endEdit()
                        store.save();
                        record.commit();
                    }
                }
            }).show();
        } else if (records.length < 1) {
            this.editPanel.showAlert("Error", "You must select at least one preferences to edit.");
        } else {
            this.editPanel.showAlert("Error", "You can only edit one preference at a time.");
        }
    }
});
