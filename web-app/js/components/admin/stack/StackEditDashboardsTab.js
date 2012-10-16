Ext.define('Ozone.components.admin.stack.StackEditDashboardsTab', {
    extend: 'Ozone.components.admin.DashboardsTabPanel',
    alias: [
        'widget.stackeditdashboards',
        'widget.stackeditdashboardstab',
        'widget.Ozone.components.admin.stack.StackEditDashboardsTab'
    ],

    cls: 'stackeditdashboardstab',

    isGroupDashboard: true,

    initComponent: function () {
        Ext.applyIf(this, {
            layout: 'fit',
            itemId: 'tabDashboards',
            title: 'Dashboards',
            iconCls: 'dashboard-tab',
            editor: 'Stack',
            componentId: 'stack_id',
            storeCfg: {
                api: {
                    read: '/dashboard',
                    create: '/stack',
                    update: '/dashboard',
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
