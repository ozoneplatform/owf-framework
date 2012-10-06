Ext.define('Ozone.data.WidgetGroupStore',{
	extend:'Ext.data.Store',
	model: 'Ozone.data.WidgetGroup',
	proxy: {
		type: 'memory',
		reader: {
			root: 'rows',
			type: 'json'
		}
	},
    groupField: 'group'
});