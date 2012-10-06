Ext.define('Ozone.components.admin.widget.WidgetEditGroupsTab', {
	extend: 'Ozone.components.admin.GroupsTabPanel',
	alias: ['widget.widgeteditgroups',
	        'widget.widgeteditgroupstab',
	        'widget.Ozone.components.admin.widget.WidgetEditGroupsTab'],
	        
	cls: 'widgeteditgroupstab',
	
	initComponent: function() {
		var self = this;
		Ext.applyIf(this, {
			layout: 'fit',
			itemId: 'tabGroups',
			iconCls: 'groups-tab',
                        editor: 'Widget',
			componentId: 'widget_id',
			title: 'Groups',
			padding: 5,
			widgetRecord: null,
			storeCfg: {
				api: {
					read: '/group',
                    create: '/widget',
                    update: '/group',
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
