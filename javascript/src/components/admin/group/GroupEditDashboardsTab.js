Ext.define('Ozone.components.admin.group.GroupEditDashboardsTab', {
    extend: 'Ozone.components.admin.DashboardsTabPanel',
    alias: [
        'widget.groupeditdashboards',
        'widget.groupeditdashboardstab',
        'widget.Ozone.components.admin.group.GroupEditDashboardsTab'
    ],

    cls: 'groupeditdashboardstab',

    isGroupDashboard: true,

    initComponent: function () {
        //get widget to launch
        Ext.applyIf(this, {
            layout: 'fit',
            itemId: 'tabDashboards',
            title: 'Pages',
            iconCls: 'dashboard-tab',
            editor: 'Group',
            componentId: 'group_id',
            storeCfg: {
                api: {
                    read: '/dashboard',
                    create: '/group',
                    update: '/dashboard',
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

        this.addDocked({
            xtype: 'toolbar',
            itemId: 'tbDashboardsGridFtr',
            dock: 'bottom',
            ui: 'footer',
            defaults: {
                minWidth: 80
            },
            items: [
            {
                xtype: 'button',
                text: 'Add',
                itemId: 'btnAdd',
                handler: function() {
                    this.onAddClicked();
                },
                scope: this
            },
            {
                xtype: 'button',
                text: 'Remove',
                itemId: 'btnRemove',
                handler: function() {
                    this.doDelete();
                },
                scope: this
            }
            ]
        });
    }
});
