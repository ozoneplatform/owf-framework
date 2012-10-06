Ext.define('Ozone.components.window.DashboardsManager', {
	extend: 'Ozone.components.window.ModalWindow',
	alias: [
		'widget.dashboardsmanager',
		'widget.Ozone.components.window.DashboardsManager'
	],
	
	stateful: false,
	closeAction: 'destroy',
	closable: true,
	maximizable: false,
	minimizable: false,
	layout: 'border',
	constrain: true,
	title: Ozone.layout.tooltipString.manageDashboardsTitle,
	minButtonWidth: 80,
	reloadDashboards: false,
	reordered: false,
	
	dashboardContainer: null,

	initComponent: function() {
		
		this.addEvents('reload');
		
		Ext.applyIf(this, {
			width: this.width != null ? this.width  : this.ownerCt.getWidth() - 200,
			height: this.height != null ? this.height : this.ownerCt.getHeight() - 100,
			listeners: {
				reload: {
					fn: function() {
						if (this.dashboardContainer) {
							this.dashboardContainer.reloadDashboards();
						}
					},
					scope: this
				}
			},
			items: [
				{
					xtype: 'dashboardsgrid',
					itemId: 'dashboardsgrid',
					border: false,
					hideHeaders: true,
					region: 'center',
					store: this.dashboardContainer.dashboardStore,
					multiSelect: false,
					activeDashboard: this.dashboardContainer.activeDashboard.guid,
					listeners: {
						select: {
							fn: this.onSelect,
							scope: this
						},
						itemdblclick: {
							fn: this.doEdit,
							scope: this
						}
					}
				}, {
					xtype: 'dashboarddetailpanel',
					itemId: 'dashboardsdetail',
					region: 'east',
					preventHeader: true,
					// collapseMode: 'mini',
					// collapsible: true,
					// collapsed: true,
					split: true,
					border: false,
					width: 400
				}
			],
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'bottom',
					//ui: 'footer',
					defaults: {
						minWidth: this.minButtonWidth
					},
					items: [
						{
							xtype: 'button',
							text: 'Create',
							itemId: 'btnCreate',
							handler: function(button) {
								this.doCreate(button);
							},
							scope: this
						}, {
							xtype: 'splitbutton',
							text: 'Edit',
							itemId: 'btnEdit',
							disabled: true,
							handler: function(button) {
								this.doEdit(button);
							},
							menu: {
								xtype: 'menu',
								plain: true,
								defaults: {
									minWidth: this.minButtonWidth
								},
								items: [
									{
										xtype: 'owfmenuitem',
										text: 'Share',
										itemId: 'btnShare',
										disabled: true,
										handler: this.doShare,
										scope: this
									}, {
										xtype: 'owfmenuitem',
										text: 'Restore',
										itemId: 'btnRestore',
										disabled: true,
										handler: this.doRestore,
										scope: this
									}, {
										xtype: 'owfmenuitem',
										text: 'Move Up',
										itemId: 'btnMoveUp',
										disabled: true,
										handler: function(button, event) {
											this.doRowMove(button, event, 'up');
										},
										scope: this
									}, {
										xtype: 'owfmenuitem',
										text: 'Move Down',
										itemId: 'btnMoveDown',
										disabled: true,
										handler: function(button, event) {
											this.doRowMove(button, event, 'down');
										},
										scope: this
									}
								],
								listeners: {
									hide: {
										fn: function() {
											this.down('#btnEdit').focus();
										},
										scope: this
									},
									afterrender: {
										fn: function (cmp) {
											Ozone.components.focusable.EscCloseHelper.
												prototype.setupFocusOnEsc.call(cmp, 
													this.down('#btnEdit').getFocusEl());
										},
										scope: this
									}
								}
							},
							scope: this
						}, {
							xtype: 'button',
							text: 'Delete',
							itemId: 'btnDelete',
							disabled: true,
							handler: this.doDelete,
							scope: this
						}
					]
				}
			]
		});
		
		this.callParent(arguments);

		this.on('beforeclose', this.onClose, this);

		this.on('afterrender', function (cmp) {
			cmp.setupFocus(cmp.getComponent('dashboardsgrid').getView().getEl(), cmp.down('#btnDelete').getFocusEl());
		});

		//Ensure the shadow follows the window in IE
		this.on('resize', function() {
			this.syncShadow();
		});
	},

	onSelect: function(rowModel, record, index, opts) {
		var grid = this.down('#dashboardsgrid');
		var dashboardsdetailpanel = this.down('#dashboardsdetail');
		var btnDelete = this.down('#btnDelete');
		var btnEdit = this.down('#btnEdit');
		var btnShare = this.down('#btnShare');
		var btnRestore = this.down('#btnRestore');
		var btnMoveUp = this.down('#btnMoveUp');
		var btnMoveDown = this.down('#btnMoveDown');

		if (dashboardsdetailpanel) {
			dashboardsdetailpanel.loadData(record);
		}
		if (btnDelete) {
			if (btnDelete.isDisabled()) {btnDelete.enable();}
		}
		if (btnEdit) {
			if (btnEdit.isDisabled()) {btnEdit.enable();}
		}
		if (btnShare) {
			if (btnShare.isDisabled()) {btnShare.enable();}
		}
		if (btnRestore) {
			var groups = record.get('groups');
			if (groups && groups.length > 0) {
				if (btnRestore.isDisabled()) {btnRestore.enable();}
			} else {
				btnRestore.disable();
			}
		}
		if (btnMoveUp) {
			if (btnMoveUp.isDisabled()) {btnMoveUp.enable();}
		}
		if (btnMoveDown) {
			if (btnMoveDown.isDisabled()) {btnMoveDown.enable();}
		}
	},
	
	doCreate: function(button) {
		var createDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'createDashWindow',
			dashboardContainer: this.dashboardContainer,
			ownerCt: this.dashboardContainer
		});
		createDashWindow.show();
		this.close();
	},
	
    doEdit: function(button) {

        var grid = this.down('#dashboardsgrid');
   		var detailsPanel = this.down('dashboarddetailpanel');

   		if (grid) {
   			var records = grid.getSelectionModel().getSelection();
   			if (records && records.length > 0) {
   				var record = records[0];

                   var editDashWindow = Ext.widget('createdashboardwindow', {
                       itemId: 'editDashWindow',
                       title: 'Edit Dashboard',
                       height: 250,
                       dashboardContainer: this.dashboardContainer,
                       ownerCt: this.dashboardContainer,
                       hideViewSelectRadio: true,
                       existingDashboardRecord: record
                   });
                   editDashWindow.show();
                   this.close();

//   				this.dashboardContainer.editDashboard(record);
   				this.close();
   			}
   		}
   	},

	doDelete: function(button) {
		var me = this,
			grid = this.down('#dashboardsgrid');

		if (grid) {
			var records = grid.getSelectionModel().getSelection();
			if (records && records.length > 0) {
				var msg = null;
				if (records.length == 1) {
					msg = 'This action will permanently<br>delete <span class="heading-bold">' 
							+ Ext.htmlEncode(records[0].data.name) + '</span>.';
				}
				else {
					msg = 'This action will permanently<br>delete the selected <span class="heading-bold">' 
							+ records.length + ' dashboards</span>.';
				}

                Ext.widget('alertwindow',{
                    title: "Warning",
                    html:  msg,
                    minHeight: 115,
                    width: 250,
                    dashboardContainer: this.dashboardContainer,
                    focusOnClose: grid.getView(),
                    okFn: function() {
                        var dashstore = grid.store;
                        dashstore.remove(records);
                        me.reloadDashboards = true;
                        dashstore.save();
                        if (dashstore.getCount() <= 0) {
                            me.down('dashboarddetailpanel').clear();
                        }
                    }
                }).show();

			}
			else {
				Ext.Msg.alert("Error", "You must select at least one dashboard to delete.");
			}
		}
	},
	
	doShare: function(button) {
		
		var grid = this.down('#dashboardsgrid');
		if (grid) {
			var records = grid.getSelectionModel().getSelection();
			if (records && records.length > 0) {

				var dash = Ozone.util.cloneDashboard(records[0].data, false, true);
				
//				if (typeof dash.defaultSettings === "string" && !Ext.isEmpty(dash.defaultSettings)) {
//					dash.defaultSettings = Ext.JSON.decode(dash.defaultSettings);
//				} else {
//					dash.defaultSettings = {};
//				}
				
				var shareFormPanel = Ext.create('Ext.form.Panel', Ext.apply({
					itemId: 'shareFormPanel',
					standardSubmit: true,
					layout: 'fit',
					frame: false,
					items: [{
						xtype: 'textarea',
						itemId: 'json',
						name: 'json',
						hideLabel: true,
						readOnly: true,
						width: 550,
						height: 500,
						value: owfdojo.toJson(dash, true),
						plugins: new Ozone.components.focusable.Focusable()
					}]
				}));
				
				var myPopup = Ext.create('Ext.window.Window', Ext.apply({
					id: 'export-win',
					cls: 'manageContainer',
					title: Ozone.ux.DashboardMgmtString.exportDashboardConfig,
					width: 550,
					height: 500,
					modal: true,
					closable: true,
					collapsible: false,
					draggable: true,
					maximizable: false,
					minimizable: false,
					resizable: true,
					layout: 'fit',
					items: [shareFormPanel]
				},this.winConfig || {} ));

				//Ensure the shadow follows the window in IE
				myPopup.on('resize', function() {
					myPopup.syncShadow();
				});
		
				myPopup.show();

                //Ensure its on top
                this.dashboardContainer.floatingWindowManager.register(myPopup);
                this.dashboardContainer.floatingWindowManager.bringToFront(myPopup);

				myPopup.center();
				shareFormPanel.down('textarea').focus();
				// Stop unload event from firing long enough to submit form.
				// Have to do this because the form submit triggers the window's unload event
				// which causes competing requests.  (SEE OWF-4280)
				Ext.EventManager.un(window, 'beforeunload', this.dashboardContainer.onBeforeUnload);
				var elForm = document.createElement('form');
				var elInput = document.createElement('input');
				elInput.id = 'json';
				elInput.name = 'json';
				elInput.type = 'hidden';
				elInput.value = Ext.JSON.encode(dash);
				elForm.appendChild(elInput);
				elForm.action = Ozone.util.contextPath() + '/servlet/ExportServlet';
				elForm.method = 'POST';
				elForm.enctype = elForm.encoding = 'multipart/form-data';
				document.body.appendChild(elForm);
				elForm.submit();
				document.body.removeChild(elForm);
				elForm = null;
				elInput = null;
				var dmScope = this;
				setTimeout(function() {
					Ext.EventManager.on(window, 'beforeunload', dmScope.dashboardContainer.onBeforeUnload, dmScope.dashboardContainer);
				}, 100);
			}
		}
	},
	
	doRestore: function(button) {
		var grid = this.down('#dashboardsgrid');
		var detailsPanel = this.down('dashboarddetailpanel');
		var me = this;
		if (grid) {
			var records = grid.getSelectionModel().getSelection();
			if (records && records.length > 0) {
				var record = records[0];
				var groups = record.get('groups');
				if (groups && groups.length > 0) {
					var id = record.get('guid');
					Ext.Ajax.request({
						url: Ozone.util.contextPath() + '/dashboard/restore',
						params: {
							guid: id,
							isdefault: id == this.dashboardContainer.activeDashboard.guid
						},
						success: function(response, opts) {
							var json = Ext.decode(response.responseText);
							if (json != null && json.data != null && json.data.length > 0) {
								record.data.description = json.data[0].description;
								grid.down('gridview').refreshNode(grid.getStore().indexOf(record));
								detailsPanel.loadData(record);
								me.reloadDashboards = true;
							}
						},
						failure: function(response, opts) {
							Ozone.Msg.alert('Dashboard Manager', "Error restoring dashboard.", function() {
                                Ext.defer(function() {
                                    this.down('gridview').focus();
                                }, 200, this);
                            }, this, null, this.dashboardContainer.floatingWindowManager);
							return;
						},
						scope: this
					});
				}
			}
		}
	},
	
	doRowMove: function(button, event, dir) {
		
		// Check whether up or down arrow was clicked
		var grid = this.down('#dashboardsgrid');
		event.stopEvent();
		var record = grid.getSelectionModel().getSelection()[0];
		if (!record) {
			return;
		} else {
			this.reordered = true;

			var index = grid.getStore().indexOf(record);
			if (dir === "up") {
				index--;
				if (index < 0) {
					return;
				} 
			} else if (dir === "down") {
				index++;
				if (index >= grid.getStore().getCount()) {
					return;
				} 
			} 
			
			// move row
			var store = grid.getStore();
			store.remove(record, true);
			store.insert(index, record);
			
			grid.getSelectionModel().select(index, true);
		}
	},

	onClose: function() {
		var me = this;

		// refresh if user deleted all dashboards
		if(me.dashboardContainer.dashboardStore.getCount() <= 0) {
			window.location.reload();
			return;
		}

		if (me.reordered) {
			me.cellData = [];
			// Create array of views
			var gridData = me.dashboardContainer.dashboardStore.data.items;
			var viewsToUpdate = [];
			var viewGuidsToDelete = [];
		
			for (var i = 0; i < gridData.length; i++) {
				if (!gridData[i].data.removed) {
					viewsToUpdate.push({
						guid: gridData[i].data.guid,
						isdefault: gridData[i].data.isdefault,
						name: gridData[i].data.name.replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '')
					});
				} else {
					viewGuidsToDelete.push(gridData[i].data.guid);
				}
			}

			// remove before close listener so that it doesn't get called
			// when the window is closed from callback
			me.un('beforeclose', arguments.callee, me);

			Ozone.pref.PrefServer.updateAndDeleteDashboards({
				viewsToUpdate: viewsToUpdate,
				viewGuidsToDelete: viewGuidsToDelete,
				updateOrder: true,
				onSuccess: function() {
					me.fireEvent('reload');
					me.close();
				},
				onFailure: function() {
					me.fireEvent('reload');
					me.close();
				}
			});
			return false;
		}
		else if(me.reloadDashboards) {
			this.fireEvent('reload');
		}
	}
});