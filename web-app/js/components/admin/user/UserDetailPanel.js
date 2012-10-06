Ext.define('Ozone.components.admin.user.UserDetailPanel',{
    extend: 'Ext.panel.Panel',
    alias: ['widget.userdetailpanel'],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    detailsView: null,

    initComponent: function() {

        //create new store
        if (this.store == null) {
          this.store = Ext.StoreMgr.lookup({
            type: 'userstore'
          });
        }
		
        this.detailsView = Ext.create('Ext.view.View',{
            store: this.store,
            deferEmptyText: false,
            flex: 1,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="userdetailsummary">',
                        '<div id="detail-info" class="detail-info">',
                            '<div class="detail-block">',
                                '<div class="detail-title">{userRealName:htmlEncode}</div>',
                                '<div><span class="detail-label">User Name:</span> {username:htmlEncode}</div>',
                                '<div><span class="detail-label">Email:</span> {email:htmlEncode}</div>',
                                '<div><span class="detail-label">Last Sign In:</span> {lastLogin:this.renderDate}</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
                {
                    compiled: true,
                    renderDate: function(d) {
                        return d ? Ext.Date.format(new Date(d), "m-d-Y H:i") : '';
                    }
                }
            ),
            emptyText:'No user selected',
            itemSelector: 'div.userdetailsummary',
            autoScroll: 'true'
        });
        this.items = [this.detailsView];
        this.callParent(arguments);
    },
    loadData: function(record){
        this.detailsView.store.loadData([record],false);
    },
    removeData: function() {
        this.detailsView.store.removeAll(false);
    }
});