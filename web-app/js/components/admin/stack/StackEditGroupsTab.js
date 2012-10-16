Ext.define('Ozone.components.admin.stack.StackEditGroupsTab', {
    extend: 'Ozone.components.admin.GroupsTabPanel',
    alias: [
        'widget.stackeditgroups',
        'widget.stackeditgroupstab',
        'widget.Ozone.components.admin.stack.StackEditGroupsTab'
    ],

    cls: 'stackeditgroupstab',

    initComponent: function() {
        Ext.applyIf(this, {
            layout: 'fit',
            padding: 5,
            itemId: 'tabGroups',
            iconCls: 'groups-tab',
            editor: 'Stack',
            componentId: 'stack_id',
            title: 'Groups',
            storeCfg: {
                api: {
                    read: '/group',
                    create: '/stack',
                    update: '/group',
                    destroy: '/stack'
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
            stack_id:record.data.id
        };
        this.applyFilter();
    }
});