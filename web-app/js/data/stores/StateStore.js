Ext.define('Ozone.data.StateStore',{
	extend:'Ext.data.Store',
	model:'Ozone.data.State',
	proxy:{
		type:'ajax',
		url:Ozone.util.contextPath() + '/dashboard'
	}
});