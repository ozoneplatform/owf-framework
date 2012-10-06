Ext.define('Ozone.components.admin.GroupsGrid', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.groupsgrid'],
    plugins: new Ozone.components.focusable.FocusableGridPanel(),

    title: 'Groups',
    columns: [
        {
          itemId: 'id',
          header: 'ID',
          dataIndex: 'id',
          sortable: true,
          hidden: true
        },
        {
            header: 'Group Name',
            dataIndex: 'displayName',
            flex: 3,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                return this.renderCell(Ext.htmlEncode(value ? value : record.data.name), metaData, record);
            }
        }, {
            header: 'Users',
            dataIndex: 'totalUsers',
            flex: 1,
            sortable: false,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                return this.renderCell(value, metaData, record);
            }
        }, {
            header: 'Widgets',
            dataIndex: 'totalWidgets',
            flex: 1,
            sortable: false,
            renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                return this.renderCell(value, metaData, record);
            }
        }
    ],
    defaultPageSize: 50,
    multiSelect: true,
    
    initComponent: function() {
        Ext.apply(this,{
        	columnLines:true
        });
        this.store = Ext.create('Ozone.data.GroupStore', {
            id: 'groupstore',
            autoLoad: false,
            pageSize: this.defaultPageSize
        });
        
        this.bbar = Ext.create('Ext.toolbar.Paging', {
            itemId: 'bottomBar',
            store: this.store,
            pageSize: this.pageSize,
            displayInfo: true
        });
        
        this.relayEvents(this.store, ['datachanged']);
        
        this.callParent(arguments);
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
                max: this.pageSize
            }
        });
        
    },
    
    clearFilter: function() {
        this.store.proxy.extraParams = undefined;
        if (this.baseParams) { this.setBaseParams(this.baseParams); }
        this.store.load({
            params: {
                start: 0,
                max: this.pageSize
            }
        });
    },
    
    renderCell: function(value, meta, record) {
        if (record.get('status') == 'inactive') {
            meta.tdCls += ' x-item-disabled';
        }
        return value;
    },

    setBaseParams: function (params) {
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

    getTopToolbar: function() {
    	return this.getDockedItems('toolbar[dock="top"]')[0];
    },

    getBottomToolbar: function() {
    	return this.getDockedItems('toolbar[dock="bottom"]')[0];
    },

    load: function() {
        this.store.loadPage(1);
    },

    refresh: function() {
      this.store.loadPage(this.store.currentPage);
    }
});
