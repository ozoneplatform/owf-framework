Ext.define('Ozone.components.admin.widget.WidgetEditUsersTab', {
    extend: 'Ozone.components.admin.UsersTabPanel',
    alias: [
        'widget.widgeteditusers',
        'widget.widgetedituserstab',
        'widget.Ozone.components.admin.widget.WidgetEditUsersTab'
    ],
    cls: 'widgetedituserstab',
    preventHeader: true,

    initComponent: function () {
		
        var self = this;
        Ext.applyIf(this,{
            layout:'fit',
            itemId: 'users-tab',
            iconCls: 'users-tab',
            title: 'Users',
            editor: 'Widget',
            componentId: 'widget_id',
            storeCfg: {
                api: {
                    read: '/user',
                    create: '/widget',
                    update: '/user',
                    destroy: '/widget'
                },
                methods: {
                    read: 'GET', 
                    load: 'GET',  
                    create: 'PUT', 
                    update: 'PUT', 
                    save: 'POST', 
                    destroy: 'PUT'
                },
                updateActions: {
                    destroy: 'remove',
                    create: 'add'
                }
            }
        });
        this.callParent(arguments);
    }
});