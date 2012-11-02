Ext.define('Ozone.components.admin.widget.WidgetApprovalPanel', {
  extend: 'Ozone.components.admin.ManagementPanel',
  alias: ['widget.WidgetApprovalPanel', 'widget.widgetapprovalpanel', 'widget.Ozone.components.admin.widget.WidgetApprovalPanel'],

  dragAndDrop: true,
  launchesWidgets: true,
  channel: 'AdminChannel',
  defaultTitle: 'Widget Requests',
  minButtonWidth: 80,
  cls: 'widgetapprovalpanel',
  detailsAutoOpen: true,

  initComponent: function() {

    var me = this;

    //create new store
    Ext.apply(this, {
      xtype: 'panel',
      itemId: 'main',
      layout: {
        type: 'border'
      },
      items: [
        {
          xtype: 'widgetapprovalsgrid',
          itemId: 'grid',
          border: false,
          region: 'center'

        },
        {
          xtype: 'widgetdetailpanel',
          itemId: 'widgetdetailpanel',
          store:  Ext.create('Ozone.data.stores.WidgetApprovalStore'),
          region: 'east',
          preventHeader: true,
          collapseMode: 'mini',
          collapsible: true,
          collapsed: true,
          split: true,
          border: false,
          width: 300
        }
      ],
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'top',
          layout: {
              type: 'hbox',
              align: 'stretchmax'
          },
          items: [
            {
              itemId: 'tbtext',
              xtype: 'tbtext',
              text: '<span class="heading-bold">' + this.defaultTitle + ' </span>'
            },
            '->',
            {
                xtype: 'searchbox',
                listeners: {
                    searchChanged: function(box, value) {
                        var grid = me.down('#grid');
                        if (grid != null) {
                            grid.applyFilter(value, ['name','userId','userRealName']);
                        }
                    }
                }
            }
          ]
        },
        {
          xtype: 'toolbar',
          dock: 'bottom',
          ui: 'footer',
          defaults: {
            minWidth: this.minButtonWidth
          },
          items: [
            {
              xtype: 'button',
              text: 'Approve',
              itemId: 'approveButton',
              handler: function() {
                var grid = this.down('#grid');
                var records = grid.getSelectionModel().getSelection();
                if (records && records.length > 0) {
                  this.approve(records);
                }
                else {
                    me.showAlert('Error', 'You must select at least one widget to approve.');
                }
              },
              scope: this
            },
            {
              xtype: 'button',
              text: 'Reject',
              itemId: 'rejectButton',
              handler: function() {
                var grid = this.down('#grid');
                var records = grid.getSelectionModel().getSelection();
                if (records && records.length > 0) {
                  this.reject(records);
                }
                else {
                    me.showAlert('Error', 'You must select at least one widget to reject.');
                }
              },
              scope: this
            }
          ]
        }
      ]
    });

    this.callParent();

    this.on({
      render: {
        fn: function() {

          //bind to grid after render
          var grid = this.down('#grid');
          if (grid != null) {

            grid.on({
              select: {
                fn: function(rowModel, record, index, opts) {
                  var widgetdetailpanel = this.down('#widgetdetailpanel');
                  if (widgetdetailpanel != null) {
                    widgetdetailpanel.load(record);
                    if(this.detailsAutoOpen) {
                    	widgetdetailpanel.expand();
                    }
                  }
                },
                scope: this
              }
            });

            //load the data
            grid.load();

            grid.store.on({
              datachanged: {
                fn: function() {
                  //collapse and clear detail panel if the store is refreshed
                  var widgetdetailpanel = this.down('#widgetdetailpanel');
                  if (widgetdetailpanel != null) {
                    widgetdetailpanel.collapse();
                    widgetdetailpanel.clear();
                  }

                  //refresh launch menu
                  if (!this.disableLaunchMenuRefresh) {
                    this.refreshWidgetLaunchMenu();
                  }
                },
                scope: this
              }
            })
          }
        },
        scope: this
      },
      afterrender: {
    	  fn: function() {
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
    	  scope: this
      }
    });
  },

  createApprovalWindow: function(widgets) {

    var me = this;

    var requestedWidgetIds  = Ext.create('Ext.util.MixedCollection');
    requestedWidgetIds.getKey = function(obj) {
      return obj;
    };

    var requiredWidgetIds  = Ext.create('Ext.util.MixedCollection');
    requestedWidgetIds.getKey = function(obj) {
      return obj;
    };

    var allWidgetRequests = Ext.create('Ext.util.MixedCollection');
    allWidgetRequests.getKey = function(obj) {
      return obj.userId +'-'+obj.widgetGuid;
    };

    if (widgets != null) {
      for (var i = 0; i < widgets.length; i++) {
        var w = widgets[i].data;
        requestedWidgetIds.add(w.widgetGuid);
        allWidgetRequests.add({
          userId: w.userId,
          widgetGuid: w.widgetGuid
        });
        if (w.allRequired != null && w.allRequired.length > 0) {
          for (var j = 0 ; j < w.allRequired.length ; j++) {
            requiredWidgetIds.add(w.allRequired[j]);
            allWidgetRequests.add({
              userId: w.userId,
              widgetGuid: w.allRequired[j]
            });
          }
        }
      }
    }

      //get all required widgets requests via ajax call
      Ext.Ajax.request({
          url: Ozone.util.contextPath() + '/widget',
          params: {
              id: requiredWidgetIds.getRange(),
              _method: 'GET'
          },
          success: function(response, opts) {
              var json = Ext.decode(response.responseText);
              if (json) {
                var data = json.data;
                if (data != null && data.length > 0) {

                  var requiredWidgets = [];
                  if (data) {
                    for (var i = 0; i < data.length; i++) {
                      var widgetData = {
                          id: data[i].id,
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
                          userId: data[i].value.userId,
                          userRealName: data[i].value.userRealName,
                          totalUsers: data[i].value.totalUsers,
                          totalGroups: data[i].value.totalGroups,
                          singleton: data[i].value.singleton
                        };
                      //make sure we don't include the same widgets that we want to approve
                      if (!requestedWidgetIds.containsKey(widgetData.widgetGuid)) {
                        requiredWidgets.push(widgetData);
                      }
                    }
                  }

                  //open approve window
//                  var vpSize = Ext.getBody().getViewSize();
//                  var win = Ext.create('Ext.window.Window', {
//                    id: 'approvewindow',
//                    title: 'Warning',
//                    itemId: 'approvewindow',
//                    minWidth: 250,
//                    minHeight: 200,
//                    width: vpSize.width * .8,
//                    height: vpSize.height * .75,
//                    width: 250,
//                    height: 200,
//                    layout: 'fit',
//                    modal: true,
//                    items: [
//                      {
//                        xtype: 'approvepanel',
//                        itemId: 'approvepanel',
//                        widgets: widgets,
//                        requiredWidgets: requiredWidgets,
//                        listeners: {
//                          approve: {
//                            fn: function(data) {
//                                this.doApproveReject(allWidgetRequests.getRange());
//                            },
//                            scope: this
//                          },
//                          cancel: {
//                            fn: function() {
//                              win.close();
//                            },
//                            scope: this
//                          }
//                        }
//                      }
//                    ]
//                  });
//                  win.show();

                  var msg = 'You have selected to approve ';
                  var selectedWidgetCount = widgets.length;
                  msg += selectedWidgetCount > 1 ? ('<span class="heading-bold">'+ selectedWidgetCount + '</span> widgets')
                          : ('<span class="heading-bold">'+widgets[0].data.name+'</span>');
                  msg += '. <br/><br/> '+ (selectedWidgetCount > 1 ? 'These widgets require' : 'This widget requires')
                          + ' other widget(s) in OWF. Approving '+ (selectedWidgetCount > 1 ? 'these widgets' : 'this widget ')
                          + ' will automatically approve '+ (selectedWidgetCount > 1 ? 'their' : 'its') +' required widget(s).';

                  this.showConfirmation('Warning', msg, function(btn, text, opts) {
                      if (btn == 'ok') {
                          this.doApproveReject(allWidgetRequests.getRange());
                      }
                  });
                }
              }
          },
          failure: function(response, opts) {
              me.showAlert('Error', 'Error retrieving required widgets.');
          },
          scope: this
      });



  },

  approve: function(requests) {
    var requiredWidgetsExist = false;
    if (requests != null) {
      for (var i = 0; i < requests.length; i++) {
        if (requests[i].data.allRequired != null && requests[i].data.allRequired.length > 0) {
          requiredWidgetsExist = true;
          break;
        }
      }

      if (requiredWidgetsExist) {
        this.createApprovalWindow(requests);
      }
      //just approve the widgets no required widgets found
      else {
        this.doApproveReject(requests);
      }

    }

  },

  reject: function(requests) {
    this.doApproveReject(null,requests);
  },

  doApproveReject : function(approveList, rejectList) {
    var toApprove = [];
    var toReject = [];

    var dt = new Date();
    var dateString = Ext.Date.format(dt,'Y-m-d');

    if (approveList) {
      for (var i = 0, len = approveList.length ; i < len ; i++) {
        var rec = approveList[i].data != null ? approveList[i].data : approveList[i];
        toApprove.push({
//          id: rec.id,
          userId: rec.userId,
          widgetGuid: rec.widgetGuid
        });
      }
    }
    if (rejectList) {
      for (var i = 0, len = rejectList.length ; i < len ; i++) {
        var rec = rejectList[i].data != null ? rejectList[i].data : rejectList[i];
        toReject.push({
          //id: rec.id,
          userId: rec.userId,
          widgetGuid: rec.widgetGuid
        });
      }
    }

    Ext.Ajax.request({
      url: Ozone.util.contextPath() + '/widget/approve',
      method: 'POST',
      timeout: 30000,
      autoAbort: false,
      disableCaching: true,
      params: {
        toApprove: Ext.encode(toApprove),
        toDelete: Ext.encode(toReject)
      },
      scope: this,
      success: function() {
        //refresh store
        var grid = this.down('#grid');
        grid.refresh();

        var win = Ext.getCmp('approvewindow');
        if (win) {
          win.close();
        }
      },
      failure: function() {
        me.showAlert('Error', 'Server Error during approve or reject.');
        var win = Ext.getCmp('approvewindow');
        if (win) {
          win.close();
        }
      }
    });
  }

});
