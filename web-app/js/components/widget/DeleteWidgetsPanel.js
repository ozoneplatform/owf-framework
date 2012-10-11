Ext.define('Ozone.components.widget.DeleteWidgetsPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.deletewidgetspanel', 'widget.Ozone.components.widget.DeleteWidgetsPanel'],
    
    delWidgets: null,
    dashboardContainer: null,
    delTitlePanel: null,
    delView: null,
    reqTitlePanel: null,
    reqGrid: null,

    mixins: {
        circularFocus: 'Ozone.components.focusable.CircularFocus'
    },
    
    id: 'topdeletepanel',
    width: 600,
    height: 300,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    // private
    initComponent: function() {
        
        this.delTitlePanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            border: false,
            html: 'You have selected to delete 0 widgets:'
        });
        
        this.delView = Ext.create('Ext.grid.Panel', {
            cls: 'delView',
            columns: [{
                xtype: 'templatecolumn',
                sortable: false,
                hideable: false,
                tpl: '<img src="{headerIcon}" />',
                width: 36
            }, 
            {
                header: 'Name',
                dataIndex: 'name',
                flex: 1,
                hideable: false
            }],
            store: Ext.create('Ext.data.Store', {
                autoDestroy: true,
                storeId: 'deleteStore',
                idIndex: 0,
                sortInfo: {
                    field: 'name',
                    direction: 'ASC'
                },
                fields: [
                    {name: 'guid'},
                    {name: 'name'},
                    {name: 'headerIcon'},
                    {name: 'image'}
                ]
            })
        });

        
        this.reqTitlePanel = Ext.create('Ext.panel.Panel', {
            itemId: 'reqTitlePanel',
            layout: 'fit',
            hidden: true,
            border: false,
            html: 'These widgets are required by other widgets in OWF. Deleting these widgets will additionally delete the widgets listed below.'
        });
        
        this.reqGrid = Ext.create('Ext.grid.Panel', {
            itemId: 'reqGrid',
            hidden: true,
            store: Ext.create('Ext.data.Store', {
                autoDestroy: true,
                storeId: 'requiredStore',
                idIndex: 0,
                sortInfo: {
                    field: 'name',
                    direction: 'ASC'
                },
                fields: [
                    {name: 'id'},
                    {name: 'name'},
                    {name: 'version'},
                    {name: 'url'},
                    {name: 'headerIcon'},
                    {name: 'image'},
                    {name: 'width'},
                    {name: 'height'},
                    {name: 'widgetGuid'},
                    {name: 'maximized'},
                    {name: 'minimized'},
                    {name: 'x'},
                    {name: 'y'},
                    {name: 'visible'},
                    {name: 'tags'},
                    {name: 'totalUsers'},
                    {name: 'totalGroups'},
                    {name: 'singleton'}
                ]
            }),
            columns: [
            {
                dataIndex: 'headerIcon',
                width: 36,
                sortable: false,
                hideable: false,
                menuDisabled: true,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    var url = null;
                    var contextPath = Ozone.util.contextPath();
                    if (!value.match(new RegExp('^/?' + contextPath + '/.*$','i')) && !value.match(new RegExp('^https?://.*','i'))) {
                        //url is not relative to the contextPath
                        if (value.indexOf('/') == 0) {
                            url = contextPath + value;
                        } else {
                            url = contextPath + '/' + value;
                        }
                    }
                    else {
                      //value is a full url
                      url = value;
                    }
                    return '<img src="' + url + '" title="' + record.data.name + '">';
                }
            },
            {
                header: 'Name', 
                dataIndex: 'name',
                flex: 1,
                sortable: false,
                hideable: false,
                menuDisabled: true
            },
            {
                header: 'Version', 
                dataIndex: 'version',
                width: 121,
                sortable: false,
                hideable: false,
                menuDisabled: true
            },
            {
                header: 'Tags', 
                dataIndex: 'tags',
                //width: 150,
                flex: 1, //fill the rest of the space
                sortable: false,
                hideable: false,
                menuDisabled: true,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    var strTags = "";
                    if (value != null) {
                        for (var i = 0; i < value.length; i++) {
                            strTags += value[i].name;
                            if (i < value.length - 1) {
                                strTags += ", ";
                            }
                        }
                    }
                    return strTags;
                }
            }
            ],
            viewConfig: {
                emptyText: 'No additional widgets to delete'
            },
            autoScroll: true,
            foreceFilt: true,
            flex: 1,
            border: false,
            iconCls: 'icon-grid'
        });
        
        this.items  = [
            this.delTitlePanel,
            this.delView,
            this.reqTitlePanel,
            this.reqGrid
        ];
        
        this.okBtn = Ext.create('Ext.button.Button', {
            text: Ozone.layout.DialogMessages.ok,
            //iconCls: 'okSaveBtnIcon',
            handler: function(button) {
                this.del();
            },
            scope: this
        });
        this.cancelBtn = Ext.create('Ext.button.Button', {
            xtype: 'button',
            text: 'Cancel',
            //iconCls: 'cancelBtnIcon',
            handler: function(button) {
                this.cancel();
            },
            scope: this
        });
        
        this.buttons = [this.okBtn, this.cancelBtn];
    
        var scope = this;
        
        var ids = [];
        var r = [];
        var w = this.delWidgets;
        for (var i = 0; i < w.length; i++) {
            ids.push(w[i].guid);
            r.push([
                w[i].guid,
                Ext.htmlEncode(w[i].name),
                w[i].headerIcon,
                w[i].image
            ]);
        }
        
        var delStore = this.delView.getStore();
        if (delStore) {
            delStore.removeAll();
            delStore.loadData(r, true);
        }
        
        this.delTitlePanel.update('You have selected to delete ' + delStore.getCount() + ' widgets:');
        
        Ozone.pref.PrefServer.getDependentPersonWidgets({
            content: {'ids': ids},
            onSuccess: function(ret) {
                var d = [];
                var data = ret.data;
                
                var delStore = scope.delView.getStore();
                
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (-1 == delStore.find('guid', data[i].path)) {
                            d.push({
                                id: data[i].path,
                                name: data[i].value.namespace,
                                version: data[i].value.widgetVersion,
                                url: data[i].value.url,
                                headerIcon: data[i].value.headerIcon,
                                image: data[i].value.image,
                                width: data[i].value.width,
                                height: data[i].value.height,
                                widgetGuid: data[i].path,
                                maximized: data[i].value.maximized,
                                minimized: data[i].value.minimized,
                                x: data[i].value.x,
                                y: data[i].value.y,
                                visible: data[i].value.visible,
                                tags: data[i].value.tags,
                                totalUsers: data[i].value.totalUsers,
                                totalGroups: data[i].value.totalGroups,
                                singleton: data[i].value.singleton
                            });
                        }
                    }
                }

                var reqTitlePanel = scope.reqTitlePanel;
                var reqGrid = scope.reqGrid;
                var reqStore = scope.reqGrid.getStore();
                if (reqStore) {
                  reqStore.removeAll();
                  if (d.length > 0) {
                    reqTitlePanel.show();
                    reqGrid.show();
                    reqStore.loadData(d);
                    scope.doLayout();
                  }
                  else {
                    reqTitlePanel.hide();
                    reqGrid.hide();
                    scope.doLayout();
                  }
                }
            },
            onFailure: function() {
                alert('Error');
            }
        });
        
