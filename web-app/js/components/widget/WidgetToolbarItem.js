Ext.define('Ozone.components.widget.WidgetToolbarItem', {
    extend: 'Ozone.components.widget.WidgetPanel',
    alias: ['widget.widgettoolbaritem', 'widget.Ozone.components.widget.WidgetToolbarItem'],
    
    width: 200,

    widget: null,
    focusable: true,

    initComponent: function () {
        var widget = this.widget;
        
        this.title = widget.title;
        this.icon = widget.icon;
        this.widget = widget;
        this.itemId = widget.uniqueId;
        this.singleton = widget.singleton;
        this.active = widget.active;

        this.tools = [{
                type: 'minimize',
                itemId: 'minimize',
                hidden: widget.minimized,
                handler: function(evt, toolEl, panel, tool) {
                    evt.stopEvent();
                    widget.minimize();
                }
            },
            {
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
            {
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
            {
                type: 'close',
                itemId: 'close',
                handler: function(event, toolEl, panel, tool) {
                    widget.close();
                }
            }
        ];

        this.listeners = {
            activate: this.onToolbarItemActivate,
            titlechange: this.onToolbarItemTitleChange,
            click: {
                fn: this.onToolbarItemClick,
                element: 'el',
                scope: this
            }
        };


        //relay activate and deactive from the window to the taskbar headers
        this.relayEvents(widget, ['activate','deactivate']);

        widget.on({
            minimize: {
                fn: this.onWidgetMinimize,
                scope: this.header
            },
            maximize: {
                fn: this.onWidgetMaximize,
                scope: this.header
            },
            restore: {
                fn: this.onWidgetRestore,
                scope: this.header
            },
            destroy: {
                fn: this.onWidgetDestroy,
                scope: this
            },
            titlechange: {
                fn: this.onWidgetTitleChange,
                scope: this
            }
        });

        this.callParent(arguments);
    },

    onToolbarItemActivate: function(header) {
        this.ownerCt.layout.overflowHandler.scrollToItem(header, true);
    },

    onToolbarItemClick: function  (e, t, o) {
        var widget = this.widget;

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
                afterrender: this.onWidgetAfterrender
            });
            widget.show();
        }
    },

    onToolbarItemTitleChange: function (cmp, newtitle, oldtitle) {
        this.widget.suspendEvents();
        this.widget.setTitle(newtitle);
        this.widget.resumeEvents();
    },

    onWidgetTitleChange: function (widget, newtitle, oldtitle) {
        this.suspendEvents();
        this.setTitle(newtitle);
        this.resumeEvents();
    },

    onWidgetAfterrender: function (cmp) {
        if (cmp.minimized) {
            cmp.restoreFromMinimize();
        }
        //don't waste an extra focus call here, if the widget is already active
        if (!cmp.active) {
            cmp.focus();
        }
    },

    onWidgetMinimize: function () {
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
    },

    onWidgetMaximize: function  () {
        this.tools.restore.show();
        this.tools.maximize.hide();
    },

    onWidgetRestore: function (widget) {
        this.tools.minimize.show();

        if(widget.maximized) {
            this.tools.maximize.hide();
            this.tools.restore.show();
        }
        else {
            this.tools.maximize.show();
            this.tools.restore.hide();
        }
    },

    onWidgetDestroy: function () {
        if(this.ownerCt) {
            this.ownerCt.ownerCt.attemptScrollerReset(this.ownerCt);
            this.ownerCt.remove(this);
        }
    }

});
