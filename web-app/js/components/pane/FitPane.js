Ext.define('Ozone.components.pane.FitPane', {
    extend: 'Ozone.components.pane.Pane',
    alias: ['widget.fitpane', 'widget.Ozone.components.pane.FitPane'],
    
    plugins: [
        new Ozone.plugins.pane.FitPane()
    ],
    
    activeWidget: null,

    layout: 'fit',
    componentCls: 'fitpane pane',

    type: 'fit',

    launchWidget: function(model, x, y, instanceId, launchData, launchFloating) {
        var me = this,
            widgetCfg;

        widgetCfg = me.createWidgetConfig(model, instanceId, launchData);

        if(me.items.getCount() > 0) {
            if(launchFloating) {
                this.launchFloatingWidget(model, null, null, instanceId, launchData);
            }
            else {
                this.confirmReplaceWidget(widgetCfg.id, widgetCfg.title, function() {
                    me.clearWidgets(false);

                    //Must defer for IE
                    Ext.defer(function() {
                        me.addWidget(widgetCfg, model)
                    }, 200);
                });
            }
        }
        else {
            me.addWidget(widgetCfg, model);
        }
    },

    addWidget: function(widgetCfg, model) {
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
                return this.getComponent('frontFocusCatch').getEl();
            },
            listeners: {
                render: function(cmp) {
                    //Create front focus catch required to replace the header
                    //for completing the circular focus chain around the widget iframe
                    cmp.addDocked({
                        xtype: 'focuscatch',
                        dock: 'top',
                        itemId: 'frontFocusCatch',
                        listeners: {
                            afterrender: {
                                fn: function(cmp) {
                                    cmp.mon(cmp.getEl(), 'focus', function() {
                                        this.showFocusFrame(cmp.getEl());
                                    }, this);
                                },
                                scope: this
                            }
                        }
                    });
                }
            }
        });
        
        if(widgetCfg.active) {
            this.activeWidgetGuid = widgetCfg.id;
        }

        widgetCfg.preventHeader = true;

        this.add(widgetCfg);
    },

    //Ask the user if they would like to replace the existing widget since the FitPane is full
    confirmReplaceWidget: function(widgetId, widgetTitle, okFn) {
        var me = this;
        Ext.widget('alertwindow', {
            title: 'Warning',
            html: '<p>' + Ozone.layout.DialogMessages.fitPaneFullWarning + '</p><br/>'
                + '<p>Replace <i>' + Ext.htmlEncode(this.items.get(0).title) + '</i> with <i>' 
                + Ext.htmlEncode(widgetTitle) + '</i>?</p>',
            width: 400,
            dashboardContainer: this.dashboard.dashboardContainer,
            okFn: okFn,
            cancelFn: function() {
                me.dashboard.activateWidget(widgetId);
            }
        }).show();
    }
});