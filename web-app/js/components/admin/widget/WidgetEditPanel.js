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
                    {
                        xtype: 'widgeteditproperties',
                        itemId: 'widgeteditproperties'
                    },
                    {
                        xtype: 'intentstabpanel',
                        itemId: 'intentstabpanel'
                    },
                    {
                        xtype: 'widgeteditusers',
                        itemId: 'widgeteditusers'
                    },
                    {
                        xtype: 'widgeteditgroups',
                        itemId: 'widgeteditgroups'
                    },
                    {
                        xtype: 'widgeteditstacks',
                        itemId: 'widgeteditstacks'
                    }
                ]
            }]
        });
        this.callParent(arguments);
    }
});