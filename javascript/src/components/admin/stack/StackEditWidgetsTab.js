Ext.define('Ozone.components.admin.stack.StackEditWidgetsTab', {
    extend: 'Ozone.components.admin.grid.WidgetsTabPanel',
    alias: ['widget.stackeditwidgets',
            'widget.stackeditwidgetstab',
            'widget.Ozone.components.admin.stack.StackEditWidgetsTab'],

    cls: 'stackeditwidgetstab',
            
    initComponent: function () {
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            itemId: 'tabWidgets',
            title: 'App<br>Components',
            iconCls: 'widgets-tab',
            editor: 'Stack',
            componentId: 'stack_id',
            storeCfg: {
                api: {
                    read: '/widget'
                },
                methods: {
                    read: 'GET', 
                    load: 'GET'
                }
            }
        });
        this.callParent(arguments);

        //Remove the bottom toolbar with Add/Remove buttons, a stack's widgets read-only
        this.removeDocked(this.getDockedComponent('tbWidgetsGridFtr'));
    }
});