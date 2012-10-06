Ext.define('Ozone.components.layout.PinnableAccordion', {
	extend: 'Ext.layout.container.Accordion',
	alias: 'layout.pinnableaccordion',
	
	renderItems : function(items, target) {
        var me = this,
            ln = items.length,
            i = 0,
            comp,
            targetSize = me.getLayoutTargetSize(),
            renderedPanels = [],
            border;

        for (; i < ln; i++) {
            comp = items[i];
            if (!comp.rendered) {
                renderedPanels.push(comp);

                // Set up initial properties for Panels in an accordion.
                if (me.collapseFirst) {
                    comp.collapseFirst = me.collapseFirst;
                }
                if (me.hideCollapseTool) {
                    comp.hideCollapseTool = me.hideCollapseTool;
                    comp.titleCollapse = true;
                }
                else if (me.titleCollapse) {
                    comp.titleCollapse = me.titleCollapse;
                }

                delete comp.hideHeader;
                comp.collapsible = true;
                comp.title = comp.title || '&#160;';
                comp.setBorder(false);

                // Set initial sizes
                comp.width = targetSize.width;
                if (me.fill) {
                    delete comp.height;
                    delete comp.flex;

                    if (comp.collapsed === false) {
                        comp.flex = 1;
                    } else {
                        comp.collapsed = true;
                    }
                } else {
                    delete comp.flex;
                    comp.animCollapse = me.initialAnimate;
                    comp.autoHeight = true;
                    comp.autoScroll = false;
                }
            }
        }
        
        // Render all Panels.
		Ozone.components.layout.PinnableAccordion.superclass.superclass.renderItems.apply(this, arguments);
                
        // Postprocess rendered Panels.
        ln = renderedPanels.length;
        for (i = 0; i < ln; i++) {
            comp = renderedPanels[i];

            // Delete the dimension property so that our align: 'stretch' processing manages the width from here
            delete comp.width;

            comp.header.addCls(Ext.baseCSSPrefix + 'accordion-hd');
            comp.body.addCls(Ext.baseCSSPrefix + 'accordion-body');
            
            // If we are fitting, then intercept expand/collapse requests. 
            if (me.fill) {
                me.owner.mon(comp, {
                    show: me.onComponentShow,
                    beforeexpand: me.onComponentExpand,
                    beforecollapse: me.onComponentCollapse,
                    scope: me
                });
            }
        }
    },
	
	onComponentExpand: function(toExpand) {
        var me = this,
            it = me.owner.items.items,
            len = it.length,
            i = 0,
            comp;

        for (; i < len; i++) {
            comp = it[i];
            if (comp === toExpand && comp.collapsed && !comp.pinned) {
                me.setExpanded(comp);
            } else if (!me.multi && (comp.rendered && comp.header.rendered && comp !== toExpand && !comp.collapsed)) {
                me.setCollapsed(comp);
            }
        }
        
        me.animate = me.initialAnimate;
        me.layout();
        me.animate = false;
        return false;
    },
	
	onComponentCollapse: function(comp) {
        var me = this,
            toExpand = comp.next() || comp.prev(),
            expanded = me.multi ? me.owner.query('>panel:not([collapsed])') : [];

        // If we are allowing multi, and the "toCollapse" component is NOT the only expanded Component,
        // then ask the box layout to collapse it to its header.
        if (me.multi && !me.pinned) {
            me.setCollapsed(comp);

            // If the collapsing Panel is the only expanded one, expand the following Component.
            // All this is handling fill: true, so there must be at least one expanded,
            //if (expanded.length === 1 && expanded[0] === comp) {
            //    me.setExpanded(toExpand);
            //}
            
            me.animate = me.initialAnimate;
            me.layout();
            me.animate = false;
        }
        // Not allowing multi: expand the next sibling if possible, prev sibling if we collapsed the last
        else if (toExpand && !me.pinned) {
            me.onComponentExpand(toExpand);
        }
        return false;
    },
    setCollapsed: function(comp) {
        this.callParent(arguments);

        //check if tool is in menu overflow if so toggle type
        var menu =  comp.header.layout.overflowHandler.menu;
        if (comp.collapseTool && menu != null && menu.items !=null
                && menu.items.getCount() > 0) {

            var menuCollapseTool = null;
            var menuItems = menu.items;

            //find collapsetool in actual menu
            for (var i = 0 ; i < menuItems.getCount() ; i++) {
              if (menuItems.getAt(i).type.indexOf('collapse-') == 0) {
                menuCollapseTool = menuItems.getAt(i);
                break;
              }
            }

            if (menuCollapseTool) {
              menuCollapseTool.setType('expand-' + comp.getOppositeDirection(comp.collapseDirection));
            }

            //find collapsetool in overflowHander.menuItems
            menuItems = comp.header.layout.overflowHandler.menuItems
            for (var i = 0 ; i < menuItems.length ; i++) {
              if (menuItems[i].type.indexOf('collapse-') == 0) {
                menuCollapseTool = menuItems[i];
                break;
              }
            }

            if (menuCollapseTool) {
              menuCollapseTool.setType('expand-' + comp.getOppositeDirection(comp.collapseDirection));
            }
        }
    },

    setExpanded: function(comp) {
      this.callParent(arguments);

      //check if tool is in menu overflow if so toggle type
      var menu =  comp.header.layout.overflowHandler.menu;
      if (comp.collapseTool && menu != null && menu.items !=null
              && menu.items.getCount() > 0) {

        var menuCollapseTool = null;
        var menuItems = menu.items;

        //find collapsetool in actual menu
        for (var i = 0 ; i < menuItems.getCount() ; i++) {
          if (menuItems.getAt(i).type.indexOf('expand-') == 0) {
            menuCollapseTool = menuItems.getAt(i);
            break;
          }
        }

        if (menuCollapseTool) {
          menuCollapseTool.setType('collapse-' + comp.collapseDirection);
        }

        //find collapsetool in overflowHander.menuItems
        menuItems = comp.header.layout.overflowHandler.menuItems
        for (var i = 0 ; i < menuItems.length ; i++) {
          if (menuItems[i].type.indexOf('expand-') == 0) {
            menuCollapseTool = menuItems[i];
            break;
          }
        }

        if (menuCollapseTool) {
          menuCollapseTool.setType('collapse-' + comp.collapseDirection);
        }
      }
    }
});
