Ext.define('Ozone.components.pane.TabbedPane', {
    extend: 'Ozone.components.pane.Pane',
    alias: ['widget.tabbedpane', 'widget.Ozone.components.pane.TabbedPane'],
    
    plugins: [
        new Ozone.plugins.pane.TabbedPane()
    ],
    
    activeWidget: null,

    layout: 'fit',
    componentCls: 'tabbedpane pane',

    type: 'tabbed',

    widgetCls: 'x-portlet',

    initComponent: function() {
        var me = this;

        me.tabPanel = Ext.widget('widgettabpanel', {
            cls: 'tab-dashboard-panel',
            enableTabScroll: true,
            layoutOnTabChange: true,
            deferredRender: true,
            defaults: {
                closable: true
            },
            autoScroll: false,
            border: false,
            split: false,
            activeTab: 0,
            listeners: {
                add: me.onTabWidgetAdd,
                tabchange: {
                    fn: function(tabPanel, card){
                        if(card.getIframeEl()) {
                            me.activateWidget(card, false, true);
                        }
                    }
                },
                scope: me
            }
        });

        me.items = [me.tabPanel];

        me.callParent(arguments);
    },

    // returns an array of widget components that are launched
    getWidgets: function () {
        var widgets = Ext.clone(this.tabPanel.items.items),
            stateStore = this.stateStore;

        //Append all the floating widgets
        for(var i = 0, len = stateStore.getCount(); i < len; i++) {
            if(stateStore.getAt(i).data.floatingWidget) {
                widgets.push(Ext.getCmp(stateStore.getAt(i).data.uniqueId));
            }
        }
        
        return widgets;
    },

    activateWidget: function(widget, showFocusFrame, focusIframe) {
        this.tabPanel.setActiveTab(widget);
        widget.focus(false, false, showFocusFrame, focusIframe);
        this.dashboard.updateActiveWidget(widget);

        return true;
    },

    launchPreviouslyOpenedWidgets: function() {
        this._launchingPreviouslyOpenedWidgets = true;
        var deferreds = this.launchWidgets(this.stateStore.data.items);
        delete this._launchingPreviouslyOpenedWidgets;

        // activate previously active tab
        this.tabPanel.setActiveTab(this.activeWidgetGuid);

        return deferreds;
    },

    launchWidget: function(model, x, y, instanceId, launchData, launchPosition) {
        var me = this,
            widgetCfg, widget;

        widgetCfg = me.createWidgetConfig(model, instanceId, launchData);
        
        widgetCfg = Ext.Object.merge(widgetCfg, {
            xtype: 'widgetpanel',

            x: 0,
            y: 0,
            zIndex: 0,
            active: model.get('active'),

            layout: 'fit',

            minimized: false,
            maximized: false,
            pinned: false,
            collapsed: false,
            frame: false,
            border: false,
            getFirstFocusableElement: function() {
                var tabbar = this.ownerCt.getTabBar();
                if (tabbar != null) {
                    return tabbar.getComponent(this.id);
                }
            },
            getBubbleTarget : function() {
                return me.tabPanel;
            },
            listeners: {
                render: me.onTabWidgetRender
            }
        });
        
        if(widgetCfg.active) {
            me.activeWidgetGuid = widgetCfg.id;
        }

        widget = Ext.isNumber(launchPosition) ? me.tabPanel.insert(launchPosition, widgetCfg) : me.tabPanel.add(widgetCfg);
        
        widget.on("statesave", function(obj, state) {
            this.defaultSettings.widgetStates = this.defaultSettings.widgetStates || {};
            this.defaultSettings.widgetStates[state.widgetGuid] = {
                "timestamp": Ext.Date.now()
            };
        }, this);

        // activate the widget to render it
        me.tabPanel.setActiveTab(widgetCfg.id);
        
        widget.fireEvent(
            'statesave',
            widget,
            {
                widgetGuid: widget.widgetGuid
            }
        );

        return widget.deferred.promise();
    },

    onTabWidgetRender: function(cmp) {
        cmp.headers = [cmp.tab.header];
        cmp.addDocked({
            xtype: 'focuscatch',
            dock: 'top',
            itemId: 'frontFocusCatch'
        });
    },

    onTabWidgetAdd: function(container, cmp, index) {
        function setupCircFocus() {
            cmp.tearDownCircularFocus();
            cmp.tab.tearDownCircularFocus();
            cmp.tab.getComponent('focusCatch').destroy();

            this.setupTabbedCircularFocus(cmp);
        }

        //wrong container, probably a bubbled event.
        //using the target option on this listener should
        //prevent this, but apparently doesn't
        if (container !== this.tabPanel)
            return;

        if (cmp.rendered)
            setupCircFocus.call(this);
        else
            //cmp should be a widgetpanel
            cmp.on('afterrender', function(cmp) {
                //remove the default circular focus and add
                //our own focus setup.  This needs to
                //be done in a defer because the initial setup
                //isn't done until afterrender
                Ext.defer(setupCircFocus, 1, this);
            }, this);
    },

    /*
     * Creates a tab-focus circle between the header and the widget
     */
    setupTabbedCircularFocus: function(widgetCmp) {
        var header = widgetCmp.tab,
            headerFocusable = header.getEl().select('*').filter(function(el) {
                return el.dom.tabIndex === 0;
            }),
            headerLast = Ext.get(header.getEl().select('.x-tool img').last().dom),
            headerFirst = Ext.get(header.getEl().select('.x-panel-header-text-container').first().dom),
            widgetFirst = widgetCmp.getComponent('frontFocusCatch').getEl(),
            widgetLast = widgetCmp.getComponent('focusCatch').getEl();

        widgetCmp.mon(widgetFirst, 'keydown', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === true) 
                widgetCmp.focusAndPrevent(evt, headerLast);
        });

        widgetCmp.mon(widgetLast, 'keydown', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === false) 
                widgetCmp.focusAndPrevent(evt, headerFirst);
        });

        widgetCmp.mon(headerFirst, 'keydown', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === true) 
                widgetCmp.focusAndPrevent(evt, widgetLast);
        });

        widgetCmp.mon(headerLast, 'keydown', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === false) 
                widgetCmp.focusAndPrevent(evt, widgetFirst);
        });


        //same as above, but for keypress
        widgetCmp.mon(widgetFirst, 'keypress', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === true) 
                widgetCmp.focusAndPrevent(evt, headerLast);
        });

        widgetCmp.mon(widgetLast, 'keypress', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === false) 
                widgetCmp.focusAndPrevent(evt, headerFirst);
        });

        widgetCmp.mon(headerFirst, 'keypress', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === true) 
                widgetCmp.focusAndPrevent(evt, widgetLast);
        });

        widgetCmp.mon(headerLast, 'keypress', function(evt) {
            if (evt.getKey() === evt.TAB && evt.shiftKey === false) 
                widgetCmp.focusAndPrevent(evt, widgetFirst);
        });
    },

    moveWidgetLeft: function(widget) {
        var noOfWidgets = this.tabPanel.items.getCount(),
            widgetIndex;

        for(var i = 0, len = noOfWidgets; i < len; i++) {
            if(widget === this.tabPanel.items.items[i]) {
                widgetIndex = i;
                break;
            }
        }

        if(widgetIndex !== 0) {
            this.reorderWidget(widget, widgetIndex - 1, widgetIndex);
        }
    },

    moveWidgetRight: function(widget) {
        var noOfWidgets = this.tabPanel.items.getCount(),
            widgetIndex;

        for(var i = 0, len = noOfWidgets; i < len; i++) {
            if(widget === this.tabPanel.items.items[i]) {
                widgetIndex = i;
                break;
            }
        }

        if(widgetIndex !== (noOfWidgets - 1)) {
            this.reorderWidget(widget, widgetIndex + 1, widgetIndex);
        }
    }
    
});