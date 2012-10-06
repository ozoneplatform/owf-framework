Ext.define('Ozone.data.Group', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'id', type: 'int' },
        { name: 'description', type: 'string' },
        { name: 'totalWidgets', type: 'int' },
        { name: 'totalUsers', type: 'int' },
        { name: 'automatic', type: 'boolean' },
        { name: 'status', type: 'string' },
        { name: 'displayName', type: 'string' },
        { name: 'email', type: 'string'},
        { name: 'title', mapping:'displayName'}
    ]
});