Ext.define('Ozone.components.panel.WidgetHeader', {
    extend: 'Ext.panel.Header',
    alias: ['widget.widgetheader','widget.Ozone.components.panel.WidgetHeader'],
    defaultType: 'widgettool',
    cls: 'widgetheader',
    inactiveCls: 'x-tab-top-inactive',

    initComponent: function() {
        var me = this,
            rule,
            style,
            titleTextEl,
            ui;

        me.indicateDragCls = me.baseCls + '-draggable';
        me.title = Ext.htmlEncode(me.title) || '&#160;';
        me.tools = me.tools || [];
        me.items = me.items || [];
        me.orientation = me.orientation || 'horizontal';
        me.dock = (me.dock) ? me.dock : (me.orientation == 'horizontal') ? 'top' : 'left';
    
        me.addClsWithUI(me.orientation);
        me.addClsWithUI(me.dock);
    
        me.addChildEls('body');
    
        if (!Ext.isEmpty(me.iconCls) || !Ext.isEmpty(me.icon)) {
            me.initIconCmp();
            me.items.push(me.iconCmp);
        }
    
        if (me.orientation == 'vertical') {
            
            if (Ext.isIE6 || Ext.isIE7) {
                me.width = this.width || 24;
            } else if (Ext.isIEQuirks) {
                me.width = this.width || 25;
            }
    
            me.layout = {
                type : 'vbox',
                align: 'center',
                clearInnerCtOnLayout: true,
                bindToOwnerCtContainer: false
            };
            me.textConfig = {
                cls: me.baseCls + '-text',
                type: 'text',
                text: me.title,
                rotate: {
                    degrees: 90
                }
            };
            ui = me.ui;
            if (Ext.isArray(ui)) {
                ui = ui[0];
            }
            rule = Ext.util.CSS.getRule('.' + me.baseCls + '-text-' + ui);
            if (rule) {
                style = rule.style;
            }
            if (style) {
                Ext.apply(me.textConfig, {
                    'font-family': style.fontFamily,
                    'font-weight': style.fontWeight,
                    'font-size': style.fontSize,
                    fill: style.color
                });
            }
            me.titleCmp = Ext.create('Ext.draw.Component', {
                ariaRole: 'heading',
                focusable: false,
                viewBox: false,
                flex : 1,
                autoSize: true,
                margins: '5 0 0 0',
                items: [ me.textConfig ],
                renderSelectors: {
                    textEl: '.' + me.baseCls + '-text'
                }
            });
        } else {
            me.layout = {
                type : 'owfhbox',
                overflowHandler: 'Ozone.components.container.boxOverflow.Menu',
                align: 'middle'
            };
            function openEditor(event) {
                var self = me,
                    titleCmp = self.titleCmp;


                event.stopEvent();

//                //if we are focused, set a flag so that focus returns when
//                //the editor is closed
//                self.returnFocus = (titleCmp.getEl().dom === document.activeElement);

                var editor = Ext.create('Ext.Editor', {
                    updateEl: false,
                    width: titleCmp.getWidth(),
                    height: titleCmp.getHeight(),
                    parentEl: titleCmp.getEl(),
                    shadow: false,
                    titleCmp: titleCmp,
                    field: {
                        xtype: 'textfield',
                        allowBlank: false
                    },
                    listeners: {
                        specialkey: {
                            fn: function(editor, field, evt) {
                                if (evt.getKey() === evt.ENTER) {
                                    evt.preventDefault();
                                    self.titleCmp.focus();
                                }
                            },
                            scope: self
                        },
                        afterrender: function (cmp) {
                            cmp.mon(cmp.getEl(), 'keydown', function(evt) {
                                //this is supposed to be done automatically
                                //by Ext, but it seems to have a bug in FF
                                //that prevents it from working, since in FF 
                                //it uses keypress instead of keydown
                                evt.stopPropagation();

                                //take care of focus issues wth esc
                            });

                            Ozone.components.focusable.EscCloseHelper.prototype.
                                setupFocusOnEsc.call(cmp, self.titleCmp.getFocusEl(),
                                        true);
                        }
                    }
                });

                //make sure the editor uses the full title not the one in the textEl because that may have been shortened
                editor.startEdit(titleCmp.textEl, Ext.htmlDecode(me.title));
                editor.alignTo(self.iconCmp, 'l-r');
                editor.on('complete', function(editor, value, startValue, options) {
                    //Set the title of the header component to the encoded title
                    self.ownerCt.setTitle(value);

                    editor.clearListeners();
                    editor.destroy();
                });
            }

            me.titleCmp = Ext.create('Ext.Component', {
                xtype: 'component',
                ariaRole: 'heading',
//              focusable: false,
                plugins: [
                    new Ozone.components.focusable.Focusable()
                ],
                minWidth: 66,
                flex : 1,
                cls: me.baseCls + '-text-container',
                renderTpl : [
                    '<span id="{id}-textEl" class="{cls}-text {cls}-text-{ui}">{title}</span>'
                ],
                renderData: {
                    title: me.title,
                    cls: me.baseCls,
                    ui: me.ui
                },
                childEls: ['textEl'],
                renderSelectors: {
                    textEl: '.' + me.baseCls + '-text'
                },
                listeners: {
//                    resize: {
//                        fn: function(cmp, adjWidth, adjHeight) {
//                          this.setTitle(this.title);
//                        },
//                        scope: this
//                    },
                    afterrender: {
                        fn: function(cmp) {
                            var preventFocus = false;


                            var tooltip = {
                                text: this.title
                            };
                            this.setTooltip(tooltip);
                            cmp.keyMap = new Ext.util.KeyMap(cmp.el, [
                                {
                                    key: [Ext.EventObject.ENTER, Ext.EventObject.SPACE],
                                    handler: function(num, evt) {
                                        openEditor(evt);
                                    }
                                }
                            ]);
                            
                            cmp.mon(cmp.textEl, 'dblclick', openEditor);

                            //in IE in ext4.0.7, the tileCmp mysteriously
                            //gets focused when it is clicked on.  This should
                            //not happen
                            cmp.mon(cmp.getEl(), 'focus', function() {
                                if (preventFocus) this.blur();
                            }, cmp.getEl());

                            cmp.mon(cmp.getEl(), 'mousedown', function (evt) {
                                preventFocus = true;
                            });

                            var unprevent = function() {
                                preventFocus = false;
                            };
                            cmp.mon(cmp.getEl(), {
                                mouseup: unprevent, 
                                mouseout: unprevent
                            });


                        },
                        scope: this,
                        single: true
                    },
                    destroy: {
                        fn: function(cmp) {
                            this.clearTip();
                        },
                        scope: this
                    }
                }
            });
        }
        me.items.push(me.titleCmp);


        // Spacer ->
        me.spacer = Ext.create('Ext.Component', {
            itemId: 'spacer',
            xtype: 'component',
            html: '&nbsp;',
            width: 14,
            focusable: false
        });
        me.items.push(me.spacer);
    
        // Add Tools
        me.items = me.items.concat(me.tools);
    
        Ozone.components.panel.WidgetHeader.superclass.superclass.initComponent.apply(this, arguments);
    },

     //override - always fire click event no matter what type of button/tool is clicked
    onClick: function(e) {
      this.fireEvent('click', e);
    },


    initIconCmp: function() {
        this.iconCmp = Ext.create('Ext.Component', {
            focusable: false,
            renderTpl: ['<div>' + 
                            '<img id="{id}-iconEl" alt="" src="{icon}" class="{cls}-icon {iconCls}"/>' +
                        '</div>'],
            renderData: {
                icon: this.icon != null ? this.icon : Ext.BLANK_IMAGE_URL,
                cls: this.baseCls,
                iconCls: this.iconCls,
                orientation: this.orientation,
                singleton: this.singleton
            },
            childEls: ['iconEl'],
            renderSelectors: {
                iconEl: '.' + this.baseCls + '-icon'
            },
            icon: this.icon,
            iconCls: this.iconCls
        });
    },

    /**
     */
    setIcon: function(icon) {
        this.icon = icon;
        if (!this.iconCmp) {
            this.initIconCmp();
            this.insert(0, this.iconCmp);
        }
        else {
            if (!icon || !icon.length) {
                this.iconCmp.destroy();
            }
            else {
                var iconCmp = this.iconCmp,
                    el      = iconCmp.iconEl;

                el.set({src:icon});
                iconCmp.icon = icon;
            }
        }
    },

    setTooltip: function(tooltip, initial) {
        var me = this;

        if (me.rendered) {
            if (!initial) {
                me.clearTip();
            }
            if (Ext.isObject(tooltip)) {
                var t = Ext.apply({
                    target: this.titleCmp.textEl,
                    //align: 'bl-tl',
                    anchor: 'bottom'
                },
                tooltip);
                t.html = t.text;
                me.tooltip = Ext.create('Ozone.components.tip.ToolTip',t);
            } else {
                me.btnEl.dom.setAttribute('data-' + this.tooltipType, tooltip);
            }
        } else {
            me.tooltip = tooltip;
        }
        return me;
    },

    // private
    clearTip: function() {
        if (Ext.isObject(this.tooltip)) {
            this.tooltip.destroy();
        }
    },

    /**
     * Sets the title of the header. Disables HTML since the
     * title may come from outside sources, such as the Chrome API
     * @param {String} title The title to be set
     */
    setTitle: function(title) {
        title = Ext.htmlEncode(title);

        this.callParent([title]);

        //update tooltip
        this.setTooltip({
            text: title
        });
    },

    // @private
    activate : function(supressEvent) {
        var me = this;

        me.active = true;
        me.removeCls(me.inactiveCls);

        if (supressEvent !== true) {
            me.fireEvent('activate', me);
        }
    },

    // @private
    deactivate : function(supressEvent) {
        var me = this;

        me.active = false;
        me.addCls(me.inactiveCls);

        if (supressEvent !== true) {
            me.fireEvent('deactivate', me);
        }
    },

    // Inserts specified tool before specified element. If pos is null,
    // prepends tool to current tools.
    insertTool : function(tool, pos) {
        // Start after spacer
        var insertPos = this.items.indexOf(this.spacer) + 1;
        if (pos) insertPos += pos;
        
        this.tools.push(this.insert(insertPos, tool));
    },
    
    // Inserts specified item before specified element. If pos is null,
    // appends item to current menu items.
    insertMenuItem : function(menu, pos) {
        // Append by default
        var insertPos = this.items.indexOf(this.spacer);
        
        // If pos is specified, start after title editor
        if (pos) insertPos = this.items.indexOf(this.editor) + 1 + pos;
        var obj = Ext.ClassManager.instantiateByAlias("widget." + menu.xtype, menu);
        this.insert(insertPos, obj);
    },

    //because this is a custom header is we need any xtype call to be deep so the custom header
    //will be considered a subclass of header
    isXType: function(xtype, shallow) {
      if (xtype == 'header') {
        return this.callParent([xtype,false]);
    }
      else {
        return this.callParent(arguments);
      }
    }
});
