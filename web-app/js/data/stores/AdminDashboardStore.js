Ext.define('Ozone.data.stores.AdminDashboardStore', {
  extend:'Ozone.data.OWFStore',
  model: 'Ozone.data.Dashboard',
  alias: 'store.admindashboardstore',
  remoteSort: true,
  totalProperty:'results',
  sorters: [
    {
      property : 'name',
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
  }

});