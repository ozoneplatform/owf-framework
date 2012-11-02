Ext.define('Ozone.components.admin.user.UserEditPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.useredit','widget.usereditpanel','widget.Ozone.components.admin.user.UserEditPanel'],

    mixins: ['Ozone.components.WidgetAlerts'],

    cls: 'usereditpanel',
	
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
                domain: 'User',
                channel: 'AdminChannel',
                store: Ext.create('Ozone.data.UserStore', {}),
                items: [
                    {
                        xtype: 'usereditproperties',
                        itemId: 'usereditproperties',
                        editPanel: self
                    },
                    {
                        xtype: 'usereditgroups',
                        itemId: 'usereditgroups',
                        editPanel: self
                    },
                    {
                        xtype: 'usereditwidgets',
                        itemId: 'usereditwidgets',
                        editPanel: self
                    },
                    {
                        xtype: 'usereditdashboards',
                        itemId: 'usereditdashboards',
                        editPanel: self
                    },
                    {
                        xtype: 'usereditstacks',
                        itemId: 'usereditstacks',
                        editPanel: self
                    },
                    {
                        xtype: 'usereditpreferences',
                        itemId: 'usereditpreferences',
                        editPanel: self
                    }
                ]
            }]
        });
        this.callParent(arguments);
    }
});