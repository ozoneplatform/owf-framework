Ext.define('Ozone.components.admin.widget.WidgetEditStacksTab', {
	extend: 'Ozone.components.admin.StacksTabPanel',
	alias: ['widget.widgeteditstacks',
	        'widget.widgeteditstackstab',
	        'widget.Ozone.components.admin.widget.WidgetEditStacksTab'],
	        
	cls: 'widgeteditstackstab',
	
	initComponent: function() {
		var self = this;
		Ext.applyIf(this, {
			layout: 'fit',
			itemId: 'tabStacks',
			iconCls: 'stacks-tab',
                        editor: 'Widget',
			componentId: 'widget_id',
			title: 'Stacks',
			padding: 5,
			widgetRecord: null,
			storeCfg: {
				api: {
					read: '/stack',
                    create: '/widget',
                    update: '/stack',
                    destroy: '/widget'
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
				pageSize: 50
			}
		});
		this.callParent();
	},
	initBaseParams: function(record) {
		this.baseParams = {
				widget_id:record.data.id
		};
		this.applyFilter();
	}
});
