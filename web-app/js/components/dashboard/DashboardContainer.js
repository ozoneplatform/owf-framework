Ext.define('Ozone.components.dashboard.DashboardContainer', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboardContainer', 'widget.Ozone.components.dashboard.DashboardContainer'],

    plugins: new Ozone.plugins.DashboardContainer(),

    activeDashboard: null,
    dashboardMenuItems: null,

    dashboardStore: null,
    widgetStore: null,
    dashboards: null,
    autoSaveEnabled: true,

    layout: 'fit',
    refreshUrl: window.location,

    // current user
    user: null,

    // User-defined widget names
    widgetNames: {},
    originalWidgetNames: {},

    // the number of milliseconds to wait between checks to determine if a save is needed
    // 900000 = 15 minutes
    pollingInterval: Ozone.config.autoSaveInterval ? Ozone.config.autoSaveInterval : 900000,

    suppressLockWarning: false,

    // ZIndexManagers for the various z-index levels, must be instantiated in 
    // index.gsp so the tooltipManager can be used and still be created last
    floatingWidgetManager: null,
    bannerManager: null,
    dashboardDesignerManager: null,
    modalWindowManager: null,
    tooltipManager: null,

    // private
    initComponent: function() {
        var me = this,
            stackModels = {},
            dashboard, stack, model;

        this.stackStore = Ext.create('Ozone.data.StackStore', {});

        for(var i = 0, len = this.dashboardStore.getCount(); i < len; i++) {

            model = this.dashboardStore.getAt(i);

            dashboard = model.data;
            stack = dashboard.stack;

            if( stack ) {
                if( stackModels[ stack.id ] ) {
                    stackModels[ stack.id ].get('dashboards').push( model );
                }
                else {
                    var stackModel = this.stackStore.add( stack )[0];
                    stackModel.set('dashboards', [ model ]);

                    stackModels[ stack.id ] = stackModel;
                }
            }

        }
        
        this.originalDashboardStore = Ext.create('Ozone.data.DashboardStore', {
        });
        this.dashboardMenuItems = [];
        this.dashboards = [];

        // eventing configuration
        this.initEventing();

        OWF.Container = OWF.Container || {};
        OWF.Container.Eventing = Ozone.eventing.Container;

        // initialize widget launcher
        OWF.Container.Launcher = new Ozone.launcher.WidgetLauncherContainer(OWF.Container.Eventing);
        this.addWidgetContainer = new Ozone.marketplace.AddWidgetContainer(OWF.Container.Eventing);
        OWF.Container.DragAndDrop = new Ozone.dragAndDrop.WidgetDragAndDropContainer({
            eventingContainer: OWF.Container.Eventing
        });
        OWF.Container.DragAndDrop.addCallback('dragStart', Ext.bind(function(data) {
            Ext.getCmp(this.activeDashboard.id).fireEvent('widgetStartDrag', data);
        }, this));
        OWF.Container.DragAndDrop.addCallback('dragStop', Ext.bind(function(data) {
            Ext.getCmp(this.activeDashboard.id).fireEvent('widgetStopDrag', data);
        }, this));

        //initialize widgetchrome api
        OWF.Container.Chrome = new Ozone.chrome.WidgetChromeContainer({eventingContainer:OWF.Container.Eventing});

        // initialize widget state event container for receiving events
        OWF.Container.State = new Ozone.state.WidgetStateContainer(OWF.Container.Eventing);

        this.user = Ozone.config.user;
        this.widgetNames = Ozone.config.widgetNames || {};
        this.widgetStore.on('datachanged', this.updateTitlesandBanner, this);

        //setup component properties
        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: [
                //putting the banner as an actual child component because there are window contraining issues if the
                //banner is an actual docked toolbar
                {
                    itemId: 'owfbanner',
                    xtype: 'owfbanner',
                    user: this.user,
                    dashboardContainer: this
                },
                {
                    id: 'dashboardCardPanel',
                    itemId: 'dashboardCardPanel',
                    xtype: 'panel',
                    flex: 1,
                    layout: {
                        type: 'bufferedcard'
                    },
                    cls: 'usableCentralRegion',
                    listeners: {
                        afterlayout: {
                            fn: function(cmp) {

                                cmp.isLayedOut = true;

                            },
                            scope: this,
                            single: true
                        }
                    },
                    items: []
                }
            ]
        });

        //call super init
        this.callParent(arguments);

        //start autosaving after layout is complete
        this.on('afterlayout', this.startAutoSave, this, {
            single: true
        });

        this.on('resize', function(comp, width, height, oldWidth, oldHeight, eOpts) {
            var banner = this.getBanner();
            if (banner && banner.popOutToolbar && banner.popOutToolbar.isVisible()) {
                var pos = banner.getBanner().getPosition(true);
                if (pos[0] > width || pos[1] > height) {
                    banner.dockPopOutBanner();
                }
            }
        });

        this.onBeforeUnload = function(evt) {
            Ozone.pref.PrefServer.deleteUserPreference({
                namespace:'owf.custom.widgetprefs',
                sync: true,
                name:'widgetNames'
            });

            if (this.activeDashboard != null) {
                Ext.getCmp(this.activeDashboard.id).saveToServer(true);
            }

            //tell History to shutdown cleanly because the browser is leaving OWFs
            if (!this.shareButtonClicked) {
                Ext.History.shutDown();
            }
            else {
                this.shareButtonClicked = false;
            }
        };

        //setup save on unload
        Ext.EventManager.on(window, 'beforeunload', this.onBeforeUnload, this);

        this.addKeyBindings();

        this.addEvents({
            dashboardChanged : true
        });

        // delegate all mousedown to document
        // enables moving widgets from one pane to another
        Ext.getDoc().on('mousedown', this.onWidgetMouseDown, this, { delegate: '.widgetheader' });

        this.updateTitlesandBanner();
        this.initLoad();
    },

    onWidgetMouseDown: function(evt, target) {
        var widgetEl, widgetId, targetEl, widget;

        if(evt.getTarget().nodeName === "IMG") {
            return;
        }

        // if only one pane, don't enable drag n drop
        // if (this.activeDashboard.query('pane').length === 1) {
        //     return;
        // }

        targetEl = Ext.get(target);
        widgetEl = targetEl.up('.x-closable');
        widgetId = widgetEl ? widgetEl.dom.id : target.id;

        // cache widget to move and src pane guid to use later
        widget = Ext.getCmp(widgetId);
        widget = widget.card || widget;

        //Return if not a widget or is floating
        if(!widget.isWidget || widget.floatingWidget) {
            return;
        }

        Ext.getDoc().on('mousemove', this.onMouseMove, this);
        Ext.getDoc().on('mouseup', this.onMouseUp, this);

        this._widgetToMove = widget;
        this._sourcePane = this._widgetToMove.pane;
        this._paneWidgets = [];
        this._paneWidgetsBox = [];

        var widget, widgetBox;
        var sourcePaneWidgets = this._sourcePane.getWidgets(),
            body = Ext.getBody();

        for (var pos = 0, len = sourcePaneWidgets.length; pos < len; pos++) {
            widget = sourcePaneWidgets[pos];
            widget._position = pos;
            this._paneWidgets.push(widget);

            widgetBox = widget.tab ? widget.tab.getBox() : widget.getBox();
            widgetBox.midpoint = widget.tab ? widgetBox.x + (widgetBox.width/2) : widgetBox.y + (widgetBox.height / 2);
            this._paneWidgetsBox.push(widgetBox);
        }
    },

    onMouseMove: function(evt, target) {
        var xy = evt.getXY(),
            targetPane = Ext.get(target).up('.pane'),
            isFloating = this._widgetToMove.isFloating();

        this._reorderingWidgets = false;

        if (this._counter) {
            this.ddProxy.el.setStyle({
                'left': (xy[0] + 25) + 'px',
                'top': (xy[1] + 25) + 'px'
            });

            if (this.activeDashboard.configRecord.get("locked")) {
                this.ddProxy.setStatus(this.ddProxy.dropNotAllowed);
            } else {
                this.ddProxy.setStatus(targetPane ? this.ddProxy.dropAllowed : this.ddProxy.dropNotAllowed);
            }

            if (targetPane && this._sourcePane.el === targetPane) {
                if(isFloating) {
                    // hide proxy for floating widgets
                    this.ddProxy.hide();
                }
                else { // allow reordering via drag and drop

                    this.ddProxy.show();

                    this._reorderingWidgets = true;

                    var widgetBox, overWidget;
                    var match = false,
                        eventPageX = xy[0],
                        eventPageY = xy[1];

                    for (var pos = 0, len = this._paneWidgets.length; pos < len; pos++) {
                        overWidget = this._paneWidgets[pos];
                        widgetBox = this._paneWidgetsBox[pos];

                        if(overWidget.tab) {
                             if(widgetBox.x < eventPageX && ((widgetBox.x + widgetBox.width) > eventPageX)) {
                                match = true;
                                break;
                            }
                        }
                        else {
                            if(widgetBox.y < eventPageY && ((widgetBox.y + widgetBox.height) > eventPageY)) {
                                match = true;
                                break;
                            }
                        }

                    }

                    pos = (match && overWidget ? pos : this._paneWidgets.length);

                    if(this._lastDropIndicatedWidget) {
                        this._lastDropIndicatedWidget.el.removeCls.call(
                            this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el,
                            ['indicate-drop-before', 'indicate-drop-after']
                        );
                    }

                    if(pos === this._widgetToMove._position) {
                        // dont move as the widget hasn't been moved
                        this.ddProxy.setStatus(this.ddProxy.dropNotAllowed);
                    }
                    else if(match) {

                        this._lastDropIndicatedWidget =  this._paneWidgets[pos];

                        // var oldPos = pos;
                        var clsToAdd;

                        if((overWidget.tab && widgetBox.midpoint > eventPageX) ||
                            (!overWidget.tab && widgetBox.midpoint > eventPageY)) {
                            //pos = pos === 0 ? 0 : pos - 1;
                            clsToAdd = 'indicate-drop-before';
                        }
                        else {
                            pos = pos + 1;
                            clsToAdd = 'indicate-drop-after';
                        }

                        this._lastDropIndicatedWidget.el.addCls.call(
                            this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el,
                            clsToAdd
                        );

                        this._movePosition = pos;

                        // if(overWidget.tab)
                        //     console.log(widgetBox.midpoint > eventPageX ? 'before' : 'after', pos, oldPos);
                        // else
                        //     console.log(widgetBox.midpoint > eventPageY ? 'before' : 'after', pos, oldPos);
                    }
                }
            }
            else {
                this.ddProxy.show();
            }
        }
        else {
            this._counter = 1;

            this.ddProxy = this.ddProxy || Ext.create('Ext.dd.StatusProxy', {
                shadow: false
            });
            this.ddProxy.update('<img src="' + this._widgetToMove.model.get('image') + '" class="widget-drag-proxy"/>');


            //TODO: investigate why I have to call show, hide and show
            this.ddProxy.show();
            this.ddProxy.hide();

            this.activeDashboard.enableWidgetMove(targetPane);
        }
    },

    onMouseUp: function(evt, target) {
        var targetPaneEl;

        if(this._lastDropIndicatedWidget) {
            this._lastDropIndicatedWidget.el.removeCls.call(
                this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el,
                ['indicate-drop-before', 'indicate-drop-after']
            );
        }

        Ext.getDoc().un('mousemove', this.onMouseMove, this);
        Ext.getDoc().un('mouseup', this.onMouseUp, this);

        if(this._movePosition && this._widgetToMove._position < this._movePosition)
            this._movePosition -= 1;

        if(this._reorderingWidgets && this._movePosition !== undefined && this._movePosition !== this._widgetToMove._position) {
            this._sourcePane.reorderWidget(this._widgetToMove, this._movePosition);
        }
        else if ( this._widgetToMove && (targetPaneEl = Ext.fly(target).up('.pane')) ) {
            this.activeDashboard.moveWidgetToPane(evt, Ext.getCmp(this._widgetToMove.paneGuid), Ext.getCmp(targetPaneEl.dom.id), this._widgetToMove);
        }

        this.activeDashboard.disableWidgetMove();
        this.ddProxy && this.ddProxy.hide();

        delete this._counter;
        delete this._movePosition;
        delete this._widgetToMove;
        delete this._lastDropIndicatedWidget;
        delete this._sourcePane;
        delete this._paneWidgets;
        delete this._paneWidgetsBox;
    },

    /*
    * Launches widget on the current dashboard.
    */
    launchWidgets: function(widgetModel, isEnterPressed) {
        var me = this;

        me.selectPane(isEnterPressed).then(function(pane, e) {
            me.activeDashboard.launchWidgets(pane, null, e, {
                widgetModel: widgetModel
            })
        },
        function () {
            var launchMenu = Ext.getCmp('widget-launcher');
            if (launchMenu) {
                launchMenu.fireEvent('noWidgetLaunched');
            }
        });
    },

    /*
    * Selects a Pane from the active dashboard.
    * 
    * Returns: a promise object that will be resolved with
    * event and pane selected
    */
    selectPane: function(isUsingKeyboard) {
        var me = this,
            deferred = jQuery.Deferred(),
            panes = this.activeDashboard.panes,
            doc = Ext.getDoc();

        // if one page resolve right away
        if( panes.length === 1 ) {
            deferred.resolve( panes[0] );
        }
        else {

            this.activeDashboard.enableWidgetMove();

            // if using keyboard, highlight first pane
            if( isUsingKeyboard === true ) {
                if (document.activeElement) document.activeElement.blur();
                panes[0].focus();
            }

            doc.on('keydown', this._selectPaneOnKeyDown, this, {
                capture: true,
                deferred: deferred
            });

            this.el.on('click', this._selectPaneOnClick, this, {
                deferred: deferred
            });

            // cleanup listeners when deferred is either resolved or rejected
            deferred.always(function() {
                me.activeDashboard.disableWidgetMove();

                doc.un('keydown', me._selectPaneOnKeyDown, me, {capture: true});
                me.el.un('click', me._selectPaneOnClick, me);
            });
        }

        return deferred.promise();
    },

    /*
    * Manages pane selection using keyboard.
    * Resolves deferred when Enter key is pressed and 
    * rejects when Esc is pressed
    */
    _selectPaneOnKeyDown: function(e, dom, eOpts) {
        var panes = this.activeDashboard.panes,
            key = e.getKey(),
            lastPaneIndex = panes.length - 1,
            nextPaneIndex;

        // prevent from bubbling down
        e.stopEvent();

        this._previousPaneIndex = this._previousPaneIndex || 0;

        if( key === Ext.EventObject.TAB ) {
            if(e.shiftKey) {
                //Go back a pane
                if(this._previousPaneIndex === 0) {
                    nextPaneIndex = lastPaneIndex;
                }
                else {
                    nextPaneIndex = this._previousPaneIndex - 1;
                }
            }
            else {
                //Go forward a pane
                if (this._previousPaneIndex === lastPaneIndex) {
                    nextPaneIndex = 0;
                }
                else {
                    nextPaneIndex = this._previousPaneIndex + 1;
                }
            }
            panes[ this._previousPaneIndex ].blur();
            panes[ nextPaneIndex ].focus();

            this._previousPaneIndex = nextPaneIndex;
        }
        else if( key === Ext.EventObject.ENTER ) {

            eOpts.deferred.resolve( panes[ this._previousPaneIndex ], e );
            delete this._previousPaneIndex;

        }
        //Enable ESC to cancel
        else if( key === Ext.EventObject.ESC ) {
            eOpts.deferred.reject();
        }
    },

    /*
    * Manages pane selection using mouse.
    */
    _selectPaneOnClick: function(e, dom, eOpts) {
        var paneEl = Ext.get(dom).up('.pane'),
            deferred = eOpts.deferred;

        if( paneEl ) {
            deferred.resolve( Ext.getCmp( paneEl.id ), e );
        }
        else {
            deferred.reject();
        }
    },

    initLoad: function() {

        var records = this.widgetStore.getRange();
        for (var i = 0; i < records.length; i++) {
            //save widget names
            this.originalWidgetNames[records[i].data.widgetGuid] = records[i].data.name;
        }

        //see if the dashboard guid was specified on the hash
        var hashData = Ext.util.History.getToken();
        var data = hashData ? Ext.urlDecode(hashData) : {};
        var activeDashboardGuid = data.guid;
        var stackDashboards = [];
        var stackContext = data.stack;

        if (this.dashboardStore.getCount() > 0) {
            for (var i = 0, len = this.dashboardStore.getCount(); i < len; i++) {
                var dashRecord = this.dashboardStore.getAt(i);
                var dash = dashRecord.data;

                this.dashboards.push(this.createDashboardConfig(dashRecord));
                this.originalDashboardStore.add(Ext.JSON.decode(Ext.JSON.encode(dashRecord.data)));
                
                // Build an array of dashboards that are in the supplied stack context
                if (stackContext && dashRecord.data.stack && dashRecord.data.stack.stackContext == stackContext) {
                    stackDashboards.push(this.createDashboardConfig(dashRecord));
                }

                if (activeDashboardGuid != null) {
                    if (dash.guid == activeDashboardGuid) {
                        this.activeDashboard = this.dashboards[this.dashboards.length - 1];
                    }
                }
                if (dash.isdefault) {
                    this.defaultDashboard = this.dashboards[this.dashboards.length - 1];
                }

            }
        }

        // Set active dashboard
        if (this.activeDashboard == null) {
            // Couldn't find a dashboard based on guid
            if (stackDashboards.length > 0) {
                // If a stack context was supplied, set active dashboard to first dashboard in stack
                this.activeDashboard = stackDashboards[0];
                if (this.defaultDashboard) {
                    // If a default dashboard exists and is part of the stack, activate that one
                    for (var i = 0; i < stackDashboards.length; i++) {
                        if (this.defaultDashboard.guid == stackDashboards[i].guid) {
                            this.activeDashboard = stackDashboards[i];
                            break;
                        }
                    }
                }
                this.defaultDashboard = this.activeDashboard;
            } else {
                if (this.defaultDashboard != null) {
                    // Otherwise, set active dashboard to default dashboard
                    this.activeDashboard = this.defaultDashboard;
                } else {
                    if (this.dashboards.length > 0) {
                        // Otherwise, just pick the first dash
                        this.activeDashboard = this.dashboards[0];
                        this.defaultDashboard = this.activeDashboard;
                    } else {
                        // And if all else fails, create a new active dashboard
                        this.activeDashboard = this.createDashboardConfig(this.createEmptyDashboard('desktop', true));
                        this.defaultDashboard = this.activeDashboard;
                        this.dashboards.push(this.activeDashboard);
                    }
                }
            }
        }

        Ext.state.Manager.setProvider(Ext.create('Ozone.state.WidgetStateStoreProvider', {
            store: this.activeDashboard ? this.activeDashboard.stateStore : null
        }));

        //attach listener to change dashboard on # change
        Ext.util.History.on('change', function(hashData) {
            if (hashData != null) {
                
                var data = Ext.urlDecode(hashData);
                if (data.guid != null && data.guid != 'notFound') {
                    this._activateDashboard(data.guid, data.stack);
                }
                else
                if (data.guid == 'notFound') {
                    //guid was bad
                    this._activateDashboard(null, data.stack);
                }
                else {
                    //no data specified on the hash -- pass empty string
                    this._activateDashboard('', data.stack);
                }
            }
            else {
                //goto the default dashboard
                this._activateDashboard(this.defaultDashboard.guid, data.stack);
            }
        }, this);

        var dashboardCardPanel = this.getComponent('dashboardCardPanel');

        var setupInitialDash = Ext.bind(function() {
            dashboardCardPanel.activeItem = this.activeDashboard.id;
            dashboardCardPanel.add(this.dashboards);

            this.activeDashboard = dashboardCardPanel.getComponent(this.activeDashboard.id);
            this.activateDashboard(this.activeDashboard.id, true, this.activeDashboard.stackContext);
            if (this.activeDashboard.configRecord.get('locked')) {
    			this.getBanner().disableLaunchMenu();
    		} else {
    			this.getBanner().enableLaunchMenu();
    		}
        }, this);

        if (dashboardCardPanel.isLayedOut) {
            setupInitialDash();
        }
        else {
            dashboardCardPanel.on({
                afterlayout: {
                    fn: function() {
                        setupInitialDash();
                    },
                    scope: this,
                    single: true
                }
            });
        }
    },

    //add global key bindings here instead of in initComponent
    addKeyBindings: function() {
        Ext.FocusManager.disable();

        Ozone.KeyMap.addBinding([
            Ext.apply(Ozone.components.keys.HotKeys.WIDGET_SWITCHER, {
                scope: this,
                fn: this.showWidgetSwitcher
            }),

            Ext.apply(Ozone.components.keys.HotKeys.CLOSE_WIDGET, {
                scope: this,
                fn: this.closeWidget
            }),

            Ext.apply(Ozone.components.keys.HotKeys.MAXIMIZE_COLLAPSE_WIDGET, {
                scope: this,
                fn: this.maximizeCollapseWidget
            }),

            Ext.apply(Ozone.components.keys.HotKeys.MINIMIZE_EXPAND_WIDGET, {
                scope: this,
                fn: this.minimizeExpandWidget
            }),

            Ext.apply(Ozone.components.keys.HotKeys.ESCAPE_FOCUS, {
                scope: this,
                fn: this.esc
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_UP, {
                scope: this,
                alt: false,
                fn: this.saveWidgetState
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_RIGHT, {
                scope: this,
                alt: false,
                fn: this.saveWidgetState
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_DOWN, {
                scope: this,
                alt: false,
                fn: this.saveWidgetState
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_LEFT, {
                scope: this,
                alt: false,
                fn: this.saveWidgetState
            })
        ]);

        // map move hot keys for widgets
        Ozone.MoveKeyMap.addBinding([
            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_UP, {
                scope: this,
                fn: function(key, event, widgetInstanceId) {
                    this.activeDashboard.moveWidgetUp(widgetInstanceId);
                }
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_RIGHT, {
                scope: this,
                fn: function(key, event, widgetInstanceId) {
                    this.activeDashboard.moveWidgetRight(widgetInstanceId);
                }
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_DOWN, {
                scope: this,
                fn: function(key, event, widgetInstanceId) {
                    this.activeDashboard.moveWidgetDown(widgetInstanceId);
                }
            }),

            Ext.apply(Ozone.components.keys.MoveHotKeys.MOVE_LEFT, {
                scope: this,
                fn: function(key, event, widgetInstanceId) {
                    this.activeDashboard.moveWidgetLeft(widgetInstanceId);
                }
            })
        ]);
    },

    showWidgetSwitcher: function() {
        var widgetSwitcherId = 'widget-switcher', widgetSwitcher = Ext.getCmp(widgetSwitcherId);

        if (!widgetSwitcher) {
            widgetSwitcher = Ext.widget('widgetswitcher', {
                id: widgetSwitcherId,
                dashboardContainer: this,
                activeDashboard: this.activeDashboard,
                widgetStore: this.widgetStore,
                plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.WIDGET_SWITCHER)
            });
        }
        else if (widgetSwitcher.isVisible()) {
            widgetSwitcher.close();
            return;
        }
        widgetSwitcher.show();
        widgetSwitcher.activeDashboard = this.activeDashboard;
        widgetSwitcher.setStore(this.activeDashboard.stateStore);
        widgetSwitcher.center();
    },

    showDashboardSwitcher: function() {
        // force dashboard save before showing dashboard switcher
        this.activeDashboard.saveToServer(false, true);
        
        var dashboardSwitcherId = 'dashboard-switcher', dashboardSwitcher = Ext.getCmp(dashboardSwitcherId);

        if (!dashboardSwitcher) {
            dashboardSwitcher = Ext.widget('dashboardswitcher', {
                id: dashboardSwitcherId,
                dashboardContainer: this,
                activeDashboard: this.activeDashboard,
                dashboardStore: this.dashboardStore,
                plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.DASHBOARD_SWITCHER)
            });
        }
        else if (dashboardSwitcher.isVisible()) {
            dashboardSwitcher.close();
            return;
        }
        dashboardSwitcher.activeDashboard = this.activeDashboard;
        dashboardSwitcher.show().center();
    },

    destroyDashboardSwitcher: function () {
        var dashboardSwitcherId = 'dashboard-switcher',
            dashboardSwitcher = Ext.getCmp(dashboardSwitcherId);

        dashboardSwitcher && dashboardSwitcher.destroy();
    },

    createDashboardConfig: function(dashRecord) {
        var dash = dashRecord.data;
        var stateStore = Ext.create('Ozone.data.StateStore', {
            storeId: dash.guid,
            data: []
        });

//        if (typeof dash.defaultSettings === "string" && !Ext.isEmpty(dash.defaultSettings)) {
//            dash.defaultSettings = Ext.JSON.decode(dash.defaultSettings);
//        }
//        //we always want this to be defaulted to an empty object if it is null or an empty string
//        if (dash.defaultSettings == null || dash.defaultSettings == "") {
//            dash.defaultSettings = {};
//        }

        return {
            id: dash.guid,
            itemId: dash.guid,
            guid: dash.guid,
            xtype: 'dashboard',
            config: dash,
            configRecord: dashRecord,
//            defaultSettings: dash.defaultSettings,
            widgetStore: this.widgetStore,
            stateStore: stateStore,
            eventingContainer: OWF.Container.Eventing,
            widgetLauncher: OWF.Container.Launcher,
            addWidgetContainer: this.addWidgetContainer,
            widgetStateContainer: OWF.Container.State,
            widgetDragAndDrop: OWF.Container.DragAndDrop,
            dashboardContainer: this,
            viewportId: this.viewportId,
            name: dash.name,
            userId: this.user.id,
            userName: this.user.displayName,
            stackContext: dash.stack ? dash.stack.stackContext : null
        };
    },

    activateDashboard: function(guid, silent, stackContext) {
        //set dashboard in history but disable events so we don't activate the dashboard twice
        var params = new Object();
        if (stackContext) { params.stack = stackContext; }
        params.guid = guid;
        if (silent) {
            Ext.util.History.shutDown();
        }
        Ext.util.History.add(Ext.urlEncode(params));
        if (silent) {
            Ext.util.History.startUp();
        }
    },

    //this function is private, do not call outside of this class - use activateDashboard instead
    _activateDashboard: function(guid, stackContext) {
        var dashboardCardPanel = this.getDashboardCardPanel();
        if (!dashboardCardPanel) {
            return;
        }

        if (guid != null && guid != '') {
            //make the new dashboard active and visible
            var dashboardPanel = dashboardCardPanel.layout.setActiveItem(guid);
            
            if (dashboardPanel) {
                //save a reference
                this.activeDashboard = dashboardPanel;

                this.fireEvent(OWF.Events.Dashboard.CHANGED, guid);
                this.setDefaultDashboard(guid);
            }
        } else {
            var params = new Object();
            if (stackContext) {
                params.stack = stackContext;
                var stackDashGuids = [];
                if (this.dashboardStore.getCount() > 0) {
                    for (var i = 0, len = this.dashboardStore.getCount(); i < len; i++) {
                        var dashRecord = this.dashboardStore.getAt(i);

                        // Build an array of dashboard guids that are in the supplied stack context
                        if (stackContext && dashRecord.data.stack && dashRecord.data.stack.stackContext == stackContext) {
                            stackDashGuids.push(dashRecord.data.guid);
                        }
                    }
                }
                if (stackDashGuids.length > 0) {
                    // If a stack context was supplied, set active dashboard to first dashboard in stack
                    params.guid = stackDashGuids[0];
                    if (this.defaultDashboard) {
                        // If a default dashboard exists and is part of the stack, activate that one
                        for (var i = 0; i < stackDashGuids.length; i++) {
                            if (this.defaultDashboard.guid == stackDashGuids[i]) {
                                params.guid = stackDashGuids[i];
                                break;
                            }
                        }
                    }
                }
            }
            if (!params.guid) {
                if (guid == '') {
                    //no guid specified set to default
                    var defaultGuid = this.defaultDashboard.guid;
                    params.guid = defaultGuid;
                } else {
                    var prevGuid = this.activeDashboard.guid;
                    params.guid = prevGuid;
                    //todo remove this defer when there are events on dashboards
                    Ext.defer(Ozone.Msg.alert, 100, this, 
                        [Ozone.util.ErrorMessageString.invalidDashboard, this.activeDashboard.isdefault 
                        ? Ozone.util.ErrorMessageString.invalidDashboardMsg 
                        : Ozone.util.ErrorMessageString.invalidDashboardGotoDefaultMsg,
                        null, null, null, this.modalWindowManager]);
                }
            }
            if (params.guid) {
                Ext.util.History.add(Ext.urlEncode(params));
            }
        }
    },

    getBanner: function() {
        return this.getComponent('owfbanner');
    },

    getDashboardCardPanel: function() {
        return this.getComponent('dashboardCardPanel');
    },

    /*
     * the escape key has dual functionality.
     * From within a widget, it escapes the widget.
     * From within the container, it blurs
     * in order to reset the focus to the beginning
     */
    esc: function(key, evt, guid) {
        if (evt.fromWidget) {
            this.unfocusWidget(key, evt, guid);
        }
        else {
            this.getBanner().getBanner().focus();
        }
    },

    unfocusWidget: function(key, event, guid) {
        var widget = Ext.getCmp(guid), header;
        if (widget) {
            header = widget.tab ? widget.tab.header : widget.header;
            if(header) {
                header.titleCmp.focus();
            }
            else {
                this.getBanner().getBanner().focus();
            }
        }
    },

//    showCustomizeWindow: function() {
//        if(!this.customizeDashWindow) {
//            this.customizeDashWindow = Ext.widget('customizedashboardwindow', {
//                dashboardContainer: this
//            });
//        }
//        else {
//            this.customizeDashWindow.getComponent('customizeDashboardPanel').refresh();
//        }
//
//        this.customizeDashWindow.isVisible() ? this.customizeDashWindow.close() : this.customizeDashWindow.show();
//    },

    openDashboardMgr: function() {
        var winId = "user-manage-dashboards";
        var win = Ext.getCmp(winId);
        if (win) {
            win.show();
            return;
        }

        Ext.create('Ozone.components.window.DashboardsManager', {
            ownerCt: this,
            dashboardContainer: this,
            id: winId,
            itemId: winId,
            modal: true,
            border: false,
            bodyBorder: false
        }).show();
    },

    showCreateWindow: function() {
        var dashPanelHeight = this.getHeight();
        var dashPanelWidth = this.getWidth();
        var winHeight = (dashPanelHeight > 339) ? 330 : dashPanelHeight - 10;
        var winWidth = (dashPanelWidth > 559) ? 550 : dashPanelWidth - 10;
        var createNewDashboardWindowId = 'createNewDashboardWindowId';
        var win = Ext.getCmp(createNewDashboardWindowId);

        if (!win) {
            var createNewDashboardWindowConfig = {
                id: createNewDashboardWindowId,
                title: Ozone.layout.tooltipString.createDashboardTitle,
                ownerCt: this,
                constrain: Ext.isIE,
                constrainHeader: true,
                cls: "manageContainer",
                closeAction: 'destroy',
                draggable: true,
                items: [
                    {
                        xtype: 'owfCreateDashboardsContainer',
                        dashboardContainer: this,
                        winId: createNewDashboardWindowId
                    }
                ],
                width: winWidth + 20,
                height: winHeight,
                listeners: {
                    show: function(cmp) {
                        var newDashboardPanel = this.getComponent('createNewDashboardPanel');
                        var titleBox = newDashboardPanel.getComponent('titleBox');
                        titleBox.setRawValue('');

                        var importFileupload = newDashboardPanel.down('#importFileupload');
                        importFileupload.setRawValue('');
                        newDashboardPanel.refreshData();
                        if (newDashboardPanel.afterRenderInitComplete == false) {
                            newDashboardPanel.down('#viewCb').enable();
                            newDashboardPanel.down('#viewCb').validate();

                            var existViewCb = newDashboardPanel.down('#existViewCb');
                            existViewCb.reset();
                            existViewCb.disable();

                            importFileupload.reset();
                            importFileupload.disable();

                            newDashboardPanel.afterRenderInitComplete = true;
                        }

                        newDashboardPanel.focusTitleBox();
                        titleBox.clearInvalid();

                        this.setupFocus(titleBox.el, this.down('#cancelBtn').el);
                    }
                }
            };
            win = Ext.widget('managerwindow', createNewDashboardWindowConfig);
        }
        if (win.isVisible()) {
            win.close();
        }
        else {
            win.show();
        }
    },

    navigate: function(incr) {
        var cmp = this.getComponent('dashboardCardPanel');
        var layout = cmp.getLayout();
        var index = cmp.items.indexOf(layout.activeItem);
        index = index + incr;

        layout.activeItem.windowGroup.hideAll();

        if (index > 0 && index < cmp.items.getCount()) {
            layout.setActiveItem(cmp.items.get(index));
        }
    },

    initEventing: function() {
        Ozone.eventing.Container.init({

            //override getIframeId directly lookup iframe ids via ext components
            getIframeId:{
                fn: function(uniqueId) {
                    var widgetCmp = Ext.getCmp(uniqueId);
                    if (widgetCmp != null) {
                        var iframeCmp = widgetCmp.down('#widgetIframe');
                        if (iframeCmp != null) {
                            return iframeCmp.el.dom.id;
                        }
                    }
                },
                scope: this
            },

            //override getOpenedWidgets
            getOpenedWidgets:{
                fn: this.getOpenedWidgets,
                scope: this
            },

            //hook widgetEventingReady so loadTime may be captured per widget
            widgetEventingReady: {
                fn: function(sender, message) {
                    var initMessage = gadgets.json.parse(message);
                    if (initMessage.loadTime != null) {
                        var widgetCfg = gadgets.json.parse(initMessage.id);

                        var loadTimeCfg = {
                            id: widgetCfg.id,
                            msg: 'Loaded in ' + initMessage.loadTime + ' (ms)',
                            loadTime: initMessage.loadTime
                        };

                        //get widget display name
                        var activeWidgets = this.activeDashboard.stateStore;
                        if (activeWidgets != null) {

                            var wrec = activeWidgets.getById(widgetCfg.id);
                            if (wrec != null) {
                                loadTimeCfg.name = wrec.get('name');
                                loadTimeCfg.widgetGuid = wrec.get('widgetGuid');
                                this.sendLoadTime(loadTimeCfg);
                            }
                            else {
                                //widget is not in the store however it will be so attach a listener on add
                                activeWidgets.on({
                                    add : {
                                        fn : function(store, records, index) {
                                            var w = store.getById(widgetCfg.id);
                                            if (w != null) {
                                                loadTimeCfg.name = w.get('name');
                                                loadTimeCfg.widgetGuid = w.get('widgetGuid');
                                                this.sendLoadTime(loadTimeCfg);
                                            }
                                        },
                                        scope: this,
                                        single:true
                                    }
                                });
                            }
                        }
                    }
                },
                scope: this
            },
            onRoute: {
                fn: function(sender, subscriber, channel, message) {
                    var returnValue = false;

                    //if the sender or subscriber is the container then always let the message through
                    if (sender != '..' && subscriber != '..') {
                        //check if the sender and subscriber are on the same dashboard if so allow the message else deny it
                        var senderObj = Ozone.util.parseJson(sender);
                        var senderDashboard = this.findParentDashboard(senderObj.id);
                        var subscriberObj = Ozone.util.parseJson(subscriber);
                        var subscriberDashboard = this.findParentDashboard(subscriberObj.id);
                        if (senderDashboard != null && senderDashboard == subscriberDashboard) {
                            returnValue = true;
                        }
                    }
                    else {
                        returnValue = true;
                    }

                    return returnValue;
                },
                scope: this
            }
        });
        this.eventingContainer = Ozone.eventing.Container;

        OWF.IntentsContainer.init({
            onRoute:{
                fn:function (sender, intent, data, dest, container) {
                    var sendingId = Ozone.util.parseJson(sender).id;
                    var sendingCmp = Ext.getCmp(sendingId);
                    var intentConfig = sendingCmp.intentConfig;

                    //check for any saved preference that routes this intent
                    if (!dest || (dest.length != null && dest.length <= 0 )) {
                        if (intentConfig != null && intentConfig[owfdojo.toJson(intent)] != null) {
                            var intentConfigDest = intentConfig[owfdojo.toJson(intent)];

                            //check if dest widgets exists on the dashboard, if they all don't delete the data
                            var existsOnDashboardCount = 0;
                            for (var i = 0, len = intentConfigDest.length; i < len; i++) {
                                var destFrameId = intentConfigDest[i];
                                var destId = Ozone.util.parseJson(destFrameId).id;
                                if (this.activeDashboard.stateStore.indexOfId(destId) > -1) {
                                    existsOnDashboardCount++;
                                }
                            }

                            //only send if dest widgets are on the current dashboard
                            if (existsOnDashboardCount == intentConfigDest.length) {
                                //just send the intent if destination(s) is specified via saved intentConfig
                                container.send(sender, intent, data, null, intentConfigDest);
                                container.callback(intentConfigDest);

                                return;
                            }
                            else {
                                //remove data
                                delete intentConfig[owfdojo.toJson(intent)];
                            }
                        }

                        //handle opening launch menu and routing the intent
                        this.showLaunchMenuForIntents(intent, container, sender, data, sendingCmp);
                    }
                    else {
                        //todo handle error here if the widget doesn't exist
                        //just send the intent if destination(s) is specified
                        container.send(sender, intent, data, null, dest);
                        container.callback(dest);
                    }
                },
                scope:this
            }
        });
    },

    showLaunchMenuForIntents: function(intent, container, sender, data, sendingCmp) {
        var intentConfig = sendingCmp.intentConfig;

        //open launch menu
        var launchMenu = Ext.getCmp('widget-launcher');
        if (launchMenu) {

            //make sure the launch menu is visible
            if (!launchMenu.isVisible()) {
                launchMenu.show();
            }

            //dont load the launchMenu's widgetStore, this disables the searchPanel from causing a load as well
            launchMenu.disableWidgetStoreLoading(true);

            //reload main widgetStore to retreive new data
            this.widgetStore.load({
                scope: this,
                callback: function (records, operation, success) {
                    //refresh data
                    launchMenu.refreshOpenedWidgets();
                    launchMenu.clearSelections(true);

                    //now update the launch menu for choosing a dest widget(s) for intents
                    var infoPanelData = Ext.create('Ozone.data.WidgetDefinition', {
                        name: 'Please select a widget below',
                        description: 'Widgets below are filtered against Intent: ' + intent.action + ' ' + intent.dataType
                    });
                    launchMenu.updateInfoPanel(infoPanelData, false, true, false, false);
                    launchMenu.showIntentCheckBox = true;

                    //open the adv search panel
                    launchMenu.openOrCloseAdvancedSearch(true);

                    var intentsTree = launchMenu.searchPanel.down('#intentsTree');
                    var intentsTreeSelModel = intentsTree.getSelectionModel();
                    intentsTreeSelModel.setLocked(false);

                    //setting this tree selection for intent filtering
                    var rootNode = {
                        expanded: true,
                        children: [
                            {
                                text: intent.action,
                                expanded: true,
                                expandable: false,
                                children: [
                                    {
                                        text: intent.dataType,
                                        leaf: true
                                    }
                                ]
                            }
                        ]
                    };
                    intentsTree.setRootNode(rootNode);

                    //now select
                    var separator = '!@//@!';
                    intentsTree.selectPath(separator + 'Root' + separator + intent.action + separator + intent.dataType,
                                                'text', separator);

                    intentsTreeSelModel.setLocked(true);

                    launchMenu.disableWidgetStoreLoading(false);

                    //cleanup flags when the launch menu closes
                    launchMenu.on({
                        close: {
                            fn: function(cmp) {
                                intentsTreeSelModel.setLocked(false);
                            },
                            scope: this,
                            single: true
                        }
                    });

                    //explicitly filter by intents by passing this cfg to the search function
                    var filterCfg = {
                      intent: {
                         action: intent.action,
                         dataType: intent.dataType,
                         receive: true
                      }
                    };
                    launchMenu.searchPanel.search(filterCfg);

                    launchMenu.searchPanel.loadGroupStore();
                    launchMenu.showOpenedWidgetsView(true);
                    launchMenu.loadLauncherState();
                }
            });

            var deferredSendIntentListener = null;
            var noWidgetLaunchListener = null;

            var dashboardContainer = this;
            var widgetLaunchListener = {
                beforewidgetlaunch: {
                    fn:function (pane, model) {
                        var data = { intents: true };
                        model.set('launchData',gadgets.json.stringify(data));
                    }
                }, 
                afterwidgetlaunch:{
                    fn:function (widget, model, wasAlreadyLaunched) {
                        var id = widget.uniqueId;
                        var destIdString = '{\"id\":\"' + id + '\"}';
                        
                        !sendingCmp.intentConfig && ( sendingCmp.intentConfig = {} );
                        intentConfig = sendingCmp.intentConfig;

                        //the widget is already open, send intent immeditaly
                        if (wasAlreadyLaunched) {
                            container.send(sender, intent, data, null, destIdString);
                            //check if the intentcheckbox is checked if so save to intentConfig
                            if (launchMenu.getIntentCheckBoxValue()) {

                                if (intentConfig[owfdojo.toJson(intent)] == null) {
                                    intentConfig[owfdojo.toJson(intent)] = [];
                                }
                                intentConfig[owfdojo.toJson(intent)].push(destIdString);
                            }
                        }
                        //widget is not launched yet
                        else {

                            //create a listener function to send the intent once the launched widget
                            //and has registered to receive the intent
                            deferredSendIntentListener = function (i, destWidgetId) {
                                //send the data to the dest widgets only if intent and dest widget match
                                if (i != null && owfdojo.toJson(i) === owfdojo.toJson(intent)
                                        && destWidgetId === destIdString) {

                                    //send intent
                                    container.send(sender, intent, data, null, destIdString);
                                    //remove this listener now that the intent has been sent
                                    container.removeListener('onIntentsReady',
                                            deferredSendIntentListener,
                                            this);
                                    //check if the intentcheckbox is checked if so save to intentConfig
                                    if (launchMenu.getIntentCheckBoxValue()) {
                                        if (intentConfig[owfdojo.toJson(intent)] == null) {
                                            intentConfig[owfdojo.toJson(intent)] = [];
                                        }
                                        intentConfig[owfdojo.toJson(intent)].push(destIdString);
                                    }
                                }
                                //todo perhaps put a timer to timeout the intent, and remove the listener
                                //this would only need to be done if a widget was opened that never registered
                                //for the specified intent
                            };
                            //hook event that will fire when the dest widget is ready for the intent
                            container.addListener('onIntentsReady',
                                    deferredSendIntentListener,
                                    this
                            );
                        }
                        //fire callback to startActivity call once dest widgets have been identified
                        container.callback([destIdString]);

                        //widget has been launched set the intent checkbox to be hidden
                        launchMenu.showIntentCheckBox = false;

                        //a widget has been launched unhook our noWidgetLaunchListener
                        launchMenu.un(noWidgetLaunchListener);
                        
                        // remove the listener when finished because when launching new widgets in this pane
                        // the beforewidgetlaunch will continue to be hit if you don't.
                        dashboardContainer.un(widgetLaunchListener);
                    },
                    scope:this,
                    single:true
                }
            };
            this.on(widgetLaunchListener);

            //if the user didn't actually launch a widget remove the other listeners
            noWidgetLaunchListener = {
                noWidgetLaunched: {
                    fn: function() {
                        //unattach the listeners no widget will be launched
                        this.un(widgetLaunchListener);
                        if (deferredSendIntentListener != null) {
                            container.removeListener('onIntentsReady', deferredSendIntentListener, this);
                        }
                        //fire callback to startActivity
                        container.callback([]);
                        launchMenu.showIntentCheckBox = false;
                    },
                    scope: this,
                    single: true
                }
            };
            launchMenu.on(noWidgetLaunchListener);
        }
    },


    findParentDashboard:function (widgetId) {
        var dashboardCardPanel = this.getComponent('dashboardCardPanel');
        var parentDashboard = null;
        for (var i = 0; i < dashboardCardPanel.items.getCount(); i++) {
            var dashboard = dashboardCardPanel.items.getAt(i);
            if (dashboard.stateStore.getById(widgetId) != null) {
                parentDashboard = dashboard;
                break;
            }
        }
        return parentDashboard;
    },

    sendLoadTime : function(loadTimeCfg) {
        //send to server
        if (Ozone.config.sendWidgetLoadTimesToServer === true) {
            Ozone.util.Transport.send({
                url: Ozone.util.contextPath() + '/widgetLoadTime',
                method: 'POST',
                async: true,
                content: loadTimeCfg,
                onSuccess : function() {
                    //do nothing
                }
            });
        }

        //send to channel
        if (Ozone.config.publishWidgetLoadTimes === true) {
            var payload = gadgets.json.stringify(loadTimeCfg);
            Ozone.eventing.Container.publish('Ozone.eventing.widget.public', payload);
        }
    },

    getOpenedWidgets:function () {
        var returnValue = [];
        if (this.activeDashboard != null && this.activeDashboard.stateStore != null) {
            var recs = this.activeDashboard.stateStore.getRange();

            for (var i = 0; i < recs.length; i++) {
                var rec = recs[i].data;
                var widgetCmp = Ext.getCmp(rec.uniqueId);
                var widgetDefRec = this.widgetStore.getById(rec.widgetGuid);

                if (widgetDefRec != null) {
                    var widgetDef = widgetDefRec.data;
                    if (widgetDef != null && widgetCmp != null) {
                        var iframeCmp = widgetCmp.down('#widgetIframe');
                        if (iframeCmp != null) {
                            returnValue.push({
                                //kernel fields
                                id:rec.uniqueId,
                                name:rec.name,
                                url:widgetDef.url,
                                //kernel fields

                                //extra info
                                frameId:iframeCmp.id,
                                widgetGuid:rec.widgetGuid,
                                widgetName:widgetDef.name,
                                universalName: widgetDef.universalName
                            });
                        }
                    }
                }
            }
        }
        return returnValue;
    },

    startAutoSave: function() {
        if (this.autoSaveId) {
            clearInterval(this.autoSaveId);
        }
        this.autoSaveId = setInterval(Ext.bind(function() {
            if (this.autoSaveClear) {
                clearInterval(this.autoSaveId);
                this.autoSaveClear = false;
            }
            else
            if (this.autoSaveEnabled) {
                //get active dashboard and save it
                if (this.activeDashboard) {
                    Ext.getCmp(this.activeDashboard.id).saveToServer();
                }
            }
        }, this), this.pollingInterval);
    },

    deleteDashboards: function(dashboardsToDelete) {

        // -----------------------------------------------------------
        // Remove dashboards from all dashboard-related components.
        // Incoming argument is an array of dashboard guids to remove.
        // -----------------------------------------------------------

        var deleteCount = dashboardsToDelete.length;
        if (deleteCount == 0) {
            return;
        }

        var dashPanel = this.getDashboardCardPanel();

        // Remove dashboards contained in incoming array parameter.
        for (var i1 = 0; i1 < deleteCount; i1++) {

            // Remove from dashboard store.
            var dsIndex = this.dashboardStore.find('guid', dashboardsToDelete[i1]);
            if (dsIndex != -1) {
                // If default dashboard is deleted reset default to first dashboard.
                if (this.dashboardStore.getAt(dsIndex).get('isDefault') == true) {
                    this.dashboardStore.getAt(0).get('isDefault') == true;
                    this.activeDashboard = this.dashboards[0];
                    this.defaultDashboard = this.activeDashboard;
                }
                this.dashboardStore.removeAt(dsIndex);
            }

            // Remove from banner tabs and card layout.
            dashPanel.remove(dashboardsToDelete[i1]);

            // Remove from 'dashboards' array.
            for (var i3 = 0, dblen = this.dashboards.length; i3 < dblen; i3++) {
                if (this.dashboards[i3].id == dashboardsToDelete[i1]) {
                    this.dashboards.splice(i3, 1);
                    break;
                }
            }
        }

        this.destroyDashboardSwitcher();
    },

    updateDashboardsFromStore: function(storeRecords, callbackOptions, loadSuccess, dashboardGuidToActivate) {

        // ---------------------------------------------------------------------------------
        // Update all dashboard-related components with newly-refreshed dashboardStore data.
        // ---------------------------------------------------------------------------------
        var me = this;

        // Set default tab guid.
        var defaultTabGuid = storeRecords[0].get('guid');
        var stack = storeRecords[0].get('stack');
        var stackContext = stack ? stack.stackContext : null;

        // Clear 'this.dashboards' array.
        this.dashboards.length = 0;

        var dashPanel = this.getDashboardCardPanel();
        dashPanel.removeAll(true);
        
        this.destroyDashboardSwitcher();

        // Without the timeout, updateDashboardsFromStore causes problems when dashboards are restored 
        // because widget destruction is delayed by 100ms to prevent memory leaks.
        // Because of the delay, widgets on a dashboard get rerendered while previous ones haven't been destroyed.
        setTimeout(function () {
            // Update various dashboard-related components.
            for (var i1 = 0, len = storeRecords.length; i1 < len; i1++) {

                var dsRecord = storeRecords[i1];

                // Add dashboard object to local array.
                me.dashboards.push(me.createDashboardConfig(dsRecord));

                // Add dashboard to buffered card panel.
                var addedDash = dashPanel.add(me.dashboards[i1]);

                // Save default dashboard Guid and set active dashboard instance.
                if (dsRecord.get('isdefault')) {
                    defaultTabGuid = dsRecord.get('guid');
                    stack = dsRecord.get('stack');
                    stackContext = stack ? stack.stackContext : null;
                    me.activeDashboard = addedDash;
                    me.defaultDashboard = addedDash;
                }

            }
            // activate dashboard
            me._activateDashboard(dashboardGuidToActivate || defaultTabGuid); // Focus the default dashboard.
            me.activateDashboard(dashboardGuidToActivate || defaultTabGuid, true, stackContext);

        }, 200);
    },

    reloadDashboards: function() {
        // TODO improvment: only restored dashboards should be refresh and deleted dashboard be removed
        var me = this;
        me.dashboardStore.load({
            callback: function(records, options, success) {
                if (success == true) {
                    me.updateDashboardsFromStore(records, options, success);
                }
            }
        });
    },

    saveActiveDashboardToServer: function() {
        // only save if the active dashboard is in store
        // it may have been deleted
        if (this.dashboardStore.getById(this.activeDashboard.id)) {
            Ext.getCmp(this.activeDashboard.id).saveToServer(true, true, false);
        }
    },

    saveDashboard: function(json, createOrUpdate, success, failure) {
        var me = this;

        if (!failure) {
            failure = function() {
                Ozone.Msg.alert('Dashboard Manager', "Error creating or updating dashboard.", null, null, null, me.modalWindowManager);
                return;
            }
        }

        Ozone.pref.PrefServer.createOrUpdateDashboard({
            json: json,
            saveAsNew: createOrUpdate == 'create' ? true : false,
            onSuccess: function(json) {
                me.destroyDashboardSwitcher();
                me.dashboardCreated(json);
                success && success(json);

                me = null;
            },
            onFailure: failure
        });

    },

    createEmptyDashboard: function(type, setAsDefault) {

        // create a blank dashboard of the specified type and go to it

        var newGuid = guid.util.guid();

        var newJson = {
            "name": 'Untitled',
            "guid": newGuid,
            "isdefault": setAsDefault,
            "state": []
        };

        this.saveDashboard(newJson, 'create');

        // add to dashbaordStore

        var dash = {
            id: newGuid,
            itemId: newGuid,
            alteredByAdmin: 'false',
            guid: newGuid,
            isdefault: setAsDefault,
            name: 'Untitled',
            state: []
            //user:             userNameObj
        };
        this.dashboardStore.add(dash);

        return this.dashboardStore.getAt(this.dashboardStore.getCount() - 1);

    },

    createDashboard: function(model) {
        this.designDashboard(model, false);
    },

    editDashboard: function(model) {
        var dashboard = this.getDashboardCardPanel().getComponent(model.get('guid'));
        this.designDashboard(dashboard || model, dashboard ? true : false);
    },

    dashboardCreated: function(json) {
        // if it already exists in store return
        if(this.dashboardStore.getById(json.guid)) {
            return;
        }
        var dashboard = Ext.create('Ozone.data.Dashboard', json);
        this.dashboardStore.add(dashboard);

        // Add new dashboard object to local array.
        this.dashboards.push(this.createDashboardConfig(dashboard));

        // Add new dashboard to buffered card panel.
        var dashPanel = this.getDashboardCardPanel();
        return dashPanel.add(this.dashboards[this.dashboards.length - 1]);
    },

    designDashboard: function(dashboard, dashboardExists) {
        Ozone.KeyMap.disable();

        var banner = this.getBanner().getBanner(),
            me = this;

        if(banner.state !== 'docked') {
            banner.hide();
        }
        else {
            banner.el.mask();
        }

        var dashboardCardPanel = Ext.getCmp('dashboardCardPanel');
        var dashboardDesigner = Ext.widget('dashboarddesigner', {
            dashboardContainer: this,
            dashboard: dashboard || this.activeDashboard,
            dashboardStore: this.dashboardStore,
            dashboardExists: dashboardExists,
            renderTo: dashboardCardPanel.el,
            ownerCt: dashboardCardPanel
        });

        dashboardDesigner.on('destroy', function() {
            if(banner.state !== 'docked') {
                banner.show();
            }
            else {
                banner.el.unmask();
            }
            Ozone.KeyMap.enable();
        });
    },

    setDefaultDashboard: function(guid) {

        var newDefault = this.getDashboardCardPanel().getComponent(guid);
        if (newDefault && this.defaultDashboard != newDefault) {

            //set old dashboard as not default
            //todo remove using isdefault in favor of using the configRecord
            this.defaultDashboard.isdefault = false;
            this.defaultDashboard.configRecord.set('isdefault', false);
            this.defaultDashboard.configRecord.commit(true);

            //set newDefault
            newDefault.isdefault = true;
            newDefault.configRecord.set('isdefault', true);
            newDefault.configRecord.commit(true);
            this.defaultDashboard = newDefault;
        }
    },

    retrieveUpdatedWidgets: function() {
        //Ext.getCmp('launchMenuWindow').setLoading(true);
        this.widgetStore.load({
            scope:this,
            callback: function(wrecords, woptions, wsuccess) {
                if (wrecords.length >= 0) {
                    if (!wsuccess) {
                        Ozone.Msg.alert(Ozone.util.ErrorMessageString.retrieveUpdatedWidgets, Ozone.util.ErrorMessageString.retrieveUpdatedWidgetsMsg,
                            null, null, null, this.modalWindowManager);
                    }
                }
                else {
                    Ozone.Msg.alert(Ozone.util.ErrorMessageString.retrieveUpdatedWidgets, Ozone.util.ErrorMessageString.retrieveUpdatedWidgetsMsg,
                        null, null, null, this.modalWindowManager);
                }
                //Ext.getCmp('widget-launcher').loadLauncherState();
            }
        });
    },

    storeContains: function(widgetGuid) {
        var store = this.activeDashboard.stateStore;
        if (store) {
            return store.findRecord('widgetGuid', widgetGuid);
        }
        return null;
    },

    closeWidget: function(key, event, widgetInstanceId) {
        var activeWidget = widgetInstanceId ? Ext.getCmp(widgetInstanceId) : this.activeDashboard.getActiveWidget();
        activeWidget && activeWidget.close();
    },

    maximizeCollapseWidget: function(key, event, widgetInstanceId) {
        var activeWidget = widgetInstanceId ? Ext.getCmp(widgetInstanceId) : this.activeDashboard.getActiveWidget();
        activeWidget && activeWidget.pane.maximizeCollapseWidget(activeWidget);
    },

    minimizeExpandWidget: function(key, event, widgetInstanceId) {
        var activeWidget = widgetInstanceId ? Ext.getCmp(widgetInstanceId) : this.activeDashboard.getActiveWidget();
        activeWidget && activeWidget.pane.minimizeExpandWidget(activeWidget);
    },

    saveWidgetState: function(key, event, widgetInstanceId) {
        var widget = widgetInstanceId ? Ext.getCmp(widgetInstanceId) : this.activeDashboard.getActiveWidget();

        if (widget && widget.isFloating()) {
            widget.onStateChange();
        }
    },

    updateTitlesandBanner: function() {
        // Update widget titles with user-defined titles
        // and find out if there are marketplace widgets
        var hasMpWidget = false;
        var hasMetricWidget = false;
        var mpWidgets = [], mpWidget = null;
        var records = this.widgetStore.getRange();
        for (var i = 0; i < records.length; i++) {
            var newTitle = this.widgetNames[records[i].data.widgetGuid];
            if (newTitle) {
                records[i].data.name = newTitle;
            }
            if (records[i].data.widgetTypes[0].name == 'marketplace') {
                hasMpWidget = true;
                mpWidgets.push(records[i]);
            }
            if (records[i].data.widgetTypes[0].name == 'metric') {
                hasMetricWidget = true;
            }

        }
        //if we have a marketplace widget or marketplace config, tell the banner to add a button
        if (hasMpWidget
//              || (!!Ozone.config.marketplaceLocation)
                ) {
            if (mpWidgets.length == 1) { mpWidget = mpWidgets[0] }
            this.getBanner().addMarketplaceButton(mpWidget);
        }
        else {
            this.getBanner().removeMarketplaceButton();
        }

        if (hasMetricWidget) {
            this.getBanner().addMetricButton();
        }
        else {
            this.getBanner().removeMetricButton();
        }
    }

});
