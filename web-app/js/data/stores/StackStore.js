Ext.define('Ozone.data.StackStore', {
    extend:'Ozone.data.OWFStore',
    model: 'Ozone.data.Stack',

    sorters: [
      {
        property : 'title',
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
            fields: ['id', 'order', 'title', 'description', 'icon', 'totalDashboards', 'totalUsers', 'totalGroups', 'totalWidgets'],
            autoDestroy: true
        });
    	
        this.callParent(arguments);
    }
});