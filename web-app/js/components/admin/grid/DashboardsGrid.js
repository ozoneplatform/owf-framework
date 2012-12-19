Ext.define('Ozone.components.admin.grid.DashboardsGrid', {
  extend: 'Ext.grid.Panel',
  alias: ['widget.dashboardsgrid'],
  quickSearchFields: ['name'],
  plugins: new Ozone.components.focusable.FocusableGridPanel(),
  mixins: ['Ozone.components.WidgetAlerts'],

  cls: 'grid-dashboard',

  defaultPageSize: 50,
  forceFit: true,
  baseParams: null,

  initComponent: function() {

    //create new store
    if (this.store == null) {
      this.store = Ext.StoreMgr.lookup({
        type: 'admindashboardstore',
        pageSize: this.defaultPageSize
      });
    }
    
    if (this.baseParams) { this.setBaseParams(this.baseParams); }

    Ext.apply(this, {
        columnLines: true,
      columns: [
        {
          itemId: 'guid',
          header: 'GUID',
          dataIndex: 'guid',
          flex: 1,
          width: 210,
          minWidth: 210,
          sortable: true,
          hidden: true,
          renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {
            return  '<div class="grid-text">' + value +'</div>';
          }
        },
        {
          itemId: 'name',
          header: 'Dashboard Title',
          dataIndex: 'name',
          flex: 1,
          minWidth: 200,
          sortable: true,
          renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {

            var title = value;
            var dashboardLayoutList = record.get('EDashboardLayoutList'); //List of valid ENUM Dashboard Layout Strings
            var dashboardLayout = record.get('layout'); //current dashboard layout string
            var iconClass = "grid-dashboard-default-icon-layout";
            
            return  '<p class="grid-dashboard-title '+ iconClass + '">' + Ext.htmlEncode(title) + '</p>';
          }
        },
        {
          itemId: 'widgets',
          header: 'Widgets',
          dataIndex: 'layoutConfig',
          width: 250,
          sortable: false,
          renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {
        	  var widgetCount = 0;
        	  if (value) {
    			var countWidgets = function(cfg) {
    				if(!cfg || !cfg.items)
    					return;
    				
    				if(cfg.items.length === 0) {
    					if(cfg.widgets && cfg.widgets.length > 0) {
    						widgetCount += cfg.widgets.length;
    					}
    				}
    				else {
    					for(var i = 0, len = cfg.items.length; i < len; i++) {
    						countWidgets(cfg.items[i]);
    					}
    				}

    				return widgetCount;
    			};
          	    widgetCount = countWidgets(value);
        	  }
        	  return  '<div class="grid-text grid-dashboard-widget-count">' + widgetCount +'</div>';
          }
        }
      ]
    });


      Ext.apply(this, {
        multiSelect: true,
        dockedItems: [Ext.create('Ext.toolbar.Paging', {
          dock: 'bottom',
          store: this.store,
          displayInfo: true,
          hidden: this.hidePagingToolbar,
          itemId: 'dashboard-grid-paging'
        })]
      });

    this.callParent(arguments);
  },
  
  getSelectedDashboards: function(){
    return this.getSelectionModel().getSelection();
  },

  load: function() {
      this.store.loadPage(1);
  },

  refresh: function() {
    this.store.loadPage(this.store.currentPage);
  },

  getTopToolbar: function() {
    return this.getDockedItems('toolbar[dock="top"]')[0];
  },
  getBottomToolbar: function() {
    return this.getDockedItems('toolbar[dock="bottom"]')[0];
  },

  applyFilter: function(filterText, fields) {
    this.store.proxy.extraParams = undefined;

    if (filterText) {
      var filters = [];
      for (var i = 0; i < fields.length; i++) {
        filters.push({
          filterField: fields[i],
          filterValue: filterText
        });
      }
      this.store.proxy.extraParams = {
        filters: Ext.JSON.encode(filters),
        filterOperator: 'OR'
      };
    }
    
    if (this.baseParams) { this.setBaseParams(this.baseParams); }

    this.store.loadPage(1,{
      params: {
        offset: 0,
        max: this.store.pageSize
      }
    });
  },

  clearFilters: function() {
    this.store.proxy.extraParams = undefined;
    if (this.baseParams) { this.setBaseParams(this.baseParams); }
    this.store.load({
      params: {
        start: 0,
        max: this.store.pageSize
      }
    });
  },
  
  setBaseParams: function(params) {
      this.baseParams = params;
      if (this.store.proxy.extraParams) {
          Ext.apply(this.store.proxy.extraParams, params);
      } else {
          this.store.proxy.extraParams = params;
      }
  },
  
  setStore: function(store, cols) {
      this.reconfigure(store, cols);
      var pgtb = this.getBottomToolbar();
      if (pgtb) { pgtb.bindStore(store); }
  },
  
    doMoveRow: function(direction) {
        
        var dashboards = this.getSelectedDashboards();

        if (dashboards && dashboards.length > 0) {
            
            var store = this.store;
            
            dashboards.sort(function(a,b) {
                return a.get('dashboardPosition') - b.get('dashboardPosition');
            });
            
            if ('up' === direction) {
                var firstPosition = 1;
                for (var i = 0; i < dashboards.length; i++) {
                    if (dashboards[i].get('dashboardPosition') === firstPosition) {
                        firstPosition++;
                    } else {
                        var origPos = dashboards[i].get('dashboardPosition'), newPos = origPos - 1;
                        store.each(function(rec) {
                            var pos = rec.get('dashboardPosition')
                            if (pos) {
                                if (pos == newPos) {
                                    rec.set('dashboardPosition', origPos);
                                } else if (pos == origPos) {
                                    rec.set('dashboardPosition', newPos);
                                }
                            }
                        })
                    }
                }
            } else {
                var lastPosition = store.getCount();
                for (var i = dashboards.length - 1; i >= 0; i--) {
                    if (dashboards[i].get('dashboardPosition') === lastPosition) {
                        lastPosition--;
                    } else {
                        var origPos = dashboards[i].get('dashboardPosition'), newPos = origPos + 1;
                        store.each(function(rec) {
                            var pos = rec.get('dashboardPosition')
                            if (pos) {
                                if (pos == origPos) {
                                    rec.set('dashboardPosition', newPos);
                                } else if (pos == newPos) {
                                    rec.set('dashboardPosition', origPos);
                                }
                            }
                        })
                    }
                }
            }
            
            //If records were updated, sync, refresh, and reselect rows
            
            if (store.getUpdatedRecords().length) {
                store.sync();

                store.on('write', function() {
                    this.refresh();
                }, this, {
                    single: true
                });

                //After the store is loaded, reselect the selected stacks
                store.on('load', function(store, records, successful, operation) {
                    for (var i = 0; i < dashboards.length; i++) {
                        this.getSelectionModel().select(store.indexOfId(dashboards[i].get('id')), true);
                    }
                }, this, {
                    single: true
                });
            }
        }
        else {
            this.showAlert('Error', 'You must select at least one dashboard to move.');
        }
    }

});
