Ext.define('Ozone.data.GroupStore', {
    extend:'Ozone.data.OWFStore',
    model: 'Ozone.data.Group',

    sorters: [
      {
        property : 'displayName',
        direction: 'ASC'
      }
    ],

    constructor:function(config) {
        
        config = config ? config : {};
    	
        Ext.applyIf(config, {
            api: {
                read: '/group',
                create: '/group',
                update: '/group',
                destroy: '/group'
            },
            fields: ['id', 'name', 'description', 'totalWidgets', 'totalUsers', 'automatic', 'status', 'displayName', 'email'],
            autoDestroy: true
        });
    	
        this.callParent(arguments);
    }
});