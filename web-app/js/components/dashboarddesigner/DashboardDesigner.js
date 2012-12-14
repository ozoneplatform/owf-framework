Ext.define('Ozone.components.dashboarddesigner.DashboardDesigner', {
    extend: 'Ext.container.Container',
    alias: [
        'widget.dashboarddesigner',
        'widget.Ozone.components.dashboarddesigner.DashboardDesigner'
    ],

    id: 'dashboard-designer',

    mixins: {
        circularFocus: 'Ozone.components.focusable.CircularFocus'
    },

    autoRender: true,
    dashboardContainer: null,
    dashboard: null,
    ownerCt: null,

    dashboardExists: false,
    dashboardStore: null,

    //layout: 'fit',
    height: '100%',
    floating: true,

    // array of all widgets for the dashboard
    // used when user removes all the panes by resetting dashboard
    allWidgets: null,
    
    buildItemsArray: function(cfg) {
        if(!cfg || !cfg.items)
            return;
        
        if(cfg.items.length === 0) {
            cfg.paneType = cfg.xtype;
            cfg.xtype = 'dashboarddesignerpane';

            if(cfg.widgets && cfg.widgets.length > 0) {
                this.allWidgets = this.allWidgets.concat(cfg.widgets);
            }
        }
        else {

            if(cfg.xtype === "dashboarddesignerpane") {
                cfg.xtype = 'container';
                cfg.layout = "fit";
                cfg.cls = '';
            }

            for(var i = 0, len = cfg.items.length; i < len; i++) {
                this.buildItemsArray(cfg.items[i]);
            }
        }

        return cfg;
    },
    
    initComponent: function() {
        var me = this,
            layoutConfig = me.dashboardExists ? me.dashboard.configRecord.get('layoutConfig'): me.dashboard.get('layoutConfig');

        me.locked = me.dashboardExists ? me.dashboard.configRecord.get('locked'): me.dashboard.get('locked');
        
        me.allWidgets = [];

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };

        me.items = [
            {
                itemId: 'dashboard-designer-working-area',
                id: 'dashboard-designer-working-area',
                xtype: 'dashboarddesignerworkingarea',
                flex: 3,
                layout: 'fit',
                items: me.buildItemsArray(layoutConfig ? Ext.clone(layoutConfig) : []),
                listeners: {
                    afterrender: {
                        fn: me.setupDropZone,
                        options: {
                            single: true
                        }
                    },
                    destroy: {
                        fn: me.cleanUp
                    }
                }
            },
            {
                xtype: 'dashboarddesignersidepanel',
                dashboardDesigner: me
            }
        ];

        me.callParent(arguments);

        me.down('dashboarddesignerbaselayout').on('viewready', me.setup, me, { single: true });
        me.on('baselayoutselected', me.enableKeyboardDesign, me);
        me.on('panelayouttypeselected', me.enableKeyboardDesign, me);

        Ext.EventManager.onWindowResize(me.resize, me);
    },

    setup: function() {
        var ddpanes = this.query('dashboarddesignerpane'),
            firstEl;

        this.dashboardContainer.dashboardDesignerManager.register(this);
        this.dashboardContainer.dashboardDesignerManager.bringToFront(this);

        if(ddpanes.length > 0)
            firstEl = ddpanes[0].el;
        else {
            var dom = this.down('dashboarddesignerbaselayout').el.query('.layout-type')[0];
            firstEl = Ext.get(dom);
        }

        var lastEl = this.down('#cancelBtn').getFocusEl();
        this.setupFocus(firstEl, lastEl);
    },

    resize: function() {
        this.doComponentLayout();
    },

    enableKeyboardDesign: function(view, record, item) {
        var me = this,
            workArea = this.down('dashboarddesignerworkingarea'),
            ddpanes = this.query('dashboarddesignerpane'),
            firstEl;
        
        // just after reset......or designing saved dashboard with no panes
        if(ddpanes.length === 0 || ddpanes.length === 1) {
            var target = ddpanes.length === 0 ? workArea : ddpanes[0];
            record.get('type') ? me.nest(target, record) : me.updatePaneType(target, record);
            return;
        }

        firstEl = ddpanes[0].el
        firstEl.focus();

        // disable resizing in keyboard selection mode
        for(var i = 0, len = ddpanes.length; i < len; i++) {
            var ddpane = ddpanes[i];
            ddpane.disableEditing();
        }

        workArea.setupFocus(firstEl, ddpanes[len-1].el);

        function enterHandler(evt, dom) {
            if(evt.getKey() === Ext.EventObject.ENTER) {
                if(record.get('type')) {
                    me.nest(dom, record);
                }
                else {
                    me.updatePaneType(dom, record);
                }
            }

            if(evt.getKey() === Ext.EventObject.ENTER || evt.getKey() === Ext.EventObject.ESC) {

                workArea.el.un('keyup', enterHandler);
                workArea.tearDownCircularFocus();

                // enable resizing panes via keyboard
                var ddpanes = me.query('dashboarddesignerpane');

                for(var i = 0, len = ddpanes.length; i < len; i++) {
                    var ddpane = ddpanes[i];
                    ddpane.enableEditing();
                }

                // focus selected item
                item.focus();
            }
        }

        workArea.el.on('keyup', enterHandler);
    },

    nest: function(target, record) {
        var layoutType = record.get('type'),
            targetCmp = Ext.getCmp(target.id),
            layoutClasses,
            layoutConfig,
            layoutClasses = record.get('classes'),
            ownerCt;

        if(!targetCmp)
            return;
        
        ownerCt = targetCmp.ownerCt;

        layoutConfig = {
            xtype: 'container',
            cls: layoutType + " " + (targetCmp.initialConfig.cls || ""),
            layout: {
                type: layoutType,
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'dashboarddesignerpane',
                    cls: layoutClasses[0],
                    flex: 1,
                    htmlText: '50%',
                    items: [],
                    widgets: targetCmp.isXType('dashboarddesignerworkingarea') ? this.allWidgets : targetCmp.initialConfig.widgets || [],
                    paneType: targetCmp.initialConfig.paneType || ""
                },
                {
                    xtype: 'dashboardsplitter'
                },
                {
                    xtype: 'dashboarddesignerpane',
                    cls: layoutClasses[1],
                    flex: 1,
                    htmlText: '50%',
                    items: [],
                    paneType: targetCmp.initialConfig.paneType || ""
                }
            ]
        };

        if(targetCmp.initialConfig.flex) {
            layoutConfig.flex = targetCmp.initialConfig.flex;
        }
        else if(targetCmp.initialConfig.width) {
            layoutConfig.width = targetCmp.initialConfig.width;
        }
        else if(targetCmp.initialConfig.height) {
            layoutConfig.height = targetCmp.initialConfig.height;
        }

        // if nest a pane, then remove it from its parent items array
        // and add new layout
        if(targetCmp.isXType('dashboarddesignerpane')) {
            for(var i = 0, len = ownerCt.initialConfig.items.length; i < len; i++) {
                if(ownerCt.initialConfig.items[i] === targetCmp.initialConfig) {
                    ownerCt.initialConfig.items[i] = layoutConfig;
                    break;
                }
            }

            ownerCt.remove(targetCmp);
            ownerCt.insert(i, layoutConfig);
        }
        else {

            // delete the widgets from target pane, they have been added to the first pane
            delete targetCmp.initialConfig.widgets;

            if(targetCmp.initialConfig.paneType) {
                targetCmp.el.removeCls(targetCmp.initialConfig.paneType);
            }

            // add layout
            targetCmp.add(layoutConfig);
        }

        // recreate circular focus as layout may have changed
        this.tearDownCircularFocus();
        this.setup();
    },

    updatePaneType: function(target, record) {
        var paneType = record.get('paneType'),
            cmp = Ext.getCmp(target.id),
            prevPaneType = cmp.initialConfig.paneType;

        //If a fitpane check if widgets will be lost from update, if so make the user confirm
        if(paneType === 'fitpane') {
            var widgets = [];
            if(cmp.isXType("dashboarddesignerworkingarea")) {
                //Was reset so use all widgets
                widgets = this.allWidgets;
            }
            else {
                widgets = cmp.initialConfig.widgets;
            }

            //Filter out the floating and background widgets
            var paneWidgets = [];
            for(var i = 0; widgets && i < widgets.length; i++) {
                if(!widgets[i].floatingWidget && !widgets[i].background) {
                    paneWidgets.push(widgets[i]);
                }
            }

            //If more than 1 non-floating widget, confirm since widgets will be lost
            if(paneWidgets.length > 1 && (cmp.isXType("dashboarddesignerworkingarea") 
                    || (prevPaneType !== null && prevPaneType !== 'fitpane'))) {
                this.confirmRemoveWidgets(cmp, paneWidgets);
            }
            else {
                cmp.el.replaceCls(cmp.initialConfig.paneType, paneType);
                cmp.initialConfig.paneType = paneType;
            }
        }
        else {
            cmp.el.replaceCls(cmp.initialConfig.paneType, paneType);
            cmp.initialConfig.paneType = paneType;
        }
    },

    confirmRemoveWidgets: function(cmp, paneWidgets) {
        var me = this,
            activeWidget = this.dashboard.activeWidget ? this.dashboard.activeWidget : paneWidgets[0];

        //Active widget cannot be a floating widget, if it is use the first
        activeWidget = activeWidget.floatingWidget ? paneWidgets[0] : activeWidget;

        //If an item on the side panel selected, refocus it, otherwise select the first item
        var focusOnClose = Ext.fly('dashboard-designer-side-panel').query('.x-item-selected')[0];
        if(!focusOnClose) {
            focusOnClose = Ext.fly('dashboard-designer-side-panel').query('.layout-type')[0];
        }

        Ext.widget('alertwindow', {
            title: 'Warning',
            html: '<p>You are about to set a single-widget Fit layout to a pane containing ' 
                + paneWidgets.length + ' widgets. On save, all widgets in the pane except for <i>' 
                + Ext.htmlEncode(activeWidget.name) + '</i> will be removed from the dashboard.</p><br/>'
                + '<p>Set to Fit layout and <b>permanently</b> remove the other widgets?</p>',
            width: 400,
            dashboardContainer: me.dashboardContainer,
            focusOnClose: focusOnClose,
            okFn: function() {
                cmp.el.replaceCls(cmp.initialConfig.paneType, 'fitpane');
                cmp.initialConfig.paneType = 'fitpane';

                var remainingWidgets = [];
                if(cmp.isXType("dashboarddesignerworkingarea")) {
                    remainingWidgets = me.allWidgets;
                }
                else {
                    remainingWidgets = cmp.initialConfig.items[0] 
                        ? cmp.initialConfig.items[0].widgets 
                        : cmp.initialConfig.widgets;
                }

                //Remove all widgets that aren't floating, background, or the active widget
                for(var i = 0; i < remainingWidgets.length; i++) {
                    var widget = remainingWidgets[i];
                    if(widget.floatingWidget !== true 
                            && widget.background !== true
                            && widget.uniqueId !== activeWidget.uniqueId) {
                        remainingWidgets[i] = null;
                    }
                }
                remainingWidgets = Ext.Array.clean(remainingWidgets);

                cmp.initialConfig.items[0] 
                    ? cmp.initialConfig.items[0].widgets = remainingWidgets 
                    : cmp.initialConfig.widgets = remainingWidgets;

                if(cmp.isXType("dashboarddesignerworkingarea")) {
                    me.allWidgets = remainingWidgets;
                }
            }
        }).show();
    },

    setupDropZone: function() {
        this.dropZone = new Ext.dd.DropZone(this.el, {
            ddGroup: 'dashboard-designer',

            getTargetFromEvent: function(e) {
                return e.getTarget('.droppable', 1);
            },

            // On entry into a target node, highlight that node.
            onNodeEnter : function(target, dd, e, data){
                Ext.fly(target).addCls('highlight-dashboard-designer-drop');
            },

            // On exit from a target node, unhighlight that node.
            onNodeOut : function(target, dd, e, data){ 
                Ext.fly(target).removeCls('highlight-dashboard-designer-drop');
            },

            // While over a target node, return the default drop allowed class which
            // places a "tick" icon into the drag proxy.
            onNodeOver : function(target, dd, e, data){ 
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            // On node drop we can interrogate the target to find the underlying
            // application object that is the real target of the dragged data.
            onNodeDrop : Ext.bind(this.ownerCt.onDrop, this.ownerCt)
        });
    },

    onDrop: function(target, dd, e, data) {
        var layoutType = data.draggedRecord.get('type'),
            paneType = data.draggedRecord.get('paneType');

        if(layoutType) {
            this.nest(target, data.draggedRecord);
        }
        else if(paneType) {
            this.updatePaneType(target, data.draggedRecord);
        }

        return true;
    },

    reset: function() {
        var cmp = this.getComponent('dashboard-designer-working-area'),
            paneType = cmp.initialConfig.paneType;
        
        cmp.removeAll(true);
        cmp.initialConfig.items = [];

        if(paneType)
            cmp.el.removeCls(paneType);

        // recreate circular focus as layout may have changed
        this.tearDownCircularFocus();
        this.setup();
    },

    save: function() {
        var me = this,
            workArea = me.getComponent('dashboard-designer-working-area'),
            cmp = workArea.items.get(0),
            dashboardLayoutConfig;

        if(cmp) {
            dashboardLayoutConfig = cmp.initialConfig;
        }
        else {
            // dashboard is reset or not customized
            dashboardLayoutConfig = {
                xtype: 'container',
                flex: 1,
                height: '100%',
                items: [],
                paneType: workArea.initialConfig.paneType || "",
                widgets: me.allWidgets
            };
        }

        delete dashboardLayoutConfig.itemId;

        if(me.dashboardExists) {
            if (!Ext.isIE) {
              //IE has issues when removing flex widgets - since we are reloading the browser anyway, just don't do this
              //step for IE
              me.dashboard.removeAll(true);
            }
            me.dashboard.configRecord.set('layoutConfig', dashboardLayoutConfig);
            me.dashboard.configRecord.set('locked', me.locked);

            me.dashboard.saveToServer(null, null, null, function() {
                //TODO revisit, reload can be worked around by manually updating Ext layout

                me.dashboardContainer.dashboardStore.load({
                    callback: function(records, options, success) {
                        if (success == true) {
                            me.dashboardContainer.updateDashboardsFromStore(records, options, success, me.dashboard.getGuid());
                        }
                    },
                    scope: me
                });
                
            });
        }
        else {
            me.dashboard.set('layoutConfig', dashboardLayoutConfig);
            me.dashboard.set('locked', me.locked);
            // Clear out the stack association on newly created dashboards.  At this time, fresh dashboard
            // instances should be unassigned to a stack including the case where we are copying from an existing dashboard.
            me.dashboard.set('stack', null);
            me.dashboardContainer.saveDashboard(me.dashboard.data, 'create', function() {

                // activate new dashboard
                var guid = me.dashboard.get('guid');
                me.dashboardContainer.activateDashboard(guid);
            });
        }

        me.cancel();
    },
    
    cancel: function() {
        Ext.EventManager.removeResizeListener(this.resize, this);
        this.destroy();
    },
    
    toggleDashboardLock: function() {
        var me = this,
            sidePanel = this.getComponent('dashboard-designer-side-panel'),
            lockButton = sidePanel.getComponent('dashboard-lock');
        
        if(!this.locked) {
            if (!this.dashboardContainer.suppressLockWarning) {
                //Must be instantiated first so it can be referenced as firstEl
//                var checkbox = Ext.widget('checkbox', {
//                    itemId: 'checkbox',
//                    boxLabel: 'Do not show this message again.'
//                });

                var alertWindow = Ext.widget('alertwindow', {
                    title: Ozone.layout.DialogMessages.dashboardLockTitle,
                    width: 500,
//                    layout: 'vbox',
                    dashboardContainer: me.dashboardContainer,
                    html: Ozone.layout.DialogMessages.dashboardLockWarning,

//                    items: [{
//                        xtype: 'component',
//                        flex: 1,
//                        html: Ozone.layout.DialogMessages.dashboardLockWarning
//                    }
////                        ,
////                        checkbox
//                    ],
                    focusOnClose: lockButton,
                    //firstEl: checkbox,
                    okText: Ozone.layout.MessageBoxButtonText.yes,
                    okFn: function() {
                        // set suppressMsg flag
                        //me.dashboardContainer.suppressLockWarning = checkbox.getValue();
                        
                        me.locked = true;
                        
                        // Toggle lock icon
                        var img = lockButton.el.down('img');
                        img.set({
                            src: "themes/common/images/dashboard-designer/LockON.png"
                        });
                    },
                    cancelText: Ozone.layout.MessageBoxButtonText.no,
                    cancelFn: function() {
                        // set suppressMsg flag
                        //me.dashboardContainer.suppressLockWarning = checkbox.getValue();
                    }
                });
                alertWindow.show().setZIndex(this.el.getStyle('z-index') + 10);
            } else {
                this.locked = true;
                
                // Toggle lock icon
                var img = lockButton.el.down('img');
                img.set({
                    src: "themes/common/images/dashboard-designer/LockON.png"
                });
            }
        } else { 
            this.locked = false;
            // Toggle lock icon
            var img = lockButton.el.down('img');
            img.set({
                src: "themes/common/images/dashboard-designer/LockOFF.png"
            });
        }
    },
    
    cleanUp: function() {
        this.dropZone.destroy();
    }
});