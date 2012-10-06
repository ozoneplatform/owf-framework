Ext.define('Ozone.components.admin.user.UserEditPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.useredit','widget.usereditpanel','widget.Ozone.components.admin.user.UserEditPanel'],

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
                Ext.create('Ozone.components.admin.user.UserEditPropertiesTab', {}),
                Ext.create('Ozone.components.admin.user.UserEditGroupsTab', {}),
                Ext.create('Ozone.components.admin.user.UserEditWidgetsTab', {}),
                Ext.create('Ozone.components.admin.user.UserEditDashboardsTab', {}),
				Ext.create('Ozone.components.admin.user.UserEditPreferencesTab', {})
                ]
            }]
        });
        this.callParent(arguments);
    }
});