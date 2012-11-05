Ext.define('Ozone.components.layout.PortalAnchor', {
    extend: 'Ext.layout.container.Anchor',
    alias: ['layout.portalanchor'],

    isValidParent : function(item, target, position) {
        var dom = item.el ? item.el.dom : Ext.getDom(item);
        if (dom && target && target.dom) {

            // Don't need to check for position in portal layout, this may change in the future

            // if (Ext.isNumber(position) && dom !== target.dom.childNodes[position]) {
            //     return false;
            // }

            return (dom.parentNode == (target.dom || target));
        }
        return false;
    }

});


Ext.define('Ozone.components.pane.PortalPane', {
    extend: 'Ozone.components.pane.Pane',
    alias: ['widget.portalpane', 'widget.Ozone.components.pane.PortalPane'],
    
    plugins: [
        new Ozone.plugins.pane.PortalPane()
    ],
    
    activeWidget: null,

    defaults: {
        // applied to each contained panel
        xtype: 'widgetportlet'
    },

    componentCls: 'portalpane pane',

    autoHeight: true,
    autoScroll: true,

    type: 'portal',

    widgetCls: 'x-portlet',

    layout: 'portalanchor',

    activateWidget: function(widget, showFocusFrame, focusIframe) {
        widget.rendered ? widget.expand() : widget.show();
        widget.focus(false, false, showFocusFrame, focusIframe);
        this.dashboard.updateActiveWidget(widget);
        return true;
    },

    launchWidget: function(model, x, y, instanceId, launchData, launchPosition) {
        var me = this,
            widgetCfg, widget;

        widgetCfg = me.createWidgetConfig(model, instanceId, launchData);
        widgetCfg = Ext.Object.merge(widgetCfg, {
            height: model.get('height'),
            width: '100%',
            x: 0,
            y: 0,
            zIndex: 0,
            active: model.get('active'),
            
            maximized: false,
            pinned: false,

            //layout: 'fit',

            collapsed: false
        });
        
        // apply any pane specific default settings if new instance
        if (!model.data.uniqueId) {
            if (me.defaultSettings && me.defaultSettings.widgetStates && me.defaultSettings.widgetStates[widgetCfg.widgetGuid]) {
                var dflt = me.defaultSettings.widgetStates[widgetCfg.widgetGuid];
                widgetCfg = Ext.Object.merge(widgetCfg, {
                    width: dflt.width,
                    height: dflt.height
                });
            }
        }

        //widget = me.insert(Ext.isNumber(launchPosition) ? launchPosition : 0, widgetCfg);
        widget = Ext.isNumber(launchPosition) ? me.insert(launchPosition, widgetCfg) : me.add(widgetCfg);
        
        widget.on("statesave", function(obj, state) {
            this.defaultSettings.widgetStates = this.defaultSettings.widgetStates || {};
            this.defaultSettings.widgetStates[state.widgetGuid] = {
                "height": state.height,
                "width": state.width,
                "timestamp": Ext.Date.now()
            };
        }, this);
        
        // to fix a bug in Ext, where it doesn't layout if scrollbars are added/removed
        widget.on({
            expand: me.layoutOnExpandCollapse,
            collapse: me.layoutOnExpandCollapse,
            destroy: me.layoutOnExpandCollapse,
            scope: me
        });
        
        widget.fireEvent(
            'statesave',
            widget,
            {
                widgetGuid: widget.widgetGuid,
                height: widget.height,
                width: widget.width
            }
        );
        
        return widget.deferred.promise();
    },

    afterWidgetLaunch: function(widgetCmp, widgetModel) {
        if(widgetModel.get('collapsed')) {
            widgetCmp.collapse();
        }
    },

    layoutOnExpandCollapse: function() {
        if(!this.destroying)
            this.doComponentLayout();
    },

    maximizeCollapseWidget: function (widget) {
        widget.toggleCollapse(true);
    },

    minimizeExpandWidget: function (widget) {
        widget.toggleCollapse(true);
    },

    moveWidgetUp: function(widget) {
        var noOfWidgets = this.items.getCount(),
            widgetIndex;

        for(var i = 0, len = noOfWidgets; i < len; i++) {
            if(widget === this.items.items[i]) {
                widgetIndex = i;
                break;
            }
        }

        if(widgetIndex !== 0) {
            this.reorderWidget(widget, widgetIndex - 1, widgetIndex);
        }
    },

    moveWidgetDown: function(widget) {
        var noOfWidgets = this.items.getCount(),
            widgetIndex;

        for(var i = 0, len = noOfWidgets; i < len; i++) {
            if(widget === this.items.items[i]) {
                widgetIndex = i;
                break;
            }
        }

        if(widgetIndex !== (noOfWidgets - 1)) {
            this.reorderWidget(widget, widgetIndex + 1, widgetIndex);
        }
    }
    
});