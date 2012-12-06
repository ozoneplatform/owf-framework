Ext.define('Ozone.data.stores.AdminDashboardStore', {
    extend:'Ozone.data.OWFStore',
    model: 'Ozone.data.Dashboard',
    alias: 'store.admindashboardstore',
    remoteSort: true,
    totalProperty:'results',
    sorters: [
        {
            property : 'dashboardPosition',
            direction: 'ASC'
        }
    ],
    constructor: function(config) {

        Ext.applyIf(config, {
            api: {
                read: "/dashboard",
                create: "/dashboard",
                update: "/dashboard",
                destroy: "/dashboard"
            },
            reader: {
                root: 'data'
            },
            writer: {
                root: 'data'
            }
        });

        this.callParent(arguments);
    },
  
    reorder: function() {
        if (this.getCount() > 0) {
            for (var i = 0; i < this.getCount(); i++) {
                var dashboard = this.getAt(i);
                dashboard.set('dashboardPosition', i + 1);
            }
        }
    }

});