Ext.define('Ozone.components.admin.widget.WidgetManagementPanel', {
  extend: 'Ozone.components.admin.ManagementPanel',
  alias: ['widget.widgetmanagement', 'widget.widgetmanagementpanel', 'widget.Ozone.components.admin.widget.WidgetManagementPanel'],

  dragAndDrop: true,
  launchesWidgets: true,
  channel: 'AdminChannel',
  defaultTitle: 'Widgets',
  minButtonWidth: 80,
  cls: 'widgetmanagementpanel',
  detailsAutoOpen: true,

  initComponent: function() {

    var me = this;

    OWF.Preferences.getUserPreference({
      namespace: 'owf.admin.WidgetEditCopy',
      name: 'guid_to_launch',
      onSuccess: function(result) {
        me.guid_EditCopyWidget = result.value;
      },
      onFailure: function(err) { /* No op */
        me.showAlert('Preferences Error', 'Error looking up Widget Editor: ' + err);
      }
    });

    Ext.applyIf(this, {
      xtype: 'panel',
      itemId: 'main',
      layout: {
        type: 'border'
      },
      items: [
        {
          xtype: 'widgetsgrid',
          itemId: 'grid',
          border: false,
          region: 'center'

        },
        {
          xtype: 'widgetdetailpanel',
          itemId: 'widgetdetailpanel',
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
                            grid.applyFilter(value, ['displayName', 'universalName']);
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
              text: 'Create',
              itemId: 'create',
              handler: function(btn, evt) {
                evt.stopPropagation();
                this.doCreate();
              },
              scope: this
            },
            {
                xtype: 'splitbutton',
                text: 'Edit',
                itemId: 'editButton',
                handler: function() {
                    var grid = this.down('#grid');
                    var records = grid.getSelectionModel().getSelection();
                    if (records && records.length > 0) {
                        for (var i = 0; i < records.length; i++) {
                            this.doEdit(records[i].data.id, records[i].data.name);
                        }
                    }
                    else {
                        me.showAlert('Error', 'You must select at least one widget to edit.');
                    }
                },
                menu: {
                    xtype: 'menu',
                    plain: true,
                    hideMode: 'display',
                    defaults: {
                        minWidth: this.minButtonWidth
                    },
                    items: [
                        {
                            xtype: 'owfmenuitem',
                            text: 'Export',
                            handler: function(button) {
                                var records = me.down('#grid').getSelectionModel().getSelection();
                                if(records && records.length === 1) {
                                    me.doExport('widget', records[0]);
                                }
                                else if(records && records.length > 1) {
                                    me.showAlert('Error', 'You must select only one widget to export.');
                                }
                                else {
                                    me.showAlert('Error', 'You must select a widget to export.');
                                }
                            }
                        }
                    ]
                },
                scope: this
            },
            {
              xtype: 'button',
              text: 'Delete',
              itemId: 'deleteButton',
              handler: function() {
                var grid = this.down('#grid');
                var records = grid.getSelectionModel().getSelection();
                if (records && records.length > 0) {
                    this.createDeleteWindow(records);
                }
                else {
                    me.showAlert('Error', 'You must select at least one widget to delete.');
                }
              },
              scope: this
            }
          ]
        }
      ]
    });

    this.callParent();
        
    OWF.Eventing.subscribe('AdminChannel', owfdojo.hitch(this, function(sender, msg, channel) {
        if(msg.domain === 'Widget') {
            this.down('#grid').getBottomToolbar().doRefresh();
        }
    }));

    this.on({
      render: {
        fn: function() {

          //bind to grid after render
          var grid = this.down('#grid');
          if (grid != null) {

            grid.on({
              itemdblclick: {
                fn: function() {
                  var records = grid.getSelectionModel().getSelection();
                  if (records && records.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        this.doEdit(records[i].data.id, records[i].data.name);
                    }
                  }
                  else {
                    me.showAlert('Error', 'You must select at least one widget to edit.');
                  }
                },
                scope: this
              },
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

            grid.getView().on({
              itemkeydown: {
                  scope: this,
                  fn: function(view, record, dom, index, evt) {
                      switch(evt.getKey()) {
                          case evt.SPACE:
                          case evt.ENTER:
                              this.doEdit(record.data.id, record.data.name);
                      }
                  }
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

  createDeleteWindow: function(widgetsToDelete) {
    var me = this;
    var vpSize = Ext.getBody().getViewSize();

    var widgetsToDeleteIds = [];
    if (widgetsToDelete != null) {
      for (var i = 0; i < widgetsToDelete.length; i++) {
        widgetsToDeleteIds.push(widgetsToDelete[i].data.widgetGuid);
      }
    }

    OWF.Preferences.getDependentWidgets({
      content: {'ids': widgetsToDeleteIds},
      onSuccess: Ext.bind(function(ret) {
        var requiredWidgets = ret.data;

        if (requiredWidgets != null && requiredWidgets.length > 0) {
          var win = Ext.create('Ext.window.Window', {
            title: 'Warning',
            itemId: 'deletewidgetwindow',
            minWidth: 250,
            minHeight: 200,
            width: vpSize.width * .8,
            height: vpSize.height * .75,
            layout: 'fit',
            modal: true,
            items: [
              {
                xtype: 'deletewidgetspanel',
                itemId: 'deletewidgetspanel',
                delWidgets: widgetsToDelete,
                requiredWidgets: requiredWidgets,
                listeners: {
                  'delete': {
                    fn: function(data) {
                      if (data != null && data.widgetGuidsToDelete != null) {
                        //actually delete these widgets
                        OWF.Preferences.deleteWidgetDefs({
                          content: {'id': data.widgetGuidsToDelete, '_method': 'delete'},
                          onSuccess: Ext.bind(function(ret) {
                            var grid = this.down('#grid');

                            if (grid != null) {
                              grid.refresh();
                            }
                            win.close();
                          }, this),
                          onFailure: function() {
                            me.showAlert(Ozone.util.ErrorMessageString.saveUpdatedWidgets, Ozone.util.ErrorMessageString.saveUpdatedWidgetsMsg);
                          }
                        });
                      }
                    },
                    scope: this
                  },
                  cancel: {
                    fn: function() {
                      win.close();
                    },
                    scope: this
                  }
                }
              }
            ]
          });
          win.show();
        }
        else {
            var msg = 'This action will permanently delete ';
            if (widgetsToDelete.length == 1) {
                msg += '<span class="heading-bold">' + Ext.htmlEncode(widgetsToDelete[0].data.name) + '</span>.';
            }
            else {
                msg += 'the selected <span class="heading-bold">' + widgetsToDelete.length + ' widgets</span>.';
            }
            this.showConfirmation('Warning', msg, function(btn, text, opts) {
                if (btn == 'ok') {
                    var grid = me.down('#grid');
                    var store = grid.store;
                    var autoSave = store.autoSave;
                    store.autoSave = false;
                    store.remove(widgetsToDelete);
                    var remainingRecords = store.getTotalCount() - widgetsToDelete.length;
                    store.on({
                        write: {
                            fn: function(s, b, data) {
                                if(store.data.items.length == 0 && store.currentPage > 1) {
                                    var lastPage = store.getPageFromRecordIndex(remainingRecords - 1);
                                    var pageToLoad = (lastPage >= store.currentPage) ? store.currentPage : lastPage;
                                    store.loadPage(pageToLoad);
                                }
                                grid.getBottomToolbar().doRefresh();
                            },
                            scope: this,
                            single: true
                        }
                    });
                    store.save();
                }
            });
        }
      }, this),
      onFailure: function() {
          me.showAlert('Error', 'Error deleting the selected widget(s).');
      }
    });
  }
});
