Ext.define('Ozone.data.Stack', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'id', type: 'int', defaultValue: -1 },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'stackContext', type: 'string' },
        { name: 'owner' },
        { name: 'approved', type: 'boolean'},
        { name: 'imageUrl', type: 'string'},
        { name: 'descriptorUrl', type: 'string'},
        { name: 'totalDashboards', type: 'int' },
        { name: 'totalUsers', type: 'int' },
        { name: 'totalGroups', type: 'int' },
        { name: 'totalWidgets', type: 'int' }
    ]
});