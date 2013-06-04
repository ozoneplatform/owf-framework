Ext.define('Ozone.data.Dashboard', {
    extend: 'Ext.data.Model',
    idProperty: 'guid',
    fields:[
        'alteredByAdmin',
        'guid',
        {name:'id', mapping: 'guid'},
        { name: 'isdefault', type: 'boolean', defaultValue: false },
        { name: 'dashboardPosition', type: 'int' },
        'EDashboardLayoutList',
        'name',
        { name: 'state', defaultValue: [] },
        'removed',
        'groups',
        'isGroupDashboard',
        'description',
        'createdDate',
        'prettyCreatedDate',
        'editedDate',
        'prettyEditedDate',
        { name: 'stack', defaultValue: null },
        { name: 'locked', type: 'boolean', defaultValue: false },
        { name: 'layoutConfig', defaultValue: null },
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

        if(!data.guid) {
            data.guid = guid.util.guid();
        }

        this.callParent(arguments);
    },

    /**
     * Determine whether this dashboard can be modified by adding new widgets to it.  This is a stronger
     * variant than the concept of locking. Current intent is that this logic only applies to dashboards containing
     * one or more widgets of type 'marketplace'. We recognize that this behavior could be overloaded or extended..
     * 
     * @returns {Boolean}
     */
    isModifiable: function () {
        return !this.isMarketplaceDashboard();
    },

    /**
    *
    * Determines if this is a 'special' marketplace dashboard
    * @returns {Boolean} true if this is a marketplace dashboard. Otherwise, returns false.
    **/
    isMarketplaceDashboard: function () {
        var widgets = this.get('layoutConfig').widgets,
            widgetCount = widgets ? widgets.length: 0,
            widgetStore = Ext.StoreManager.lookup('widgetStore');

        // marketplace dashboard is a one pane dashboard with layout of either fit or tabbed
        // multi pane dashboard or no widgets
        if(!widgets || widgetCount === 0) {
            return false;
        }

        // For a dasbhoard to be of type 'marketplace', it must have all widgets that are of type 'marketplace'
        // Search widgetStore and check for widgetType
        for(var i = 0, len = widgetCount; i < len; i++) {
            var widgetDef = widgetStore.findRecord('widgetGuid', widgets[i].widgetGuid);
            if(widgetDef && widgetDef.get('widgetTypes')[0].name !== 'marketplace') {
                return false;
            }
        }
        
        return true;
    }
});