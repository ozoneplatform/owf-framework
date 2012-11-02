Ext.define('Ozone.components.launchMenu.LaunchMenu', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.launchMenu',

    closeAction: 'hide',
    modal: true,
    modalAutoClose: true,
    shadow: false,
    ui: 'widget-launcher',
    dashboardContainer: null,
    closable: true,
    preventHeader: true,
    iconCls: 'widget-launcher-header-icon',
    resizable: false,
    draggable: true,
    mouseDownCounter: 0,

    dontLoadWidgetStore: false,

   launchBtnCfg: {
       xtype: 'button',
       text: 'Launch',
       cls: 'launch-btn',
       itemId: 'launch'
   },

   initComponent: function () {
        var me = this;

        //make a copy of widgetStore to use, this is needed because filtering causes problems when widget states are saved
        this.widgetStore = Ext.create('Ozone.data.WidgetStore');
        //set default filtering
        this.widgetStore.proxy.extraParams = {
            visible: true,
            widgetTypes: ['standard']
        };

       //update names to custom names
       this.widgetStore.on({
           datachanged: {
               fn: function (store, records, successful, operation, eOpts) {
                   for (var i = 0; i < records.length; i++) {
                       var newTitle = this.dashboardContainer.widgetNames[records[i].data.widgetGuid];
                       if (newTitle) {
                           records[i].data.name = newTitle;
                       }
                   }
               },
               scope: this
           }
       });

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
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'left',
                    itemId: 'advSearchBtnToolbar',
                    cls: 'advSearchBtnToolbar',
                    layout: {
                        type: 'vbox',
                        align: 'stretchmax',
                        pack: 'center',
                        clearInnerCtOnLayout: true

                    },
                    listeners: {
                        afterlayout: {
                            fn: function(cmp) {
                                //ext toolbars auto subscribe to the FocusManager in afterrender
                                //we need to unsubscribe after that
                                Ext.FocusManager.unsubscribe(cmp);
                            },
                            scope: this
                        }
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'advSearchBtn',
                            cls: 'advSearchBtn',
                            iconCls: 'advSearchBtnIcon',
                            enableToggle: true,
                            toggleHandler: function (b, state) {
                                //toggle the searchpanel
                                this.openOrCloseAdvancedSearch(state);

                                //focus the text box if this button was pressed or clicked
                                if (state) {
                                    var searchbox = this.searchPanel.down('#searchbox');
                                    var searchBoxDom = searchbox.getFocusEl().dom;

//                                    this.tearDownCircularFocus();
//
                                    searchBoxDom.focus();
//
//                                    this.setupCircularFocus();
                                }
                            },
                            scope: this
                        }
                    ]
                }
            ],
            items: [
                //infopanel
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox',
                        align: 'stretchmax'
                    },
                    itemId: "infoPanel",
                    cls: "info-panel",
                    region: 'north',
                    padding: '10',
                    items: [
                        {
                            xtype: 'panel',
                            itemId: 'imagePanel',
                            cls: 'image-panel',
                            items: [
                                {
                                    xtype: 'image',
                                    cls: 'widget-icon',
                                    region: 'west',
                                    itemId: 'widgetImg',
                                    src: Ext.BLANK_IMAGE_URL,
                                    listeners: {
                                        afterrender: function (cmp) {
                                            cmp.el.on({
                                                error: function (evt, ele, opts) {
                                                    ele.src = 'themes/common/images/settings/WidgetsIcon.png';
                                                }
                                            });
                                        }
                                    }
                                },
                               me.launchBtnCfg
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            flex: 1,
                            cls: 'infoCenter',
                            itemId: 'infoCenter',
                            items: [
                                {
                                    xtype: 'component',
                                    itemId: 'htmlPanel',
                                    cls: 'htmlPanel',
                                    flex: 1
                                },
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
                            xtype: 'panel',
                            itemId: 'toolbar-panel',
                            cls: 'toolbar-panel',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'toolbar',
                                    cls: 'viewSwitch',
                                    flex: 1,
                                    layout: 'auto', //Ext hbox puts a 2 pixel gap between things
                                    //that we don't want, so its easier if we
                                    //just lay it out in css
                                    //items are floated right, so they need to
                                    //be in reverse order
                                    items: [
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
                                        },
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
                                        }
                                    ]
                                },
                                {
                                    xtype: 'slider',
                                    itemId: 'iconSlider',
                                    cls: 'iconSlider',
                                    value: 64,
                                    flex: 1,
                                    increment: 1,
                                    minValue: 24,
                                    maxValue: 128,
                                    plugins: [
                                        new Ozone.components.focusable.Focusable()
                                    ],
                                    //todo extend this slider class and override there
                                    onKeyDown : function(e) {
                                        var me = this,
                                            k,
                                            val;

                                        if(me.disabled || me.thumbs.length !== 1) {
                                            e.preventDefault();
                                            return;
                                        }
                                        k = e.getKey();

                                        switch(k) {
                                            case e.UP:
                                            case e.RIGHT:
                                                e.stopEvent();
                                                val = e.ctrlKey ? me.maxValue : me.getValue(0) + me.keyIncrement;
                                                me.setValue(0, val, undefined, true);
                                            break;
                                            case e.DOWN:
                                            case e.LEFT:
                                                e.stopEvent();
                                                val = e.ctrlKey ? me.minValue : me.getValue(0) - me.keyIncrement;
                                                me.setValue(0, val, undefined, true);
                                            break;
                                            default:
                                                 //todo - override this in it's own class, preventDefault stops tab presses
                                                //e.preventDefault();
                                                break;
                                        }
                                    },
                                    listeners: {
                                        change: function (cmp, value, thumb, eOpts) {
                                            var sizeObj = {
                                                '.thumb-wrap': {
                                                    width: value,
                                                    height: value
                                                },

                                                //hack for IE7, where the surrounding
                                                //nodes need a width or they end up with
                                                //width = 100%
                                                '.': Ext.isIE7 ? {
                                                    width: value
                                                } : null
                                            };

                                            me.view.setItemSize(sizeObj);

                                        },
                                        scope: this
                                    }
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
                                            emptyText: "Search title",
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
                            ]
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
                    xtype: 'carousel',
                    region: 'south',
                    id: 'launchMenu-carousel',
                    itemId: 'carousel',
                    height: 96,
                    store: me.favStore,
                    plugins: {
                        ptype: 'instancevariablizer',
                        container: me
                    }
                }
            ]
        });

        this.callParent();

        this.addEvents('noWidgetLaunched', 'refresh');

