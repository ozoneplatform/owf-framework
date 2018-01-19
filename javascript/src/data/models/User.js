Ext.define('Ozone.data.User',{
	extend:'Ext.data.Model',
	idProperty:'id',
	fields:[
	        {name:'id'},
	        {name:'username'},
	        {name:'userRealName'},
	        {name:'email'},
            {name:'totalGroups'},
	        {name:'totalWidgets'},
	        {name:'totalDashboards'},
            {name:'totalStacks'},
	        {name:'lastLogin'},
	        {name:'title', mapping:'userRealName'}
	]
});