Ext.define('Ozone.data.State', {
    extend: 'Ext.data.Model',
    idProperty: 'uniqueId',

    fields: [
        'uniqueId',
        'dashboardGuid',
        'paneGuid',
        'widgetGuid',
        'statePosition',
        'name',
        'active',
        'width',
        'height',
        'x',
        'y',
        'zIndex',
        'minimized',
        'maximized',
        'pinned',
        'collapsed',
        'columnPos',
        'columnOrder',
        'buttonId',
        'buttonOpened',
        'region',
        'singleton',
        { name: 'floatingWidget', type: 'boolean' },
        'intentConfig',
        'launchData',
        { name: 'background', type: 'boolean' },
        { name: 'mobileReady', type: 'boolean' }
    ],

    get: function(field) {
        var val = this.callParent(arguments);

        if(val !== undefined)
            return val;

        var widgetGuid = this.callParent(['widgetGuid']);
        if(!widgetGuid)
            return widgetGuid;

        return Ext.StoreManager.lookup('widgetStore').getById(widgetGuid).get(field);
    }
});
