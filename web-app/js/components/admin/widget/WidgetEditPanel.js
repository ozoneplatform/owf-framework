Ext.define('Ozone.components.admin.widget.WidgetEditPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.widgetedit','widget.widgeteditpanel','widget.Ozone.components.admin.widget.WidgetEditPanel'],

    cls: 'widgeteditpanel',
	
    initComponent: function () {
        //get widget to launch
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            items: [{
                xtype: 'editwidgetpanel',
                cls: 'adminEditor',
                bodyCls: 'adminEditor-body',
                dragAndDrop: false,
                launchesWidgets: false,
                domain: 'Widget',
                channel: 'AdminChannel',
                store: Ext.create('Ozone.data.stores.AdminWidgetStore', {}),
                items: [
                    { xtype: 'widgeteditpropertiestab' },
                    { xtype: 'intentstabpanel' },
                    { xtype: 'widgetedituserstab' },
                    { xtype: 'widgeteditgroupstab' }
                ]
            }]
        });
        this.callParent(arguments);
    }
});