Ext.define('Ozone.data.UserStore',{
	extend:'Ozone.data.OWFStore',
	model: 'Ozone.data.User',
	alias: 'store.userstore',

	/*proxy: {
		type: 'ajax',
		api: Ozone.util.contextPath() + '/user', 

        //the components which use this store do not support paging yet, so these must be explicitly set to undefined
        //to disable paging params from being passed to the server
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,

		reader: {
			type: 'json',
			root: 'rows'
		}
	},
	autoLoad:true,
    totalProperty:'results',
    */
    sorters: [
      {
        property : 'userRealName',
        direction: 'ASC'
      }
    ],


    constructor:function(config)
    {
    	config = config ? config : {};
    	
    	Ext.applyIf(config, {
    		api:{
    			read:"/user",
    			create:"/user",
    			update:"/user",
    			destroy:"/user"
    		},
    		fields:['id','username','userRealName','email','totalWidgets','totalGroups','totalDashboards','lastLogin'],
    		autoDestroy:true
    	});
    	
    	Ozone.data.UserStore.superclass.constructor.call(this,config);
    }
});