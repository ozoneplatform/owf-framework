Ext.define('Ozone.data.Intent', {
	extend: 'Ext.data.Model',
    fields: [
        { name:'title', mapping:'action'},
        { name:'action'},
        { name:'dataType'},
        { name:'send'},
        { name:'receive'}]
});