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

        Ext.Ajax.request({
            url: Ozone.util.contextPath() + '/widget/hasMarketplace',
            success: function(response) {
                var json = Ext.decode(response.responseText);
                self.hasMarketplace = json.data;
            }
        });

        // This is to disable the add button if the app has not been approved.
        // Remove button is never disabled.
        this.on({
            activate: {
                scope: this,
                fn: function (cmp, opts) {
                    Ext.QuickTips.init();

                    if (cmp && cmp.ownerCt && cmp.ownerCt.record && cmp.ownerCt.record.data) {
                        var stack = cmp.ownerCt.record.data;
                        if (!stack.approved) {

                            // disable the add button
                            var button = Ext.getCmp('adminGroupsTabAddButton'),
                                tip, msg;

                            msg = self.hasMarketplace ? 
                                    Ozone.layout.tooltipString.unapprovedStackEditMessage
                                    : Ozone.layout.tooltipString.unapprovedStackWithoutMarkpetplaceEditMessage;

                            if (button) {
                                button.setDisabled(true);

                                // firefox handles tooltips on disabled buttons differently than the other browsers
                                if (Ext.isGecko) {
                                    tip = Ext.create('Ext.tip.ToolTip', {
                                        target: button.id,
                                        html: msg
                                    });
                                }
                                else {
                                    button.setTooltip(msg);
                                }
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