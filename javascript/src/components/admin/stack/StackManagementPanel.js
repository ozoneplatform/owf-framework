Ext.define('Ozone.components.admin.stack.StackManagementPanel', {
    extend: 'Ozone.components.admin.ManagementPanel',
    alias: ['widget.stackmanagement'],

    layout: 'fit',

    gridStacks: null,
    pnlStackDetail: null,
    txtHeading: null,
    lastAction: null,
    guid_EditCopyWidget: null,

    widgetStateHandler: null,
    dragAndDrop: true,
    launchesWidgets: true,
    channel: 'AdminChannel',
    defaultTitle: 'Apps',
    minButtonWidth: 80,
    detailsAutoOpen: true,

    initComponent: function() {

        var me = this;

        OWF.Preferences.getUserPreference({
            namespace: 'owf.admin.StackEditCopy',
            name: 'guid_to_launch',
            onSuccess: function(result) {
                me.guid_EditCopyWidget = result.value;
            },
            onFailure: function(err){ /* No op */
                me.showAlert('Preferences Error', 'Error looking up Application Editor: ' + err);
            }
        });

        this.gridStacks = Ext.create('Ozone.components.admin.StacksGrid', {
            preventHeader: true,
            region: 'center',
            border: false
        });
        this.gridStacks.store.proxy.extraParams = {
                adminEnabled: true
              };
        this.gridStacks.store.load({
        	params: {
                offset: 0,
                max: this.pageSize
            }
        });
        this.relayEvents(this.gridStacks, ['datachanged', 'select', 'deselect', 'itemdblclick']);

        this.pnlStackDetail = Ext.create('Ozone.components.admin.stack.StackDetailPanel', {
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
                this.gridStacks,
                this.pnlStackDetail
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
                text: 'Edit',
                itemId: 'btnEdit',
                handler: function() {
                    var records = me.gridStacks.getSelectionModel().getSelection();
                    if (records && records.length > 0) {
                        for (var i = 0; i < records.length; i++) {
                            me.doEdit(records[i].data.id, records[i].data.name);
                        }
                    } else {
                        me.showAlert('Error', 'You must select at least one App to edit.');
                    }
                }
            }, {
                xtype: 'button',
                text: 'Delete',
                itemId: 'btnDelete',
                handler: function(button) {
                    me.doDelete();
                }
            }, {
                xtype: 'button',
                text: 'Assign To Me',
                itemId: 'btnAssignToMe',
                handler: function(button) {
                    me.doAssignToMe();
                }
            }]
        }];

        this.on(
            'datachanged',
            function(store, opts) {
                  //collapse and clear detail panel if the store is refreshed
                  if (this.pnlStackDetail != null ) {
                    this.pnlStackDetail.collapse();
                    this.pnlStackDetail.removeData();
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
                this.pnlStackDetail.loadData(record);
                if (this.pnlStackDetail.collapsed && this.detailsAutoOpen) {this.pnlStackDetail.expand();}
            },
            this
        );

        this.searchBox.on(
            'searchChanged',
            function(searchbox, value) {
                this.gridStacks.applyFilter(value, ['name', 'description', 'stackContext']);
            },
            this
        );

        this.on(
             'itemdblclick',
             function(view, record, item, index, evt, opts) {
                 this.doEdit(record.data.id, record.data.name);
             },
             this
         );

        this.gridStacks.getView().on('itemkeydown', function(view, record, dom, index, evt) {
            switch(evt.getKey()) {
                case evt.SPACE:
                case evt.ENTER:
                    this.doEdit(record.data.id, record.data.name);
            }
        }, this);

        this.callParent(arguments);

        OWF.Eventing.subscribe('AdminChannel', owfdojo.hitch(this, function(sender, msg, channel) {
            if(msg.domain === 'Stack') {
                this.gridStacks.getBottomToolbar().doRefresh();
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
        if (response && response.error) {
            this.showAlert('Launch Error', 'Application Editor Launch Failed: ' + response.message);
        }
    },

    doEdit: function(id ,title) {
        var me = this,
            dataString = Ozone.util.toString({
                id: id,
                copyFlag: false
            });

        this.getTargetPane(function (pane) {
            OWF.Launcher.launch({
                pane: pane,
                title: '$1 - ' + title,
                titleRegex: /(.*)/,
                guid: me.guid_EditCopyWidget,
                launchOnlyIfClosed: false,
                data: dataString
            }, me.launchFailedHandler);
        });
    },

    doDelete: function() {
        var records = this.gridStacks.getSelectionModel().getSelection();
        if (records && records.length > 0) {

            var msg = 'This action will permanently delete ';
            if (records.length === 1) {
              msg += '<span class="heading-bold">' + Ext.htmlEncode(records[0].data.name) + '</span>.';
            }
            else {
              msg += 'the selected <span class="heading-bold">' + records.length + ' applications</span>.';
            }
            this.showConfirmation('Warning', msg, function(btn, text, opts) {
                if (btn == 'ok') {
                    var store = this.gridStacks.getStore();
                    store.remove(records);
                    var remainingRecords = store.getTotalCount() - records.length;
                    store.on({
                       write: {
                         fn: function() {
                           if(store.data.items.length==0 && store.currentPage>1)
                           {
                               var lastPage = store.getPageFromRecordIndex(remainingRecords - 1);
                               var pageToLoad = (lastPage>=store.currentPage)?store.currentPage:lastPage;
                               store.loadPage(pageToLoad);
                           }
                           this.gridStacks.getBottomToolbar().doRefresh();
                           this.pnlStackDetail.removeData();
                           if (!this.pnlDashboardDetail.collapsed) {this.pnlDashboardDetail.collapse();}
                           this.refreshWidgetLaunchMenu();

                         },
                         scope: this,
                         single: true
                       }
                    });
                    store.save();

                    this.widgetStateHandler.handleWidgetRequest({
                        fn: 'refreshDashboardStore',
                        title: this.generateNotificationTitle(records.length)
                    });
                }
            });
        } else {
            this.showAlert('Error', 'You must select at least one App to delete.');
        }
    },

    generateNotificationTitle: function(numRecordsChanged) {
        return numRecordsChanged === 1 ? 'App Deleted' : 'Apps Deleted';
    },

    doAssignToMe: function() {
        var records = this.gridStacks.getSelectionModel().getSelection();
        if (records && records.length === 1) {
            var record = records[0],
                msg = 'This action will assign <span class="heading-bold">' +
                       Ext.htmlEncode(record.get('name')) + '</span> to you.',
                owner = record.get('owner');

            if(owner && owner.username === Ozone.config.user.displayName) {
                this.showAlert('Error', 'You are already the assigned owner of this App.');
            }
            else {
                //If this App has an owner, give a more dire warning
                if(owner) {
                    msg += '<br/><br/><b>IMPORTANT:</b> This App is currently owned by <b>' +
                           Ext.htmlEncode(owner.username) + '</b> and cannot be reassigned ' +
                           'to this owner once this action is executed.';
                }
                msg += '<br/><br/>Are you sure you want to take ownership of this App?';

                this.showConfirmation('Warning', msg, function(btn, text, opts) {
                    if (btn == 'ok') {
                        record.set('owner', {'username': Ozone.config.user.displayName});
                        this.gridStacks.getStore().save();
                    }
                });
            }
        } else if(records && records.length > 1) {
            this.showAlert('Error', 'You may assign <b>only</b> one App at a time.');
        } else {
            this.showAlert('Error', 'You must select an App to assign.');
        }
    }
});
