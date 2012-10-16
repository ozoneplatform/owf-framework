Ext.define('Ozone.data.Stack', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'order', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'icon', type: 'string'},
        { name: 'totalDashboards', type: 'int' },
        { name: 'totalUsers', type: 'int' },
        { name: 'totalGroups', type: 'int' },
        { name: 'totalWidgets', type: 'int' }
    ]
});