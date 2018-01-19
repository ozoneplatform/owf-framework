Ext.define('Ozone.components.dashboard.Dashboard', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboard', 'widget.Ozone.components.dashboard.Dashboard'],

    activeWidget: null,

    plugins: [
        new Ozone.plugins.Dashboard()
    ],

    dashboardContainer: null,
    eventingContainer: null,
    widgetLauncher: null,
    addWidgetContainer: null,
    widgetStateHandler: null,
    windowGroup: null,
    widgetStateContainer: null,
    type: null,
    configRecord: null,
    config: {
        "name": "Default Page",
        "alteredByAdmin": "false",
        "user": null,
        "isdefault": false,
        "locked": false,
        "guid": null,
        //todo remove this in favor of using the actual store
        "state": null
    },
    hideMode: 'visibility',
    hideCls: 'hidden', //css class applied to nonanimated, hidden dashboards
    cls: 'dashboard',

    // flag to determine whether or not a save is already in progress
    saveLock: false,

    // flag to determine whether changes have been made since last save
    hasChanged: false,

    dontSave: false,

    /**
     * datastore for config.state data
     */
    stateStore: null,
    widgetStore: null,

    widgetIframeDelay: 200,

    //    defaultSettings: {},

    // array of panes
    panes: null,
    layout: 'fit',
    widgetCls: 'widgetwindow',

    cssanimations: Modernizr.cssanimations,
    animationCls: 'animate ',
    inactiveCls: 'inactive ',
    slideInDirection: 'left',
    slideOutDirection: 'left',

    buildItemsArray: function(cfg) {
        if (!cfg || !cfg.items)
            return;

        if (cfg.items.length === 0) {
            //TODO choose default by checking what layout types are available
            if (!cfg.paneType) {
                cfg.paneType = 'tabbedpane';
            }

            cfg.xtype = cfg.paneType;
        } else {

            if (cfg.xtype === "dashboarddesignerpane") {
                cfg.xtype = 'container';
                cfg.layout = "fit";
            }

            for (var i = 0, len = cfg.items.length; i < len; i++) {
                this.buildItemsArray(cfg.items[i]);
            }

        }

        return cfg;
    },

    getMenuDropdown: function() {
        return Ext.getCmp('userMenuBtn');
    },

    initComponent: function() {
        var me = this;

        // TODO remove after support for old dashboard is added
        if (!me.configRecord.get('layoutConfig')) {
            me.configRecord.set('layoutConfig', {
                cls: null,
                height: "100%",
                items: [],
                paneType: null,
                xtype: "desktoppane"
            });
        }

        me.items = me.buildItemsArray(me.configRecord.get('layoutConfig')) || [];

        if (!this.stateStore) {
            this.stateStore = Ext.create('Ozone.data.StateStore', {
                storeId: this.guid,
                data: []
            });
        }
        else if (!this.stateStore.storeId) {
            this.stateStore.storeId = this.guid;
            Ext.data.StoreManager.register(this.stateStore);
        }

        this.callParent(arguments);

        this.addEvents(
            'beforeserversave',
            'serversave',
            'widgetStartDrag',
            'widgetStopDrag',
            OWF.Events.Dashboard.SHOWN,
            OWF.Events.Dashboard.HIDDEN,
            OWF.Events.Widget.BEFORE_LAUNCH,
            OWF.Events.Widget.AFTER_LAUNCH);

        this.enableBubble([OWF.Events.Widget.BEFORE_LAUNCH, OWF.Events.Widget.AFTER_LAUNCH]);

        this.on('activate', this.onActivate, this);
        this.on('deactivate', this.onDeActivate, this);

        this.stateStore.on({
            add: {
                fn: function() {
                    if (this.rendered) {
                        this.hasChanged = true;
                    }
                },
                scope: this
            },
            update: {
                fn: function() {
                    if (this.rendered) {
                        this.hasChanged = true;
                    }
                },
                scope: this
            },
            remove: {
                fn: function() {
                    if (this.rendered) {
                        this.hasChanged = true;
                    }
                },
                scope: this
            },
            clear: {
                fn: function() {
                    if (this.rendered) {
                        this.hasChanged = true;
                    }
                },
                scope: this
            }
        });

        me.on(OWF.Events.Widget.BEFORE_LAUNCH, me.onBeforeWidgetLaunch, me);
        me.on('afterlayout', me.afterDashboardLayout, me, {
            single: true
        });
        me.on('beforedestroy', me.cleanup, me);

        if (me.configRecord.isMarketplaceDashboard()) {
            //catch bubbling destroy events from widgets
            me.on('remove', function(cont, cmp) {
                if (cmp.isXType('widgetpanel') || cmp.isXType('widgetwindow')) {
                    me.handleMarketplaceWidgetClose();
                }
            });
        }
    },

    afterDashboardLayout: function() {
        var me = this,
            pane,
            allWidgetsDeferreds = [];

        this.panes = this.query('pane');

        // launch previously opened widgets
        for (var i = 0, len = this.panes.length; i < len; i++) {
            pane = this.panes[i];
            pane.widgetStateContainer = this.widgetStateContainer;

            //todo why not a concat here?
            allWidgetsDeferreds.push.apply(allWidgetsDeferreds, pane.launchPreviouslyOpenedWidgets());
        }

        $.when(allWidgetsDeferreds).then(function() {
            me.fireEvent(OWF.Events.Dashboard.COMPLETE_RENDER, me);
            if (OWF.Mask) {
                OWF.Mask.hide();
                OWF.Mask = null;
            }

            //      loop through dashboard stateStore and validate intentConfig
            //      check intentConfig and remove any widgets that don't exist
            var items = me.stateStore.data.items;

            for (var i = 0, len = items.length; i < len; i++) {
                var rec = items[i];
                var intentConfig = rec.get('intentConfig');
                for (var intent in intentConfig) {
                    var destIds = intentConfig[intent];
                    var newDestIds = [];
                    for (var j = 0; j < destIds.length; j++) {
                        var id = Ozone.util.parseJson(destIds[j]).id;
                        if (me.stateStore.findExact('uniqueId', id) > -1) {
                            newDestIds.push(destIds[j]);
                        }
                    }
                    if (newDestIds.length > 0) {
                        intentConfig[intent] = newDestIds;
                    } else {
                        delete intentConfig[intent];
                    }
                }
            }

            //console.timeEnd('page');
            console.timeEnd('initload');
        });
    },

    enableWidgetDragAndDrop: function() {
        var me = this;

        me.dropZone = me.dropZone || new Ext.dd.DropZone(me.getEl(), {

            ddGroup: 'widgets',

            getTargetFromEvent: function(e) {
                return e.getTarget('.shim');
            },

            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver: function(target, dd, e, data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            onNodeDrop: function(target, dd, evt, data) {
                if (me.configRecord.isMarketplaceDashboard()) {
                    me.dashboardContainer.selectDashboardAndLaunchWidgets(evt, data.widgetModel, true);
                } else {
                    me.launchWidgets(target, dd, evt, data);
                }
            }
        });

        me.enableWidgetMove();
    },

    disableWidgetDragAndDrop: function() {
        this.disableWidgetMove();
        this.cleanup();
    },

    cleanup: function() {
        // if dashboard isn't rendered, dropZone won't be setup
        if (this.dropZone) {
            this.dropZone.unreg();
            delete this.dropZone;
        }
    },

    launchWidgets: function(target, dd, coordinates, data) {
        var targetPaneId = target.id,
            targetPaneEl, offsets,
            targetPane = Ext.getCmp(targetPaneId),
            x, y;

        if (coordinates) {
            x = coordinates['x'] ? coordinates['x'] : coordinates.getX();
            y = coordinates['y'] ? coordinates['y'] : coordinates.getY();
        }

        if (!targetPane || !targetPane.isXType('pane')) {
            targetPaneEl = Ext.get(target).up('.pane');
            if (targetPaneEl) {
                targetPane = Ext.getCmp(targetPaneEl.id);
            }
        }

        if (targetPane && targetPane.isXType('pane')) {
            targetPane = Ext.getCmp(targetPane.id);

            if (coordinates) {
                offsets = targetPane.el.getOffsetsTo(Ext.getBody());
                targetPane.launchWidgets(data.widgetModel, x - offsets[0], y - offsets[1], 0);
            } else {
                targetPane.launchWidgets(data.widgetModel);
            }
            return true;
        }

        return false;
    },

    onBeforeWidgetLaunch: function(pane, widgetModel, launchData) {
        var stateStore = this.stateStore,
            instanceId = widgetModel.get('uniqueId') || guid.util.guid(),
            isSingleton = widgetModel.get('singleton'),
            isBackground = widgetModel.get('background'),
            stateModel = stateStore.findRecord('widgetGuid', widgetModel.get('widgetGuid')),
            isAlreadyLaunched = !! stateModel,
            widget;

        if (isSingleton && isAlreadyLaunched) {
            pane.activateWidget(Ext.getCmp(stateModel.get('uniqueId')));
            return false;
        }

        if (isBackground) {
            widget = this.add({
                id: instanceId,
                xtype: 'backgroundwidget',
                isWidget: true,
                pane: pane,
                iframeProperties: OWF.Container.Eventing.getIframeProperties(
                    widgetModel.get('url'), instanceId, widgetModel.data, pane.type, launchData, this.configRecord.get('locked'))
            });

            var widgetState = {
                'uniqueId': instanceId,
                'dashboardGuid': this.id,
                'paneGuid': pane.id,
                'widgetGuid': widgetModel.get('widgetGuid'),
                'statePosition': ++pane.statePositionCount,
                'name': widgetModel.get('name'),
                'active': false,
                'width': widgetModel.get('width'),
                'height': widgetModel.get('height'),
                'x': 0,
                'y': 0,
                'zIndex': 0,
                'minimized': false,
                'maximized': false,
                'pinned': false,
                'collapsed': false,
                'columnPos': 0,
                'columnOrder': "",
                'buttonId': null,
                'buttonOpened': false,
                'region': "",
                'singleton': widgetModel.get('singleton'),
                'background': widgetModel.get('background'),
                'mobileReady': widgetModel.get('mobileReady')
            };

            // workaround for now
            // only way widgets get added to dashboard store is if 'add' event fires on pane's store
            // which it doesn't for background widgets as they dont go through state changes
            // so remove and add so that same record gets added to both stores
            var recordIndex = pane.stateStore.findExact('uniqueId', instanceId);
            if (recordIndex !== -1) {
                pane.stateStore.removeAt(recordIndex);
            }
            pane.stateStore.add(widgetState);

            pane.fireEvent(OWF.Events.Widget.AFTER_LAUNCH, widget, widgetModel);
            return false;
        }

        if (!pane._launchingPreviouslyOpenedWidgets && !pane._reorderingWidgets && pane.dashboard.configRecord.get('locked')) {
            pane.launchFloatingWidget(widgetModel, null, null, instanceId, launchData);
            return false;
        }

        return true;
    },

    moveWidgetToPane: function(evt, sourcePane, targetPane, widget) {
        var me = this,
            widgetModel = widget.model,
            x = evt.getX(),
            y = evt.getY();

        if (!sourcePane || !targetPane || sourcePane === targetPane || this.configRecord.get("locked"))
            return;

        // use widget defination model instead of using state model
        // so that it gets a new instance id
        widgetModel = this.widgetStore.findRecord('widgetGuid', widgetModel.get('widgetGuid'));

        function doIt() {
            if (targetPane.isXType('fitpane') && targetPane.items.length > 0) {
                targetPane.confirmReplaceWidget(widget.id, widget.title, function() {
                    targetPane.clearWidgets(false);
                    targetPane.items.clear();
                    move();
                });
            } else {
                move();
            }
        }

        function move() {
            var pane = targetPane,
                widgetStateModelData = pane.cloneWidgetDataForTransfer(widget);

            widget.on('destroy', function() {
                me.launchWidgets(pane, null, {
                    x: x,
                    y: y
                }, {
                    widgetModel: widgetStateModelData
                });
            });
            widget.destroy();
        }

        // delay for floating widgets so dragend events could be handled
        widget.isFloating() ? setTimeout(doIt, 500) : doIt();
    },

    onDestroy: function() {
        if (this.stateStore != null) {
            this.stateStore.destroyStore();
            this.stateStore = null;
            this.initialConfig.stateStore = null;
        }
        this.callParent(arguments);
    },

    /**
     * @description Finds a widget from the widgetStore either by guid or universalName
     * @param JSON object specifying the widget guid/universalName
     * @returns widget instance
     */
    findWidget: function(launchConfig) {
        //find the widget with the specified guid
        if (launchConfig.guid != null) {
            return this.widgetStore.getById(launchConfig.guid);
        }
        //find the widget with universalName
        else if (launchConfig.universalName != null) {
            var index = this.widgetStore.findExact('universalName', launchConfig.universalName);
            if (index > -1) {
                return this.widgetStore.getAt(index);
            }
        }
    },

    /**
     * @description Launches a widget instance based on the specified widget guid.
     * @member Ozone.layout.AccordionWindowManager
     * @param JSON object specifying the widget guid and an option launchOnlyIfClosed param.
     * @returns JSON object specifying success/failure, an error message, and the uniqueId of the widget that was launched.
     */
    launchWidgetInstance: function(sender, launchConfig) {
        var launchWidget = null,
            specifiedWidget = null,
            responseObj,
            currentPane = Ext.getCmp(sender.id).pane,
            targetPane = currentPane,
            targetPaneId = launchConfig.pane;

        if(targetPaneId && this.panes.length > 1) {
            if(targetPaneId === 'sibling') {
                var siblingPane = targetPane.next() ? targetPane.next().next() : targetPane.prev().prev();

                targetPane = siblingPane.xtype === 'container' ? siblingPane.items.items[0] : siblingPane;
            }
            else {
                targetPane = _.findWhere(this.panes, {
                    id: targetPaneId
                });
            }
        }

        // if target is not found, use current pane.
        if(!targetPane) {
            targetPane = currentPane;
            targetPaneId = targetPane.id;
            console.warn('Pane with id ' + targetPaneId + ' is not found, launching widget in the same pane.');
        }

        specifiedWidget = this.findWidget(launchConfig);

        // If the specified widget wasn't found return failure and error message
        if (specifiedWidget == null) {
            // Return failure and error message
            responseObj = {
                error: true,
                newWidgetLaunched: false,
                message: "The specified widget wasn't found."
            }
        } else {

            //make a copy so we don't alter the widgetdef if we change the title
            specifiedWidget = specifiedWidget.copy();

            //check if we need to change the widget's name
            if (launchConfig.title != null) {
                //regex was not used simply replace the title
                if (launchConfig.titleRegex == null) {
                    specifiedWidget.data.name = launchConfig.title;
                } else {
                    //check if a regex string by using a regex
                    var matches = launchConfig.titleRegex.match(/^\/(.*)\/(.*)$/);

                    //there are 2 capture groups so if the above regex matches
                    //matches[0] will be the full string
                    //matches[1] will be the titleRegex pattern
                    //matches[2] will be any flags
                    if (matches != null && matches[1] != '') {
                        //use regex string to alter the title
                        specifiedWidget.data.name = specifiedWidget.data.name.replace(
                            new RegExp(matches[1], matches[2]), launchConfig.title);
                    }
                }
            }

            // Determine which pane widget was last opened in
            // only if, target pane isn't specified
            if (!targetPane.isXType('fitpane') && !targetPaneId) {
                if (this.panes && this.panes.length > 1) {
                    var widgetState, latest, latestPane;
                    for (var i = 0, len = this.panes.length; i < len; i++) {
                        var p = this.panes[i];
                        if (!p.isXType('fitpane')) {
                            if (p.defaultSettings && p.defaultSettings.widgetStates) {
                                widgetState = p.defaultSettings.widgetStates[specifiedWidget.data.widgetGuid];
                                if (widgetState && widgetState.timestamp) {
                                    if (!latest || widgetState.timestamp > latest) {
                                        latest = widgetState.timestamp;
                                        latestPane = p;
                                    }
                                }
                            }
                        }
                    }

                    // If a pane is found, launch in that one
                    if (latestPane) {
                        targetPane = latestPane;
                    }
                }
            }

            launchConfig.guid = specifiedWidget.data.widgetGuid;

            if (launchConfig.launchOnlyIfClosed) {
                launchWidget = this.findWidgetInstance(launchConfig.guid);
                if (launchWidget) {
                    if (!specifiedWidget.get('background')) {
                        this.handleAlreadyLaunchedWidget(launchWidget.data);
                    }

                    // Return failure, error message, and the uniqueId of the widget instance
                    responseObj = {
                        error: false,
                        newWidgetLaunched: false,
                        message: "An instance of the specified widget already exists.",
                        uniqueId: launchWidget.get('uniqueId')
                    };
                }
            }

            if (launchWidget == null) {
                var uniqueId = guid.util.guid();
                if (targetPane.fireEvent(OWF.Events.Widget.BEFORE_LAUNCH, targetPane, specifiedWidget, launchConfig.data) !== false) {
                    targetPane.launchWidget(specifiedWidget, null, null, uniqueId, launchConfig.data, true);
                }

                // Return success and the uniqueId of the widget instance
                responseObj = {
                    error: false,
                    newWidgetLaunched: true,
                    uniqueId: uniqueId,
                    pane: targetPaneId
                };
            }
        }

        return responseObj;
    },

    /**
     * @description Handles a request made from a widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param config JSON object containing the function to call and the params required for that function.
     */
    handleWidgetRequest: function(config) {
        switch (config.fn) {
            case 'getWidgetState':
                return this.getWidgetState(config.params.guid);
            case 'getWidgetStateEvents':
                return this.getWidgetStateEvents(config.params.guid);
            case 'addStateEventListeners':
                return this.addWidgetStateEvents('listen', config.params.guid, config.params.events);
            case 'addStateEventOverrides':
                return this.addWidgetStateEvents('override', config.params.guid, config.params.events);
            case 'removeStateEventListeners':
                return this.removeWidgetStateEvents('listen', config.params.guid, config.params.events);
            case 'removeStateEventOverrides':
                return this.removeWidgetStateEvents('override', config.params.guid, config.params.events);
            case 'closeWidget':
                return this.closeWidget(config.params.guid);
            case 'activateWidget':
                return this.activateWidget(config.params.guid);
            case 'getWidgetConfig':
                var data = this.getWidgetState(config.params.guid);
                return Ext.JSON.encode(data);
            case 'refreshWidgetLaunchMenu':
                return this.refreshWidgetLaunchMenu();
            case 'refreshDashboardStore':
                var title = config.title || Ozone.layout.DialogMessages.refreshRequiredTitle;

                $.pnotify({
                    title: title,
                    text: Ozone.layout.DialogMessages.refreshRequiredBody,
                    type: 'success',
                    addclass: "stack-bottomright",
                    stack: {
                        "dir1": "up",
                        "dir2": "left",
                        "firstpos1": 25,
                        "firstpos2": 25
                    },
                    history: false,
                    sticker: false,
                    icon: false
                });
            default:
                break;
        }
    },

    /**
     * @description Gets all events registered on a widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param cmpId Id of the widget.
     */
    getWidgetStateEvents: function(cmpId) {
        // get component
        var widget = Ext.getCmp(cmpId);
        var eventList = [];

        if (widget) {
            for (var item in widget.events) {
                eventList.push(item);
            }
            return eventList.sort();
        }
        return eventList;
    },

    /**
     * @description Adds custom state event handlers to a widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param eventAction Action to take when an event is received.  Valid values are "listen" and "override".
     * @param guid Id of the widget
     * @param events Array of events
     */
    addWidgetStateEvents: function(eventAction, guid, events) {
        // get widget by guid
        var widget = Ext.getCmp(guid),
            eventName;

        function stateEventHandler(widget, eventAction, eventName) {
            return function() {
                return widget.handleStateEvent(eventAction, eventName);
            };
        }

        if (widget) {

            // default to all events
            if (events == null || events == undefined || events.length == 0) {
                events = this.getWidgetStateEvents(guid);
            }

            // set event listener for specified events
            for (var i = 0, len = events.length; i < len; i++) {

                eventName = events[i];

                if (widget.tab && eventName.indexOf('close') > -1) {

                    if (eventAction === "override") {
                        widget.tab.purgeListener(eventName);
                    }
                    widget["on_" + eventName] = stateEventHandler(widget, eventAction, eventName);
                    widget.tab.on(eventName, widget["on_" + eventName]);
                } else {
                    if (eventAction === "override") {
                        widget.purgeListener(eventName);
                    }
                    widget["on_" + eventName] = stateEventHandler(widget, eventAction, eventName);
                    widget.on(eventName, widget["on_" + eventName]);
                }
            }

            return true;
        }

        return false;
    },

    /**
     * @description Removes custom state event handlers from a widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param eventAction Action to take when an event is received.  Valid values are "listen" and "override".
     * @param guid Id of the widget
     * @param events Array of events
     */
    removeWidgetStateEvents: function(eventAction, guid, events) {
        // get widget by guid
        var widget = Ext.getCmp(guid),
            eventName, cmp;

        if (widget) {
            // default to all events
            if (events == null || events == undefined || events.length == 0) {
                events = this.getWidgetStateEvents(guid);
            }

            // set event listener for specified events
            for (var i = 0; i < events.length; i++) {
                eventName = events[i];
                cmp = widget; // reset cmp to widget

                if (widget.tab && eventName.indexOf('close') > -1) {
                    cmp = widget.tab;
                }
                if (cmp.hasListener(eventName)) {
                    cmp.un(eventName, widget["on_" + eventName]);
                }
                if (eventAction == "override") {
                    cmp.restoreListener(eventName);
                }
            }

            return true;
        }

        return false;
    },

    /**
     * @description Activates a widget. This method should be overridden by each dashboard that support activating a widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param params guid of the widget to activate.
     */
    activateWidget: function(widgetInstanceId) {
        var widget = Ext.getCmp(widgetInstanceId);
        if (widget && !widget.is('backgroundwidget')) {
            if (widget.floatingWidget) {
                widget.minimized === true ? widget.restoreFromMinimize(true) : widget.focus(false, false, true, true);

                this.updateActiveWidget(widget);
                return true;
            } else {
                return widget.pane.activateWidget(widget);
            }
        }
        return false;
    },

    /**
     * @description Closes a widget.  This method should be overridden by each dashboard type.
     * @member Ozone.components.dashboard.Dashboard
     * @param params guid of the widget to close.
     */
    closeWidget: function(guid) {
        var widget = Ext.getCmp(guid);
        if (widget !== undefined) {
            //Check if widget has a tab (i.e., is in a tabbed pane)
            if (widget.tab) {
                //close the tab, not the widget
                widget.tab.close();
            }
            else {
                widget.close();
            }

            return true;
        }
        return false;
    },

    /**
     * @description Closes a widget.  This method should be overridden by each dashboard type.
     * @member Ozone.components.dashboard.Dashboard
     * @param params JSON object containing the guid of the widget to close.
     */
    refreshWidgetLaunchMenu: _.debounce(function() {
        this.dashboardContainer.refreshAppComponentsView();
    }, 1000),

    /**
     * @description Defines what to do when launchWidgetInstance method was called on a widget
     * that is already launched and launchOnlyIfClosed is set to true.  This method should be
     * overridden by each dashboard type.
     * @member Ozone.components.dashboard.Dashboard
     * @param widget The widget instance in state
     */
    handleAlreadyLaunchedWidget: function(widgetData) {
        var widgetCmp = Ext.getCmp(widgetData.uniqueId);

        this.fireEvent(OWF.Events.Widget.AFTER_LAUNCH, widgetCmp, widgetCmp.model, true);

        Ext.getCmp(widgetData.paneGuid).activateWidget(widgetCmp);
    },

    /**
     * @description Returns the JSON representation of the specified widget.
     * @member Ozone.components.dashboard.Dashboard
     * @param guid Id of the specified widget
     * @returns Layout configuration object in JSON format.
     */
    getWidgetConfig: function(guid) {
        var rec = this.widgetStore.getById(guid);
        return rec ? rec.data : null;
    },

    /**
     * @description Returns the JSON representation of the specified widget instance's state.
     * @member Ozone.components.dashboard.Dashboard
     * @param guid Id of the specified widget
     * @returns Layout configuration object in JSON format.
     */
    getWidgetState: function(guid) {
        var widget = Ext.getCmp(guid),
            state, storeState, size;

        if (widget) {
            size = widget.getSize();
            state = widget.getState();

            // use actual width and height if widget is maximized
            if (widget.maximized) {
                Ext.apply(state, {
                    height: size.height,
                    width: size.width
                });
            }
        } else {
            storeState = this.stateStore.getById(guid);
            state = storeState ? storeState.data : {};
        }

        delete state.launchData;
        return state;
    },

    /**
     * @description Returns the launched instance of the specified widget, if there is one
     * @param widgetGuid Id of the widget definition
     * @returns the widget that was launched from the specified definition, or null if there is none
     */
    findWidgetInstance: function(widgetGuid) {
        var index = this.stateStore.findExact('widgetGuid', widgetGuid);
        var widget = (index > -1) ? this.stateStore.getAt(index) : null;
        return widget;
    },

    /**
     * @description Removes the specified window configuration from state.
     * @member Ozone.components.dashboard.Dashboard
     * @param windowId Id of window to be removed.
     * @param dm DashboardMgmt object.
     * @returns None.
     */
    removeState: function(windowId) {
        this.stateStore.remove(this.stateStore.getById(windowId));
    },

    initNewWidget: function(widget) {
        widget.on('close', function() {
            this.updateActiveWidget(null, false);
        }, this);

        widget.on("statesave", function() {
            // For each record in state, add/update value in dashboard defaultStates object
            this.defaultSettings.widgetStates = this.defaultSettings.widgetStates || {};

            var items = this.stateStore.data.items;

            for (var i = 0, len = items.length; i < len; i++) {
                var record = items[i];
                this.defaultSettings.widgetStates[record.data.widgetGuid] = {
                    "x": record.data.x,
                    "y": record.data.y,
                    "height": record.data.height,
                    "width": record.data.width,
                    "columnPos": record.data.columnPos
                };
            }
        }, this);
    },

    initDashboard: function() {
        //register with windowmanager
        this.widgetLauncher.registerWindowManager(this);

        this.addWidgetContainer.registerWindowManager(this);

        //register with windowmanager
        this.widgetStateContainer.registerWindowManager(this);

        //set statestore in the state provider
        var sp = Ext.state.Manager.getProvider();
        if (sp.setStore && typeof sp.setStore === 'function') {
            sp.setStore(this.stateStore);
        }
        document.title = this.config.name;
    },

    // private
    onRender: function(ct, position) {
        this.initDashboard();

        //Ensure a dashboard isn't rendered hidden (OP-1161)
        if (this.cssanimations) {
            this.hidden = false;
        }

        this.callParent(arguments);
    },

    onActivate: function(cmp) {
        var banner = this.dashboardContainer.getBanner();

        this.initDashboard();

        if (this.configRecord.get('locked') || this.configRecord.isMarketplaceDashboard()) {
            banner.disableAppComponentsBtn();
            banner.getUserMenuBtn().disableAdminMenuItem();
            banner.getUserMenuBtn().disableMetricsMenuItem();
        } else {
            banner.enableAppComponentsBtn();
            banner.getUserMenuBtn().enableAdminMenuItem();
            banner.getUserMenuBtn().enableMetricsMenuItem();
        }

        // hide all widgets to fire hide events on Widget State
        var items = this.stateStore.data.items;

        for (var i = 0, len = items.length; i < len; i++) {
            var rec = items[i],
                uniqueId = rec.get('uniqueId'),
                cmp = Ext.getCmp(uniqueId);

            //cmp.show();
            //cmp.fireEvent('show');
            var onShow;
            if (cmp && (onShow = cmp['on_show'])) {
                onShow();
            }
        }

        $('.widgetMenuItem').hide();
        if(this.config.type)
        	$('.'+this.config.type+'MenuItem').show();

    },

    onDeActivate: function(cmp) {
        this.saveToServer();
        // hide all widgets to fire hide events on Widget State
        var items = this.stateStore.data.items;

        for (var i = 0, len = items.length; i < len; i++) {
            var rec = items[i],
                uniqueId = rec.get('uniqueId'),
                cmp = Ext.getCmp(uniqueId);

            //cmp.hide();
            //cmp.fireEvent('hide');
            var onHide;
            if (cmp && (onHide = cmp['on_hide'])) {
                onHide();
            }
        }
    },

    getJson: function() {
        var json = this.configRecord.data,
            pane,
            panes = this.query('pane'),
            paneWidgets;

        for (var i = 0, len = panes.length; i < len; i++) {
            pane = panes[i];

            pane.initialConfig.widgets = pane.getStatesOfAllWidgets();
            pane.initialConfig.defaultSettings = pane.defaultSettings;
        }

        json.state = [];
        json = Ext.clone(json);

        return json;
    },

    saveToServer: function(sync, force, saveAsNew, successCallback, failureCallback) {
        //save state
        if (this.configRecord && this.stateStore && !this.dontSave) {
            if (this.hasChanged || this.configRecord.dirty || force) {
                var dash = this;
                if (this.fireEvent('beforeserversave', this) !== false) {
                    if (!this.saveLock) {
                        this.saveLock = true;
                        Ozone.pref.PrefServer.createOrUpdateDashboard({
                            json: this.getJson(),
                            saveAsNew: (saveAsNew === true),
                            onSuccess: function() {
                                dash.configRecord.commit();
                                dash.hasChanged = false;
                                dash.fireEvent('serversave', dash, true);
                                dash.saveLock = false;
                                if (successCallback) {
                                    successCallback();
                                }
                            },
                            onFailure: function() {
                                dash.fireEvent('serversave', dash, false);
                                dash.saveLock = false;
                                if (failureCallback) {
                                    failureCallback();
                                }
                            },
                            async: !sync
                        });
                    }
                }
            }
        }
    },

    shimPanes: function() {
        _.invoke(this.panes, 'shim');
    },

    unshimPanes: function() {
        _.invoke(this.panes, 'unshim');
    },

    //Enables widget move to all but the sourcePane that originated the drag
    enableWidgetMove: function(sourcePane, isDragAndDrop) {
        var panes = this.panes,
            isLocked = this.configRecord.get("locked");

        this.shimPanes();

        if(!isLocked) {
            var el = this.el.dom,
                $shims = $('.shim', el),
                $doc = $(document),
                $innerShims, hintText;

            hintText = isDragAndDrop ? 'Drag and release to start the App Component' : 'Click to start the App Component';
            $shims.before('<div class="inner-shim"></div><div class="hint-text">' + hintText + '</div>');
            $innerShims = $('.inner-shim', el);

            $doc.on('mousemove.launch', '.shim', function (evt) {
                $innerShims.addClass('highlight-dashboard-designer-drop');
                $innerShims.siblings('.hint-text').css('display', 'none');
                $(evt.target).siblings('.inner-shim').removeClass('highlight-dashboard-designer-drop').siblings('.hint-text').css('display', Ozone.config.showHints ? '' : 'none');
            });

            $doc.one('mouseup', function () {
                $doc.off('.launch');
                $shims.removeClass('highlight-dashboard-designer-drop');
                $('.hint-text, .inner-shim', el).remove();
            });

            if(sourcePane && sourcePane.el) {
                var $sourcePaneShim = $(sourcePane.el.dom).children('.shim');
                $shims.not($sourcePaneShim).addClass('highlight-dashboard-designer-drop');
            }
        }
    },

    disableWidgetMove: function() {
        this.unshimPanes();
    },

    getViewPort: function() {
        return Ext.getCmp(this.viewportId);
    },

    getSite: function() {
        //find root context
        var baseContextPath = window.location.pathname;
        var baseContextPathRegex = /^(\/[^\/]+\/).*$/i;
        var matches = baseContextPath.match(baseContextPathRegex);
        if (matches && matches[1] && matches[1].length > 0) {
            baseContextPath = matches[1];
            //remove final /
            baseContextPath = baseContextPath.substring(0, baseContextPath.length - 1);
        } else {
            baseContextPath = '';
        }

        return window.location.protocol + "//" + window.location.host + (baseContextPath.charAt(0) != '/' ? ('/' + baseContextPath) : baseContextPath);
    },

    updateActiveWidget: function(widget, notify) {
        //console.log('updating active widget');
        if (!widget || (widget && widget.is('backgroundwidget'))) {
            this.activeWidget = null;
            return;
        }

        if (this.activeWidget === widget && widget.iframeReady) {
            gadgets.rpc.call(widget.getIframeId(), '_widget_activated');
        }

        if (this.activeWidget && this.activeWidget !== widget) {
            this.activeWidget.active = false;
            this.activeWidget.removeCls(this.activeWidget.focusCls);

            if (this.activeWidget.iframeReady && notify !== false) {
                this.activeWidget._activated = false;
                var deactivatedWidgetId = this.activeWidget.getIframeId();
                if (deactivatedWidgetId) {
                    gadgets.rpc.call(deactivatedWidgetId, '_widget_deactivated');
                }
            }
        }

        this.activeWidget = widget;

        if (widget && notify !== false && this.activeWidget.iframeReady && !widget._activated) {
            widget.active = true;
            widget._activated = true;
            gadgets.rpc.call(widget.getIframeId(), '_widget_activated');
        }

    },

    getActiveWidget: function(id) {
        return Ext.getCmp(id) || this.activeWidget;
    },

    getViewHeight: function() {
        return Ext.getCmp('dashboardCardPanel').getHeight();
    },

    getViewWidth: function() {
        return Ext.getCmp('dashboardCardPanel').getWidth();
    },

    moveWidgetUp: function(id) {
        var widget = this.getActiveWidget(id);
        if (widget && widget.initialConfig.floatingWidget) {
            widget.pane.moveFloatingWidgetUp(widget);
        } else {
            widget && widget.pane.moveWidgetUp(widget);
        }
    },

    moveWidgetRight: function(id) {
        var widget = this.getActiveWidget(id);
        if (widget && widget.initialConfig.floatingWidget) {
            widget.pane.moveFloatingWidgetRight(widget);
        } else {
            widget && widget.pane.moveWidgetRight(widget);
        }
    },

    moveWidgetDown: function(id) {
        var widget = this.getActiveWidget(id);
        if (widget && widget.initialConfig.floatingWidget) {
            widget.pane.moveFloatingWidgetDown(widget);
        } else {
            widget && widget.pane.moveWidgetDown(widget);
        }
    },

    moveWidgetLeft: function(id) {
        var widget = this.getActiveWidget(id);
        if (widget && widget.initialConfig.floatingWidget) {
            widget.pane.moveFloatingWidgetLeft(widget);
        } else {
            widget && widget.pane.moveWidgetLeft(widget);
        }
    },

    /**
     * @Override
     * Overridden to add CSS animations
     **/
    onHide: function(animateTarget, cb, scope) {
        var me = this;

        if (this.cssanimations) {
            this.slideOut();
        } else {
            me.el.hide();
            me.el.addCls(me.hideCls);
        }

        if (!animateTarget) {
            me.afterHide(cb, scope);
        }
    },

    /**
     * @Override
     * Overridden to add CSS animations
     **/
    onShow: function() {
        var me = this;

        if (this.cssanimations) {
            this.slideIn();
        } else {
            me.el.show();
            me.el.removeCls(me.hideCls);
        }

        Ext.AbstractComponent.prototype.onShow.call(this);
        if (me.floating && me.constrain) {
            me.doConstrain();
        }
    },

    /**
     *
     * Disable CSS animations.
     **/
    disableCssAnimations: function() {
        this.cssanimations = false;
    },

    /**
     *
     * Enable CSS animations.
     **/
    enableCssAnimations: function() {
        this.cssanimations = true;

        //update the way a hidden dashboard is hidden
        if (this.rendered && this.isHidden()) {
            this.el.addCls(this.inactiveCls);
            this.el.removeCls(this.hideCls);
            this.el.setStyle('visibility', '');
        }
    },

    /**
     *
     * Set slide in direction for dashboard animations.
     * @param {String} direction valid values up, left, down, right
     **/
    setSlideInDirection: function(direction) {
        this.slideInDirection = direction;
    },

    /**
     *
     * Set slide out direction for dashboard animations.
     * @param {String} direction valid values up, left, down, right
     **/
    setSlideOutDirection: function(direction) {
        this.slideOutDirection = direction;
    },

    /**
     *
     * Slide dashboard into view.
     *
     **/
    slideIn: function() {
        switch (this.slideInDirection) {
            case 'down':
                this.slideInDown();
                break;
            case 'up':
                this.slideInUp();
                break;
            case 'left':
            default:
                this.slideInLeft();
                break;
        }
    },

    /**
     *
     * Slide dashboard out of view.
     *
     **/
    slideOut: function() {
        switch (this.slideOutDirection) {
            case 'down':
                this.slideOutDown();
                break;
            case 'up':
                this.slideOutUp();
                break;
            case 'left':
            default:
                this.slideOutLeft();
                break;
        }
    },

    /**
     *
     * Slide down dashboard into view.
     *
     **/
    slideInDown: function() {
        this.showAnimation('dashboardSlideInDown');
    },

    /**
     *
     * Slide down dashboard out of view.
     *
     **/
    slideOutDown: function() {
        this.hideAnimation('dashboardSlideOutDown');
    },

    /**
     *
     * Slide up dashboard into view.
     *
     **/
    slideInUp: function() {
        this.showAnimation('dashboardSlideInUp');
    },

    /**
     *
     * Slide up dashboard out of view.
     *
     **/
    slideOutUp: function() {
        this.hideAnimation('dashboardSlideOutUp');
    },

    /**
     *
     * Slide left dashboard into view.
     *
     **/
    slideInLeft: function() {
        this.showAnimation('dashboardSlideInLeft');
    },

    /**
     *
     * Slide left dashboard out of view.
     *
     **/
    slideOutLeft: function() {
        this.hideAnimation('dashboardSlideOutLeft');
    },

    /**
     *
     * Helper method to be used from slide in css animations.
     * @param {String} cls CSS animation class to add
     *
     **/
    showAnimation: function(cls) {
        this.el.removeCls(this.inactiveCls).addCls(this.animationCls + cls);
        this.el.on(CSS.Animation.ANIMATION_END, function() {
            this.el.removeCls(this.animationCls + cls);
            this.fireEvent(OWF.Events.Dashboard.SHOWN);
        }, this, {
            single: true
        });
    },

    /**
     *
     * Helper method to be used from slide out css animations.
     * @param {String} cls CSS animation class to add
     *
     **/
    hideAnimation: function(cls) {
        this.el.addCls(this.animationCls + cls);
        this.el.on(CSS.Animation.ANIMATION_END, function() {
            this.el.addCls(this.inactiveCls).removeCls(this.animationCls + cls);
            this.fireEvent(OWF.Events.Dashboard.HIDDEN);
        }, this, {
            single: true
        });
    },

    /**
     * Handle the case when the user closes all widgets on the marketplace dashboard.
     * In this case their previous dashboard should be switched to
     */
    handleMarketplaceWidgetClose: function() {
        if (!this.query('.widgetpanel, .widgetwindow').length) {
            //no widgets left on marketplace dashboard, switch to another dashboard
            this.dashboardContainer.activatePreviousDashboard();
        }
    }
});
