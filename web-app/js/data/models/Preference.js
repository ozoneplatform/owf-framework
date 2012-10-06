Ext.define('Ozone.data.Preference', {
	extend: 'Ext.data.Model',
	idProperty: 'id',
	fields:[
     {name: 'id', mapping: 'id'},
	 {name: 'namespace', mapping: 'namespace'},
	 {name: 'path', mapping: 'path'},
	 {name: 'value', mapping: 'value'},
	 {name: 'username', mapping: 'user.userId'},
	 {name: 'originalNamespace'},
	 {name: 'originalPath'},
	 {name: 'originalValue'},
     {name:'title', mapping:'namespace'}]
});