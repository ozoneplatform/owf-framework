Ext.define('Ozone.components.admin.user.UserEditPreferencesTab', {
    extend: 'Ozone.components.admin.grid.PreferencesTabPanel',
    alias: ['widget.usereditpreferences',
            'widget.usereditpreferencestab',
            'widget.Ozone.components.admin.user.UserEditPreferencesTab'],

    cls: 'usereditpreferencestab',
    	    
    initComponent: function () {
        
        var self = this;
        Ext.applyIf(this,{
            layout: 'fit',
            itemId: 'tabPreferences',
            title: 'Preferences',
            iconCls: 'preferences-tab',
			editor: 'User',
            componentId: 'username',
			storeCfg: {
                api: {
                    read: "/administration/listPreferences",
       			 	create: "/administration/addCopyPreferenceSubmit",
        			update: "/administration/updatePreference",
        			destroy: "/administration/deletePreferences"
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
                },
				reader: {
					root: 'rows'
				}
            }
        });
        this.callParent(arguments);
    }
});