Ext.define('Ozone.components.admin.group.GroupDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.groupdetailpanel'],
    
    viewGroup: null,
    
    initComponent: function() {
        
        this.viewGroup = Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
                storeId: 'storeGroupItem',
                fields: [
                    { name: 'name', type: 'string' },
                    { name: 'status',  type: 'string' },
                    { name: 'automatic', type: 'string' },
                    { name: 'description', type: 'string' }
                ]
            }),
            deferEmptyText: false,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="selector">',
                        '<div id="detail-info" class="detail-info">',
                            '<div class="detail-block">',
                                '<div class="detail-title">{name:htmlEncode}</div>',
                                '<div><span class="detail-label">Status:</span> {status:this.renderStatus}</div>',
                                '<div><span class="detail-label">User Management:</span> {automatic:this.renderUserMgmt}</div>',
                            '</div>',
                            '<div><span class="detail-label">Description:</span></div>',
                            '<div>{description:htmlEncode}</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
                {
                    compiled: true,
                    renderStatus: function(status) {
                        if (status == 'active') {
                            return 'active'
                        } else {
                            return 'inactive'
                        }
                    },
                    renderUserMgmt: function(value) {
                        if (value) {
                            return 'Automatic'
                        } else {
                            return 'Manual'
                        }
                    }
                }
            ),
			emptyText: 'No group selected',
            itemSelector: 'div.selector',
            autoScroll: 'true'
        });
        
        this.items = [this.viewGroup];
        
        this.callParent(arguments);
    },
    
    loadData: function(record) {
        this.viewGroup.store.loadData([record], false);
    },
    
    removeData: function() {
        this.viewGroup.store.removeAll(false);
    }
    
});