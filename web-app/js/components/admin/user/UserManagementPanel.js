Ext.define('Ozone.components.admin.user.UserManagementPanel', {
	extend: 'Ozone.components.admin.ManagementPanel',
	alias: ['widget.usermanagement','widget.usermanagementpanel','widget.Ozone.components.admin.UserManagementPanel'],

	lastAction : null,
	
	dragAndDrop: true,
	launchesWidgets: true,
	channel: 'AdminChannel',
	defaultTitle: 'Users',
	guid_EditCopyWidget: null,
	minButtonWidth: 80,
	cls: 'usermanagementpanel',
	detailsAutoOpen: true,
	

	handleEvent: function(sender, msg) {
		if(msg.domain == 'User' || msg.relationship == 'users')
		{
			var userManagement = Ext.getCmp('managementpanel');
			if(userManagement)
			{
				userManagement.refreshGrid();
				userManagement.refreshWidgetLaunchMenu();
			}
		}
	},
	initComponent: function (config) {
		//get widget to launch
		var me = this;
		OWF.Preferences.getUserPreference({
			namespace: 'owf.admin.UserEditCopy',
			name: 'guid_to_launch',
			onSuccess: function(result){
				me.guid_EditCopyWidget = result.value;
			},
			onFailure: function(err){ /* No op */
				me.showAlert('Preferences Error', 'Error looking up User Editor: ' + err);
			}
		});
		Ext.applyIf(this,{
			xtype: 'panel',
			itemId: 'main',
			layout: {
				type: 'border'
			},
			items: [
				{
					xtype: 'usersgrid',
					itemId: 'usersgrid',
					border: false,
					region: 'center'
				},{
					xtype: 'userdetailpanel',
					itemId: 'userdetailpanel',
					region: 'east',
					preventHeader: true,
					collapseMode: 'mini',
					collapsible: true,
					collapsed: true,
					split: true,
					border: false,
					width: 300
				}
			],
			dockedItems: [{
				xtype:'toolbar',
				dock:'top',
                layout: {
                    type: 'hbox',
                    align: 'stretchmax'
                },
				items:[{
					itemId: 'tbtext',
					xtype: 'tbtext',
					text: '<span class="heading-bold">'+this.defaultTitle+'</span>'
					
				},'->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(box, value) {
                                var grid = this.down('#usersgrid');
                                if (grid != null) {
                                    grid.applyFilter(value, 
                                            grid.quickSearchFields);
                                }
                            },
                            scope: this
                        }
                    }
                }]
			},{
				xtype: 'toolbar',
				dock: 'bottom',
				ui:'footer',
				defaults: {
					minWidth: this.minButtonWidth
				},
				items: [{
					xtype: 'button',
					text: 'Create',
					itemId: 'create',
					handler: function(btn, evt) {
						evt.stopPropagation();
						this.doCreate();
					},
					scope: this
				},{
					xtype: 'button',
					text: 'Edit',
					itemId: 'edit',
					handler: function() {
						var grid = this.down('#usersgrid');
						if(grid) {
							var records = grid.getSelectionModel().getSelection();
							if(records && records.length>0) {
			                    for(var i = 0; i < records.length; ++i)
			                    {
			                        this.doEdit(records[i].data.id, records[i].data.userRealName);
			                    }
							}
							else {
                                me.showAlert('Error', 'You must select at least one user to edit.');
							}
						}
					},
					scope: this
				},{
					xtype: 'button',
					text: 'Delete',
					itemId: 'delete',
					handler: function() {
						//confirm multi-select?
						//make store actually delete form database?
						var grid = this.down('#usersgrid');
						if(grid) {
							var records = grid.getSelectionModel().getSelection();
							if(records && records.length > 0){
								var msg = 'This action will permanently delete ';
								if(records.length === 1) {
									msg += '<span class="heading-bold">' + Ext.htmlEncode(records[0].data.userRealName) + '</span>.';
								}
								else {
									msg += 'the selected <span class="heading-bold">' + records.length + ' users</span>.';
								}
								// this.lastAction = '<span class="heading-message">(<span class="heading-bold">'+(records.length==1?records[0].data.userRealName:records.length+ " users");
								// this.lastAction += '</span> deleted)</span>';
                                me.showConfirmation('Warning', msg, function(btn, text, opts) {
                                    if(btn === "ok"){
                                        var userstore = this.down('#usersgrid').store;
                                        userstore.remove(records);
                                        var remainingRecords = userstore.getTotalCount() - records.length;
                                        userstore.on({
                                            write: {
                                                fn: function() {
                                                    if(userstore.data.items.length == 0 && userstore.currentPage > 1) {
                                                        //fencepost, since it's by index
                                                        var lastPage = userstore.getPageFromRecordIndex(remainingRecords - 1);
                                                        var pageToLoad = (lastPage >= userstore.currentPage) ? userstore.currentPage : lastPage;
                                                        userstore.loadPage(pageToLoad);
                                                    }
                                                    grid.getBottomToolbar().doRefresh();
                                                },
                                                scope: this,
                                                single: true
                                            }
                                        });
                                        userstore.save();
                                    }
                                });
							}
							else {
                                me.showAlert('Error', 'You must select at least one user to delete.');
							}
						}
							
					},
					scope: this
				}]
			}]
		});
		this.callParent(arguments);
        
        OWF.Eventing.subscribe('AdminChannel', owfdojo.hitch(this, function(sender, msg, channel) {
            if(msg.domain === 'User') {
                this.down('#usersgrid').getBottomToolbar().doRefresh();
            }
        }));

		this.on({
			render: {
				fn: function() {

					//bind grid selection and data change
					var grid = this.down('#usersgrid');
					if (grid != null) {

						grid.on({
							select: {
								fn: function(rowModel, record, index, opts) {
									var userdetailpanel = this.down('#userdetailpanel');
									if (userdetailpanel != null) {
										userdetailpanel.loadData(record);
										if(this.detailsAutoOpen) {
											userdetailpanel.expand();
										}
									}
								},
								scope: this
							}

						});

                        grid.getView().on({
							itemdblclick: {
								fn: function() {
									var records = grid.getSelectionModel().getSelection();
									if(records && records.length>0) {
										for (var i = 0; i<records.length; i++) {
                                            this.doEdit(records[i].data.id, records[i].data.userRealName);
										}
									}
									else {
                                        me.showAlert('Error', 'You must select at least one user to edit.');
									}
								},
								scope: this
							},
                            itemkeydown: {
                                scope: this,
                                fn: function(view, record, dom, index, evt) {
                                    switch(evt.getKey()) {
                                        case evt.SPACE:
                                        case evt.ENTER:
                                            this.doEdit(record.data.id, record.data.userRealName);
                                    }
                                }
                            }
                        });

						grid.store.on({
							datachanged: {
								fn: function(store, opts) {
									var userdetailpanel = this.down('#userdetailpanel');
									if(userdetailpanel != null) {
										userdetailpanel.collapse();
										userdetailpanel.removeData();
									}
//									if(this.lastAction != null){
//										var tbtext = this.down('#title');
//										tbtext.setText('<span class="heading-bold">Users</span> '+this.lastAction);
//									}
//									this.lastAction = null;
								},
								scope: this
							},
							load: {
								fn: function(store, opts) {
//									if(this.lastAction != null){
//										var tbtext = this.down('#title');
//										tbtext.setText('<span class="heading-bold">Users</span> '+this.lastAction);
//									}
//									this.lastAction = null;
								},
								scope:this
							}
						});
						
                        if (grid.store.proxy) {
                            grid.store.proxy.on(
                                'exception',
                                function(proxy, response, operation, eOpts) {
                                    var json;
                                    var theStore = grid.store;
                                    try {
                                        json = (typeof response) == 'string' ?  Ext.JSON.decode(response) : response;
                                    } catch(e) {
                                        json = {
                                            errorMsg: response
                                        }
                                    }
                                    me.showAlert('Server Error',
                                        'Error during ' + operation.action + (json && json.errorMsg ? (': ' + json.errorMsg) : ''));
                                    theStore.removed = [];
                                    theStore.load();
                                }
                            );
                        }
						
						//load data
						grid.load();
					}
				},
				scope: this
			},
			afterrender: {
				fn: function() {
					var splitterEl = this.el.down(".x-collapse-el");
					splitterEl.on('click', function() {
						var collapsed = this.el.down(".x-splitter-collapsed");
						if(collapsed) {
							this.detailsAutoOpen = true;
						}
						else {
							this.detailsAutoOpen = false;
						}
					}, this);
				},
				scope:this
			
			}
		});
	}
});
