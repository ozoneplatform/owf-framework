Ext.define('Ozone.components.admin.stack.StackEditPanel', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.stackedit','widget.stackeditpanel','widget.Ozone.components.admin.stack.StackEditPanel'],

    mixins: ['Ozone.components.WidgetAlerts'],

	cls: 'stackeditpanel',
	
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
	            domain: 'Stack',
	            channel: 'AdminChannel',
	            store: Ext.create('Ozone.data.StackStore', {}),
                items: [
                  {
                    xtype: 'stackeditwidgets',
                    itemId: 'stackeditwidgets',
                    editPanel: self
                  },
                  {
                    xtype: 'stackeditgroups',
                    itemId: 'stackeditgroups',
                    editPanel: self
                  },
                  {
                    xtype: 'stackeditusers',
                    itemId: 'stackeditusers',
                    editPanel: self
                  }
                ]
	        }]
		});
		this.callParent(arguments);
	}
});