Ext.define('Ozone.data.WidgetGroup', {
	extend: 'Ext.data.Model',
	idProperty: 'groupId',
	fields: [            //group fields
    	'groupId', //should be a unique id for every record
		'group', 'groupTitle', 'groupShowHeader', 'groupCollapsed', 'groupVisible', 'groupPosition', 'groupEditable', '_lastInGroup', '_shortName', '_itemPos',            //number of items visible
    	'_groupCount',            //total of items including invisible
    	'_groupTotalCount',            //widget fields
    	'name', 'url', 'headerIcon', 'image', 'width', 'height', 'widgetGuid', 'maximized', 'minimized', 'x', 'y', 'visible', 'singleton', 'allRequired', 'directRequired', 'widgetCollapsed']
});