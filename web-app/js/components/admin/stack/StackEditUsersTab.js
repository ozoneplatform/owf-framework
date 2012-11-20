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

        this.on({
            activate: {
                scope: this,
                single: true,
                fn: function(cmp, opts) {
                    var grid = cmp.getComponent('usersgrid');
                    grid.setBaseParams({adminEnabled: true});
                }
            }
        });
    }
});