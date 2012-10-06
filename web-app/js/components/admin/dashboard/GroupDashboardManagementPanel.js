Ext.define('Ozone.components.admin.dashboard.GroupDashboardManagementPanel', {
    extend: 'Ozone.components.admin.ManagementPanel',
    alias: ['widget.groupdashboardmanagement','widget.groupdashboardmanagementpanel','widget.Ozone.components.admin.GroupDashboardManagementPanel'],
    
    layout: 'fit',
    
    cls: 'groupdashboardmanagementpanel',
    
    gridDashboards: null,
    pnlDashboardDetail: null,
    txtHeading: null,
    lastAction: null,
    guid_EditCopyWidget: null,
    
    widgetStateHandler: null,
    dragAndDrop: true,
    launchesWidgets: true,
    channel: 'AdminChannel',
    defaultTitle: 'Group Dashboards',
    minButtonWidth: 80,
    detailsAutoOpen: true,
    
    initComponent: function() {
        
        var self = this;
        
        OWF.Preferences.getUserPreference({
            namespace: 'owf.admin.DashboardEditCopy',
            name: 'guid_to_launch',
            onSuccess: function(result) {
                self.guid_EditCopyWidget = result.value;
            },
            onFailure: function(err){ /* No op */
                Ext.Msg.alert('Preferences Error', 'Error looking up Dashboard Editor: ' + err);
            }
        });
        
        this.gridDashboards = Ext.create('Ozone.components.admin.grid.DashboardGroupsGrid', {
            preventHeader: true,
            region: 'center',
            border: false
        });
        
        this.gridDashboards.setBaseParams({
                adminEnabled: true,
	            isGroupDashboard: true
        });
        
        this.gridDashboards.store.load({
            params: {
                offset: 0,
                max: this.pageSize
            }
        });
        
        this.relayEvents(this.gridDashboards, ['datachanged', 'select', 'deselect', 'itemdblclick']);
        
        this.pnlDashboardDetail = Ext.create('Ozone.components.admin.dashboard.DashboardDetailPanel', {
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            region: 'east',
            preventHeader: true,
            collapseMode: 'mini',
            collapsible: true,
            collapsed: true,
            split: true,
            border: false,
            width: 266
        });
        
        this.txtHeading = Ext.create('Ext.toolbar.TextItem', {
            text: '<span class="heading-bold">'+this.defaultTitle+'</span>'
        });
        
        this.searchBox = Ext.widget('searchbox');        
        this.items = [{
            xtype: 'panel',
            layout: 'border',
            border: false,
            items: [
                this.gridDashboards,
                this.pnlDashboardDetail
            ]
        }];
        
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            layout: {
                type: 'hbox',
                align: 'stretchmax'
            },
            items: [
                this.txtHeading,
            {
                xtype: 'tbfill'
            },
                this.searchBox
            ]
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            defaults: {
                minWidth: this.minButtonWidth
            },
            items: [{
                xtype: 'button', 
                text: 'Create',
                handler: function(button, evt) {
                    evt.stopPropagation();
                    self.doCreate();
                }
            }, {
                xtype: 'button',
                text: 'Edit',
                handler: function() {
                    self.doEdit();
                }
            }, {
                xtype: 'button', 
                text: 'Delete',
                handler: function(button) {
                    self.doDelete();
                }
            }]
        }];
    
        this.gridDashboards.store.on(
        	'load',
        	function(thisStore, records, options){
        		if ((this.pnlDashboardDetail != null ) && 
        		   (!this.pnlDashboardDetail.collapsed) && 
        		    (this.pnlDashboardDetail.loadedRecord != null)){
        			for(var idx=0; idx < records.length; idx++){
        				if(records[idx].id == this.pnlDashboardDetail.loadedRecord.id){
        					this.pnlDashboardDetail.loadData(records[idx]);
        					break;
        				}
        			}
        		}
        	},
        	this
        );
        
        this.on(
            'datachanged',
            function(store, opts) {
                  //collapse and clear detail panel if the store is refreshed
                  if (this.pnlDashboardDetail != null ) {
                    this.pnlDashboardDetail.collapse();
                    this.pnlDashboardDetail.removeData();
                  }

                  //refresh launch menu
                  if (!this.disableLaunchMenuRefresh) {
                    this.refreshWidgetLaunchMenu();
                  }
            },
            this
        );
    
        this.on(
            'select',
            function(rowModel, record, index, opts) {
                this.pnlDashboardDetail.loadData(record);
                if (this.pnlDashboardDetail.collapsed && this.detailsAutoOpen) {this.pnlDashboardDetail.expand();}
            },
            this
        );
        
        this.searchBox.on(
            'searchChanged',
            function(searchbox, value) {
                var grid = this.gridDashboards;

                if (grid)  {
                    if (!value)
                        this.gridDashboards.clearFilters();
                    else
                        this.gridDashboards.applyFilter(value, ['name', 'description']);
                }
            },
            this
        );
            
        this.on({
            'itemdblclick': {
	            scope: this,
	            fn: this.doEdit
            }
        });

        this.gridDashboards.getView().on({
            itemkeydown: {
                scope: this,
                fn: function(view, record, dom, index, evt) {
                    switch(evt.getKey()) {
                        case evt.SPACE:
                        case evt.ENTER:
                            this.doEdit();
                    }
                }
            }
        });
        
        
        this.callParent(arguments);
        
        OWF.Eventing.subscribe('AdminChannel',this.handleEvent);
        
        this.on(
        		'afterrender', 
        		function() {
    				var splitterEl = this.el.down(".x-collapse-el");
    				splitterEl.on('click', function() {
    					var collapsed = this.el.down(".x-splitter-collapsed");
    					if(collapsed) {
    						this.detailsAutoOpen = true;
    					}
    					else {
    						this.detailsAutoOpen = false;
    					}
    				}, this);
    			}, 
    			this
    		);
    },
    
    onLaunchFailed: function(response) {
        if (response.error) {
            Ext.Msg.alert('Launch Error', 'Dashboard Editor Launch Failed: ' + response.message);
        }
    },

    doCreate: function() {
    	var dataString = Ozone.util.toString({
            copyFlag: false,
            isCreate: true,
            isGroupDashboard: true
        });
        
        OWF.Launcher.launch({
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
            data: dataString
        }, this.onLaunchFailed);
    },
    
    doEdit: function() {
    	var records = this.gridDashboards.getSelectedDashboards();
        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var id = records[i].getId();//From Id property of Dashboard Model
                var dataString = Ozone.util.toString({
		            id: id,
		            copyFlag: false,
		            isCreate: false,
		            isGroupDashboard: true
		        });
		        
		        OWF.Launcher.launch({
		            guid: this.guid_EditCopyWidget,
		            launchOnlyIfClosed: false,
		            data: dataString
		        }, this.onLaunchFailed);
            }
        } else {
            Ext.Msg.alert("Error", "You must select at least one dashboard to edit");
        }
    },
    
    doDelete: function() {
        var records = this.gridDashboards.getSelectionModel().getSelection();
        if (records && records.length > 0) {

            var msg = 'This action will permanently<br>delete the selected dashboard(s)';
            if (records.length == 1) {
              msg = 'This action will permanently<br>delete <span class="heading-bold">' 
                    + Ext.htmlEncode(records[0].data.name) + '</span>.';
            }
            else {
              msg = 'This action will permanently<br>delete the selected <span class="heading-bold">'
                    + records.length + ' dashboards</span>.';
            }
            Ext.create('Ozone.window.MessageBoxPlus', {}).show({
                title: 'Warning',
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                closable: false,
                modal: true,
                scope: this,
                fn: function(btn, text, opts) {
                    if (btn == 'ok') {
//                        if (records.length > 1) {
//                          this.txtHeading.setText('<span class="heading-bold">' + this.defaultTitle +
//                                  ' </span><span class="heading-message"> ('+
//                                  '<span class="heading-bold">' + records.length +
//                                  ' dashboards</span> deleted) </span>');
//                        } else {
//                          this.txtHeading.setText('<span class="heading-bold">' + this.defaultTitle +
//                                  ' </span><span class="heading-message"> ( <span class="heading-bold">'
//                                  + records[0].data.name + '</span> deleted) </span>');
//                        }
                        var store = this.gridDashboards.getStore();
                        store.remove(records);
                        var remainingRecords = store.getTotalCount() - records.length;
                        store.on({
                           write: {
                             fn: function() {
                               if(store.data.items.length==0 && store.currentPage>1)
                               {
                                   var lastPage = store.getPageFromRecordIndex(remainingRecords - 1);
                                   var pageToLoad = (lastPage>=store.currentPage)?store.currentPage:lastPage;
                                   store.loadPage(pageToLoad);
                               }
                               this.gridDashboards.getBottomToolbar().doRefresh();
                               this.pnlDashboardDetail.removeData();
                               if (!this.pnlDashboardDetail.collapsed) {this.pnlDashboardDetail.collapse();}
                               this.refreshWidgetLaunchMenu();
                             },
                             scope: this,
                             single: true
                           }
                        });
                        store.save();
                    }
                }
            });
        } else {
            Ext.create('Ozone.window.MessageBoxPlus', {}).show({
                title: "Error",
                msg: "You must select at least one dashboard to delete.",
                buttons: Ext.Msg.OK
            });
        }
    },
    
    refreshWidgetLaunchMenu: function() {
        if (this.widgetStateHandler) {
          this.widgetStateHandler.handleWidgetRequest({
              fn: 'refreshWidgetLaunchMenu'
          });
        }
    }
});
