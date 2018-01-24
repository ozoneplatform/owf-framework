Ext.define('Ozone.data.StackStore', {
    extend:'Ozone.data.OWFStore',
    model: 'Ozone.data.Stack',

    sorters: [
      {
        property : 'name',
        direction: 'ASC'
      }
    ],

    constructor:function(config) {
        
        config = config ? config : {};
    	
        Ext.applyIf(config, {
            api: {
                read: '/stack',
                create: '/stack',
                update: '/stack',
                destroy: '/stack'
            },
            fields: ['id', 'name', 'description', 'stackContext', 'approved', 'descriptorUrl', 'totalDashboards', 'totalUsers', 'totalGroups', 'totalWidgets'],
            autoDestroy: true
        });
    	
        this.callParent(arguments);
    }
});