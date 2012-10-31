Ext.define('Ozone.components.pane.DesktopPane', {
    extend: 'Ozone.components.pane.Pane',
    alias: ['widget.desktoppane', 'widget.Ozone.components.pane.DesktopPane'],
    
    plugins: [
        new Ozone.plugins.pane.DesktopPane()
    ],
    
    activeWidget: null,
    componentCls: 'desktoppane pane',

    type: 'desktop',

    getTaskBar: function(){
        return this.getDockedItems('toolbar[dock="bottom"]')[0];
    },

    initComponent: function() {
        var me = this;

        this.dockedItems = [{
            xtype: 'widgettoolbar',
            itemId: 'taskbar',
            cls: 'taskbar',
            dock: 'bottom',
            layout: { 
                type: 'hbox',
                align: 'stretch',
                autoSize: false,
                clearInnerCtOnLayout: true,
                overflowHandler: 'Scroller',
                scollerResetPerformed: false
            },
            items: [],
            //height: 33,
            listeners: {
                resize: {
                    fn: me.attemptScrollerReset,
                    scope: me
                }
            }
        }];

        me.callParent(arguments);
    },

    // returns an array of widget components that are launched
    getWidgets: function () {
        var widgets = [],
            stateStore = this.stateStore;

        for(var i = 0, len = stateStore.getCount(); i < len; i++) {
            widgets.push(Ext.getCmp(stateStore.getAt(i).data.uniqueId));
        }
        
        return Ext.Array.clean(widgets);
    },
    
    activateWidget: function(widget) {
        if (widget.rendered === false || 
            (widget.rendered === true && widget.floating)) {

            widget.minimized === true ? widget.restoreFromMinimize() : widget.focus(false, false, true, true);
        }

        this.dashboard.updateActiveWidget(widget);
        return true;
    },

    launchPreviouslyOpenedWidgets: function() {
        var deferreds,
            firstWidget, previousWidget;

        this._launchingPreviouslyOpenedWidgets = true;
        this._widgetCmps = {};
        this._sortedUniqueIds = [];

        if(this.widgets.length > 0) {

            // sort by zIndex and store the order in a temp array
            // so that we can use it later to bring the widgets to 
            // foreground in the correct order
            this.stateStore.sort('zIndex', 'ASC');
            for(var i = 0, len = this.stateStore.getCount(); i < len; i++) {
                var record = this.stateStore.getAt(i);

                if(!record.get('floatingWidget') && !record.get('background')) {
                    this._sortedUniqueIds.push( record.get('uniqueId') );
                }
            }
            
            // sort by statePosition to render them in the order
            // widgets were launched by a user
            this.stateStore.sort('statePosition', 'ASC');
        }

        deferreds = this.launchWidgets(this.stateStore.data.items);

        for(var i = 0, len = this._sortedUniqueIds.length; i < len; i++) {
            var widgetCmp = Ext.getCmp( this._sortedUniqueIds[i] );

            // if widget wasn't launched
            if(!widgetCmp)
                continue;
            
            if(i === 0) {
                firstWidget = widgetCmp;
            }

            // show this widget after previous widget is shown
            if(previousWidget) {
                previousWidget.on('show', function(w) {
                    return function() {
                        showRestoreWidget(w);
                    }
                }(widgetCmp), null, { single: true });
            }
            previousWidget = widgetCmp;
        }

        if(firstWidget) {
            showRestoreWidget(firstWidget);
        }

        delete this._sortedUniqueIds;
        delete this._widgetCmps;
        delete this._launchingPreviouslyOpenedWidgets;

        return deferreds;

        function showRestoreWidget(widget) {
            widget.show();

            if(widget.model.get('minimized')) {
                widget.minimize();
            }
            else if(widget.model.get('maximized')) {
                widget.maximize();
            }
        }
    },

    launchWidget: function(model, x, y, instanceId, launchData) {
        this.launchFloatingWidget(model, x, y, instanceId, launchData, true);
    },

    createTaskbarComponent: function(widget) {
        //TODO: reduce the use of closure and create an Ext component to represent taskbar
        //item instead of using widgetpanel

        var windowTaskBarHandle = {
            title: widget.title,
            xtype: 'widgetpanel',
            width: 200,
            icon: widget.icon,
            widget: widget,
            itemId: widget.uniqueId,
            focusable: true,
            singleton: widget.singleton,
            active: widget.active,
            tools: [],
            listeners: {
                activate: {
                    fn: function(header) {
                        this.ownerCt.layout.overflowHandler.scrollToItem(header, true);
                    }
                },
                titlechange: {
                    fn: function(cmp, newtitle, oldtitle) {
                        this.widget.suspendEvents();
                        this.widget.setTitle(newtitle);
                        this.widget.resumeEvents();
                    }
                },
                afterrender: {
                    fn: function(cmp) {
                        //relay activate and deactive from the window to the taskbar headers
                        cmp.relayEvents(widget, ['activate','deactivate']);

                        cmp.on({
                            click: {
                                fn: function(e, t, o) {
                                    if (widget.rendered) {
                                        if (widget.minimized) {
                                            // console.log('restoring from taskbar');
                                            widget.restoreFromMinimize();
                                        }
                                        //don't waste an extra focus call here, if the widget is already active
                                        if (!widget.active) {
                                            widget.focus();
                                        }
                                    }
                                    else {
                                        widget.on({
                                            afterrender: {
                                                fn: function(cmp) {
                                                    if (cmp.minimized) {
                                                        cmp.restoreFromMinimize();
                                                    }
                                                    //don't waste an extra focus call here, if the widget is already active
                                                    if (!cmp.active) {
                                                        cmp.focus();
                                                    }
                                                }
                                            }
                                        });
                                        widget.show();
                                    }
                                },
                                element: 'el',
                                scope: this
                            }
                        });

                    },
                    scope: this
                }
            }
        };

        Ext.apply(windowTaskBarHandle.tools, {
            minimize: {
                type: 'minimize',
                itemId: 'minimize',
                hidden: widget.minimized,
                handler: function(evt, toolEl, panel, tool) {
                    evt.stopEvent();
                    widget.minimize();
                }
            },
            restore: {
                type: 'restore',
                itemId: 'restore',
                hidden: !widget.minimized,
                handler: function(evt, toolEl, panel, tool) {
                    evt.stopEvent();
                    if(widget.minimized)
                        widget.restoreFromMinimize();
                    else
                        widget.restore();
                }
            },
            maximize: {
                type: 'maximize',
                itemId: 'maximize',
                handler: function(evt, toolEl, panel, tool) {
                    evt.stopEvent();
                    if (widget.rendered) {
                        if (widget.minimized) {
                            widget.restoreFromMinimize();
                        }
                        widget.maximize();
                        widget.focus();
                    }
                    else {
                        widget.on({
                            afterrender: {
                                fn: function(cmp) {
                                    if (cmp.minimized) {
                                        cmp.restoreFromMinimize();
                                    }
                                    cmp.maximize();
                                    cmp.focus();
                                }
                            }
                        });
                        widget.show();
                    }
                }
            },
            close: {
                type: 'close',
                itemId: 'close',
                handler: function(event, toolEl, panel, tool) {
                    widget.close();
                }
            }
        });

        windowTaskBarHandle.tools.push(
            windowTaskBarHandle.tools.minimize,
            windowTaskBarHandle.tools.restore,
            windowTaskBarHandle.tools.maximize,
            windowTaskBarHandle.tools.close
        );

        var taskbar = this.getTaskBar();
        var windowTaskBarHandleCmp = taskbar.add(windowTaskBarHandle);

        //save applicable headers to widget
        if (widget.headers == null) {
            widget.headers = [];
        }
        if (widget.rendered) {
            widget.headers.push(widget.header);
        }
        else {
            widget.on({
                afterrender: {
                    fn: function(cmp) {
                        cmp.headers.push(widget.header);
                    },
                    single: true
                }
            });
        }

        widget.headers.push(windowTaskBarHandleCmp.header);

        widget.on('minimize', function(widget) {
            //var setFocus = widget.tools.minimize.isFocused() || this.tools.minimize.isFocused();

            //it is important to call show before hide because
            //show causes the overflow thing to recompute
            //which includes showing everything
            this.tools.restore.show();
            this.tools.maximize.show();
            this.tools.minimize.hide();

            // var restore = this.tools.restore;

            // if (setFocus) {
            //     //if overflowing, set focus to the wrench icon
            //     if (restore.isVisible())
            //         restore.focus();
            //     else
            //         this.getLayout().overflowHandler.menuTrigger.focus();
            // }

        }, windowTaskBarHandleCmp.header);

        widget.on('maximize', function(widget) {
            this.tools.restore.show();
            this.tools.maximize.hide();

        }, windowTaskBarHandleCmp.header);

        widget.on('restore', function (widget) {
            this.tools.minimize.show();

            if(widget.maximized) {
                this.tools.maximize.hide();
                this.tools.restore.show();
            }
            else {
                this.tools.maximize.show();
                this.tools.restore.hide();
            }
        }, windowTaskBarHandleCmp.header);

        widget.on('destroy', function(widget) {
            if(this.ownerCt) {
                this.ownerCt.ownerCt.attemptScrollerReset(this.ownerCt);
                this.ownerCt.remove(this);
            }
        }, windowTaskBarHandleCmp);

        widget.on('titlechange',function(widget, newtitle, oldtitle) {
            this.suspendEvents();
            this.setTitle(newtitle);
            this.resumeEvents();
        }, windowTaskBarHandleCmp);

        //taskbar.doLayout();
    },

    attemptScrollerReset: function(toolbar) {
        if (!toolbar.layout.scollerResetPerformed) {
            var scrollerElem = toolbar.layout.overflowHandler;
            if (scrollerElem != undefined) {
                var afterScroller = scrollerElem.afterScroller;
                var beforeScroller = scrollerElem.beforeScroller;
                if ((beforeScroller != undefined) && (afterScroller != undefined)) {
                    if ((!beforeScroller.isDisplayed()) && (!afterScroller.isDisplayed())) {
                        //Scroll to beginning, and no animation
                        scrollerElem.scrollTo(0, false);
                        toolbar.layout.scollerResetPerformed = true;
                    }
                }
                else {//First Rendering, adding scroll listener...
                    scrollerElem.on('scroll', function(scrollCmp, newPosition, animate){
                        this.layout.scollerResetPerformed = false;
                    }, toolbar);
                }
            }
        }
    },

    maximizeCollapseWidget: function (widget) {
        widget.minimized ? widget.restoreFromMinimize() : widget.maximize();
    },

    minimizeExpandWidget: function (widget) {
        widget.maximized ?  widget.restore() : widget.minimize();
    },

    moveWidgetUp: function(widget) {
        widget && widget.moveUp();
    },

    moveWidgetRight: function(widget) {
        widget && widget.moveRight( widget.renderTo.getWidth() );
    },

    moveWidgetDown: function(widget) {
        widget && widget.moveDown( widget.renderTo.getHeight() );
    },

    moveWidgetLeft: function(widget) {
        widget && widget.moveLeft();
    }
    
});