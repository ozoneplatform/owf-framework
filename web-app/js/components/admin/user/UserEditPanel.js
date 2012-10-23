Ext.define('Ozone.components.admin.user.UserEditPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.useredit','widget.usereditpanel','widget.Ozone.components.admin.user.UserEditPanel'],

    mixins: ['Ozone.components.WidgetAlerts'],

    cls: 'usereditpanel',
	
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
                domain: 'User',
                channel: 'AdminChannel',
                store: Ext.create('Ozone.data.UserStore', {}),
                items: [
                    {
                        xtype: 'usereditproperties',
                        itemId: 'usereditproperties'
                    },
                    {
                        xtype: 'usereditgroups',
                        itemId: 'usereditgroups'
                    },
                    {
                        xtype: 'usereditwidgets',
                        itemId: 'usereditwidgets'
                    },
                    {
                        xtype: 'usereditdashboards',
                        itemId: 'usereditdashboards'
                    },
                    {
                        xtype: 'usereditstacks',
                        itemId: 'usereditstacks'
                    },
                    {
                        xtype: 'usereditpreferences',
                        itemId: 'usereditpreferences'
                    }
                ]
            }]
        });
        this.callParent(arguments);
    }
});