Ext.define('Ozone.components.admin.group.GroupEditDashboardsTab', {
    extend: 'Ozone.components.admin.DashboardsTabPanel',
    alias: [
        'widget.groupeditdashboards',
        'widget.groupeditdashboardstab',
        'widget.Ozone.components.admin.group.GroupEditDashboardsTab'
    ],

    cls: 'groupeditdashboardstab',

    isGroupDashboard: true,

    initComponent: function () {
        //get widget to launch
        Ext.applyIf(this, {
            layout: 'fit',
            itemId: 'tabDashboards',
            title: 'Dashboards',
            iconCls: 'dashboard-tab',
            componentId: 'group_id',
            storeCfg: {
                api: {
                    read: '/dashboard',
                    create: '/group',
                    update: '/dashboard',
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
                    destroy: 'remove',
                    create: 'add'
                }
            }
        });
        this.callParent(arguments);

        this.addDocked({
            xtype: 'toolbar',
            itemId: 'tbDashboardsGridFtr',
            dock: 'bottom',
            ui: 'footer',
            defaults: {
                minWidth: 80
            },
            items: [
            {
                xtype: 'button',
                text: 'Add',
                itemId: 'btnAdd',
                handler: function() {
                    this.onAddClicked();
                },
                scope: this
            },
            {
                xtype: 'button',
                text: 'Remove',
                itemId: 'btnRemove',
                handler: function() {
                    this.doDelete();
                },
                scope: this
            }
            ]
        });
    },
    onAddClicked: function () {
        var me = this;
        var vpSize = Ext.getBody().getViewSize();
        var win = Ext.create('Ext.window.Window', {
            title: me.generateTitle(),
            minWidth: 250,
            minHeight: 200,
            width: vpSize.width * .9,
            height: vpSize.height * .9,
            modal:true,
            layout: 'fit',
            cls: 'dashboardsaddpanel',
            items: [
            {
                xtype:'dashboardsgrid',
                itemId: 'dashboardsaddgrid',
                cls: 'adddashboardsgrid',
                preventHeader:true,
                border:false,
                listeners: {
                    render: {
                        fn: function(cmp) {
                            cmp.setBaseParams({
                                adminEnabled: true,
                                isGroupDashboard: true
                            });
                        },
                        scope: this
                    }
                }
            }
            ],
            dockedItems: [
            {
                xtype:'toolbar',
                dock:'bottom',
                ui:'footer',
                defaults:{
                    minWidth:80
                },
                items:['->',{
                    xtype:'button',
                    text:'OK',
                    handler: function() {
                        var addgrid = win.down('#dashboardsaddgrid');
                        if (addgrid) {
                            var records = addgrid.getSelectionModel().getSelection();
                            if (records && records.length > 0) {
                                var grid = me.down('#dashboardsgrid');
                                if (grid) {
                                    var store = grid.getStore();
                                    var uniqueRecords = [];

                                    for (var i = 0, length = records.length; i < length; i++) {
                                        //if it doesn't exist in the store, add it to the unique records list
                                        if (store.getById(records[i].data.guid) === null) {
                                            var recordToPush = records[i];
                                            recordToPush.phantom = true;
                                            uniqueRecords.push(recordToPush);
                                        }
                                    }

                                    store.insert(0, uniqueRecords);
                                    store.sync();
                                }
                            }
                        }
                        win.close();
                    },
                    scope: this
                },{
                    xtype:'button',
                    text:'Cancel',
                    handler: function() {
                        win.close();
                    },
                    scope: win
                }]
            },
            {
                xtype:'toolbar',
                dock:'top',
                items:[
                {
                    xtype:'tbtext',
                    cls: 'tbDashboardsGridHdr',
                    text:'Dashboards'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: function (cmp, value) {
                            var grid = win.down('#dashboardsaddgrid');
                            grid.applyFilter(value, grid.quickSearchFields);
                        }
                    }
                }
                ]
            }
            ]
        });
        win.on(
            'activate',
            function(cmp, opts) {
                var grid = cmp.down('#dashboardsaddgrid');
                grid.store.load({
                    params: {
                        offset: 0,
                        max: this.pageSize
                    }
                });
            },
            this);
        win.show();
    },
    doDelete: function(button, e) {
      
        var grid = this.getComponent('dashboardsgrid');
        var store = grid.getStore();
        var records = grid.getSelectedDashboards();
        if (records && records.length > 0) {
            store.remove(records);
            store.save();
        } else {
            Ext.Msg.alert("Error", "You must select at least one dashboard to delete.");
        }
    },
    generateTitle: function() {

        var title = "Add Dashboard(s)";

        //Set the title to the name of whatever the group is being added to 
        var data = this.ownerCt.store.data.items[0].data;
        if(data.name) {
            //Adding dashboard to a group
            title += " to " + data.name;
        }

        //Set a character limit to start at and truncate the title to it if necessary
        var charLimit = 100;
        title = Ext.util.Format.ellipsis(title, charLimit);

        //Get the size of the parent container
        var vpSize = Ext.getBody().getViewSize();

        //Use TextMetrics to get the pixel width of the title
        var textMetrics = new Ext.util.TextMetrics();
        var titleWidth = textMetrics.getWidth(title);

        //If the title's pixel width is too large for the window, decrease it
        //by 5 characters until its pixel width fits
        while(titleWidth > ((vpSize.width * .8))) {
            charLimit -= 5;
            title = Ext.util.Format.ellipsis(title, charLimit);
            titleWidth = textMetrics.getWidth(title);
        }

        textMetrics.destroy();

        return Ext.htmlEncode(title);
    }
});
