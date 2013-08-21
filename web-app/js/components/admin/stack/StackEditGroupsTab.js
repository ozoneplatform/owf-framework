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

        // this is to disable the add/remove buttons if the app has not been approved
        this.on({
            activate: {
                scope: this,
                fn: function (cmp, opts) {
                    Ext.QuickTips.init();

                    if (cmp && cmp.ownerCt && cmp.ownerCt.record && cmp.ownerCt.record.data) {
                        var stack = cmp.ownerCt.record.data;
                        if (!stack.approved) {

                            // disable the add button
                            var button = Ext.getCmp('adminGroupsTabAddButton');
                            if (button) {
                                button.setDisabled(true);
                                button.setTooltip(Ozone.layout.tooltipString.editingUnapprovedStackEditMessage);
                            }

                            // disable the remove button
                            button = Ext.getCmp('adminGroupsTabRemoveButton');
                            if (button) {
                                button.setDisabled(true);
                                button.setTooltip(Ozone.layout.tooltipString.editingUnapprovedStackEditMessage);
                            }
                        }
                    }

                }
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