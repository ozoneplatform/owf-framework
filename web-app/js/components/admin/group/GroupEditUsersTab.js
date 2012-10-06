Ext.define('Ozone.components.admin.group.GroupEditUsersTab', {
    extend: 'Ozone.components.admin.UsersTabPanel',
    alias: [
        'widget.groupeditusers',
        'widget.groupedituserstab',
        'widget.Ozone.components.admin.group.GroupEditUsersTab'
    ],
    cls: 'groupedituserstab',
    preventHeader: true,

    initComponent: function () {
		
        var self = this;
        Ext.applyIf(this,{
            itemId: 'users-tab',
            iconCls: 'users-tab',
            title: 'Users',
            editor: 'Group',
            componentId: 'group_id',
            storeCfg: {
                api: {
                    read: '/user',
                    create: '/group',
                    update: '/user',
                    destroy: '/group'
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