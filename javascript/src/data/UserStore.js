Ext.namespace('Ozone.data');

Ozone.data.UserStore = Ext.extend(Ozone.data.OWFStore, {
    constructor: function(config) {
        Ozone.data.UserStore.superclass.constructor.call(this, Ext.apply(config, {
            api: {
                read: "/user",
                create: "/user",
                update: "/user",
                destroy: "/user"
            },
            autoDestroy: true,
            sortInfo: {
              field: 'userRealName',
              direction: 'ASC'
            },
            fields:[
            {
                name:'id'
            },
            {
                name:'userRealName'
            },
            {
                name:'email'
            },
            {
                name:'username'
            },
            {
                name:'lastLogin'
            },
			{
				name: 'totalWidgets'
			},
			{
				name: 'totalGroups'
			}
            ],
            listeners: {
                load: {
                    fn: function(store, records, options) {
                        var storeRecords = store.getRange();
                        for (var i = 0; i < storeRecords.length; i++) {
                            var record = storeRecords[i];
							record.data.userRealName = Ext.util.Format.htmlEncode(record.data.userRealName);
							record.data.username = Ext.util.Format.htmlEncode(record.data.username);
							record.data.email = Ext.util.Format.htmlEncode(record.data.email);

                        }
                    },
                    scope: this
                }
            }
        }));
    }
});

Ext.reg('userstore', Ozone.data.UserStore);

