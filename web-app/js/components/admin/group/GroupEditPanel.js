Ext.define('Ozone.components.admin.group.GroupEditPanel', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.groupedit','widget.groupeditpanel','widget.Ozone.components.admin.group.GroupEditPanel'],

	cls: 'groupeditpanel',
	
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
	            domain: 'Group',
	            channel: 'AdminChannel',
	            store: Ext.create('Ozone.data.GroupStore', {}),
                items: [
                  {
                    xtype: 'groupeditproperties',
                    itemId: 'groupeditproperties'
                  },
                  {
                    xtype: 'groupeditusers',
                    itemId: 'groupeditusers'
                  },
                  {
                    xtype: 'groupeditwidgets',
                    itemId: 'groupeditwidgets'
                  },
                  {
                    xtype: 'groupeditdashboards',
                    itemId: 'groupeditdashboards'
                  },
                  {
                    xtype: 'groupeditstacks',
                    itemId: 'groupeditstacks'
                  }
                ]
	        }]
		});
		this.callParent(arguments);
	}
});