//        me.view.on({
//                    render: {
//                        fn: function (view, eopts) {
//                            var keyMap = new Ext.util.KeyMap(this.el, {
//                                key: [Ext.EventObject.TAB],
//                                fn: function (key, evt) {
//                                    //evt.preventDefault(); //stop keypress from firing since the handler might
//
//                                    //change the focus
//                                    me.carousel.down('#leftBtn').el.focus(100);
//                                },
//                                scope: this
//                            });
//                        },
//                        scope: this
//                    }
//                });

        me.carousel.on('render', function (cmp) {
            var v = cmp.down('#carouselView');

            //create a dropzone for the carousel view that allows widgts to be saved as favs
            var dropZone = new Ext.dd.DropZone(cmp.getEl(), {
                ddGroup: 'widgets',
//                containerScroll: true,

                getTargetFromEvent: function(e) {
                    return e.getTarget(v.itemSelector);
                },

                // On entry into a target node
                onNodeEnter : function(target, dd, e, data) {
                },

                // On exit from a target node
                onNodeOut : function(target, dd, e, data) {
                    Ext.fly(target).removeCls(['drag-cls', 'x-view-drop-indicator-right', 'x-view-drop-indicator-left']);
                    /*index = v.indexOf(target);
                     record = v.store.getAt(index);

                     v.store.remove(data.data);
                     v.store.insert(data.origIdx, data.data);
                     v.refresh();*/

                },

                onNodeOver : function(target, dd, e, data) {
                    var pt = v.getDropPoint(e, target, dd);
                    if (pt == 'before') {
                        Ext.fly(target).replaceCls('x-view-drop-indicator-right', 'x-view-drop-indicator-left');
                    }
                    else {
                        Ext.fly(target).replaceCls('x-view-drop-indicator-left', 'x-view-drop-indicator-right');
                    }
                    return Ext.dd.DropZone.prototype.dropAllowed;
                },

                onNodeDrop : function(target, dd, e, data) {
                    //figure out which side of the target widget the new widget is to be added at
                    var pt = v.getDropPoint(e, target, dd);

                    //check if the origin view is the same as the target view
                    if (v == data.view) {
                        //if so remove the widget being dragged
                        data.sourceStore.remove(data.widgetModel);
                    }

                    //check if the widget being dragged is in the dest view's store
                    var existingWidgetIndex = v.store.findExact('widgetGuid',data.widgetModel.get('widgetGuid'));
                    if (existingWidgetIndex > -1) {
                        //remove it if found
                        v.store.removeAt(existingWidgetIndex);
                    }

                    //now determine where to insert the new widget based on the target of the drag
                    var targetIndex = v.indexOf(target);
                    var record = v.store.getAt(targetIndex);


//                    data.lastIdx = index;

                    //if the drop point is after the target widget(the widget being hovered over) then increment the index
                    //so the dropped widget appears after the target widget
                    if (pt == 'after') {
                        targetIndex++;
                    }
                    v.store.insert(targetIndex, [data.widgetModel]);
                    //v.refresh();

                    data.view.fireEvent('drag', v, record, target, targetIndex, e);
                    return true;
                },

                onContainerOver: function (source, e, data) {
                    return Ext.dd.DropZone.prototype.dropAllowed;

                },
                onContainerDrop: function (source, e, data) {
                    me.carousel.addWidget(data.widgetModel);
//                    me.saveLauncherState();
                }
            });

            //attach itemkeydown listener to remove favs
            v.on({
                itemkeydown: {
                    fn: function (view, record, item, index, evt, eOpts) {
                        if (evt.getKey() == evt.D
                                || evt.getKey() == evt.DELETE
                                ) {
                            view.store.remove(record);

                            //set focus to appropriate item after delete
                            if (view.store.getCount() > 0) {
                                view.selModel.select(0);
                            }
                            else {
                                me.el.focus();
                            }
                        }
                    },
                    scope: this
                }
            });
        });

        this.on({
            render: {
                fn: function(cmp){
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
//            itemclick: {
//                fn: this.itemClick,
//                scope: this
//            },
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

                            //close adv search
                            this.openOrCloseAdvancedSearch(false,true);
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

    // launches the widget
    launchWidget: function (record, evt, eOpts) {

        var scope = this.dashboardContainer;

        var widgetGuid = record.get('widgetGuid');
        var ok2Add = true;
        var widgetDefs = scope.widgetStore.queryBy(function (record, id) {
            return record.data.widgetGuid == widgetGuid;
        });
        if (widgetDefs && widgetDefs.getCount() > 0) {
            var widgetDef = widgetDefs.get(0);
            if (widgetDef.get('disabled') !== true) {
                if (widgetDef.get('singleton')) {
                    var widget = scope.storeContains(widgetGuid);
                    if (widget) {
                        scope.activeDashboard.handleAlreadyLaunchedWidget(widget.data);
                        ok2Add = false;
                    }
                }
                //an already opened widget instance is being opened again
                else if (record.data.alreadyOpenedWidget) {
                    scope.activeDashboard.handleAlreadyLaunchedWidget(record.data);
                    ok2Add = false;
                }
            }
            else {
                Ozone.Msg.alert(Ozone.util.ErrorMessageString.errorTitle, Ozone.util.ErrorMessageString.widgetNotApproved,
                    null, null, null, scope.modalWindowManager);
                ok2Add = false;
            }


            if (ok2Add) {
            	if (scope.activeDashboard.configRecord.get('locked')) {
                    var instanceId = widgetDef.get('uniqueId') || guid.util.guid();
            		scope.activeDashboard.panes[0].launchFloatingWidget(widgetDef, null, null, instanceId);
            	} else {
                    // required to prevent from bubbling down
                    evt.stopEvent();
                    var newWidget = scope.launchWidgets(widgetDef,
                            evt && evt.getKey() === Ext.EventObject.ENTER);
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
     * @param clearSelection
     */
    updateInfoPanel: function (record, showRemoveFavorites, disableLaunchButton, showIntentCheckBox, intentCheckBoxValue) {
        var me = this,
            infoPanel = me.down("#infoPanel"),
            infoCenter = infoPanel.getComponent('infoCenter'),
            imagePanel = infoPanel.getComponent('imagePanel'),
            launchBtn = imagePanel.getComponent('launch'),
            htmlPanel = infoPanel.down('#htmlPanel'),
            intentCheckBox = infoPanel.down('#intentCheckBox'),
            image = imagePanel.getComponent('widgetImg'),
           launchBtnHandler = function (button, evt) {
               me.launchWidget(record, evt);
           };

        //remove launchBtn so it can be updated
       if (launchBtn) {
           imagePanel.remove(launchBtn);
       }

        if (record == null) {
            record = Ext.create('Ozone.data.WidgetDefinition', {
                name: 'Please select a widget below',
                description: 'Double click a widget to launch'
            });
        }

        var widgetDisabled = record.get('disabled');
//        var tags = record.get('tags');
//        if (tags != null && tags.length > 0) {
//          for (var i = 0; i < tags.length; i++) {
//              if (tags[i].editable === false) {
//                  widgetDisabled = true;
//                  break;
//              }
//          }
//        }
        if (widgetDisabled) {
            imagePanel.addCls('widget-disabled');
            infoCenter.addCls('widget-disabled');
        }
        else {
            imagePanel.removeCls('widget-disabled');
            infoCenter.removeCls('widget-disabled');
        }

        var desc = record.get('description') != null ? record.get('description') : '';
        //todo remove this hardcoded style
        var html = "<h1 class=\"launchMenuTitle\">" + Ext.htmlEncode(record.get('name')) + "</h1>" +
                "<p>" + Ext.htmlEncode(desc) + "</p>";
        image.setSrc(record.get('image') ? record.get('image') : 'images/launch-menu/launch-infoPanel-default.png');

        htmlPanel.el.update(html);

        if (this.showIntentCheckBox) {
            intentCheckBox.show();
        }
        else {
            intentCheckBox.hide();
        }
        if (intentCheckBoxValue !== undefined) {
            intentCheckBox.setValue(intentCheckBoxValue);
        }

       var launchButton = Ext.apply({}, me.launchBtnCfg);
       if (disableLaunchButton) {
           launchButton.disabled = true;
       }

       imagePanel.add(Ext.applyIf({
           handler: launchBtnHandler
       }, launchButton));
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
                },
                show: {
                    fn: function (cmp) {
                        cmp.alignTo(this, 'tr-tl', [0, 10]);
                    },
                    scope: this
                }
            }
        });
        this.searchPanel.show();
        this.searchPanel.alignTo(this, 'tr-tl', [0, 10]);

        //this.setActive(true);
    },

    openOrCloseAdvancedSearch: function (open, disableRefresh) {
        var me = this;

        if (!me.searchPanel) {
            me.createSidePanel();
        }
        else {
            if (open) {
                me.searchPanel.show();
                this.searchPanel.alignTo(this, 'tr-tl', [0, 10]);
            }
            else {
                me.searchPanel.hide();
            }
        }

        var button = this.down('#advSearchBtn');
        button.toggle(open, true);

        var searchbox = this.down('#searchbox');

        if (open) {
            //todo remove this in favor of using the pressedCls
            button.removeCls("advSearchBtn");
            button.addCls("advSearchBtn-clicked");

            //if the user has searched, clear the box reload the store
            if (searchbox.getValue() != '') {
                searchbox.reset();

                //this will cause the widgetStore to reload and clear any search
                if (!disableRefresh) {
                  searchbox.onClear();
                }
            }
            searchbox.disable();
        }
        else {
            //todo remove this in favor of using the pressedCls
            button.removeCls("advSearchBtn-clicked");
            button.addCls("advSearchBtn");

            searchbox.enable();

            //clear adv search and reset the data
            me.searchPanel.clearAllFilters();
            if (!disableRefresh) {
              me.searchPanel.search();
            }
        }

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

        var slider = this.down("#iconSlider");
        slider.show();

        b = b || this.down('#iconViewBtn');

        b.setIconCls('iconViewBtnIcon-down');
        this.down("#gridViewBtn").setIconCls('gridViewBtnIcon-up');
    },

    showGridView: function (b) {
        var view = this.down('#view');
        view.showIconOrGridView(false);

        var slider = this.down("#iconSlider");
        slider.hide();

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
        var advSearchBtn = this.down('#advSearchBtn');
        var focusCatchEl = Ext.DomHelper.append(this.el, '<div class="focus-catch" tabindex="0"></div>'
                , true);
        this.setupFocus(advSearchBtn.getFocusEl(), focusCatchEl);
    },

    onClose: function () {
        //close adv search
        this.openOrCloseAdvancedSearch(false,true);

        this.saveLauncherState();

        //clear all stores
        this.widgetStore.removeAll();
        this.openedWidgetStore.removeAll();
        this.favStore.removeAll();

        this.carousel.cleanUpScrollerTasks();

        //remove window unload handler
        Ext.EventManager.un(window, 'beforeunload', this.saveLauncherStateSync, this);
    }
});
