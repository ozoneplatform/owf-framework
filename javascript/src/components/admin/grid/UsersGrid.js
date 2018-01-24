Ext.define('Ozone.components.UsersGrid', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.usersgrid', 'widget.Ozone.components.UsersGrid'],
    plugins: new Ozone.components.focusable.FocusableGridPanel(),
    mixins: {
        filter: 'Ozone.components.admin.grid.FilterMixin'
    },
    store: null,
    baseParams: {},
    quickSearchFields: ['userRealName', 'username', 'email'],
    showHeaderBar: true,

    viewConfig: {
        forceFit: true
    },
    defaultPageSize: 50,
    initComponent: function(){
        if (this.store == null) {
            this.store = Ext.StoreMgr.lookup({
                type: 'userstore',
                pageSize: this.defaultPageSize
            });
        }
        
        if (this.baseParams) {
            this.setBaseParams(this.baseParams);
        }
        
        this.columns = [{
            itemId: 'id',
            header: 'ID',
            dataIndex: 'id',
            sortable: true,
            hidden: true
          },
          {
			header: 'User Name',
			dataIndex: 'username',
			flex: 2,
            sortable: true,
            editable: false,
			hidden: true,
            renderer: function(v) {
                return v ? Ext.htmlEncode(v) : "";
            }
		}, {
            header: 'Full Name',
            dataIndex: 'userRealName',
            flex: 2,
            sortable: true,
            editable: false,
            renderer: function(v) {
                return v ? Ext.htmlEncode(v) : "";
            }
        }, {
            header: 'Last Sign In',
            dataIndex: 'lastLogin',
            flex: 2,
            sortable: true,
            editable: false,
            renderer: function(v){
                return v ? Ext.Date.format(new Date(v), "m-d-Y H:i") : "";
            }
        }, {
            header: 'Groups',
            dataIndex: 'totalGroups',
            flex: 1,
            sortable: false,
            editable: false
        }, {
            header: 'App Components',
            dataIndex: 'totalWidgets',
            flex: 2,
            sortable: false,
            editable: false
        }, {
            header: 'Pages',
            dataIndex: 'totalDashboards',
            flex: 1,
            sortable: false,
            editable: false
        }, {
            header: 'Apps',
            dataIndex: 'totalStacks',
            flex: 1,
            sortable: false,
            editable: false
        }];
        
        Ext.apply(this, {
            multiSelect: true,
            dockedItems: [Ext.create('Ext.toolbar.Paging', {
                itemId: 'bottomBar',
                dock: 'bottom',
                store: this.store,
                pageSize: this.pageSize,
                displayInfo: true,
                hidden: this.hidePagingToolbar
            })],
            columnLines: true
        });
        
        this.relayEvents(this.store, ['datachanged']);
        this.callParent(arguments);
    },
    setBaseParams: function(params){
        this.baseParams = params;
        if (this.store.proxy.extraParams) {
            Ext.apply(this.store.proxy.extraParams, params);
        }
        else {
            this.store.proxy.extraParams = params;
        }
    },
    load: function(){
        this.store.loadPage(1);
    },
    refresh: function(){
        this.store.loadPage(this.store.currentPage);
    },
    setStore: function(store, cols){
        this.reconfigure(store, cols);
        var pgtb = this.getBottomToolbar();
        if (pgtb) {
            pgtb.bindStore(store);
        }
    },
    getTopToolbar: function(){
        return this.getDockedItems('toolbar[dock="top"]')[0];
    },
    getBottomToolbar: function(){
        return this.getDockedItems('toolbar[dock="bottom"]')[0];
    }
});
