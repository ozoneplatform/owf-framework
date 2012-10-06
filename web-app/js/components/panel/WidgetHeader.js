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
                    updateEl: true,
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
                    //Set the ghostPanel title
                    if(self.ownerCt.ghostPanel) {
                        self.ownerCt.ghostPanel.setTitle(Ext.htmlEncode(value));
                    }
                    //Set the title of the header component to the encoded title
                    self.ownerCt.setTitle(Ext.htmlEncode(value));

                    //Keep the actual title property to the unencoded title
                    self.ownerCt.title = value;

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
                    resize: {
                        fn: function(cmp, adjWidth, adjHeight) {
                          this.setTitle(this.title);
                        },
                        scope: this
                    },
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

    adjustTitle: function(title,adjWidth) {

        var decodedTitle = Ext.htmlDecode(title);

        //Store all the indexes of < and > so they can be restored and replace
        // all occurrences with _ to facilitate width calculation (can't have HTML)
        var lessThanIndexes = [];
        var greaterThanIndexes = [];
        var tempTitle = Ext.htmlDecode(title);
        var pos = decodedTitle.indexOf('<');
        if(pos > -1) {
            tempTitle = tempTitle.replace(/</g, "_");
            while(pos > -1) {
                lessThanIndexes.push(pos);
                pos = decodedTitle.indexOf('<', pos + 1);
            }
        }
        pos = decodedTitle.indexOf('>');
        if(pos > -1) {
            tempTitle = tempTitle.replace(/>/g, "_");
            while(pos > -1) {
                greaterThanIndexes.push(pos);
                pos = decodedTitle.indexOf('>', pos + 1);
            }
        }

        var textEl = this.titleCmp.textEl;
        var titleWidth = textEl.getTextWidth(tempTitle);

        var avaliableWidth = adjWidth != null ? adjWidth : this.titleCmp.getWidth();
        var stdCharWidth = textEl.getTextWidth('.');
        if (titleWidth > avaliableWidth) {
            var diffCharWidth = titleWidth - avaliableWidth;
            var diffChars = 0;

            if (stdCharWidth > 0) {
                diffChars = Math.ceil(diffCharWidth / stdCharWidth) + 2;
            }
            var maxChars = tempTitle.length - diffChars;
            var shortTitle = Ext.util.Format.ellipsis(tempTitle, maxChars > 12 ? maxChars : 12);

            //Add < and > back into the short title
            for(var i = 0; i < greaterThanIndexes.length && greaterThanIndexes.length > 0; i++) {
                //If index is at the elipsis, break
                if(greaterThanIndexes[i] >= shortTitle.length - 3) {
                    break;
                }
                shortTitle = shortTitle.substring(0, greaterThanIndexes[i]) + ">"
                        + shortTitle.substring(greaterThanIndexes[i] + 1);
            }
            for(var i = 0; i < lessThanIndexes.length && lessThanIndexes.length > 0; i++) {
                //If index is at the elipsis, break
                if(lessThanIndexes[i] >= shortTitle.length - 3) {
                    break;
                }
                shortTitle = shortTitle.substring(0, lessThanIndexes[i]) + "<"
                        + shortTitle.substring(lessThanIndexes[i] + 1);
            }

            return Ext.htmlEncode(shortTitle);
        }
        else if (titleWidth <= avaliableWidth) {
            return this.title;
        }
    },

    /**
     * Sets the title of the header.
     * @param {String} title The title to be set
     */
    setTitle: function(title) {
        var me = this;
        if (me.rendered) {
            if (me.titleCmp.rendered) {
                if (me.titleCmp.surface) {
                    me.title = title || '';
                    var sprite = me.titleCmp.surface.items.items[0],
                        surface = me.titleCmp.surface;

                    surface.remove(sprite);
                    me.textConfig.type = 'text';
                    me.textConfig.text = title;
                    sprite = surface.add(me.textConfig);
                    sprite.setAttributes({
                        rotate: {
                            degrees: 90
                        }
                    }, true);
                    me.titleCmp.autoSizeSurface();
                } else {
                    me.title = title || '&#160;';
                    me.titleCmp.textEl.update(this.adjustTitle(me.title));
                }
                
                //update tooltip
                this.setTooltip({
                    text: me.title
                });
            } else {
                me.titleCmp.on({
                    render: function() {
                        me.setTitle(title);
                    },
                    single: true
                });
            }
        } else {
            me.on({
                render: function() {
                    me.layout.layout();
                    me.setTitle(title);
                },
                single: true
            });
        }
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
