Ext.define('Ozone.components.container.boxOverflow.Menu', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.Menu',

    /* End Definitions */

    /**
     * @private
     * Returns a menu config for a given component. This config is used to create a menu item
     * to be added to the expander menu
     * @param {Ext.Component} component The component to create the config for
     * @param {Boolean} hideOnClick Passed through to the menu item
     */
    createMenuConfig : function(component, hideOnClick) {
        var config = Ext.apply({}, component.initialConfig),
            group  = component.toggleGroup;

        Ext.copyTo(config, component, [
            'iconCls', 'icon', 'itemId', 'disabled', 
            'handler', 'scope', 'menu', 'externalHidden'
        ]);

        Ext.apply(config, {
            text       : component.overflowText || component.text || component.type,
            hideOnClick: hideOnClick,
            destroyMenu: false
        });

        if (group || component.enableToggle) {
            Ext.apply(config, {
                group  : group,
                checked: component.pressed,
                listeners: {
                    checkchange: function(item, checked){
                        component.toggle(checked);
                    }
                }
            });
        }

        if (component.isXType('tool') || component.isXType('widgettool')) {
          config.type = component.type;

          if (hideOnClick) {
            Ext.apply(config, {
                listeners: {
                    click: function(item){
                        Ext.menu.Manager.hideAll();
                    }
                }
            });
          }

        }

        config.hidden = config.externalHidden;
        delete config.externalHidden;

        delete config.ownerCt;
        delete config.xtype;
        delete config.id;
        return config;
    },

    /**
     * @private
     * Adds the given Toolbar item to the given menu. Buttons inside a buttongroup are added individually.
     * @param {Ext.menu.Menu} menu The menu to add to
     * @param {Ext.Component} component The component to add
     */
    addComponentToMenu : function(menu, component) {
        var me = this;
        if (component instanceof Ext.toolbar.Separator) {
            menu.add('-');
        } else if (component.isComponent) {
            if (component.isXType('splitbutton')) {
                menu.add(me.createMenuConfig(component, true));

            } else if (component.isXType('button')) {
                menu.add(me.createMenuConfig(component, !component.menu));

            } else if (component.isXType('buttongroup')) {
                component.items.each(function(item){
                     me.addComponentToMenu(menu, item);
                });
            }
            else if (component.isXType('tool') || component.isXType('widgettool')) {
                menu.add(Ext.create(Ext.getClassName(component), me.createMenuConfig(component, true)));
            }
            else {
                menu.add(Ext.create(Ext.getClassName(component), me.createMenuConfig(component)));
            }
        }
    },

    /**
     * @private
     * Creates the overflow trigger and menu used when enableOverflow is set to true and the items
     * in the layout are too wide to fit in the space available
     */
    createMenu: function(calculations, targetSize) {
        var me = this,
            layout = me.layout,
            startProp = layout.parallelBefore,
            sizeProp = layout.parallelPrefix,
            available = targetSize[sizeProp],
            boxes = calculations.boxes,
            i = 0,
            len = boxes.length,
            box;

        if (!me.menuTrigger) {
            me.createInnerElements();

            /**
             * @private
             * @property menu
             * @type Ext.menu.Menu
             * The expand menu - holds items for every item that cannot be shown
             * because the container is currently not large enough.
             */
            me.menu = Ext.create('Ext.menu.Menu', {
                shadow: false,
                listeners: {
                    scope: me,
                    beforeshow: me.beforeMenuShow,
                    show: function() {
                      this.menu.alignTo(this.menuTrigger, 'bl-tl');
                },
                /*
                 * Copied and modified from
                 * Ext.menu.Menu. calls to focus 
                 * were removed since they cause 
                 * the focus frame to show up during mouseover
                 */
                setActiveItem: function(item) {
                    var me = this;

                    if (item && (item != me.activeItem && item != me.focusedItem)) {
                        me.deactivateActiveItem();
                        if (me.canActivateItem(item)) {
                            if (item.activate) {
                                item.activate();
                                if (item.activated) {
                                    me.activeItem = item;
                                }
                            } 
                        }
                        item.el.scrollIntoView(me.layout.getRenderTarget());
                    }
                }
                }
            });
            me.menu.addCls('box-overflow-menu');
            me.menu.on('destroy', function() {
                me.menu.clearListeners();
            });
            /**
             * @private
             * @property menuTrigger
             * @type Ext.button.Button
             * The expand button which triggers the overflow menu to be shown
             */
            me.menuTrigger = Ext.create('Ext.button.Button', {
                ownerCt : me.layout.owner, // To enable the Menu to ascertain a valid zIndexManager owner in the same tree
                iconCls : Ext.baseCSSPrefix + layout.owner.getXType() + '-more-icon',
                ui      : layout.owner instanceof Ext.toolbar.Toolbar ? 'default-toolbar' : 'default',
                menu    : me.menu,
                tooltip : Ozone.layout.Menu.overflowMenuButtonTooltip,
                getSplitCls: function() { return '';},
                renderTo: me.afterCt,
                handler : function(cmp, evt) {
                    evt.stopPropagation();
                },
                tabIndex: 0
            });
        }
        me.showTrigger();
        available -= me.afterCt.getWidth();


        // Hide all items which are off the end, and store them to allow them to be restored
        // before each layout operation.
        me.menuItems.length = 0;
        for (; i < len; i++) {
            box = boxes[i];
            if (box[startProp] + box[sizeProp] > available) {
                var hidden = box.component.hidden;
                me.menuItems.push(box.component);
                box.component.hide();

                modifyShowHide(box.component, hidden);
            }
        }

        /*
         * Customize the show and hide methods
         * on cmp so that they set externalHidden
         * appropriately
         */
        function modifyShowHide(cmp, hidden) {
            //console.log(me);

            //only modify if we haven't already.
            //otherwise inifinte recursion will result
            if (!cmp.hide.customized) {
                cmp.externalHidden = hidden;
                cmp.menuItemHide = cmp.hide;
                cmp.hide = function() {
                    this.menuItemHide();

                    if (arguments.callee.caller !== me.createMenu)
                        this.externalHidden = true;
                }
                cmp.hide.customized = true;
            }

            if (!cmp.show.customized) {
                cmp.menuItemShow = cmp.show;
                cmp.show = function() {
                    this.menuItemShow();
                    this.externalHidden = false;
                }
                cmp.show.customized = true;
            }
        }
    }
    
});