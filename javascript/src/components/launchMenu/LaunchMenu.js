Ext.define('Ozone.components.launchMenu.LaunchMenu', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.launchMenu',

    closeAction: 'hide',
    modal: true,
    modalAutoClose: true,
    shadow: false,
    ui: 'widget-launcher',
    title: 'Favorites Menu',
    dashboardContainer: null,
    closable: true,
    preventHeader: false,
    iconCls: 'widget-launcher-header-icon',
    resizable: false,
    draggable: false,
    mouseDownCounter: 0,

    dontLoadWidgetStore: false,
    disableDashboardSelection: false,

    startBtnCfg: {
        xtype: 'button',
        text: 'Start',
        cls: 'start-remove-btn start-btn',
        itemId: 'start'
    },

    removeBtnCfg: {
        xtype: 'button',
        text: 'Remove',
        cls: 'start-remove-btn remove-btn',
        itemId: 'remove'
    },

    initComponent: function () {
        var me = this;

        this.tools = [
            {
                itemId: 'viewSwitch',
                xtype: 'toolbar',
                cls: 'viewSwitch',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'end'
                },
                items: [
                    {
                        xtype: 'button',
                        itemId: 'gridViewBtn',
                        cls: 'gridViewBtn',
                        text: null,
                        scale: 'large',
                        iconCls: 'gridViewBtnIcon-up',
                        iconAlign: 'top',
                        handler: function (b, e) {
                            this.showGridView(b);
                        },
                        scope: this
                    },
                    {
                        xtype: 'button',
                        itemId: 'iconViewBtn',
                        cls: 'iconViewBtn',
                        text: null,
                        scale: 'large',
                        iconCls: 'iconViewBtnIcon-down',
                        iconAlign: 'top',
                        handler: function (b, e) {
                            this.showIconView(b);
                        },
                        scope: this
                    }
                ]
            },
            {
                xtype: 'toolbar',
                cls: 'searchBar',
                flex: 1,
                items: [
                    {
                        xtype: 'searchbox',
                        itemId: 'searchbox',
                        flex: 1,
                        emptyText: "Search",
                        dynamic: true,
                        listeners: {
                            searchChanged: function (cmp, value) {
                                if (!this.dontLoadWidgetStore) {
                                    if (value == '') {
                                        this.widgetStore.widgetFiltered = false;
                                    }
                                    else {
                                        this.widgetStore.widgetFiltered = true;
                                    }
                                    this.searchPanel.search({
                                        customWidgetName: value
                                    });
                                }
                            },
                            scope: this
                        }
                    }
                ]
            }
        ];

        //make a copy of widgetStore to use, this is needed because filtering causes problems when widget states are saved
        this.widgetStore = Ext.create('Ozone.data.WidgetStore');
        //set default filtering
        this.widgetStore.proxy.extraParams = {
            visible: true,
            widgetTypes: ['standard']
        };

        //a load on the main widgetStore this will trigger the launch Menu widgetStore to load
        this.dashboardContainer.widgetStore.on({
            load: {
                fn: function (store, records, successful, operation, eOpts) {
                    if (!this.dontLoadWidgetStore) {
                        this.widgetStore.widgetFiltered = false;
                    }
                },
                scope: this
            }
        });

        //create the openWidgetStore and bind to widgetStore
        this.openedWidgetStore = Ext.create('Ozone.data.WidgetStore');
        this.widgetStore.on({
            datachanged: {
                fn: function (store, eOpts) {
                    this.openedWidgetStore.clearFilter();
                    this.openedWidgetStore.filter({
                        filterFn: function (rec, id) {
                            var widgetId = rec.get('widgetGuid');
                            return store.findExact('widgetGuid', widgetId) > -1;
                        }
                    });
                },
                scope: this
            }
        });

        //create two favstores one to be filtered in the launch menu and the other to be the full set
        this.favStore = Ext.create('Ozone.data.WidgetStore', {
            sortOnFilter: false
        });
        this.favStoreUnFiltered = Ext.create('Ozone.data.WidgetStore');
        this.favStore.on({
            add: {
                fn: function (store, records, index, eOpts) {
                    for (var i = 0 ; i < records.length ; i++) {
                        var record = records[i];
                        //make sure the record to be added is not already in the favStoreUnfiltered
                        if (this.favStoreUnFiltered.findExact('widgetGuid', record.get('widgetGuid')) < 0) {
                            if (this.widgetStore.widgetFiltered) {
                                this.favStoreUnFiltered.add(record);
                            }
                            else {
                                this.favStoreUnFiltered.insert(index + i,record);
                            }
                        }
                    }
                },
                scope: this
            },
            remove: {
                fn: function (store, record, index, eOpts) {
                    var favindex = this.favStoreUnFiltered.findExact('widgetGuid', record.get('widgetGuid'));
                    if ( favindex > -1) {
                        this.favStoreUnFiltered.removeAt(favindex);
                    }
                },
                scope: this
            },
            clear: {
                fn: function (store, eOpts) {
                    if (!this.widgetStore.widgetFiltered) {
                      this.favStoreUnFiltered.removeAll();
                    }
                },
                scope: this
            }
        });
        this.widgetStore.on({
            datachanged: {
                fn: function (store, eOpts) {
                    this.favStore.clearFilter();
                    this.favStore.filter({
                        filterFn: function (rec, id) {
                            var widgetId = rec.get('widgetGuid');
                            return store.findExact('widgetGuid', widgetId) > -1;
                        }
                    });
                },
                scope: this
            },
            clear: {
                fn: function (store, eOpts) {
                    this.favStore.clearFilter();
                    this.favStore.filter({
                        filterFn: function (rec, id) {
                            return false;
                        }
                    });
                },
                scope: this
            }
        });

        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretchmax'
                    },
                    itemId: "infoPanel",
                    cls: "info-panel",
                    region: 'north',
                    padding: '2',
                    items: [
                        {
                            xtype: 'checkbox',
                            hidden: true,
                            itemId: 'intentCheckBox',
                            cls: 'intentCheckBox',
                            boxLabel: 'Remember this decision'
                        }
                    ]
                },
                {
                    xtype: 'widgetviewcontainer',
                    itemId: 'view',
                    cls: 'widgetviewcontainer',
                    region: 'center',
                    flex: 1,
                    widgetStore: this.widgetStore,
                    openedWidgetStore: this.openedWidgetStore,
                    listeners: {
                        itemkeydown: {
                            fn: function(view, record, item, index, evt, eOpts) {
                              if (evt.getKey() == evt.F) {
                                    this.carousel.addWidget(record);
                              }
                            },
                            scope: this
                        },
                        render: {
                            fn: function(cmp) {
                                var dropZone = new Ext.dd.DropZone(cmp.getEl(), {
                                    ddGroup: 'carousel',

                                    onContainerOver: function (source, e, data) {
                                        return Ext.dd.DropZone.prototype.dropAllowed;

                                    },
                                    onContainerDrop: function (source, e, data) {
                                        me.carousel.removeWidget(data.widgetModel);
                                    }
                                });
                            },
                            scope: this
                        }
                    },
                    plugins: {
                        ptype: 'instancevariablizer',
                        container: me
                    }
                },
                {
                    xtype: 'panel',
                    itemId: "startRemovePanel",
                    cls: "start-remove-panel",
                    region: 'south',
                    padding: '10',
                    items: [
                        me.startBtnCfg,
                        me.removeBtnCfg
                    ]
                }
            ]
        });

        this.callParent();

        this.addEvents('noWidgetLaunched', 'refresh');

        this.on({
            render: {
                fn: function(cmp) {
                    me.createSidePanel();
                },
                scope: this
            },
            afterrender: {
                fn: function(cmp) {
                    this.setupCircularFocus();
                },
                scope: this
            },
            close: {
                fn: this.onClose,
                scope: this
            },
            beforeshow: {
                fn: function (cmp) {
                    //adjust the size of the launch menu based on the size of the browser
                    this.setSize(document.body.clientWidth * 0.55, document.body.clientHeight * 0.7);

                    //just to be sure un register the listener
                    Ext.EventManager.un(window, 'beforeunload', this.saveLauncherStateSync, this);

                    //register the beforeunload listener to save the launch menu state while the launch menu is open
                    Ext.EventManager.on(window, 'beforeunload', this.saveLauncherStateSync, this);

                },
                scope: this
            },
            invalidDrop: {
                fn: function () {
                    this.fireEvent('noWidgetLaunched');
                },
                scope: this
            },
            modalAutoClose: {
                fn: function () {
                    this.fireEvent('noWidgetLaunched');
                },
                scope: this
            },

            //this event bubbles up from the widgetview
            selectionchange: {
                fn: function(selModel, records, eOpts) {
                    if (records.length > 0) {
                        var record = records[0];
                        this.updateInfoPanel(record, (eOpts && eOpts.favorite) || this.favStore.findRecord("widgetGuid", record.get('widgetGuid')));
                    }
                },
                scope: this
            },
            itemdblclick: {
                fn: this.itemDblClick,
                scope: this
            },
            itemkeydown: {
                fn: this.itemKeyDown,
                scope: this
            }

        });

        me.on('afterrender', me.enableDraggingOut, me, { single: true });

    },

    refreshOpenedWidgets: function () {
        //if the activeDash is set then use the stateStore as the openWidgetStore
        if (this.dashboardContainer.activeDashboard != null) {
            this.view.setOpenedWidgets(this.dashboardContainer.activeDashboard.stateStore);
        }
    },

    refresh: function () {

        if (this.rendered) {
            this.showIntentCheckBox = false;

            this.clearSelections(true);

            //toggle opened widget view
            this.showOpenedWidgetsView(false);

            //load the widget definition data
            this.dashboardContainer.widgetStore.on({
                load: {
                    fn: function (store, records, success, operation, eOpts) {
                        if (this.searchPanel != null) {

                            //this will load the launch menu's widgetStore
                            this.searchPanel.search();

                            this.searchPanel.refresh();
                        }
                        this.refreshOpenedWidgets();
                        this.loadLauncherState();
                    },
                    scope: this,
                    single: true
                }
            });
            //reload main widgetStore
            this.dashboardContainer.widgetStore.load();

            //make sure the icon view is showing
            //this.showIconView();

            //set info panel to default message
            this.updateInfoPanel(null, false, true);

            this.fireEvent('refresh');
        }
        else {
            //launch menu has not been opened, just reload the main widgetstore
            this.dashboardContainer.widgetStore.load();
        }

    },


    enableDraggingOut: function () {

        var srcDragZone, isWidgetGroupAdded = false;

        function move() {
            if (this.isDragging === true) {
                this.close();

                // Ext has a bug where it executes ondrop events 2 times on just one drop
                // This works around the bug by adding the same group to active dashboard
                // after drag starg and removes it on drop...Easier than patching Ext

                if (!srcDragZone.groups['widgets']) {
                    isWidgetGroupAdded = true;
                    srcDragZone.addToGroup('widgets');
                }
                this.dashboardContainer.activeDashboard.enableWidgetDragAndDrop();
            }
        }

        this.on('dragStarted', function (dragZone) {
            srcDragZone = dragZone;

            var widgetModel = srcDragZone.dragData.widgetModel;
            var disableDragLaunching = widgetModel.get('disabled');

            this.isDragging = true;
            if (!disableDragLaunching) {
                //this mousemove listener will only fire if the mouse is over the .x-mask (mask put up for a modal window)
                Ext.getDoc().on('mousemove', move, this, {
                    delegate: '.x-mask'
                });
            }

        }, this);

        this.on('dragEnd', function (dragZone) {

            if (isWidgetGroupAdded) {
                isWidgetGroupAdded = false;
                srcDragZone.removeFromGroup('widgets');
            }

            Ext.getDoc().un('mousemove', move, this, {
                delegate: '.x-mask'
            });

            this.isDragging = false;
            this.dashboardContainer.activeDashboard.disableWidgetDragAndDrop();

        }, this);
    },

    //Changes the widget visibility to false so it will not show in the fav menu
    removeWidget: function(record){
        var widgetsToDelete = [];
        var widgetGuid = record.get('widgetGuid');
        widgetsToDelete.push(widgetGuid);

        var widgetStore = this.widgetStore;
        var me = this;

        Ext.widget('alertwindow', {
            html: me.formatRemoveMessage(record),
            width: 400,
            dashboardContainer: me.dashboardContainer,
            showCancelButton: true,
            okFn: function() {
                Ozone.pref.PrefServer.updateAndDeleteWidgets({
                    widgetsToUpdate:[],
                    widgetGuidsToDelete:widgetsToDelete,
                    updateOrder:false,
                    onSuccess:function(){
                        me.closeWidget(widgetGuid);
                        widgetStore.remove(record);
                        var dashboardContainerRecord = me.dashboardContainer.widgetStore.findRecord("widgetGuid", record.get('widgetGuid'));
                        me.dashboardContainer.widgetStore.remove(dashboardContainerRecord);
                        me.updateInfoPanel(null, false, true);
                    },
                    onFailure:function(){
                    }
                });
            }
        }).show();
    },

    wrapRecordName: function(name) {
        return '<span class="node-name-widget-launcher">' + Ext.htmlEncode(name) + '</span>';
    },

    formatRemoveMessage: function(record) {
        var recordName = record.get('name');
        var htmlMessage = '';

        var dashboards = this.dashboardContainer.widgetStore.findRecord("widgetGuid", record.get('widgetGuid'));

        htmlMessage += '<p>Deleting this widget will remove it from any pages it is a part of.</p><br/> ';
        // htmlMessage += '<p>' + this.wrapRecordName(recordName) + ' is required by ' + record.get('allRequired').length + ' widgets.</p><br/> ';
        htmlMessage += '<p>Are you sure you want to delete ' + this.wrapRecordName(recordName) + '?</p>';

        return htmlMessage;
    },

    // Close the given widget in all the user's dashboards
    closeWidget: function(widgetGuid) {
        var dashboardCardPanel  = Ext.getCmp('dashboardCardPanel');
        if (dashboardCardPanel) {
            // Iterate through all the open dashboards
            dashboardCardPanel.items.each(function(dashboard) {
                // Access state store for each dashboard describing the state of the widgets running inside that dashboard
                dashboard.stateStore.each(function(widgetState) {
                    // Compare widget GUID to that of the one being removed
                    if (widgetState.get('widgetGuid') == widgetGuid) {
                        // Remove the widget in question from its dashboard
                        var widgetUniqueId = widgetState.get('uniqueId');
                        dashboard.closeWidget(widgetUniqueId);
                    }
                });
            });
        }
    },

    // launches the widget
    launchWidget: function (record, evt, eOpts) {
        var dashboardContainer = this.dashboardContainer,
            widgetGuid = record.get('widgetGuid'),
            widgetDefs = dashboardContainer.widgetStore.queryBy(function (record, id) {
                return record.data.widgetGuid == widgetGuid;
            });

        if (widgetDefs && widgetDefs.getCount() > 0) {
            var widgetDef = widgetDefs.get(0);
            if(widgetDef.get('disabled') === true) {
                Ozone.Msg.alert(Ozone.util.ErrorMessageString.errorTitle, Ozone.util.ErrorMessageString.widgetNotApproved,
                    null, null, null, dashboardContainer.modalWindowManager);
            }
            else {
                //Dashboard selection is disabled for launching via intents because
                //widget communication currently must stay on the same dashboard
                if(this.disableDashboardSelection) {
                    record.data.alreadyOpenedWidget ?
                        dashboardContainer.activeDashboard.handleAlreadyLaunchedWidget(record.data) :
                        dashboardContainer.launchWidgets(widgetDef, true);
                    //Revert to default behavior
                    this.disableDashboardSelection = false;
                }
                else {
                    dashboardContainer.selectDashboardAndLaunchWidgets(widgetDef, true);
                }
            }
        }

        this.close();
    },

    //launch widget via dblclick
    itemDblClick: function (view, record, item, index, event) {
        this.launchWidget(record, event);
    },

    /**
     * updates the info panel
     * @param record
     * @param showRemoveFavorites
     * @param disableStartButton
     * @param showIntentCheckBox
     * @param intentCheckBoxValue
     */
    updateInfoPanel: function (record, showRemoveFavorites, disableStartButton, showIntentCheckBox, intentCheckBoxValue) {
        var me = this;
        var infoPanel = me.down("#infoPanel");
        var startRemovePanel = me.down('#startRemovePanel');
        var startBtn = startRemovePanel.getComponent('start');
        var removeBtn = startRemovePanel.getComponent('remove');
//        var htmlPanel = infoPanel.down('#htmlPanel');
        var intentCheckBox = infoPanel.down('#intentCheckBox');

        var startBtnHandler = function (button, evt) {
            me.launchWidget(record, evt);
        };

        var removeBtnHandler = function (button, evt) {
            me.removeWidget(record);
        };

        //remove startBtn so it can be updated
        if (startBtn) {
            startRemovePanel.remove(startBtn);
        }

        if (removeBtn) {
            startRemovePanel.remove(removeBtn);
        }

        if (record == null) {
            record = Ext.create('Ozone.data.WidgetDefinition', {
                name: 'Please select a widget below',
                description: 'Double click a widget to start'
            });
        }

        var widgetDisabled = record.get('disabled');
        if (widgetDisabled || !record) {
            startRemovePanel.addCls('widget-disabled');
        }
        else {
            startRemovePanel.removeCls('widget-disabled');
        }

//        var desc = record.get('description') != null ? record.get('description') : '';
//        //todo remove this hardcoded style
//        var html = "<h1 class=\"launchMenuTitle\">" + Ext.htmlEncode(record.get('name')) + "</h1>" +
//                "<p>" + Ext.htmlEncode(desc) + "</p>";

//        htmlPanel.el.update(html);

        if (this.showIntentCheckBox) {
            intentCheckBox.show();
        }
        else {
            intentCheckBox.hide();
        }
        if (intentCheckBoxValue !== undefined) {
            intentCheckBox.setValue(intentCheckBoxValue);
        }

       var startButton = Ext.apply({}, me.startBtnCfg);
       var removeButton = Ext.apply({}, me.removeBtnCfg);
       if (disableStartButton) {
           startButton.disabled = true;
           removeButton.disabled = true;
       }

       startButton = startRemovePanel.add(Ext.applyIf({
           handler: startBtnHandler
       }, startButton));

       removeButton = startRemovePanel.add(Ext.applyIf({
           handler: removeBtnHandler
       }, removeButton));

       this.setupCircularFocus();

       //in IE7, Ext seems to be manually setting the button widths to
       //the smallest reasonable size for some reason.  We want the widths to
       //be handled in css however, so we clear the explicit width
       startButton.getEl().setWidth('');
       removeButton.getEl().setWidth('');
    },

    // populates the info panel with the widget's icon and description
    itemClick: function (view, record, item, index, event, eOpts) {
        this.updateInfoPanel(record, (eOpts && eOpts.favorite) || this.favStore.findRecord("widgetGuid", record.get('widgetGuid')));
    },
    //opens a widget via enter key
    itemKeyDown: function (view, record, item, index, event, eOpts) {
        if (event.getKey() === Ext.EventObject.ENTER) {
            event.preventDefault();
            this.launchWidget(record, event);
        }
    },

    // decodes the given json into the view store and the favorites store guid arrays
    loadFavStore: function (json) {
        var me = this, favStore = me.favStore, favStoreIds = [];

        //decode json
        json = Ext.JSON.decode(json);
        favStoreIds = json.favStore || [];

        //clear favstore
        favStore.removeAll();

        //load favorites into the favStore
        for (var i = 0; i < favStoreIds.length; i++) {
            var widgetGuid = favStoreIds[i];
            var record = me.dashboardContainer.widgetStore.findRecord("widgetGuid", widgetGuid);
            //only add if they exist in the main widgetStore and are visible and aren't already in the favStore
            if(record && record.get('visible') && !favStore.findRecord("widgetGuid", widgetGuid)){
                favStore.add(record);
            }
        }
        //make sure the favStore is filtered
        if (favStore.isFiltered()) {
          favStore.filter(me.favStore.filters.items);
        }

        me.favStoreLoaded = true;
    },

    // returns an array of the guids for all the widgets in the given store
    getGuidList: function (store) {
        var datar = [];

        var records = store.getRange();
        for (var i = 0; i < records.length; i++) {
            datar.push(records[i].data.widgetGuid);
        }
        return datar;
    },
    saveLauncherStateSync: function () {
        this.saveLauncherState(true);
    },
    saveLauncherState: function (sync) {
        var me = this;

        if (me.favStoreLoaded) {
            var favStoreIds = me.getGuidList(me.favStoreUnFiltered);

            var value = {
                favStore: favStoreIds
            };

            Ozone.pref.PrefServer.setUserPreference({
                namespace: "owf",
                name: "widget_launcher",
                async: !sync,
                value: Ozone.util.toString(value),
                onSuccess: function (result) {
                },
                onFailure: function () {
                }
            });
        }

        //only save widget order if the widgetstore is not filtered
        if (!this.widgetStore.widgetFiltered) {
            var widgets = [];
            var records = me.widgetStore.getRange();
            for (var i = 0; i < records.length; i++) {
                var widget = {
                    guid: records[i].data.widgetGuid
                };

                //check to see if the name was customized if so submit it to be saved
                if (records[i].data.name !== records[i].data.originalName) {
                    widget.name = records[i].data.name;
                }
                widgets.push(widget);
            }
            Ozone.pref.PrefServer.updateAndDeleteWidgets({
                widgetsToUpdate: widgets,
                widgetGuidsToDelete: [],
                updateOrder: true,
                async: !sync,
                onSuccess: function (result) {
                },
                onFailure: function () {
                }
            });
        }
    },

    loadLauncherState: function () {
        var me = this;
        Ozone.pref.PrefServer.getUserPreference({
            namespace: "owf",
            name: "widget_launcher",
            onSuccess: function (result) {
                //if there was a preference found then load it in
                if (result.value) {
                    me.loadFavStore(result.value);
                }
                else {
                    //no fav preference found mark favstore as loaded
                    me.favStoreLoaded = true;
                }
            },
            onFailure: function (error, status) {
                //no fav preference found mark favstore as loaded
                me.favStoreLoaded = true;
            }
        });
    },

    clearSelections: function (suppressEvent) {
        if (this.view) {
            this.view.deselectAll(suppressEvent);
        }
        if (this.searchPanel) {
            this.searchPanel.clearAllFilters(suppressEvent);
        }
        if (this.carousel) {
            this.carousel.clearSelection(suppressEvent);
        }

        var searchbox = this.down('#searchbox');
        if (searchbox) {
            searchbox.reset();
        }
        var intentCheckbox = this.down('#intentCheckbox');
        if (intentCheckbox) {
            intentCheckbox.reset();
        }

        this.updateInfoPanel(null, false, true);
    },

    createSidePanel: function () {
        this.searchPanel = Ext.widget('advancedsearchpanel', {
            itemId: 'search-panel',
            width: document.body.clientWidth * 0.15,
            height: document.body.clientHeight * 0.65,
            renderTo: this.el,
            dashboardContainer: this.dashboardContainer,
            widgetStore: this.widgetStore,
            hidden: true,
            listeners: {
                beforeshow: {
                    fn: function (cmp) {
                        //adjust the size of the launch menu based on the size of the browser
                        cmp.setSize(document.body.clientWidth * 0.15, document.body.clientHeight * 0.65);
                    },
                    scope: this
                }
            }
        });
        this.searchPanel.show();
        this.searchPanel.hide();
    },

    openOrCloseAdvancedSearch: function (open, disableRefresh) {
    },

    onEsc: function (k, e) {
        this.callParent(arguments);
        this.fireEvent('noWidgetLaunched');
    },

    showOpenedWidgetsView: function (showHide) {
        this.view.showOpenedWidgetsView(showHide);
    },

    showIconView: function (b) {
        var view = this.down('#view');
        view.showIconOrGridView(true);

        b = b || this.down('#iconViewBtn');

        b.setIconCls('iconViewBtnIcon-down');
        this.down("#gridViewBtn").setIconCls('gridViewBtnIcon-up');
    },

    showGridView: function (b) {
        var view = this.down('#view');
        view.showIconOrGridView(false);

        b = b || this.down('#gridViewBtn');
        b.setIconCls('gridViewBtnIcon-down');
        this.down("#iconViewBtn").setIconCls('iconViewBtnIcon-up');

    },

    getIntentCheckBoxValue: function () {
        var intentCheckBox = this.down('#intentCheckBox');
        return intentCheckBox.getValue();
    },

    disableWidgetStoreLoading: function (flag) {
        this.dontLoadWidgetStore = flag;
        if (this.searchPanel != null) {
            this.searchPanel.dontLoadWidgetStore = flag;
        }

    },

    setupCircularFocus: function () {
        var firstCmp = this.header.getComponent('viewSwitch').getComponent('gridViewBtn');
        var lastCmp = this.getComponent('startRemovePanel').getComponent('remove');
        this.tearDownCircularFocus();
        this.setupFocus(firstCmp.getFocusEl(), lastCmp.getFocusEl());
    },

    onClose: function () {
        this.saveLauncherState();

        //clear all stores
        this.widgetStore.removeAll();
        this.openedWidgetStore.removeAll();
        this.favStore.removeAll();

        //remove window unload handler
        Ext.EventManager.un(window, 'beforeunload', this.saveLauncherStateSync, this);
    }
});
