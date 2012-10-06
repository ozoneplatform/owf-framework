Ext.define('Ozone.data.DashboardStore',{
    extend:'Ozone.data.OWFStore',
    model: 'Ozone.data.Dashboard',
    alias: 'store.dashboardstore',
    proxy: {
        type: 'owftransportproxy',

        //the components which use this store do not support paging yet, so these must be explicitly set to undefined
        //to disable paging params from being passed to the server
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,

        api: {
            read: "/dashboard",
            create: "/dashboard",
            update: "/dashboard",
            destroy: "/dashboard"
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'results'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            encode: true,
            root: 'data'
        }
    },
    remoteSort: true,
    totalProperty:'results'
});