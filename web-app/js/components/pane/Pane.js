Ext.define('Ozone.components.pane.Pane', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.pane', 'widget.Ozone.components.pane.Pane'],
    
    plugins: [
        new Ozone.plugins.pane.Pane()
    ],
    
    activeWidget: null,

    id: null,
    paneGuid: null,
    dashboard: null,

    // required, is passed to the widgets rendered in this pane
    type: null,

    // to be overriden in each pane that extends this class
    // can be used to restore state
    afterWidgetLaunch: function() {},

    // to be overriden in each pane that extends this class
    launchWidget: function(model, x, y, instanceId, launchData, launchPosition) {},

    // maximize or collapse widget
    maximizeCollapseWidget: function (widget) {},

    // minimize or expand widget
    minimizeExpandWidget: function (widget) {},

    moveWidgetUp: function(widget) {},

    moveWidgetRight: function(widget) {},

    moveWidgetDown: function(widget) {},

    moveWidgetLeft: function(widget) {},
        
    initComponent: function() {
        var me = this,
            widgetStore = Ext.StoreManager.lookup('widgetStore'),
            widgetStates;
        
        me.id = me.paneGuid = guid.util.guid();
        me.statePositionCount = 0;
        me.widgets = me.widgets || [];
        me.defaultSettings = me.defaultSettings || {};
        me.componentCls = 'pane ' + me.xtype;


        widgetStates = me.widgets;
        // clearing widgets array 
        // check to see if the user still has access to the widget
        // sync Widget Definition model properties with Widget State model here
        me.widgets = [];
        for(var i = 0, len = widgetStates.length; i < len; i++) {
            var oldState = widgetStates[i];
            var widgetModel = widgetStore.getById(widgetStates[i].widgetGuid);

            if(widgetModel) {
                oldState.singleton = widgetModel.get('singleton');
                oldState.background = widgetModel.get('background');
                me.widgets.push(oldState);
            }
        }

        me.stateStore = Ext.create('Ozone.data.StateStore', {
            storeId: me.paneGuid,
            data: me.widgets
        });

        me.stateStore.on({
            add: {
                fn: me.onStoreAdd,
                scope: me
            },
            remove: {
                fn: me.onStoreRemove,
                scope: me
            }
        });
        
        me.addEvents(
            OWF.Events.Widget.BEFORE_LAUNCH,
            OWF.Events.Widget.AFTER_LAUNCH
        );
        me.enableBubble([OWF.Events.Widget.BEFORE_LAUNCH, OWF.Events.Widget.AFTER_LAUNCH]);

        me.on(OWF.Events.Widget.AFTER_LAUNCH, me.afterWidgetLaunch, me);
        me.on('destroy', me.onPaneDestroy, me);
        
        me.callParent(arguments);
    },
    
    afterRender: function() {
        this.el.set({
            tabIndex: -1
        });

        this.dashboard = this.up('dashboard');

        this.callParent(arguments);
    },

    onPaneDestroy: function() {
        // clear state store listeners on destroy
        this.stateStore.clearListeners();
        this.clearWidgets();
    },

    // destroy all widgets in the pane
    clearWidgets: function(includeFloatingWidgets) {
        var items = this.stateStore.data.items;
        
        for (var i = items.length - 1; i >=0; i--) {
            var rec = items[i];
            var widget = Ext.getCmp(rec.get('uniqueId'));
            if(widget && includeFloatingWidgets !== false) {
                widget.destroy();
            }
            else if(widget && widget.floatingWidget !== true) {
                widget.destroy();
            }
        }
    },

    // returns an array of widget components that are launched
    getWidgets: function () {
        var widgets = Ext.clone(this.items.items),
            stateStore = this.stateStore;

        //Append all the floating widgets
        for(var i = 0, len = stateStore.getCount(); i < len; i++) {
            if(stateStore.getAt(i).data.floatingWidget) {
                widgets.push(Ext.getCmp(stateStore.getAt(i).data.uniqueId));
            }
        }
        
        return widgets;
    },

    // returns the states of all widgets
    getStatesOfAllWidgets: function () {
        var state = [],
            widgets = this.getWidgets();

        for(var i = 0, len = widgets.length; i < len; i++) {
            state.push(widgets[i].getState());
        }
        for(var i = 0, len = this.stateStore.getCount(); i < len; i++) {
            if(this.stateStore.getAt(i).get('background')) {
                state.push(this.stateStore.getAt(i).data);
            }
        }
        return state;
    },

    // Launches a widget that can float in a pane or over the whole dashboard
    launchFloatingWidget: function(model, x, y, instanceId, launchData, isDesktop) {
        var me = this,
            widgetCfg, widget;

        // create default cfg object
        widgetCfg = me.createWidgetConfig(model, instanceId, launchData);

        // override default cfg
        widgetCfg = Ext.Object.merge(widgetCfg, {
            width: model.get('width'),
            height: model.get('height'),
            x: x ? x : model.get('x'),
            y: y ? y : model.get('y'),
            active: model.get('active') || true,
            floatingWidget: !isDesktop
        });
        
        // apply any pane specific default settings if new instance
        if (!model.data.uniqueId) {
            if (me.defaultSettings && me.defaultSettings.widgetStates && me.defaultSettings.widgetStates[widgetCfg.widgetGuid]) {
                var dflt = me.defaultSettings.widgetStates[widgetCfg.widgetGuid];
                widgetCfg = Ext.Object.merge(widgetCfg, {
                    width: dflt.width,
                    height: dflt.height
                });
                // apply default x,y coords if not drag and drop
                if (!x && !y) {
                    widgetCfg = Ext.Object.merge(widgetCfg, {
                        x: dflt.x,
                        y: dflt.y
                    });
                }
            }
        }

        // must do outside of merge to prevent from getting cloned into Ext.util.Animate object
        // must render floating windows to pane's body el to be able to shim each pane and get 
        // mousemove events be fired on pane instead of iframe if mouse is moved to fast
        widgetCfg.renderTo = isDesktop ? me.body : me.dashboard.body;

        // show widget
        widget = Ext.widget('widgetwindow', widgetCfg);

        // register with the floating widget zindexmanager so always on top of other widgets
        !isDesktop && this.dashboard.dashboardContainer.floatingWidgetManager.register(widget);
                
        widget.on("statesave", function(obj, state) {
            this.defaultSettings.widgetStates = this.defaultSettings.widgetStates || {};
            this.defaultSettings.widgetStates[state.widgetGuid] = {
                "x": obj.x,
                "y": obj.y,
                "height": state.height,
                "width": state.width,
                "timestamp": Ext.Date.now()
            };
        }, this);

        if(isDesktop) {
            // create taskbar item
            me.createTaskbarComponent(widget);

            // show widget if we are not currently launching widgets
            if(!me._launchingPreviouslyOpenedWidgets) {
                widget.show();
            }
            else {
                me._widgetCmps[ widget.id ] = widget;
            }
        }
        else {
            // register with the top zindexmanager so always on top of other widgets
            this.dashboard.dashboardContainer.floatingWidgetManager.register(widget);

            widget.show();
            widget.model.get('minimized') && widget.minimize();
        }
        
        return widget.deferred.promise();
    },

    // is called after dashboard layout is done
    // launches previously opened widgtets
    launchPreviouslyOpenedWidgets: function() {
        var deferreds;

        this._launchingPreviouslyOpenedWidgets = true;
        deferreds = this.launchWidgets(this.stateStore.data.items);
        delete this._launchingPreviouslyOpenedWidgets;

        return deferreds;
    },

    // launches an array of widgets
    // used when a drag and drop is performed from widget launch menu
    launchWidgets: function(models, x, y, launchPosition) {
        var widgetModel,
            deferreds = [];
        if(!models)
            return;
        
        models = [].concat(models);

        // null out negative x and y when using keyboard
        x = x > 0 ? x : null;
        y = y > 0 ? y : null;

        for(var i = 0, len = models.length ; i < len ; i++) {
            widgetModel = models[i];
            widgetModel = widgetModel.isModel ? widgetModel : Ext.create('Ozone.data.State', widgetModel);

            if(this.fireEvent(OWF.Events.Widget.BEFORE_LAUNCH, this, widgetModel) !== false) {
                if(widgetModel.get('floatingWidget')) {
                    deferreds.push(this.launchFloatingWidget(widgetModel, x, y, null, null, launchPosition));
                }
                else {
                    deferreds.push(this.launchWidget(widgetModel, x, y, null, null, launchPosition));
                }
                Ext.isNumber(launchPosition) && launchPosition++;
            }
        }

        return deferreds;
    },

    activateWidget: function(widget, showFocusFrame, focusIframe) {
        widget.focus(false, false, showFocusFrame, focusIframe);
        this.dashboard.updateActiveWidget(widget);

        return true;
    },

    createWidgetConfig: function(model, instanceId, launchData) {
        var me = this,
            widgetCfg;
        
        instanceId || (instanceId = model.get('uniqueId') || guid.util.guid());

        OWF.Container.State.registerHandler(instanceId);

        widgetCfg = {
            id: instanceId,
            itemId: instanceId,

            isWidget: true,

            model: model, // can be widget defination or state model (page refresh)
            pane: me,
            dashboard: me.dashboard,

            paneGuid: me.paneGuid,
            dashboardGuid: me.dashboard.id,
            uniqueId: instanceId,
            universalName: model.get('universalName'),
            widgetGuid: model.get('widgetGuid'),

            widgetStateContainer: this.widgetStateContainer,

            name: model.get('name'),
            title: model.get('name'),
            icon: encodeURI(decodeURI(model.get('headerIcon'))),
            
            singleton: model.get('singleton'),
            background: model.get('background'),

            statePosition: ++this.statePositionCount,

            launchData: launchData || model.get('launchData') || null,

            intentConfig: model.get('intentConfig') || null,

            deferred: $.Deferred(),

            listeners: {
                afterrender: {
                    fn: me.onWidgetRender,
                    options: {
                        single: true
                    }
                },
	            beforeclose: {
	            	fn: me.onBeforeClose,
	            	scope: me
	            }
            }
        };

        return widgetCfg;
    },

    cloneWidgetDataForTransfer: function (widget) {
        var data = Ext.clone(widget.model.data),
            widgetDefinitionModel = this.dashboard.widgetStore.findRecord('widgetGuid', widget.model.get('widgetGuid'));

        data.name = widget.title || widgetDefinitionModel.get('name');
        data.uniqueId = widget.id;
        data.intentConfig = widget.intentConfig;
        data.launchData = widget.launchData || null;
       
       return data;
    },

    reorderWidget: function (widget, newPosition, oldPosition) {
        var me = this,
            widgetStateModelData = me.cloneWidgetDataForTransfer(widget);

        widget.on('destroy', function () {
        	me._reorderingWidgets = true; 
            me.launchWidgets(widgetStateModelData, null, null, newPosition);
            delete me._reorderingWidgets;
        });
        widget.destroy();
    },
    
    onBeforeClose: function(obj) {
		if(this.dashboard.configRecord.get('locked') && !obj.floatingWidget) {
			Ozone.Msg.alert(Ozone.layout.DialogMessages.dashboardLockAlertTitle, Ozone.layout.DialogMessages.dashboardLockAlert,
                    null, null, null, this.dashboard.dashboardContainer.modalWindowManager);
			return false;
		}
		return true;
    },

    onWidgetRender: function() {
        // var me = this,
        //     task = new Ext.util.DelayedTask(function() {

                // fire afterwidgetlaunch launch event
                // arguments: widgetCmp
                this.pane.fireEvent(OWF.Events.Widget.AFTER_LAUNCH, this, this.model, false);

                this.add({
                    xtype: 'widgetiframe',
                    iframeProperties: OWF.Container.Eventing.getIframeProperties(
                        this.model.get('url'), this.id, this.model.data, this.pane.type, this.launchData, this.dashboard.configRecord.get('locked')
                    )
                });
                
                this.deferred.resolve(true);

                // focus iframe if this is a manual launch
                if( !(this.model instanceof Ozone.data.State) ) {
                    this.focus(false, false, false, true);
                }
                
        //     }, me);
        
        // task.delay(me.widgetIframeDelay || 1);
    },

    // We know that we want events to bubble directly to the dashboard.
    getBubbleTarget : function() {
        return this.dashboard;
    },

    onStoreRemove: function(store, model) {
        this.dashboard.hasChanged = true;
        this.dashboard.stateStore.remove(model);
    },

    onStoreAdd: function(store, model) {
        this.dashboard.hasChanged = true;
        this.dashboard.stateStore.add(model);
    },

    focus: function() {
        this.enableDrop();
        this.callParent(arguments);
    },

    blur: function() {
        this.disableDrop();
    },

    shim: function() {
        if(!this.shimEl) {
            this.shimEl = Ext.DomHelper.append(this.el, '<div></div>', true);
        }
        this.shimEl && this.shimEl.addCls('paneshim');
    },

    unshim: function() {
        this.shimEl && this.shimEl.removeCls('paneshim');
    },

    enableDrop: function() {
        this.shimEl && this.shimEl.addCls('highlight-dashboard-designer-drop');
    },

    disableDrop: function() {
        this.shimEl && this.shimEl.removeCls('highlight-dashboard-designer-drop');
    },

    enableWidgetMove: function() {
        this.shim();
        this.el.on('mousemove', this.enableDrop, this);
        this.el.on('mouseout', this.disableDrop, this);
    },

    disableWidgetMove: function() {
        this.unshim();
        this.disableDrop();
        this.el.un('mousemove', this.enableDrop, this);
        this.el.un('mouseout', this.disableDrop, this);
    },

    moveFloatingWidgetUp: function(widget) {
        widget && widget.moveUp();
    },

    moveFloatingWidgetRight: function(widget) {
        widget && widget.moveRight( widget.renderTo.getWidth() );
    },

    moveFloatingWidgetDown: function(widget) {
        widget && widget.moveDown( widget.renderTo.getHeight() );
    },

    moveFloatingWidgetLeft: function(widget) {
        widget && widget.moveLeft();
    }
});