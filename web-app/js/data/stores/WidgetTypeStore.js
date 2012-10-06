Ext.define('Ozone.data.WidgetTypeStore', {
	extend: 'Ext.data.Store',
	model: 'Ozone.data.WidgetType',
	proxy: {
		type: 'ajax',
		url: Ozone.util.contextPath() + '/widgettype/list', 

        //the components which use this store do not support paging yet, so these must be explicitly set to undefined
        //to disable paging params from being passed to the server
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,

		reader: {
			type: 'json',
			root: 'data'
		}
	},
	totalProperty: 'results'
});