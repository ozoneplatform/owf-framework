Ext.define('Ozone.components.admin.widget.WidgetEditPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.widgetedit','widget.widgeteditpanel','widget.Ozone.components.admin.widget.WidgetEditPanel'],

    mixins: ['Ozone.components.WidgetAlerts'],

    cls: 'widgeteditpanel',
	
    initComponent: function () {
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
                        itemId: 'widgeteditproperties',
                        editPanel: self
                    },
                    {
                        xtype: 'intentstabpanel',
                        itemId: 'intentstabpanel',
                        editPanel: self
                    },
                    {
                        xtype: 'widgeteditusers',
                        itemId: 'widgeteditusers',
                        editPanel: self
                    },
                    {
                        xtype: 'widgeteditgroups',
                        itemId: 'widgeteditgroups',
                        editPanel: self
                    }
                ]
            }]
        });
        this.callParent(arguments);
    }
});