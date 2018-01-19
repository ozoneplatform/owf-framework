Ext.define('Ozone.components.admin.group.GroupEditPanel', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.groupedit','widget.groupeditpanel','widget.Ozone.components.admin.group.GroupEditPanel'],

    mixins: ['Ozone.components.WidgetAlerts'],

	cls: 'groupeditpanel',
	
	initComponent: function () {
		var self = this;
		Ext.applyIf(this,{
			layout: 'fit',
			items: [{
	            xtype: 'groupeditwidgetpanel',
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
                    itemId: 'groupeditproperties',
                    editPanel: self
                  },
                  {
                    xtype: 'groupeditusers',
                    itemId: 'groupeditusers',
                    editPanel: self
                  },
                  {
                    xtype: 'groupeditwidgets',
                    itemId: 'groupeditwidgets',
                    editPanel: self
                  },
                  {
                    xtype: 'groupeditstacks',
                    itemId: 'groupeditstacks',
                    editPanel: self
                  }
                ]
	        }]
		});
		this.callParent(arguments);
	}
});