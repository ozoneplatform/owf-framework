Ext.define('Ozone.components.admin.UsersAddWindow', {
	extend: 'Ext.window.Window',
	alias: ['widget.usersaddwindow'],
	layout: {
        type: 'fit'
    },
	title: 'Add Users',
    itemId: 'adduserwindow',
    closable: false,
	closeAction: 'hide',
    minWidth: 250,
    minHeight: 200,
	width: 250,
	height: 200,
    layout: 'fit',
    items: [{
        xtype: 'usersgrid',
        itemId: 'usersaddgrid',
        border: false
    }],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'usersaddtoolbar',
        dock: 'top',
        items: [{
            itemId: 'tbtext',
            xtype: 'tbtext',
            text: 'Users'
        },
        '->',
        {
            xtype: 'searchbox',
            listeners: {
                searchChanged: {
                    fn: function(cmp, value) {
                        var grid = this.getComponent('usersaddgrid');
                        if (grid != null) {
                            grid.applyFilter(value, ['displayName']);
                        }
                    },
                    scope: this
                }
            }

        }]
    }],
	buttons: [{
        text: 'OK', 
		handler: function(button) {
			button.ownerCt.ownerCt.close();
		}
    }, {
        text: 'Cancel',
        handler: function(button) {
            var window = button.ownerCt.ownerCt;
			window.getComponent('usersaddgrid').getSelectionModel().deselectAll();
			window.close();
        }
    }],
	initComponent: function() {
		this.on({
			show: {
				scope: this,
				fn: function(cmp, e) {
					var store = cmp.getComponent('usersaddgrid').getStore();
					if (store) {
                            
                        store.load({
                            params: {
                                offset: 0,
                                max: store.pageSize
                            }
                        });
                    }
				}
			}
		});
		
		this.callParent(arguments);
	},
	getSelection: function() {
		return this.getComponent('usersaddgrid').getSelectionModel().getSelection();
	}
});
