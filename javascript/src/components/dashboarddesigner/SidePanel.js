Ext.define('Ozone.components.dashboarddesigner.SidePanel', {
    extend: 'Ext.container.Container',

    alias: [
        'widget.dashboarddesignersidepanel',
        'widget.Ozone.components.dashboarddesigner.SidePanel'
    ],

    id: 'dashboard-designer-side-panel',

    dashboardDesigner: null,
    
    initComponent: function() {
        var me = this;

        me.items = [
            {
                xtype: 'tbtext',
                text: '<p style="padding:5px;font-size:11px;">Click or drag dividers to divide the layout</p>'
            },
            {
                xtype: 'dashboarddesignerbaselayout',
                listeners: {
                    viewready: {
                        fn: me.setupFocus
                    },
                    enterpress: {
                        fn: me.baseLayoutSelected,
                        scope: me
                    },
                    buttonclick: {
                        fn: me.baseLayoutClicked,
                        scope: me
                    },
                    mouseover: {
                        fn: me.mouseOver,
                        scope: me
                    },
                    mouseout: {
                        fn: me.setToDefaultImage,
                        scope: me
                    },
                    mousedown: {
                        fn: me.mouseDown,
                        scope: me
                    },
                    mouseup: {
                        fn: me.mouseOver,
                        scope: me
                    }
                }
            },
            {
                xtype: 'tbtext',
                text: '<p style="padding:5px;font-size:11px;" style="padding-top:5px;">Click or drag layouts to change a pane\'s layout</p>'
            },
            {
                xtype: 'dashboarddesignerlayouttype',
                listeners: {
                    enterpress: {
                        fn: me.baseLayoutSelected,
                        scope: me
                    },
                    buttonclick: {
                        fn: me.baseLayoutClicked,
                        scope: me
                    },
                    mouseover: {
                        fn: me.mouseOver,
                        scope: me
                    },
                    mouseout: {
                        fn: me.setToDefaultImage,
                        scope: me
                    },
                    mousedown: {
                        fn: me.mouseDown,
                        scope: me
                    },
                    mouseup: {
                        fn: me.mouseOver,
                        scope: me
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Reset',
                handler: me.dashboardDesigner.reset,
                scope: me.dashboardDesigner
            },
            {
                xtype: 'component',
                itemId: 'dashboard-lock',
                cls: 'dashboard-lock',
                tpl: [
                    '<img src="{image}"></img>',
                ],
                data: {
                    image: me.dashboardDesigner.locked ? "themes/common/images/dashboard-designer/LockON.png" : "themes/common/images/dashboard-designer/LockOFF.png"
                },
                listeners: {
                    afterrender: {
                        fn: function(cmp) {
                            var me = this;

                            cmp.el.on('mouseover', function() {
                                cmp.tip = Ext.create('Ext.tip.ToolTip', {
                                    target: cmp.el,
                                    trackMouse: true,
                                    mouseOffset: [0,10],
                                    renderTo: cmp.ownerCt.el,
                                    width: 85,
                                    html: me.dashboardDesigner.locked ? "Page locked" : "Page unlocked",
                                    listeners: {
                                        beforeshow: {
                                            fn: function updateTipBody(tip) {
                                                var text = me.dashboardDesigner.locked ? "Page locked" : "Page unlocked";
                                                tip.update(text);
                                            }
                                        }
                                    }
                                });
                                cmp.tip.show();
                            }, null, {
                                single: true
                            });

                            Ozone.components.focusable.Focusable.setupFocus(cmp.el, this);

                            var keymap = new Ext.util.KeyMap(cmp.el, {
                                key: [Ext.EventObject.ENTER],
                                fn: function (key, evt) {
                                    // required for IE, focus goes back to active widget for some reason
                                    evt.stopEvent();

                                    me.dashboardDesigner.toggleDashboardLock(me.dashboardDesigner);
                                },
                                scope: cmp
                            });

                            cmp.el.on('click', me.dashboardDesigner.toggleDashboardLock, me.dashboardDesigner);

                            this.on('beforedestroy', function () {
                                cmp.el.un('click', me.dashboardDesigner.toggleDashboardLock, me.dashboardDesigner);
                                cmp.tip && cmp.tip.destroy();
                                keymap.destroy();
                            });
                        },
                        scope: this
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Save',
                handler: me.dashboardDesigner.save,
                scope: me.dashboardDesigner
            },
            {
                itemId: 'cancelBtn',
                xtype: 'button',
                text: 'Cancel',
                handler: me.dashboardDesigner.cancel,
                scope: me.dashboardDesigner
            }
        ];

        me.addEvents(
            'baselayoutselected',
            'baselayoutclicked'
        );
        me.enableBubble(['baselayoutselected','baselayoutclicked', 'mouseover','mouseout']);
        me.callParent(arguments);
    },

    getBubbleTarget: function() {
        return this.up('dashboarddesigner');
    },

    baseLayoutSelected: function(view, record, item) {
        this.fireEvent('baselayoutselected', view, record, item);
    },

    baseLayoutClicked: function(view, record, item) {
        this.fireEvent('baselayoutclicked', view, record, item);
    },

    setToDefaultImage: function(dom) {
        if (dom && dom.nodeName === 'IMG') {
            dom.src = 'images/dashboard-designer/' + dom.alt + '.png';
        }
    },

    mouseOver: function(dom) {
        if (dom && dom.nodeName === 'IMG') {
            dom.src = 'images/dashboard-designer/' + dom.alt + '_over.png';
        }
    },

    mouseDown: function(dom) {
        if (dom && dom.nodeName === 'IMG') {
            dom.src = 'images/dashboard-designer/' + dom.alt + '_down.png';
        }
    },

    paneLayoutTypeSelected: function(view, record, item) {
        this.fireEvent('panelayouttypeselected', view, record, item);
    },

    setupFocus: function(view) {
        var els = this.el.query('.layout-type');

        Ext.defer(function() {

            // select and focus first item
            view.select(0);

            els[0].focus();

        }, 100);
    }
});
