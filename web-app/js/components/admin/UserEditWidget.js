Ext.onReady(function() {
	owfdojo.config.dojoBlankHtmlUrl = '../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
	Ext.Loader.setConfig({enabled: true});
	Ext.QuickTips.init();
	
	var viewport = Ext.create('Ext.container.Viewport', {
		layout: 'fit',
		items: {
			xtype: 'editwidgetpanel',
			dragAndDrop: false,
			launchesWidgets: false,
			domain: 'User',
			channel: 'AdminChannel',
			store: Ext.create('Ozone.data.UserStore', {}),
			items: [{
				xtype: 'propertiespanel',
				title: 'Properties',
				iconCls: 'properties-icon',
				items: [{
		            xtype: 'textfield',
		            fieldLabel: Ozone.util.createRequiredLabel('User Name'),
		            name: 'username',
					itemId: 'username',
		            maxLength: 200,
		            allowBlank: false
		        }, {
		            xtype: 'textfield',
		            allowBlank: false,
		            fieldLabel: Ozone.util.createRequiredLabel('Full Name'),
		            name: 'userRealName',
					itemId: 'userRealName',
		            maxLength: 200
		        }, {
		            xtype: 'textfield',
		            allowBlank: true,
		            fieldLabel: 'Email',
		            name: 'email',
					itemId: 'email',
		            vtype: 'email',
					maxLength: 200
		        }],
				initFieldValues: function(record) {
					var component = this;
					var data = record ? record.data : record;
					
					component.getComponent('username').setValue(data ? data.username : '')
					component.getComponent('username').setDisabled(data);
					component.getComponent('userRealName').setValue(data ? data.userRealName : '')
					component.getComponent('email').setValue(data ? data.email : '')
				}
			}, {
                            xtype: 'usereditwidgetstab',
                            itemId: 'tabWidgets',
                            title: 'Widgets',
                            iconCls: 'widgets-tab',
                            componentId: 'user_id'
                        }]
		}
	});
});
