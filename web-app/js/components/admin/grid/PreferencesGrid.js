Ext.define('Ozone.components.admin.grid.PreferencesGrid', {
  extend: 'Ext.grid.Panel',
  alias: ['widget.preferencesgrid'],
  plugins: new Ozone.components.focusable.FocusableGridPanel(),

  cls: 'grid-preference',
  
  defaultPageSize: 50,
//  infiniteScrolling: false,
  forceFit: true,
  baseParams: null,
  multiSelect: true,

  initComponent: function() {

    //create new store
    if (this.store == null) {
      this.store = Ext.StoreMgr.lookup({
        type: 'preferencestore',
        pageSize: this.defaultPageSize
      });
    }
    
    if (this.baseParams) { this.setBaseParams(this.baseParams); }

    Ext.apply(this, {
    	columnLines: true,
      columns: [
        {
          itemId: 'name',
          header: 'Preference Name',
          dataIndex: 'path',
          flex: 1,
          width: 210,
          minWidth: 210,
          sortable: true,
          renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {
            return  '<div class="grid-text">' + Ext.htmlEncode(value) +'</div>';
          }
        },
        {
          itemId: 'namespace',
          header: 'Namespace',
          dataIndex: 'namespace',
          flex: 1,
          minWidth: 200,
          sortable: true,
		  renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {
            return  '<div class="grid-text">' + Ext.htmlEncode(value) +'</div>';
          }
		},
        {
			itemId: 'value',
			header: 'Value',
			dataIndex: 'value',
			width: 250,
			sortable: false,
			renderer: function(value, metaData, record, rowIndex, columnIndex, store, view){
				return '<div class="grid-text">' + Ext.htmlEncode(value) + '</div>';
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
          itemId: 'preferences-grid-paging'
        })]
      });

    this.callParent(arguments);
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
  }

});
