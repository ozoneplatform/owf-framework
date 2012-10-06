Ext.define('Ozone.components.admin.group.GroupEditWidgetsTab', {
    extend: 'Ozone.components.admin.grid.WidgetsTabPanel',
    alias: ['widget.groupeditwidgets',
            'widget.groupeditwidgetstab',
            'widget.Ozone.components.admin.group.GroupEditWidgetsTab'],
        
    cls: 'groupeditwidgetstab',
    
    initComponent: function () {
        //get widget to launch
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            itemId: 'tabWidgets',
            title: 'Widgets',
            editor: 'Group',
            iconCls: 'widgets-tab',
            componentId: 'group_id',
            storeCfg: {
                api: {
                    read: '/widget',
                    create: '/group',
                    update: '/widget',
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