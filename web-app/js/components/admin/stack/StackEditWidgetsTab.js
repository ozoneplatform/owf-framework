Ext.define('Ozone.components.admin.stack.StackEditWidgetsTab', {
    extend: 'Ozone.components.admin.grid.WidgetsTabPanel',
    alias: ['widget.stackeditwidgets',
            'widget.stackeditwidgetstab',
            'widget.Ozone.components.admin.stack.StackEditWidgetsTab'],

    cls: 'stackeditwidgetstab',
            
    initComponent: function () {
        //get widget to launch
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            itemId: 'tabWidgets',
            title: 'Widgets',
            iconCls: 'widgets-tab',
            editor: 'Stack',
            componentId: 'stack_id',
            storeCfg: {
                api: {
                    read: '/widget',
                    create: '/stack',
                    update: '/widget',
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
    }
});