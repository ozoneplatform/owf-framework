Ext.define('Ozone.components.grid.DashboardsGrid', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.dashboardsgrid'],
    plugins: [
        new Ozone.components.focusable.FocusableGridPanel()
    ],
    cls: 'grid-dashboard',
    defaultPageSize: 50,
    forceFit: true,

    initComponent: function() {
        
        Ext.apply(this, {
            columnLines: true,
            columns: [
                {
                    itemId: 'colName',
                    header: 'Name',
                    dataIndex: 'name',
                    flex: 1,
                    width: 210,
                    minWidth: 210,
                    sortable: true,
                    hidden: false,
                    renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {
                        var title = value;
                        var dashboardLayoutList = record.get('EDashboardLayoutList'); //List of valid ENUM Dashboard Layout Strings
                        var dashboardLayout = record.get('layout'); //current dashboard layout string
                        var iconClass = 'grid-dashboard-default-icon-layout';
                        
                        // if (dashboardLayout && dashboardLayoutList) {
                        //     if (dashboardLayoutList.indexOf(dashboardLayout) != -1) {
                        //         iconClass = "grid-dashboard-icon-layout-" + dashboardLayout;
                        //     }
                        // }
                        
                        // var retVal = '';
                        // retVal += '<div class="grid-dashboard-title-box"><div class="grid-dashboard-icon ' + iconClass +'"></div>';
                        // retVal += '<p class="grid-dashboard-title">' + title;
                        // retVal += '</p></div></div>';
                        
                        return  '<p class="grid-dashboard-title '+ iconClass + '">' + Ext.htmlEncode(title) + '</p>'; 
                    }
                }
            ]
        });

        this.callParent(arguments);

        this.on({
          viewready: {
            fn: function() {
              var selectedDashboard = this.store.findRecord('guid', this.activeDashboard);
              this.select(selectedDashboard);
            },
            scope: this
          }
        });

    },

//    refreshStore: function() {
//        this.getStore().load({
//            callback: function() {
//                var selectedDashboard = this.store.findRecord('guid', this.activeDashboard);
//                this.select(selectedDashboard);
//            },
//            scope: this
//        });
//    },

    // accepts record/index
    select: function(obj) {
      var gdv = this.down('gridview');
      gdv.select(obj);

      var selected = gdv.getSelectedNodes()[0];
      if (selected != null) {
        var offsets = Ext.get(selected).getOffsetsTo(gdv.getEl());
        //gdv.getEl().scroll('down', offsets[1], false);
        if (this.verticalScroller.rendered) {
          this.verticalScroller.scrollByDeltaY(offsets[1]);
        }
        else {
          this.on({
            afterlayout: {
              fn: function(sc,orientation,eopts) {
                this.verticalScroller.scrollByDeltaY(offsets[1]);
              },
              scope: this,
              single: true
            }
          })
        }

      }
    }
});
