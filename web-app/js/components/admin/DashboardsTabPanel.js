Ext.define('Ozone.components.admin.DashboardsTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboardstabpanel'],
    
    layout: {
        type: 'fit'
    },
    preventHeader: true,
    border: true,
    padding: 5,
    initDisabled: true,
    
    widgetLauncher: null,
    widgetEventingController: null,
    widgetStateHandler: null,
    isGroupDashboard: false,
    
    initComponent: function() {
		
      var self = this;

      Ext.apply(this,{
        items: [{
            xtype: 'dashboardsgrid',
            itemId: 'dashboardsgrid',
            preventHeader: true,
            border: false,
            listeners: {
              itemdblclick: {
                fn: function() {
                  this.doEdit();
                },
                scope: this
              }
            }
        }],

        dockedItems: [{
                xtype: 'toolbar',
                itemId: 'tbDashboardsGridHdr',
                cls: 'tbDashboardsGridHdr',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    cls: 'tbDashboardsGridHdr',
                    itemId: 'lblDashboardsGrid',
                    text:'Dashboards'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('dashboardsgrid');
                                if (grid != null) {
                                    grid.applyFilter(value, ['name']);
                                }
                            },
                            scope: this
                        }
                    }

                }]
            }]
      });

      this.on({
        //setup panel on the first activate
        'activate': {
            scope: this,
            fn: function(cmp, opts) {
                var grid = cmp.getComponent('dashboardsgrid');
                //var tbf = cmp.getDockedComponent('tbDashboardsGridFtr');
                var tb = cmp.getDockedComponent('tbDashboardsGridHdr');
                var lbl = tb.getComponent('lblDashboardsGrid');
                var comp = cmp.ownerCt;
                var compId = -1;
                // Create modified widget store and bind to grid
                grid.setStore(Ext.create('Ozone.data.stores.AdminDashboardStore', cmp.storeCfg));
                if (grid && comp) {
                    comp.record = comp.recordId ? comp.store.getAt(comp.store.findExact('id', comp.recordId)) : undefined;
                    compId = comp.recordId ? comp.recordId : -1;
                    var p = {
                      tab: 'dashboards',
                      adminEnabled: true
                    };
                    p[cmp.componentId] = compId;
                    grid.setBaseParams(p);
                }
            },
            single: true
        }

      });

      //reload store everytime the tab is activated
      this.on({
         activate: {
           fn: function(cmp, opts) {
             var grid = cmp.getComponent('dashboardsgrid');
             var store = grid.getStore();
             
             // Set the title
             if (cmp.ownerCt.record) {
            	 var titleText = cmp.ownerCt.record.get('title') || 'Dashboards';
                 var title = this.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblDashboardsGrid');
                 titleText = '<span class="heading-bold">' + Ext.htmlEncode(titleText) + '</span>';
                 title.setText(titleText);
             }
             
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
      
      OWF.Preferences.getUserPreference({
        namespace: 'owf.admin.DashboardEditCopy',
        name: 'guid_to_launch',
        onSuccess: function(result) {
          self.guid_DashboardEditCopyWidget = result.value;
        },
        onFailure: function(err) { /* No op */
            Ext.Msg.alert('Preferences Error', 'Error looking up Dashboard Editor: ' + err);
        }
      });

      this.callParent();
  },

  launchFailedHandler: function(response) {
      if (response.error) {
          Ext.Msg.alert('Launch Error', 'Dashboard Editor Launch Failed: ' + response.message);
      }
  },

  doCreate: function(button, e) {
    var dataString = Ozone.util.toString({
        isGroupDashboard: this.isGroupDashboard
    });
	OWF.Launcher.launch({
	      guid: this.guid_DashboardEditCopyWidget,
	      launchOnlyIfClosed: false,
	      data: dataString
    }, this.launchFailedHandler);
  },
  doEdit: function(button, e) {
	 var grid = this.getComponent('dashboardsgrid');
     var records = grid.getSelectedDashboards();
     if (records && records.length > 0) {
     	for (var i = 0; i < records.length; i++) {
          var id = records[i].data.guid;//From Id property of Dashboard Model
          var dataString = Ozone.util.toString({
	          id: id,
	          copyFlag: false,
              isGroupDashboard: this.isGroupDashboard
	      });
	
	      OWF.Launcher.launch({
	          guid: this.guid_DashboardEditCopyWidget,
	          launchOnlyIfClosed: false,
	          data: dataString
	      }, this.launchFailedHandler);
        }
     }
     else {
        Ext.Msg.alert("Error", "You must select at least one dashboard to edit");
     }
  },

  onStoreException: function(proxy, response, operation, eOpts) {
      var decodedResponse;
      try {
          decodedResponse = Ext.JSON.decode(response);
      }
      catch (e) {
          decodedResponse = {
              errorMsg: response
          };
      }
  
      Ext.Msg.alert('Server Error', 
              'Error during ' + operation.action + ': ' + errorMsg);
  }
});
