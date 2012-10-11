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
            self.showAlert('Preferences Error', 'Error looking up Dashboard Editor: ' + err);
        }
      });

      //Set the messagebox to use display:none to hide otherwise
      //the circular focus of the editor will break
      Ext.Msg.hideMode = 'display';

      this.callParent();
  },

  launchFailedHandler: function(response) {
      if (response.error) {
          this.showAlert('Launch Error', 'Dashboard Editor Launch Failed: ' + response.message);
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
  
      this.showAlert('Server Error', 'Error during ' + operation.action + ': ' + errorMsg);
  },
    showAlert: function(title, msg) {
        var alert = Ext.Msg.alert(title, msg),
            okBtnEl = alert.down('button').btnEl;
            
        var onKeyDown = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                //Disable tabbing out of the alert
                event.stopEvent();
            }
        };

        okBtnEl.on('keydown', onKeyDown);

        alert.on('hide', function() {
            okBtnEl.un('keydown', onKeyDown);
        }, this, {single: true});
    },
    showConfirmation: function(title, msg, okFn) {
        var alert = Ext.Msg.show({
            title: title,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            closable: false,
            modal: true,
            scope: this,
            listeners: null,
            fn: okFn
        });

        var buttons = alert.query('button'),
            okBtn, cancelBtn;

        for(var i = 0; i < buttons.length; i++) {
            if(buttons[i].itemId === 'ok') {
                okBtn = buttons[i];
            }
            else if(buttons[i].itemId === 'cancel') {
                cancelBtn = buttons[i];
            }
        }

        var onKeyDownOkBtn = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                event.stopEvent();
                Ext.defer(function() {
                    cancelBtn.focus();
                }, 1);
            }
        };
        var onKeyDownCancelBtn = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                event.stopEvent();
                Ext.defer(function() {
                    okBtn.focus();
                }, 1);
            }
        };

        okBtn.el.on('keydown', onKeyDownOkBtn);
        cancelBtn.el.on('keydown', onKeyDownCancelBtn);

        alert.on('hide', function() {
            okBtn.el.un('keydown', onKeyDownOkBtn);
            cancelBtn.el.un('keydown', onKeyDownCancelBtn);
        }, this, {single: true});
    }
});
