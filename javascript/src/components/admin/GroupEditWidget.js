Ext.onReady(function() {
    owfdojo.config.dojoBlankHtmlUrl = '../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
    Ext.Loader.setConfig({
        enabled: true
    });
    Ext.QuickTips.init();
	
    var viewport = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: {
            xtype: 'editwidgetpanel',
            cls: 'adminEditor',
            bodyCls: 'adminEditor-body',
            dragAndDrop: false,
            launchesWidgets: false,
            domain: 'Group',
            channel: 'AdminChannel',
            store: Ext.create('Ozone.data.GroupStore', {}),
            items: [{
                xtype: 'propertiespanel',
                title: 'Properties',
                iconCls: 'properties-icon',
                items: [{
                    xtype: 'hidden',
                    name: 'id',
                    itemId: 'id'
                }, {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: Ozone.util.createRequiredLabel('Name'),
                    allowBlank: false,
                    itemId: 'name'
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Description',
                    name: 'description',
                    itemId: 'description',
                    height: 100,
                    allowBlank: true,
                    maxLength: 255
                }, {
                    xtype: 'checkbox',
                    name: 'automatic',
                    submitValue: true,
                    fieldLabel: 'Automatic',
                    itemId: 'automatic'
                }, {
                    xtype: 'combo',
                    fieldLabel: Ozone.util.createRequiredLabel('Status'),
                    store: Ext.create('Ext.data.Store', {
                        fields: ['status'],
                        data: [{
                            'status':'active'
                        }, {
                            'status':'inactive'
                        }]
                    }),
                    displayField: 'status',
                    valueField: 'status',
                    itemId: 'status',
                    editable: false,
                    queryMode: 'local',
                    name: 'status',
                    allowBlank: false
                }]
            }, {
				xtype: 'userstabpanel',
				itemId: 'users-tab',
	    		iconCls: 'users-tab',
	    		title: 'Users'
            }, {
                xtype: 'widgetstabpanel',
                itemId: 'tabWidgets',
                title: 'Widgets',
                iconCls: 'widgets-tab',
                componentId: 'group_id',
                storeCfg: {
                    api: {
                        read: '/widget',
                        create: '/group',
                        update: '/widget',
                        destroy: '/group'
                    },
                    methods: {
                        read: 'GET', 
                        load: 'GET',  
                        create: 'PUT', 
                        update: 'PUT', 
                        save: 'POST', 
                        destroy: 'PUT'
                    },
                    updateActions: {
                        destroy: 'remove'
                    },
                    tab: 'widgets'
                }
            }]
        }
    });
});
