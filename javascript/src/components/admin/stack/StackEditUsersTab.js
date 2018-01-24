Ext.define('Ozone.components.admin.stack.StackEditUsersTab', {
    extend: 'Ozone.components.admin.UsersTabPanel',
    alias: [
        'widget.stackeditusers',
        'widget.stackedituserstab',
        'widget.Ozone.components.admin.stack.StackEditUsersTab'
    ],
    cls: 'stackedituserstab',
    preventHeader: true,

    initComponent: function () {
		
        var self = this;
        Ext.applyIf(this,{
            itemId: 'users-tab',
            iconCls: 'users-tab',
            title: 'Users',
            editor: 'Stack',
            componentId: 'stack_id',
            storeCfg: {
                api: {
                    read: '/user',
                    create: '/stack',
                    update: '/user',
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

        Ext.Ajax.request({
            url: Ozone.util.contextPath() + '/widget/hasMarketplace',
            success: function(response) {
                var json = Ext.decode(response.responseText);
                self.hasMarketplace = json.data;
            }
        });

        this.on({
            activate: {
                scope: this,
                single: true,
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('usersgrid');
                    grid.setBaseParams({adminEnabled: true});

                    // disable the add/remove buttons if the app has not been approved
                    Ext.QuickTips.init();

                    if (cmp && cmp.ownerCt && cmp.ownerCt.record && cmp.ownerCt.record.data) {
                        var stack = cmp.ownerCt.record.data;
                        if (!stack.approved) {

                            // disable the add button
                            var button = Ext.getCmp('adminUsersTabAddButton'),
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

                            // disable the remove button
                            button = Ext.getCmp('adminUsersTabRemoveButton');
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
    }
});