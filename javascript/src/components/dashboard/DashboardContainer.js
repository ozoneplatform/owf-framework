Ext.define('Ozone.components.dashboard.DashboardContainer', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboardContainer', 'widget.Ozone.components.dashboard.DashboardContainer'],

    plugins: new Ozone.plugins.DashboardContainer(),

    activeDashboard: null,
    previousActiveDashboard: null,
    dashboardMenuItems: null,

    dashboardStore: null,
    widgetStore: null,
    dashboards: null,
    autoSaveEnabled: true,

    layout: 'fit',
    refreshUrl: window.location,

    // current user
    user: null,

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

    //if set to true when the dashboard switcher is opened, the
    //dashboards will refresh before the switcher opens
    dashboardsNeedRefresh: false,

    // state of app component menu
    appComponentsViewState: null,

    MY_APPS_WINDOW_ID: 'my-apps-window',

    // private
    initComponent: function() {
        var me = this;

        this.loadMask = Ext.create('Ozone.components.mask.LoadMask', Ext.getBody(), {
            zIndexManager: this.modalWindowManager
        });

        this.reloadStacks();

        this.originalDashboardStore = Ext.create('Ozone.data.DashboardStore', {});
        this.dashboardMenuItems = [];
        this.dashboards = [];

        // eventing configuration
        this.initEventing();

        OWF.Container = OWF.Container || {};
        OWF.Container.Eventing = Ozone.eventing.Container;

        // initialize widget launcher
        OWF.Container.Launcher = new Ozone.launcher.WidgetLauncherContainer(OWF.Container.Eventing);
        this.addWidgetContainer = new Ozone.marketplace.AddWidgetContainer(OWF.Container.Eventing, this);
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
        OWF.Container.Chrome = new Ozone.chrome.WidgetChromeContainer({
            eventingContainer: OWF.Container.Eventing
        });

        // initialize widget state event container for receiving events
        OWF.Container.State = new Ozone.state.WidgetStateContainer(OWF.Container.Eventing);

        this.user = Ozone.config.user;
        this.widgetStore.on('datachanged', this.updateTitlesandBanner, this);

        //setup component properties
        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                //putting the banner as an actual child component because there are window contraining issues if the
                //banner is an actual docked toolbar
                {
                    itemId: 'owfbanner',
                    xtype: 'owfbanner',
                    user: this.user,
                    dashboardContainer: this
                }, {
                    id: 'dashboardCardPanel',
                    itemId: 'dashboardCardPanel',
                    xtype: 'panel',
                    flex: 1,
                    layout: {
                        type: 'dashboardbufferedcard'
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

        this.onBeforeUnload = function(evt) {
            if (this.activeDashboard != null) {
                Ext.getCmp(this.activeDashboard.id).saveToServer(true, true);
            }

            if(this.appComponentsView) {
                this.appComponentsView.save(true);
            }

            //tell History to shutdown cleanly because the browser is leaving OWFs
            if (!this.shareButtonClicked) {
                Ext.History.shutDown();
            } else {
                this.shareButtonClicked = false;
            }
        };

        //setup save on unload
        Ext.EventManager.on(window, 'beforeunload', this.onBeforeUnload, this);

        this.addKeyBindings();

        this.addEvents({
            dashboardChanged: true
        });

        // delegate all mousedown to document
        // enables moving widgets from one pane to another
        Ext.getDoc().on('mousedown', this.onWidgetMouseDown, this, {
            delegate: '.widgetheader'
        });

        this.updateTitlesandBanner();
        this.initLoad();

        this.setupDashboardChangeListeners();
        OWF.Collections.AppComponents.on('remove', this.removeAppComponent, this);

        this.setupUserListingCheckService();

        $(window).on('resize', function () {
            if(me.appComponentsView && me.appComponentsView.isHidden()) {
                 me._refreshAppComponent = true;
            }
        });
    },

    reloadStacks: function() {
        var model, dashboard, stack;
        var stackModels = {};
        this.stackStore = Ext.create('Ozone.data.StackStore', {});

        for (var i = 0, len = this.dashboardStore.getCount(); i < len; i++) {

            model = this.dashboardStore.getAt(i);

            dashboard = model.data;
            stack = dashboard.stack;

            if (stack) {
                if (stackModels[stack.id]) {
                    stackModels[stack.id].get('dashboards').push(model);
                } else {
                    var stackModel = this.stackStore.add(stack)[0];
                    // Set phantom to 'false' to overcome a quirk of ExtJS, which considers models with id of 0
                    // to be new (phantom = true).
                    stackModel.phantom = false;
                    stackModel.set('dashboards', [model]);

                    stackModels[stack.id] = stackModel;
                }
            }

        }
    },

    onWidgetMouseDown: function(evt, target) {
        var widgetEl, widgetId, targetEl, widget;

        if (evt.getTarget().nodeName === "IMG") {
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
        if (!widget.isWidget || widget.floatingWidget || this.activeDashboard.panes.length === 1) {
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
            widgetBox.midpoint = widget.tab ? widgetBox.x + (widgetBox.width / 2) : widgetBox.y + (widgetBox.height / 2);
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
                if (isFloating) {
                    // hide proxy for floating widgets
                    this.ddProxy.hide();
                } else { // allow reordering via drag and drop

                    this.ddProxy.show();

                    this._reorderingWidgets = true;

                    var widgetBox, overWidget;
                    var match = false,
                        eventPageX = xy[0],
                        eventPageY = xy[1];

                    for (var pos = 0, len = this._paneWidgets.length; pos < len; pos++) {
                        overWidget = this._paneWidgets[pos];
                        widgetBox = this._paneWidgetsBox[pos];

                        if (overWidget.tab) {
                            if (widgetBox.x < eventPageX && ((widgetBox.x + widgetBox.width) > eventPageX)) {
                                match = true;
                                break;
                            }
                        } else {
                            if (widgetBox.y < eventPageY && ((widgetBox.y + widgetBox.height) > eventPageY)) {
                                match = true;
                                break;
                            }
                        }

                    }

                    pos = (match && overWidget ? pos : this._paneWidgets.length);

                    if (this._lastDropIndicatedWidget) {
                        this._lastDropIndicatedWidget.el.removeCls.call(
                            this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el, ['indicate-drop-before', 'indicate-drop-after']);
                    }

                    if (pos === this._widgetToMove._position) {
                        // dont move as the widget hasn't been moved
                        this.ddProxy.setStatus(this.ddProxy.dropNotAllowed);
                    } else if (match) {

                        this._lastDropIndicatedWidget = this._paneWidgets[pos];

                        // var oldPos = pos;
                        var clsToAdd;

                        if ((overWidget.tab && widgetBox.midpoint > eventPageX) ||
                            (!overWidget.tab && widgetBox.midpoint > eventPageY)) {
                            //pos = pos === 0 ? 0 : pos - 1;
                            clsToAdd = 'indicate-drop-before';
                        } else {
                            pos = pos + 1;
                            clsToAdd = 'indicate-drop-after';
                        }

                        this._lastDropIndicatedWidget.el.addCls.call(
                            this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el,
                            clsToAdd);

                        this._movePosition = pos;

                        // if(overWidget.tab)
                        //     console.log(widgetBox.midpoint > eventPageX ? 'before' : 'after', pos, oldPos);
                        // else
                        //     console.log(widgetBox.midpoint > eventPageY ? 'before' : 'after', pos, oldPos);
                    }
                }
            } else {
                this.ddProxy.show();
            }
        } else {
            this._counter = 1;

            this.ddProxy = this.ddProxy || Ext.create('Ext.dd.StatusProxy', {
                shadow: false
            });
            this.ddProxy.update('<img src="' + this._widgetToMove.model.get('image') + '" class="widget-drag-proxy"/>');


            //TODO: investigate why I have to call show, hide and show
            this.ddProxy.show();
            this.ddProxy.hide();

            this.activeDashboard.enableWidgetMove(targetPane, true);
        }
    },

    onMouseUp: function(evt, target) {
        var targetPaneEl;

        if (this._lastDropIndicatedWidget) {
            this._lastDropIndicatedWidget.el.removeCls.call(
                this._lastDropIndicatedWidget.tab ? this._lastDropIndicatedWidget.tab.el : this._lastDropIndicatedWidget.el, ['indicate-drop-before', 'indicate-drop-after']);
        }

        Ext.getDoc().un('mousemove', this.onMouseMove, this);
        Ext.getDoc().un('mouseup', this.onMouseUp, this);

        if (this._movePosition && this._widgetToMove._position < this._movePosition)
            this._movePosition -= 1;

        if (this._reorderingWidgets && this._movePosition !== undefined && this._movePosition !== this._widgetToMove._position) {
            this._sourcePane.reorderWidget(this._widgetToMove, this._movePosition);
        } else if (this._widgetToMove && (targetPaneEl = Ext.fly(target).up('.pane'))) {
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

    showWidgetDragProxy: function (evt, widgetModel) {
        if(!evt) {
            return;
        }
        var template = Handlebars.compile(
            '<div class="widget">' +
                '<div class="thumb-wrap">' +
                    '<img onerror="this.src="themes/common/images/settings/WidgetsIcon.png"" src="{{image}}" class="thumb">' +
                '</div>' +
                '<div class="thumb-text ellipsis" style="word-wrap: break-word;">{{name}}</div>' +
            '</div>'
        );
        var $document = $(document),
            $dragProxy = $(template(widgetModel.attributes));

        function updateProxy (evt) {
            var pageX, pageY;

            pageX = evt instanceof Ext.EventObjectImpl ? evt.getPageX() : evt.pageX;
            pageY = evt instanceof Ext.EventObjectImpl ? evt.getPageY() : evt.pageY;

            $dragProxy.css({
                'z-index': 10000000,
                'position': 'absolute',
                'left': (pageX + 25) + 'px',
                'top': (pageY + 25) + 'px'
            });
            return $dragProxy;
        }

        $document
            .on('mousemove.dragProxy', updateProxy)
            .on('mouseup.dragProxy', function () {
                $dragProxy.remove();
                $document.off('dragProxy');
            });
        $('body').append(updateProxy(evt));
    },

    /*
     * Launches widget on the current dashboard.
     */
    launchWidgets: function(evt, widgetModel, isEnterPressed, isDragAndDrop) {
        var me = this;

        if(!isDragAndDrop && this.activeDashboard.panes.length > 1) {
            this.showWidgetDragProxy(evt, widgetModel);
        }

        return me.selectPane(isEnterPressed, isDragAndDrop).then(function(pane, e) {
            me.activeDashboard.launchWidgets(pane, null, e, {
                widgetModel: widgetModel
            });
        }, function() {
            var launchMenu = Ext.getCmp('widget-launcher');
            if (launchMenu) {
                launchMenu.fireEvent('noWidgetLaunched');
            }
        });
    },

    /*
     * Launches widget on a dashboard that user selects from Dashboard Switcher.
     */
    selectDashboardAndLaunchWidgets: function(evt, widgetModel, isEnterPressed) {
        var me = this;

        // Display dashboard switcher and launch widgets after the user selects a dashboard
        var dashboardSelectionPromise = me.selectDashboard();
        dashboardSelectionPromise.done(function(evt, dashboardId) {
            me.launchWidgets(evt, widgetModel, isEnterPressed);
        });

        // Show a notification with instructions for selecting a dashboard
        $.pnotify({
            title: Ozone.layout.DialogMessages.launchWidgetTitle,
            text: Ozone.layout.DialogMessages.launchWidgetAlert,
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
    },

    /*
     * Selects a Pane from the active dashboard.
     *
     * Returns: a promise object that will be resolved with
     * event and pane selected
     */
    selectPane: function(isUsingKeyboard, isDragAndDrop) {
        var me = this,
            deferred = jQuery.Deferred(),
            panes = this.activeDashboard.panes,
            doc = Ext.getDoc();

        // if one pane resolve right away only if not performing drag and drop
        if (panes.length === 1 && !isDragAndDrop) {
            deferred.resolve(panes[0]);
        } else {

            this.activeDashboard.enableWidgetMove(isUsingKeyboard === true && panes[0], isDragAndDrop);

            doc.on('keydown', this._selectPaneOnKeyDown, this, {
                capture: true,
                deferred: deferred
            });

            this.el.on('click', this._selectPaneOnClick, this, {
                deferred: deferred
            });
            this.el.on('mouseup', this._selectPaneOnClick, this, {
                deferred: deferred
            });

            // cleanup listeners when deferred is either resolved or rejected
            deferred.always(function() {
                me.activeDashboard.disableWidgetMove();

                doc.un('keydown', me._selectPaneOnKeyDown, me, {
                    capture: true
                });
                me.el.un('click', me._selectPaneOnClick, me);
                me.el.un('mouseup', me._selectPaneOnClick, me);
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

        if (key === Ext.EventObject.TAB) {
            if (e.shiftKey) {
                //Go back a pane
                if (this._previousPaneIndex === 0) {
                    nextPaneIndex = lastPaneIndex;
                } else {
                    nextPaneIndex = this._previousPaneIndex - 1;
                }
            } else {
                //Go forward a pane
                if (this._previousPaneIndex === lastPaneIndex) {
                    nextPaneIndex = 0;
                } else {
                    nextPaneIndex = this._previousPaneIndex + 1;
                }
            }
            panes[this._previousPaneIndex].blur();
            panes[nextPaneIndex].focus();

            this._previousPaneIndex = nextPaneIndex;
        } else if (key === Ext.EventObject.ENTER) {

            eOpts.deferred.resolve(panes[this._previousPaneIndex], e);
            delete this._previousPaneIndex;

        }
        //Enable ESC to cancel
        else if (key === Ext.EventObject.ESC) {
            eOpts.deferred.reject();
        }
    },

    /*
     * Manages pane selection using mouse.
     */
    _selectPaneOnClick: function(e, dom, eOpts) {
        var paneEl = Ext.get(dom).up('.pane'),
            deferred = eOpts.deferred;

        if (paneEl) {
            deferred.resolve(Ext.getCmp(paneEl.id), e);
        } else {
            deferred.reject();
        }
    },

    initLoad: function() {
        var me = this;

        var records = me.widgetStore.getRange();

        //see if the dashboard guid was specified on the hash
        var hashData = Ext.util.History.getToken();
        var data = hashData ? Ext.urlDecode(hashData) : {};
        var activeDashboardGuid = data.guid;
        var stackDashboards = [];
        var stackContext = data.stack;

       if (me.dashboardStore.getCount() > 0) {
            for (var i = 0, len = me.dashboardStore.getCount(); i < len; i++) {
                var dashRecord = me.dashboardStore.getAt(i);
                var dash = dashRecord.data;

                me.dashboards.push(me.createDashboardConfig(dashRecord));
                me.originalDashboardStore.add(Ext.JSON.decode(Ext.JSON.encode(dashRecord.data)));

                // Build an array of dashboards that are in the supplied stack context
                if (stackContext && dashRecord.data.stack && dashRecord.data.stack.stackContext == stackContext) {
                    stackDashboards.push(me.createDashboardConfig(dashRecord));
                }

                if (activeDashboardGuid != null) {
                    if (dash.guid == activeDashboardGuid) {
                        me.activeDashboard = me.dashboards[me.dashboards.length - 1];
                    }
                }
                if (dash.isdefault) {
                    me.defaultDashboard = me.dashboards[me.dashboards.length - 1];
                }

            }
        }

        if ((me.dashboards.length === 1 && me.dashboards[0].config.type === "marketplace") || me.dashboards.length === 0) {
            me.createEmptyDashboard('desktop', true, Ext.bind(function (record, dashboard) {
                continueInitLoad(dashboard);
            }, me));
            return;
        }

        // Set active dashboard
        if (me.activeDashboard == null) {

            // Couldn't find a dashboard based on guid
            if (stackDashboards.length > 0) {
                // If a stack context was supplied, set active dashboard to first dashboard in stack
                me.activeDashboard = stackDashboards[0];
                if (me.defaultDashboard) {
                    // If a default dashboard exists and is part of the stack, activate that one
                    for (var i = 0; i < stackDashboards.length; i++) {
                        if (me.defaultDashboard.guid == stackDashboards[i].guid) {
                            me.activeDashboard = stackDashboards[i];
                            break;
                        }
                    }
                }
                continueInitLoad(me.activeDashboard);
            } else {
                if (me.defaultDashboard != null) {
                    // Otherwise, set active dashboard to default dashboard
                    continueInitLoad(me.defaultDashboard);
                } else {
                    if (me.dashboards.length > 0) {
                        // Otherwise, just pick the first dash
                        continueInitLoad(me.dashboards[0]);
                    }
                    else {
                        // And if all else fails, create a new active dashboard
                        me.createEmptyDashboard('desktop', true, Ext.bind(function (dash) {
                            var dashModel = me.createDashboardConfig(Ext.create('Ozone.data.Dashboard', dash));

                            me.dashboards = [dashModel];
                            continueInitLoad(dashModel);
                        }, me));
                    }
                }
            }
        }
        else {
            continueInitLoad(me.activeDashboard);
        }

        /**
         * The second half of initLoad.  This is a separate function so that it can
         * execute asynchronously in the case that no dashboard exists and one needs to be created
         * and saved
         */
        function continueInitLoad(dash) {
            var currentUrlGuid;
            //OP-2174 - Fixes a problem where browser URL and activeDashboard guids don't match
            // TODO: Rewrite dashboard switcher so this can't happen
            if (Ext.util.History.getHash()) {
                currentUrlGuid = Ext.urlDecode(Ext.util.History.getHash()).guid;

                if (me.activeDashboard && currentUrlGuid === me.activeDashboard.guid) {
                    me.defaultDashboard = dash;
                }
                else {
                    me.defaultDashboard = me.activeDashboard = dash;
                }
            }
            else {
                me.defaultDashboard = me.activeDashboard = dash;
            }

            Ext.state.Manager.setProvider(Ext.create('Ozone.state.WidgetStateStoreProvider', {
                store: me.activeDashboard ? me.activeDashboard.stateStore : null
            }));

            //attach listener to change dashboard on # change
            Ext.util.History.on('change', function(hashData) {
                if (hashData != null) {

                    var data = Ext.urlDecode(hashData);
                    if (data.guid != null && data.guid != 'notFound') {
                        me._activateDashboard(data.guid, data.stack);
                    } else
                    if (data.guid == 'notFound') {
                        //guid was bad
                        me._activateDashboard(null, data.stack);
                    } else {
                        //no data specified on the hash -- pass empty string
                        me._activateDashboard('', data.stack);
                    }
                } else {
                    //goto the default dashboard
                    me._activateDashboard(me.defaultDashboard.guid, data.stack);
                }
            });

            var dashboardCardPanel = me.getComponent('dashboardCardPanel');

            me.toggleMarketplaceMenuOnDashboardSwitch(me.activeDashboard);

            var setupInitialDash = Ext.bind(function() {
                dashboardCardPanel.activeItem = me.activeDashboard.id;
                dashboardCardPanel.add(me.dashboards);

                me.activeDashboard = dashboardCardPanel.getComponent(me.activeDashboard.id);

                // add to buffer to keep removal consistent to respect cardBufferSize set
                dashboardCardPanel.layout.cardBuffer.add(me.activeDashboard);

                me.activateDashboard(me.activeDashboard.id, true, me.activeDashboard.stackContext);
                if (me.activeDashboard.configRecord.get('locked') || me.activeDashboard.configRecord.isMarketplaceDashboard()) {
                    me.getBanner().disableAppComponentsBtn();
                    me.getBanner().getUserMenuBtn().disableAdminMenuItem();
                    me.getBanner().getUserMenuBtn().disableMetricsMenuItem();
                } else {
                    me.getBanner().enableAppComponentsBtn();
                    me.getBanner().getUserMenuBtn().enableAdminMenuItem();
                    me.getBanner().getUserMenuBtn().enableMetricsMenuItem();
                }

                if (me.activeDashboard.configRecord.isMarketplaceDashboard()) {
                    me.getBanner().setMarketplaceToggle();
                }

            });

            if (dashboardCardPanel.isLayedOut) {
                //in case there are already some dashboards in there
                dashboardCardPanel.removeAll();

                setupInitialDash();
            } else {
                dashboardCardPanel.on({
                    afterlayout: {
                        fn: function() {
                            setupInitialDash();
                        },
                        scope: me,
                        single: true
                    }
                });
            }
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
        var widgetSwitcherId = 'widget-switcher',
            widgetSwitcher = Ext.getCmp(widgetSwitcherId);

        if (!widgetSwitcher) {
            widgetSwitcher = Ext.widget('widgetswitcher', {
                id: widgetSwitcherId,
                dashboardContainer: this,
                activeDashboard: this.activeDashboard,
                widgetStore: this.widgetStore,
                plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.WIDGET_SWITCHER)
            });
        } else if (widgetSwitcher.isVisible()) {
            widgetSwitcher.close();
            return;
        }
        widgetSwitcher.show();
        widgetSwitcher.activeDashboard = this.activeDashboard;
        widgetSwitcher.setStore(this.activeDashboard.stateStore);
        widgetSwitcher.center();
    },

    refreshAppComponentsView: function () {
        var me = this;

        var search_params = {
            limitParam: undefined,
            pageParam: undefined,
            startParam: undefined
        };

        return $.ajax('person/me').then(function (person) {
            if(me.appComponentsView) {
                var isVisible = me.appComponentsView.$el.is(':visible');

                // cache current state
                me.appComponentsViewState.preference = me.appComponentsView.getState();

                // remove
                me.appComponentsView.hide().remove();
                me.appComponentsView = null;

                // show if it was visible before removal
                isVisible && me.showAppComponentsView();
            }

            // update Ext Store
            me.widgetStore.loadRecords(me.widgetStore.proxy.reader.read(person.widgets).records);

            return person;
        });
    },

    showAppComponentsView: function () {
        var me = this,
            appComponentsBtn,
            state;

        if (me.activeDashboard.configRecord.get('locked') === true ||
            me.activeDashboard.configRecord.isMarketplaceDashboard()) {
            return;
        }

        if(!me.appComponentsView) {
            state = _.isString(this.appComponentsViewState.preference) ?
                        Ozone.util.parseJson(this.appComponentsViewState.preference) :
                        this.appComponentsViewState.preference;

            me.appComponentsView = new Ozone.components.appcomponents.AppComponentsView({
                collection: OWF.Collections.AppComponents,
                dashboardContainer: me,
                state: state
            });

            appComponentsBtn = me.getBanner().getComponent('appComponentsBtn');
            me.appComponentsView.$el.on('hide.toggle', function () {
                appComponentsBtn.toggle(false, true);
            });
            me.appComponentsView.$el.on('show.toggle', function () {
                appComponentsBtn.toggle(true, true);
            });

            $('#dashboardCardPanel').append(me.appComponentsView.render().el);
            me.appComponentsView.show().shown();
        }
        else {
            me.appComponentsView.toggle();

            if(me._refreshAppComponent) {
                me._refreshAppComponent = false;
                me.appComponentsView.refresh();
            }
        }
    },

    hideAppComponentsView: function () {
        if(this.appComponentsView) {
            this.appComponentsView.hide();
        }
    },

    showMyAppsWindowButtonHandler: function() {
        return this.showMyAppsWind(false);
    },

    showMyAppsWindToSelectForWidgetLaunch: function() {
        return this.showMyAppsWind(true, {
            title: '<strong>Click the App</strong> where you want the App Component to start'
        }).done(function (myAppsWindow) {
            var $el = $(myAppsWindow.body.dom);
            $el.children('.my-apps-window-descriptor').css('visibility', 'hidden');
            $el.children('.actions').css('visibility', 'hidden');
        });
    },

    showMyAppsWind: function(hideLockedDashboards, options) {
        var me = this,
            myAppsWindowId = this.MY_APPS_WINDOW_ID,
            myAppsWindow = Ext.getCmp(myAppsWindowId),
            myAppsWindowDeferred = $.Deferred(),

            //perform the logic of actually creating and displaying the window
            show = function() {

                // OP-1355
                // Re-render dashboard switcher and its elements
                // in case locked dashboards have to be hidden
                if (myAppsWindow) {
                    myAppsWindow.destroy();
                }

                myAppsWindow = Ext.widget('myappswindow', _.extend({}, options, {
                    id: myAppsWindowId,
                    dashboardContainer: me,
                    activeDashboard: me.activeDashboard,
                    dashboardStore: me.dashboardStore,
                    hideLockedDashboards: hideLockedDashboards,
                    plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.DASHBOARD_SWITCHER)
                }));

                myAppsWindow.activeDashboard = me.activeDashboard;
                myAppsWindow.show().center();
                myAppsWindowDeferred.resolve(myAppsWindow);

                me.loadMask.hide();
            };

        if(this.appComponentsView) {
            this.appComponentsView.hide();
        }

        // If it already is open, close it
        if (myAppsWindow && myAppsWindow.isVisible()) {
            myAppsWindow.close();
        } else {
            me.loadMask.show();

            //making this asynchronous helps the loading mask appear in a timely
            //manner in IE
            setTimeout(function() {
                // force dashboard save before showing dashboard switcher
                me.activeDashboard.saveToServer(false, true, false, function(){
                    //if necessary, refresh the dashboards before calling show
                    if (me.dashboardsNeedRefresh) {
                        if (myAppsWindow) {
                            myAppsWindow.destroy();
                            myAppsWindow = null;
                        }

                        me.dashboardsNeedRefresh = false;

                        me.reloadDashboards(show);
                    } else {
                        show();
                    }
                });


            }, 0);
        }
        return myAppsWindowDeferred.promise();
    },

    destroyMyAppsWindow: function() {
        var myAppsWindowId = this.MY_APPS_WINDOW_ID,
            myAppsWindow = Ext.getCmp(myAppsWindowId);

        myAppsWindow && myAppsWindow.destroy();
    },

    // Displays dashboard switcher and returns a promise which is resolved only after the user selects a dashboard
    // and it is activated.
    selectDashboard: function() {
        var me = this,
            dashboardActivatedDeferred = $.Deferred();

        // Show the switcher
        var myAppsWindowPromise = this.showMyAppsWindToSelectForWidgetLaunch();

        myAppsWindowPromise.done(function(myAppsWindow) {
            // Dashboard selection promise will resolve if a dashboard is selected in a switcher
            var dashboardSelectionPromise = myAppsWindow.getDashboardSelectionPromise();
            dashboardSelectionPromise.done(function(evt, dashboardGuid) {
                if (me.activeDashboard.guid === dashboardGuid) {
                    // The user selected the same dashboard
                    dashboardActivatedDeferred.resolve(evt, dashboardGuid);
                } else {
                    // The user selected different dashboard, wait for it becoming active
                    me.addListener(OWF.Events.Dashboard.CHANGED, function() {
                        dashboardActivatedDeferred.resolve(evt, dashboardGuid);
                    })
                }

            })

        });
        return dashboardActivatedDeferred.promise();
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

    activateDashboard: function(guid, silent, stackContext, forceActivation) {
        if(this.activeDashboard.guid != guid || forceActivation) {
            //set dashboard in history but disable events so we don't activate the dashboard twice
            var params = {};
            if (stackContext) {
                params.stack = stackContext;
            }
            params.guid = guid;
            if (silent) {
                Ext.util.History.shutDown();
            }
            Ext.util.History.add(Ext.urlEncode(params));
            if (silent) {
                Ext.util.History.startUp();
            }

            this.fireEvent(OWF.Events.Dashboard.SELECTED, guid);
        }
    },

    /**
     *
     * Activates previously selected dashboard.
     *
     **/
    activatePreviousDashboard: function() {
        var guid, stack, previousActiveDashboardModel;

        if (this.previousActiveDashboard && this.previousActiveDashboard !== this.activeDashboard) {
            previousActiveDashboardModel = this.previousActiveDashboard.configRecord;
        } else {
            // Sort in descending order by edited date
            // Sort on array to prevent store positions from being udpated
            var sortedDashboards = Ext.Array.sort(Ext.Array.pluck(this.dashboardStore.data.items, 'data'), function(a, b) {
                return ((new Date(b.editedDate).getTime()) - (new Date(a.editedDate).getTime()));
            });

            // If more than 1 dashboards are found, verify that we dont select the same dashboard to activate
            if (sortedDashboards.length >= 2) {
                if (sortedDashboards[0].guid === this.activeDashboard.guid) {
                    guid = sortedDashboards[1].guid;
                } else {
                    guid = sortedDashboards[0].guid;
                }
                previousActiveDashboardModel = this.dashboardStore.getById(guid);
            }
        }


        if (previousActiveDashboardModel) {
            stack = previousActiveDashboardModel.get('stack');
            guid = previousActiveDashboardModel.get('guid');

            this.activateDashboard(guid, false, stack ? stack.stackContext : null);
            return true;
        } else {
            return false;
        }
    },

    //this function is private, do not call outside of this class - use activateDashboard instead
    _activateDashboard: function(guid, stackContext) {
        var dashboardCardPanel = this.getDashboardCardPanel();
        if (!dashboardCardPanel) {
            return;
        }

        this.previousActiveDashboard = dashboardCardPanel.layout.getActiveItem();

        if (guid && guid !== '') {
            //make the new dashboard active and visible
            var dashboardPanel = dashboardCardPanel.layout.setActiveItem(guid);

            if (dashboardPanel) {
                //save a reference
                this.activeDashboard = dashboardPanel;

                this.toggleMarketplaceMenuOnDashboardSwitch(this.activeDashboard);

                // OP-772: blur iframe when switching dashboards.
                // Blur the focused element.
                // Only this approach worked; bluring the active iframe directly didn't.

                var activeEl = document.activeElement;

                // OP-1056: use small delay to avoid IE7/9 issue where browser is sent to the background
                if (activeEl) {
                    if (activeEl.nodeName.toLowerCase() != 'body') {
                        setTimeout(function() {
                            activeEl.blur();
                        }, 1);

                    } else {
                        setTimeout(function() {
                            $("input:focus, textarea:focus, select:focus").blur();
                        }, 1);
                    }
                }

                if (dashboardPanel.cssanimations) {
                    dashboardPanel.on(OWF.Events.Dashboard.SHOWN, function() {
                        var me = this;

                        setTimeout(function () {
                            me.fireEvent(OWF.Events.Dashboard.CHANGED, guid, dashboardPanel, me.previousActiveDashboard);
                        }, 0);
                    }, this, {
                        single: true
                    })
                } else {
                    this.fireEvent(OWF.Events.Dashboard.CHANGED, guid, dashboardPanel, this.previousActiveDashboard);
                }
                this.setDefaultDashboard(guid);
            }
        } else {
            var params = {};
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
                    params.guid = this.defaultDashboard.guid;
                } else {
                    params.guid = this.activeDashboard.guid;
                    //todo remove this defer when there are events on dashboards
                    Ext.defer(Ozone.Msg.alert, 100, this, [Ozone.util.ErrorMessageString.invalidDashboard, this.activeDashboard.isdefault ? Ozone.util.ErrorMessageString.invalidDashboardMsg : Ozone.util.ErrorMessageString.invalidDashboardGotoDefaultMsg,
                        null, null, null, this.modalWindowManager
                    ]);
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
        } else {
            this.getBanner().focus();
        }
    },

    unfocusWidget: function(key, event, guid) {
        var widget = Ext.getCmp(guid),
            header;
        if (widget) {
            header = widget.tab ? widget.tab.header : widget.header;
            if (header) {
                header.titleCmp.focus();
            } else {
                this.getBanner().focus();
            }
        }
    },

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
                items: [{
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
        } else {
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

    getPanes: function () {
        var panes = this.activeDashboard.panes;
        return _.map(panes, function (pane) {
            return pane.getPaneUIState();
        });
    },

    initEventing: function() {
        Ozone.eventing.Container.init({

            //override getIframeId directly lookup iframe ids via ext components
            getIframeId: {
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

            getPanes: _.bind(this.getPanes, this),

            //override getOpenedWidgets
            getOpenedWidgets: {
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
                            } else {
                                //widget is not in the store however it will be so attach a listener on add
                                activeWidgets.on({
                                    add: {
                                        fn: function(store, records, index) {
                                            var w = store.getById(widgetCfg.id);
                                            if (w != null) {
                                                loadTimeCfg.name = w.get('name');
                                                loadTimeCfg.widgetGuid = w.get('widgetGuid');
                                                this.sendLoadTime(loadTimeCfg);
                                            }
                                        },
                                        scope: this,
                                        single: true
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
                    } else {
                        returnValue = true;
                    }

                    return returnValue;
                },
                scope: this
            }
        });
        this.eventingContainer = Ozone.eventing.Container;

        OWF.IntentsContainer.init({
            onRoute: {
                fn: function(sender, intent, data, dest, container) {
                    var sendingId = Ozone.util.parseJson(sender).id;
                    var sendingCmp = Ext.getCmp(sendingId);
                    var intentConfig = sendingCmp.intentConfig;

                    //check for any saved preference that routes this intent
                    if (!dest || (dest.length != null && dest.length <= 0)) {
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
                            } else {
                                //remove data
                                delete intentConfig[owfdojo.toJson(intent)];
                            }
                        }

                        //handle opening launch menu and routing the intent
                        this.showIntentsWindow(intent, container, sender, data, sendingCmp);
                    } else {
                        //todo handle error here if the widget doesn't exist
                        //just send the intent if destination(s) is specified
                        container.send(sender, intent, data, null, dest);
                        container.callback(dest);
                    }
                },
                scope: this
            }
        });
    },

    showIntentsWindow: function(intent, container, sender, data, sendingCmp) {
        var me = this,
            intentConfig,
            deferredSendIntentListener,
            isRememberSelection = false,
            bodyEl = Ext.getBody(),
            maskEl = bodyEl.mask().addCls('intent-modal-mask');

        this.hideAppComponentsView();

        function onHide() {
            isRememberSelection = me.intentsWindow.isRememberSelection();

            me.intentsWindow.$el.off('hide', onHide);
            maskEl.un('click', onHide);
            bodyEl.unmask();
            setTimeout(function () {
                me.intentsWindow.remove();
                me.intentsWindow = null;
                Ozone.KeyMap.enable();
            }, 0);
        }

        maskEl.on('click', onHide);
        Ozone.KeyMap.disable();
        me._initIntentsWindow(intent).show();


        me.intentsWindow.$el
            .on('cancel', function () {
                me.intentsWindow.$el.off('cancel');

                //unattach the listeners no widget will be launched
                me.un(widgetLaunchListener);

                if (deferredSendIntentListener) {
                    container.removeListener('onIntentsReady', deferredSendIntentListener, me);
                }

                //fire callback to startActivity
                container.callback([]);
            })
            .on('hide', onHide);

        var widgetLaunchListener = {
            beforewidgetlaunch: {
                fn: function(pane, model) {
                    var data = {
                        intents: true
                    };
                    model.set('launchData', gadgets.json.stringify(data));
                },
                single: true
            },
            afterwidgetlaunch: {
                fn: function(widget, model, wasAlreadyLaunched) {
                    var id = widget.uniqueId;
                    var destIdString = '{\"id\":\"' + id + '\"}';

                    !sendingCmp.intentConfig && (sendingCmp.intentConfig = {});
                    intentConfig = sendingCmp.intentConfig;

                    function sendIntent () {
                        container.send(sender, intent, data, null, destIdString);
                        //check if the intentcheckbox is checked if so save to intentConfig
                        if (isRememberSelection) {

                            if (intentConfig[owfdojo.toJson(intent)] == null) {
                                intentConfig[owfdojo.toJson(intent)] = [];
                            }
                            intentConfig[owfdojo.toJson(intent)].push(destIdString);
                        }
                    }

                    //the widget is already open, send intent immeditaly
                    if (wasAlreadyLaunched) {
                        sendIntent();
                    }
                    //widget is not launched yet
                    else {

                        //create a listener function to send the intent once the launched widget
                        //and has registered to receive the intent
                        deferredSendIntentListener = function(i, destWidgetId) {
                            //send the data to the dest widgets only if intent and dest widget match
                            if (i != null && owfdojo.toJson(i) === owfdojo.toJson(intent) && destWidgetId === destIdString) {
                                sendIntent();
                                //remove this listener now that the intent has been sent
                                container.removeListener('onIntentsReady', deferredSendIntentListener, me);
                            }
                            //todo perhaps put a timer to timeout the intent, and remove the listener
                            //this would only need to be done if a widget was opened that never registered
                            //for the specified intent
                        };

                        //hook event that will fire when the dest widget is ready for the intent
                        container.addListener('onIntentsReady', deferredSendIntentListener, me);

                    }
                    //fire callback to startActivity call once dest widgets have been identified
                    container.callback([destIdString]);
                },
                single: true
            }
        };
        me.on(widgetLaunchListener);
    },

    _initIntentsWindow: function (intent) {
        var matchingOpenedAppComponents = this.activeDashboard.stateStore.findByReceiveIntent(intent);
        matchingOpenedAppComponents = _.map(matchingOpenedAppComponents, function (match) {
            var data = _.extend({}, match.data);
            data.image = match.get('image');
            return data;
        });

        var matchingAppComponents = OWF.Collections.AppComponents.findByReceiveIntent(intent);

        this.intentsWindow = new Ozone.components.appcomponents.IntentsWindow({
            matchingOpenedAppComponents: new Ozone.data.collections.Widgets(matchingOpenedAppComponents),
            matchingAppComponents: new Ozone.data.collections.Widgets(matchingAppComponents),
            dashboardContainer: this
        });
        $('body').append(this.intentsWindow.render().el);
        this.intentsWindow.shown();
        return this.intentsWindow;
    },

    _showIntentsWindow: function(intent, container, sender, data, sendingCmp) {
        var intentConfig = sendingCmp.intentConfig;

        //open launch menu
        var launchMenu = Ext.getCmp('widget-launcher');
        if (launchMenu) {

            //if the user didn't actually launch a widget remove the other listeners
            noWidgetLaunchListener = {
                noWidgetLaunched: {
                    fn: function() {

                    },
                    scope: this,
                    single: true
                }
            };
            launchMenu.on(noWidgetLaunchListener);
        }
    },


    findParentDashboard: function(widgetId) {
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

    sendLoadTime: function(loadTimeCfg) {
        //send to server
        if (Ozone.config.sendWidgetLoadTimesToServer === true) {
            Ozone.util.Transport.send({
                url: Ozone.util.contextPath() + '/widgetLoadTime',
                method: 'POST',
                async: true,
                content: loadTimeCfg,
                onSuccess: function() {
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

    getOpenedWidgets: function() {
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
                                id: rec.uniqueId,
                                name: rec.name,
                                url: widgetDef.url,
                                //kernel fields

                                //extra info
                                frameId: iframeCmp.id,
                                widgetGuid: rec.widgetGuid,
                                widgetName: widgetDef.name,
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
            } else
            if (this.autoSaveEnabled) {
                //get active dashboard and save it
                if (this.activeDashboard) {
                    Ext.getCmp(this.activeDashboard.id).saveToServer();
                }
            }
        }, this), this.pollingInterval);
    },

    deleteDashboards: function(dashboardsToDelete, destroyMyAppsWin) {

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

        if (destroyMyAppsWin !== false) {
            this.destroyMyAppsWindow();
        }
    },

    /**
     * Update all dashboard-related components with newly-refreshed
     * dashboardStore data.
     * @private
     * @param dashboardGuidToActivate GUID of dashboard to activate.
     * @param stackContextToActivate Context ID of stack to activate. Will
     * take precedence over dashboardGuidToActivate if found.
     */
    updateDashboardsFromStore: function(storeRecords, callbackOptions, loadSuccess, dashboardGuidToActivate, stackContextToActivate) {
        var me = this;
        var updateDeferred = $.Deferred();

        if (storeRecords.length === 0 || (storeRecords.length === 1 && storeRecords[0].get("type") === "marketplace")) {
            me.createEmptyDashboard('desktop', true, function () {
                me.updateDashboardsFromStore(
                    storeRecords, callbackOptions, loadSuccess,
                    dashboardGuidToActivate, stackContextToActivate).then(
                        function() {
                            updateDeferred.resolve();
                        }
                    );
            });

            return updateDeferred.promise();
        }

        // Set default tab guid.
        var defaultTabGuid = storeRecords[0].get('guid');
        var stack = storeRecords[0].get('stack');
        var stackContext = stack ? stack.stackContext : null;
        var dashboardGuidFound = false;

        // Clear 'this.dashboards' array.
        this.dashboards.length = 0;

        var dashPanel = this.getDashboardCardPanel();
        dashPanel.removeAll(true);

        this.destroyMyAppsWindow();

        // Without the timeout, updateDashboardsFromStore causes problems when dashboards are restored
        // because widget destruction is delayed by 100ms to prevent memory leaks.
        // Because of the delay, widgets on a dashboard get rerendered while previous ones haven't been destroyed.
        setTimeout(function() {
            var dashboards = [];

            // Update various dashboard-related components.
            for (var i1 = 0, len = storeRecords.length; i1 < len; i1++) {

                var dsRecord = storeRecords[i1];

                if (!dashboardGuidFound || stackContextToActivate) {
                    var recordStack = dsRecord.get('stack');
                    var recordGuid = dsRecord.get('guid');

                    // stackContextToActivate takes precedence over
                    // dashboardGuidToActivate
                    if (stackContextToActivate && recordStack &&
                        recordStack.stackContext &&
                        recordStack.stackContext === stackContextToActivate) {
                        // Force dashboard associated with target stack
                        dashboardGuidToActivate = recordGuid;
                        stackContext = stackContextToActivate;
                        dashboardGuidFound = true;

                        // Stop this check after first match
                        stackContextToActivate = null;
                    } else if (!dashboardGuidFound) {
                        dashboardGuidFound = dashboardGuidToActivate === recordGuid;

                        // OP-2799: Have to get the stack context from this
                        // record so the URL can change correctly to the new
                        // dashboard when activated
                        if (dashboardGuidFound) {
                            stackContext = recordStack ? recordStack.stackContext : null;
                        }
                    }
                }

                // Add dashboard object to local array.
                me.dashboards.push(me.createDashboardConfig(dsRecord));
                me.dashboards[i1].hidden = true; //start all dashboards hidden, the
                //active one will be shown later

                // Add dashboard to buffered card panel.
                var addedDash = dashPanel.add(me.dashboards[i1]);

                // Save default dashboard Guid and set active dashboard instance.
                if (dsRecord.get('isdefault')) {
                    defaultTabGuid = dsRecord.get('guid');
                    if (!dashboardGuidFound) {
                        stack = dsRecord.get('stack');
                        stackContext = stack ? stack.stackContext : null;
                    }
                    me.activeDashboard = addedDash;
                    me.defaultDashboard = addedDash;
                }

                // disable animations when rerendering deleted dashboards
                addedDash.disableCssAnimations();
                dashboards.push(addedDash);
            }

            // validate dashboardGuidToActivate
            dashboardGuidToActivate = dashboardGuidFound === true ? dashboardGuidToActivate : defaultTabGuid;

            // activate dashboard
            me._activateDashboard(dashboardGuidToActivate); // Focus the default dashboard.
            me.activateDashboard(dashboardGuidToActivate, true, stackContext, true);

            //If browser uses animations, enable them now that dashboards are added to card layout
            if (Modernizr.cssanimations) {
                for (var j = 0, len = dashboards.length; j < len; j++) {
                    dashboards[j].enableCssAnimations();
                }
            }

            updateDeferred.resolve();
        }, 200);

        return updateDeferred.promise();
    },

    /**
     * Reloads the dashboard store from the server.
     *
     * @param callback A callback function to execute when the
     * load is complete. This function is passed a boolean parameter
     * indicating whether or not the refresh was successful.
     * @param stackContextToActivate Context ID of stack to activate. If
     * null or not found the current dashboard will remain active.
     */
    reloadDashboards: function(callback, stackContextToActivate) {
        // TODO improvement: only restored dashboards should be refresh and deleted dashboard be removed
        var me = this;

        me.dashboardStore.load({
            callback: function(records, options, success) {
                me.reloadStacks();
                records = me.dashboardStore.data.items;

                var onCompletion = function() {
                    Ext.isFunction(callback) && callback(success);
                }

                if (success == true) {
                    me.updateDashboardsFromStore(
                        records, options, success,
                        me.activeDashboard.getGuid(),
                        stackContextToActivate).then(onCompletion);
                } else {
                    onCompletion();
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
                Ozone.Msg.alert('Dashboard Manager', "Error creating or updating page.", null, null, null, me.modalWindowManager);
                return;
            };
        }

        Ozone.pref.PrefServer.createOrUpdateDashboard({
            json: json,
            saveAsNew: createOrUpdate == 'create' ? true : false,
            onSuccess: function(json) {
                me.destroyMyAppsWindow();
                var dashboard = me.dashboardCreated(json);
                success && success(json, dashboard);

                me = null;
            },
            onFailure: failure
        });

    },

    createEmptyDashboard: function(type, setAsDefault, callback) {

        // create a blank dashboard of the specified type and go to it

        var newGuid = guid.util.guid();

        var newJson = {
            "name": 'Untitled',
            "guid": newGuid,
            "isdefault": setAsDefault,
            "state": [],
            "layoutConfig": Ozone.config.defaultLayoutConfig,
            "publishedToStore": true  //allow the user to get their own copy of the
                                    //dashboard
        };

        this.saveDashboard(newJson, 'create', callback);
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
        if (this.dashboardStore.getById(json.guid)) {
            return;
        }
        var dashboard = Ext.create('Ozone.data.Dashboard', json);
        this.dashboardStore.add(dashboard);

        // If the stack was created, add it to the store
        var stack = dashboard.get('stack');
        if (stack && stack.id && !this.stackStore.getById(stack.id)) {
            this.stackStore.add(stack);
        }

        // Add new dashboard object to local array.
        this.dashboards.push(this.createDashboardConfig(dashboard));

        // Add new dashboard to buffered card panel.
        var dashPanel = this.getDashboardCardPanel();
        return dashPanel.add(this.dashboards[this.dashboards.length - 1]);
    },

    designDashboard: function(dashboard, dashboardExists) {
        Ozone.KeyMap.disable();

        var banner = this.getBanner(),
            me = this;

        banner.el.mask();

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
            banner.el.unmask();
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
        //if we have a marketplace widget or marketplace config, tell the banner to add a button
        var mpWidgets = this.getMpWidgets();

        if (mpWidgets && mpWidgets.length > 0) {
            var singleWidget = (mpWidgets.length == 1) ? mpWidgets[0] : null;
            this.getBanner().addMarketplaceButton(singleWidget);
        } else {
            this.getBanner().removeMarketplaceButton();
        }

        if (this.hasMetricsWidget()) {
            this.getBanner().getUserMenuBtn().enableMetricsMenuItem();
        } else {
            this.getBanner().getUserMenuBtn().disableMetricsMenuItem();
        }
    },

    getMpWidgets: function() {
        return _.filter(this.widgetStore.getRange(), function(widget) {
            return (widget.data.widgetTypes.length > 0 && widget.data.widgetTypes[0].name === 'marketplace')
        });
    },

    hasMetricsWidget: function() {
        return Boolean(_.find(this.widgetStore.getRange(), function(widget) {
            return (widget.data.widgetTypes.length > 0 && widget.data.widgetTypes[0].name === 'metric')
        }));
    },

    /**
     * Adds eventing subscriptions to receive messages from the admin widgets indicating
     * that dashboards/stacks have been associated/dissociated from users or groups. If the
     * current user is part of what was changed, refresh the dashboards
     */
    setupDashboardChangeListeners: function() {
        var me = this;

        //WARNING: If, at some point in the future, there is a need in
        //some other place to receive AdminChannel info, care will need to be taken
        //not to override this listener
        OWF.Container.Eventing.subscribe('AdminChannel', function(sender, msg) {

            //stack or group dashboard editor used to assign to a user or group
            if (Ext.Array.contains(['Stack', 'Dashboard'], msg.domain)) {
                var records = msg.action.resultSet.records,
                    type = msg.action.params.tab,

                    //see if affected records include the current user
                    affectsUser = type === 'users' && Ext.Array.some(records, function(record) {
                                    return record.get('username') === Ozone.config.user.displayName;
                                });

                //if it is detected that a dashboard or stack may have been added removed from
                //the current user, refresh the dashboards.
                if (affectsUser) {
                    me.dashboardsNeedRefresh = true;
                }
            }
        });
    },

    toggleMarketplaceMenuOnDashboardSwitch: function(dashboard) {
        var btn = this.getBanner().getUserMenuBtn();

        if (dashboard.configRecord.isMarketplaceDashboard()) {
            btn.enableMarketplaceMenu();
        } else {
            btn.disableMarketplaceMenu();
        }
    },

    removeAppComponent: function (model, collection, options) {
        var me = this,
            appComponentGuid = model.get('widgetGuid');

        // if fetching collection, dont update or delete on server
        if(options.fetch) {
            removeAppComponents();
        }
        else {
            Ozone.pref.PrefServer.updateAndDeleteWidgets({
                widgetsToUpdate:[],
                widgetGuidsToDelete: [appComponentGuid],
                updateOrder:false,
                onSuccess: removeAppComponents,
                onFailure: $.noop
            });
        }

        function removeAppComponents () {
            var widgetStoreRecord = me.widgetStore.findRecord('widgetGuid', appComponentGuid),
                dashboardCardPanel = Ext.getCmp('dashboardCardPanel');

            me.widgetStore.remove(widgetStoreRecord);

            // Iterate through all the open dashboards
            dashboardCardPanel.items.each(function(dashboard) {
                // Access state store for each dashboard describing the state of the widgets running inside that dashboard
                dashboard.stateStore.each(function(widgetState) {
                    // Compare widget GUID to that of the one being removed
                    if (widgetState.get('widgetGuid') == appComponentGuid) {
                        // Remove the widget in question from its dashboard
                        var uniqueId = widgetState.get('uniqueId');
                        dashboard.closeWidget(uniqueId);
                    }
                });
            });
        }
    },

    /**
     * Reverts stack model change for given dashboard's parent stack
     * @param dashboardId
     */
    cancelStackChange: function(dashboardId) {
        var dashboardModel = this.dashboardStore.getById(dashboardId);
        if (dashboardModel) {
            var stackModel =  dashboardModel.get('stack');
            if (stackModel) {
                var stack = this.stackStore.getById(stackModel.id);
                stack.reject();
            }
        }
    },

    /**
     * Reverts dashboard model change
     * @param dashboardId
     */
    cancelDashboardChange: function(dashboardId) {
        var dashboardModel = this.dashboardStore.getById(dashboardId);
        if (dashboardModel) {
            dashboardModel.reject();
        }
    },

    /**
     * Register a private service that allows the Marketplace widget to
     * determine via RPC if a particular listing has already been added by
     * the current OWF user. This will save us a round trip to the server.
     * Searches for both Apps (formerly stacks) and App Components
     * (formerly widgets).
     */
    setupUserListingCheckService: function() {
        var me = this;

        var serviceName = '_MARKETPLACE_LISTING_CHECK';

        // "msg" must contain a "guid" string to lookup
        OWF.Container.Eventing.registerHandler(serviceName, function (msg) {
            var result = false;

            // Check all user Apps
            for (var i = 0, len = me.dashboardStore.getCount(); i < len; i++) {
                var model = me.dashboardStore.getAt(i).data;

                if (model.stack && model.stack.stackContext &&
                    model.stack.stackContext == msg.guid) {
                    result = true;
                    break;
                }
            }

            // Check all user App Components
            if(!result) {
                result = OWF.Collections.AppComponents.findWhere({widgetGuid: msg.guid}) != null;
            }

            return result;
        });
    }

});
