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
    
    activateWidget: function(widget, showFocusFrame, focusIframe) {
        if (widget.rendered === false || 
            (widget.rendered === true && widget.floating)) {

            widget.minimized === true ? widget.restoreFromMinimize(showFocusFrame) : widget.focus(false, false, showFocusFrame, focusIframe);
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
        var windowTaskBarHandleCmp = this.getTaskBar().add({
            xtype: 'widgettoolbaritem',
            widget: widget
        });

        widget.fireEvent('toolbaritem:created', windowTaskBarHandleCmp);
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