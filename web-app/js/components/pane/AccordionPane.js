Ext.define('Ozone.components.pane.AccordionPane', {
    extend: 'Ozone.components.pane.Pane',
    alias: ['widget.accordionpane', 'widget.Ozone.components.pane.AccordionPane'],
    
    plugins: [
        new Ozone.plugins.pane.AccordionPane()
    ],
    
    activeWidget: null,

    defaults: {
        // applied to each contained panel
        xtype: 'widgetpanel',
        layout: 'fit',
        border: true
    },

    layout: {
        type: 'pinnableaccordion',
        animate: false,
        titleCollapse: false,
        fill: true,
        multi: true
    },

    type: 'accordion',

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
            //width: model.get('width'),
            height: model.get('height'),
            // x: x ? x : model.get('x'),
            // y: y ? y : model.get('y'),
            zIndex: model.get('zIndex'),
            active: model.get('active'),

            autoHeight: false,
            resizable: false,
            draggable: false,
            border: true,
            animCollapse: false,
            split: true,
            closable: true,

            collapsed: false
        });

        //widget = me.insert(Ext.isNumber(launchPosition) ? launchPosition : 0, widgetCfg);
        widget = Ext.isNumber(launchPosition) ? me.insert(launchPosition, widgetCfg) : me.add(widgetCfg);
        
        widget.on("statesave", function(obj, state) {
            this.defaultSettings.widgetStates = this.defaultSettings.widgetStates || {};
            this.defaultSettings.widgetStates[state.widgetGuid] = {
                "timestamp": Ext.Date.now()
            };
        }, this);
        
        widget.fireEvent(
            'statesave',
            widget,
            {
                widgetGuid: widget.widgetGuid
            }
        );
        
        return widget.deferred.promise();
    },
    afterWidgetLaunch: function(widgetCmp, widgetModel) {
        if(widgetModel.get('collapsed')) {
            widgetCmp.collapse();
        }
    },

    maximizeCollapseWidget: function (widget) {
        widget.collapse();
    },

    minimizeExpandWidget: function (widget) {
        widget.expand();
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