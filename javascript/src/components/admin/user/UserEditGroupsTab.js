Ext.define('Ozone.components.admin.user.UserEditGroupsTab', {
    extend: 'Ozone.components.admin.GroupsTabPanel',
    alias: [
        'widget.usereditgroups',
        'widget.usereditgroupstab',
        'widget.Ozone.components.admin.user.UserEditGroupsTab'
    ],

    cls: 'usereditgroupstab',

    initComponent: function() {
        Ext.applyIf(this, {
            layout: 'fit',
            padding: 5,
            itemId: 'tabGroups',
            iconCls: 'groups-tab',
            editor: 'User',
            componentId: 'user_id',
            title: 'Groups',
            //userRecord: null,
            storeCfg: {
                api: {
                    read: '/group',
                    create: '/user',
                    update: '/group',
                    destroy: '/user'
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
                },
                pageSize: 50
            },
            addFilter: {
                automatic: false
            }
        });

        this.callParent();
    },
    initBaseParams: function(record) {
        this.baseParams = {
            user_id:record.data.id
        };
        this.applyFilter();
    }
});