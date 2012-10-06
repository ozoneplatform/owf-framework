Ext.define('Ozone.data.Dashboard', {
    extend: 'Ext.data.Model',
    idProperty: 'guid',
    fields:[
        'alteredByAdmin',
        { name: 'columnCount', type: 'int', defaultValue: 3 },
        'guid',
        { name: 'isdefault', type: 'boolean', defaultValue: false },
        'layout',
        'EDashboardLayoutList',
        'name',
        { name: 'state', defaultValue: [] },
        'removed',
        'groups',
        'isGroupDashboard',
        'description',
        'defaultSettings',
        'createdDate',
        'editedDate',
        { name: 'locked', type: 'boolean', defaultValue: false },
        { name: 'showLaunchMenu', type: 'boolean', defaultValue: false },
        { name: 'layoutConfig', defaultValue: null },
        { name: 'intentConfig', defaultValue: null },
        { name: 'createdBy', model: 'User'},
        { name: 'user', model: 'User'}
    ],

    constructor: function(data, id, raw) {
        if(data.layoutConfig && typeof data.layoutConfig === 'string' && data.layoutConfig !== Object.prototype.toString()) {
            data.layoutConfig = Ext.JSON.decode(data.layoutConfig);
        }

        //todo see if we still need this
        if(data.layoutConfig === Object.prototype.toString()) {
            data.layoutConfig = "";
        }

        if(data.intentConfig && typeof data.intentConfig === 'string' && data.intentConfig !== Object.prototype.toString()) {
            data.intentConfig = Ext.JSON.decode(data.intentConfig);
        }
        else {
            data.intentConfig = {};
        }

        if(!data.guid) {
            data.guid = guid.util.guid();
        }

        this.callParent(arguments);
    }
});