//        this.on('show', function() {
//            this.focus();
//        }, okBtn);
        
        this.callParent();

        this.on('afterrender', function(cmp) {
            cmp.setupFocus(cmp.okBtn.getFocusEl(), cmp.cancelBtn.getFocusEl());
        });
    },
    
    del: function() {
        var delStore = this.delView.getStore();
        var delRecs = delStore.getRange();
        var reqStore = this.reqGrid.getStore();
        var reqRecs = reqStore.getRange();
        var allRecs = [];
        for (var i = 0; i < delRecs.length; i++) {
            allRecs.push(delRecs[i].data.guid);
        }
        for (var i = 0; i < reqRecs.length; i++) {
            allRecs.push(reqRecs[i].data.widgetGuid);
        }
        
        var scope = this;
        
        Ozone.pref.PrefServer.updateAndDeleteWidgets({
            widgetsToUpdate: [],
            widgetGuidsToDelete: allRecs, 
            updateOrder: false,
            onSuccess: function(ret) {
                //Call method to refresh the 'widget launch menu' widgets.
                scope.dashboardContainer.retrieveUpdatedWidgets();
            },
            onFailure: function() {
                Ozone.Msg.alert(Ozone.util.ErrorMessageString.saveUpdatedWidgets, Ozone.util.ErrorMessageString.saveUpdatedWidgetsMsg,
                    null, null, null, scope.dashboardContainer.modalWindowManager);
            }
        });
        
        this.cancel();
    },
    
    cancel: function() {
        this.ownerCt.close();
    }
    
});
