Ext.define('Ozone.components.admin.user.UserEditWidgetsTab', {
    extend: 'Ozone.components.admin.grid.WidgetsTabPanel',
    alias: ['widget.usereditwidgets',
            'widget.usereditwidgetstab',
            'widget.Ozone.components.admin.user.UserEditWidgetsTab'],

    cls: 'usereditwidgetstab',
    	    
    initComponent: function () {
        //get widget to launch
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            itemId: 'tabWidgets',
            title: 'Widgets',
            iconCls: 'widgets-tab',
            editor: 'User',
            componentId: 'user_id',
            storeCfg: {
                api: {
                    read: '/widget',
                    create: '/user',
                    update: '/widget',
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
                }
            }
        });
        this.callParent(arguments);
    }
});