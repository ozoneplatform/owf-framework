Ext.define('Ozone.components.admin.group.GroupManagementPanel', {
    extend: 'Ozone.components.admin.ManagementPanel',
    alias: ['widget.groupmanagement'],
    
    layout: 'fit',
    
    gridGroups: null,
    pnlGroupDetail: null,
    txtHeading: null,
    lastAction: null,
    guid_EditCopyWidget: null,
    
    widgetStateHandler: null,
    dragAndDrop: true,
    launchesWidgets: true,
    channel: 'AdminChannel',
    defaultTitle: 'Groups',
    minButtonWidth: 80,
    detailsAutoOpen: true,
    
    initComponent: function() {
        
        var me = this;
        
        OWF.Preferences.getUserPreference({
            namespace: 'owf.admin.GroupEditCopy',
            name: 'guid_to_launch',
            onSuccess: function(result) {
                me.guid_EditCopyWidget = result.value;
            },
            onFailure: function(err){ /* No op */
                me.showAlert('Preferences Error', 'Error looking up Group Editor: ' + err);
            }
        });
        
        this.gridGroups = Ext.create('Ozone.components.admin.GroupsGrid', {
            preventHeader: true,
            region: 'center',
            border: false
        });
        this.gridGroups.store.load({
        	params: {
                offset: 0,
                max: this.pageSize
            }
        });
        this.relayEvents(this.gridGroups, ['datachanged', 'select', 'deselect', 'itemdblclick']);
        
        this.pnlGroupDetail = Ext.create('Ozone.components.admin.group.GroupDetailPanel', {
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            region: 'east',
            preventHeader: true,
            collapseMode: 'mini',
            collapsible: true,
            collapsed: true,
            split: true,
            border: false,
            width: 200
        });
        
        this.txtHeading = Ext.create('Ext.toolbar.TextItem', {
            text: '<span class="heading-bold">'+this.defaultTitle+'</span>'
        });
        
        
        this.searchBox = Ext.widget('searchbox');

        this.items = [{
            xtype: 'panel',
            layout: 'border',
            border: false,
            items: [
                this.gridGroups,
                this.pnlGroupDetail
            ]
        }];
        
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            layout: {
                type: 'hbox',
                align: 'stretchmax'
            },
            items: [
                this.txtHeading,
            {
                xtype: 'tbfill'
            },
                this.searchBox
            ]
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            defaults: {
                minWidth: this.minButtonWidth
            },
            items: [{
                xtype: 'button', 
                text: 'Create',
                handler: function(button, evt) {
                    evt.stopPropagation();
                    me.doCreate();
                }
            }, {
                xtype: 'splitbutton',
                text: 'Edit',
                itemId: 'btnEdit',
                handler: function() {
                    var records = me.gridGroups.getSelectionModel().getSelection();
                    if (records && records.length > 0) {
                        for (var i = 0; i < records.length; i++) {
                            me.doEdit(records[i].data.id, records[i].data.displayName);
                        }
                    } else {
                        me.showAlert('Error', 'You must select at least one group to edit.');
                    }
                },
                menu: {
                    xtype: 'menu',
                    plain: true,
                    hideMode: 'display',
                    defaults: {
                        minWidth: this.minButtonWidth
                    },
                    items: [
                        {
                          xtype: 'owfmenuitem',
                          text: 'Activate',
                          handler: function(button) {
                            me.doActivate();
                          }
                        },
                        {
                          xtype: 'owfmenuitem',
                          text: 'Deactivate',
                          handler: function(button) {
                            me.doDeactivate();
                          }
                        }
                    ]
                }
            }, {
                xtype: 'button', 
                text: 'Delete',
                itemId: 'btnDelete',
                handler: function(button) {
                    me.doDelete();
                }
            }]
        }];
    
        this.on(
            'datachanged',
            function(store, opts) {
                  //collapse and clear detail panel if the store is refreshed
                  if (this.pnlGroupDetail != null ) {
                    this.pnlGroupDetail.collapse();
                    this.pnlGroupDetail.removeData();
                  }

                  //refresh launch menu
                  if (!this.disableLaunchMenuRefresh) {
                    this.refreshWidgetLaunchMenu();
                  }
            },
            this
        );
    
        this.on(
            'select',
            function(rowModel, record, index, opts) {
                this.pnlGroupDetail.loadData(record);
                if (this.pnlGroupDetail.collapsed && this.detailsAutoOpen) {this.pnlGroupDetail.expand();}
                this.updateDeleteButton(rowModel.selected);
            },
            this
        );
    
        this.on(
            'deselect',
            function(rowModel, record, index, opts) {
                this.updateDeleteButton(rowModel.selected);
            },
            this
        );
        
            
        this.searchBox.on(
            'searchChanged',
            function(searchbox, value) {
                this.gridGroups.applyFilter(value, ['name', 'description', 'displayName']);
            },
            this
        );

        this.on(
             'itemdblclick',
             function(view, record, item, index, evt, opts) {
                 this.doEdit(record.data.id, record.data.displayName);
             },
             this
         );

        this.gridGroups.getView().on('itemkeydown', function(view, record, dom, index, evt) {
            switch(evt.getKey()) {
                case evt.SPACE:
                case evt.ENTER:
                    this.doEdit(record.data.id, record.data.displayName);
            }
        }, this);

        
        
        this.callParent(arguments);
        
        OWF.Eventing.subscribe('AdminChannel', owfdojo.hitch(this, function(sender, msg, channel) {
            if(msg.domain === 'Group') {
                this.gridGroups.getBottomToolbar().doRefresh();
            }
        }));
        
        this.on(
    		'afterrender', 
    		function() {
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
			this
		);
    },

    launchFailedHandler: function(response) {
        if (response.error) {
            this.showAlert('Launch Error', 'Group Editor Launch Failed: ' + response.message);
        }
    },
    
    doEdit: function(id, title) {
        var dataString = Ozone.util.toString({
            id: id,
            copyFlag: false
        });
        
        OWF.Launcher.launch({
            title: '$1 - ' + title,
            titleRegex: /(.*)/,
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
            data: dataString
        }, this.launchFailedHandler);
    },
    
    doActivate: function() {
        var records = this.gridGroups.getSelectionModel().getSelection();
        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var group = records[i];
                if (group) {
                    group.set('status', 'active');
                }
            }
            var store = this.gridGroups.getStore();
            store.save();
            this.refreshWidgetLaunchMenu();
        } else {
            this.showAlert('Error', 'You must select at least one group to activate.');
        }
    },
    
    doDeactivate: function() {
        var records = this.gridGroups.getSelectionModel().getSelection();
        if (records && records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var group = records[i];
                if (group) {
                    group.set('status', 'inactive');
                }
            }
            var store = this.gridGroups.getStore();
            store.save();
            this.refreshWidgetLaunchMenu();
        } else {
            this.showAlert('Error', 'You must select at least one group to deactivate.');
        }
    },
    
    doDelete: function() {
        var records = this.gridGroups.getSelectionModel().getSelection();
        if (records && records.length > 0) {

            //Flag for if the OWF Users or OWF Administrators group is selected to delete
            var allUsersOrAdminsGroupSelected = false;
            for(var i = 0; i < records.length; i++) {
                if((records[i].get('name') == 'OWF Users' || records[i].get('name') == 'OWF Administrators') && records[i].get('automatic') == true) {
                    allUsersOrAdminsGroupSelected = true;
                    break;
                }
            }

            var msg = 'This action will permanently delete the selected group(s).';

            //If the OWF Users or OWF Administrators groups were selected for deletion, warn the user they will not be deleted
            if (allUsersOrAdminsGroupSelected) {
                //Get the current names of the OWF Users and OWF Administrators groups, since they are editable
                var nonremovableGroupNames = [];
                for(var i = 0; i < records.length; i++) {
                    if((records[i].get('name') == 'OWF Users' || records[i].get('name') == 'OWF Administrators') && records[i].get('automatic') == true) {
                        nonremovableGroupNames.push(records[i].get('name'));
                    }
                }

                if(nonremovableGroupNames.length == 1) {
                    msg = 'You have chosen to delete <span class="heading-bold">' + records.length + ' groups</span>.<br>'
                        + 'However, the <span class="heading-bold">' + nonremovableGroupNames[0] 
                        + '</span> group cannot be deleted.<br>Pressing OK will permanently delete your other selection(s).';
                } else if(nonremovableGroupNames.length == 2) {
                    msg = 'You have chosen to delete <span class="heading-bold">' + records.length + ' groups</span>.<br>'
                        + 'However, the <span class="heading-bold">' + nonremovableGroupNames[0] 
                        + '</span> and <span class="heading-bold">' + nonremovableGroupNames[1] 
                        + '</span> groups cannot be deleted.<br>Pressing OK will permanently delete your other selection(s).';
                }
            
                //Remove OWF Users and OWF Administrators groups from the records list so they aren't deleted
                for(var i = 0; i < records.length; i++) {
                    if((records[i].get('name') == 'OWF Users' || records[i].get('name') == 'OWF Administrators') && records[i].get('automatic') == true) {
                        records[i] = null;
                    }
                }
                records = Ext.Array.clean(records);
            }
            else if (records.length == 1) {
                msg = 'This action will permanently delete <span class="heading-bold">' 
                        + Ext.htmlEncode(records[0].data.name) + '</span>.';
            }
            else {
                 msg = 'This action will permanently delete the selected <span class="heading-bold">' 
                        + records.length + ' groups</span>.';
            }

            this.showConfirmation('Warning', msg, function(btn, text, opts) {
                if (btn == 'ok') {
                    var store = this.gridGroups.getStore();
                    store.remove(records);
                    var remainingRecords = store.getTotalCount() - records.length;
                    store.on({
                        write: {
                            fn: function(s,b,data) {
                                if(store.data.items.length === 0 && store.currentPage > 1) {
                                    var lastPage = store.getPageFromRecordIndex(remainingRecords - 1);
                                    var pageToLoad = (lastPage >= store.currentPage) ? store.currentPage : lastPage;
                                    store.loadPage(pageToLoad);
                                }
                                this.gridGroups.getBottomToolbar().doRefresh();
                                this.refreshWidgetLaunchMenu();
                            },
                            single: true,
                            scope: this
                        }
                    });
                    store.save();
                }
            });
        } else {
            this.showAlert('Error', 'You must select at least one group to delete.');
        }
    },
    
    updateDeleteButton: function(records) {
        var btnDelete = this.down('#btnDelete');

        //Only disable Delete if OWF Users or OWF Administrators groups are the only ones selected,
        //without any removable groups selected in addition to them.
        if(records.length == 1) {
            if ((records.get(0).get('name') == 'OWF Users' || records.get(0).get('name') == 'OWF Administrators') && records.get(0).get('automatic') == true) {
                btnDelete.disable();
            }
            else {
                btnDelete.enable();
            }
        }
        else if(records.length == 2) {
            var allUsersAndAdminsGroupsSelectedTotal = 0;
            for(var i = 0; i < 2; i++) {
                if((records.get(i).get('name') == 'OWF Users' || records.get(i).get('name') == 'OWF Administrators')  && records.get(i).get('automatic') == true) {
                    allUsersAndAdminsGroupsSelectedTotal++;
                }
            }
            if(allUsersAndAdminsGroupsSelectedTotal == 2) {
                btnDelete.disable();
            }
            else {
                btnDelete.enable();
            }
        }
        else {
            btnDelete.enable();
        }
    }
});
