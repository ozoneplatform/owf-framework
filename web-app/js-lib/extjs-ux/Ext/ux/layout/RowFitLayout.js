Ext.namespace('Ext.ux.layout');

/** 
 * <p>Layout that distributes heights of elements so they take 100% of the 
 * container height.</p> 
 * <p>Height of the child element can be given in pixels (as an integer) or 
 * in percent. All elements with absolute height (i.e. in pixels) always will 
 * have the given height. All "free" space (that is not filled with elements 
 * with 'absolute' height) will be distributed among other elements in 
 * proportion of their height percentage. Elements without 'height' in the 
 * config will take equal portions of the "unallocated" height.</p> 
 * <p>Supports panel collapsing, hiding, removal/addition. The adapter is provided 
 * to use with Ext.SplitBar: <b>Ext.ux.layout.RowFitLayout.SplitAdapter</b>.</p> 
 * <br>Forum thread: <a href="http://extjs.com/forum/showthread.php?t=17116">http://extjs.com/forum/showthread.php?t=17116</a>
 * <br>Demo link: <a href="http://exteriments.chl.ru/row-fit-layout/">http://exteriments.chl.ru/row-fit-layout/</a>
 * 
 * <p>Example usage:</p> 
 * <pre><code> 
 var vp = new Ext.Viewport({ 
   layout: 'row-fit', 
   items: [ 
     { xtype: 'panel', height: 100, title: 'Height in pixels', html: 'panel height = 100px' }, 
     { xtype: 'panel', height: "50%", title: '1/2', html: 'Will take half of remaining height' }, 
     { xtype: 'panel', title: 'No height 1', html: 'Panel without given height', id: '' }, 
     { xtype: 'panel', title: 'No height 2', html: 'Another panel' } 
   ] 
 }); 
 * </code></pre> 
 * Usage of the split bar adapter: 
 * <pre><code> 
 var split = new Ext.SplitBar("elementToDrag", "elementToSize", Ext.SplitBar.VERTICAL, Ext.SplitBar.TOP); 
 // note the Ext.SplitBar object is passed to the adapter constructor to set 
 // correct minSize and maxSize: 
 split.setAdapter(new Ext.ux.layout.RowFitLayout.SplitAdapter(split)); 
 * </code></pre> 
 * @class Ext.ux.layout.RowFitLayout 
 * @extends Ext.layout.ContainerLayout 
 * @author <a href="http://extjs.com/forum/member.php?u=14815">kx</a> Published by: <a href="http://extjs.com/forum/member.php?u=36826">SamuraiJack</a>
 * @license Please contact the author for specifing of licensing terms.
 * @version 0.1
 */

Ext.ux.layout.RowFitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize: true,

    // private
    trackChildEvents: ['collapse', 'expand', 'hide', 'show'],
    
    /**
     * @cfg {Boolean} 
     */
    monitorChildren : true,
    disableCollapseAnimation : true,
    

    // private
    splitHeight: 5,
    rendered: false,

    // private
    renderItem: function(c, position, target) {
        Ext.ux.layout.RowFitLayout.superclass.renderItem.apply(this, arguments);

        // add event listeners
        for (var i = 0, n = this.trackChildEvents.length; i < n; i++) {
            var ev = this.trackChildEvents[i];
            //c.on(this.trackChildEvents[i], this.itemListener, this);
            c.on(ev, this['_item_' + ev], this);
        }
        if (this.disableCollapseAnimation) c.animCollapse = false; // looks ugly together with row-fit layout

        this.checkRelHeight(c);
    },

    checkRelHeight: function(c) {
    	
    	if (c.rowFit && c.height !== c.rowFit.height) {
    		delete c.rowFit;
    	}

        // store some layout-specific calculations
        if (!c.rowFit) {
            c.rowFit = {
                hasAbsHeight: false,
                // whether the component has absolute height (in pixels)
                relHeight: 0,
                // relative height, in pixels (if applicable)
                calcRelHeight: 0,
                // calculated relative height (used when element is resized)
                calcAbsHeight: 0,
                // calculated absolute height
                height: c.height // save height config
            };
            
            var height = c.height;

            if (typeof height == "string" && /\%/.test(height) ) {
//            // store relative (given in percent) height
                c.rowFit.relHeight = parseInt(height);
            } else if (typeof height == "number") { // set absolute height
//                c.setHeight(c.height);
                //c.rowFit.hasAbsHeight = true;
                c.rowFit.hasAbsHeight = !Boolean(c.split);
            }
            
        }

//        // process height config option
//        if (c.height !== c.rowFit.height) {
//        	c.rowFit.height = c.height;
//        	
//            var height = c.height;
//            if (typeof height == "string" && height.indexOf("%")) {
//                c.rowFit.relHeight = parseInt(height);
//            } else { // set absolute height
//                c.setHeight(c.height);
//                //c.rowFit.hasAbsHeight = true;
//                c.rowFit.hasAbsHeight = !Boolean(c.split);
//            }
//        }
        //if(c.split) c.rowFit.hasAbsHeight = false;
        c.isResizable = c.isResizable || Boolean(c.split) || !c.rowFit.hasAbsHeight;
    },

    // private
    onLayout: function(ct, target) {

        Ext.ux.layout.RowFitLayout.superclass.onLayout.call(this, ct, target);

        if (this.container.collapsed || !ct.items || !ct.items.length) {
            return;
        }

        // first loop: determine how many elements with relative
        // height are there,
        // sums of absolute and relative heights etc.
        
        var absHeightSum = 0,
        // sum of elements' absolute heights
        
        relHeightSum = 0,
        // sum of all percent heights given in children configs
        
        relHeightRatio = 1,
        // "scale" ratio used in case sum <> 100%
        
        noHeightCount = 0,
        // number of elements with no height given
        
        relHeightElements = []; // array of elements with 'relative' height for the second loop

//        var targetSize = target.getStyleSize();
		var targetSize = target.getViewSize();
        targetSize.width -= target.getPadding('lr');
        targetSize.height -= target.getPadding('tb');
		
        for (var i = 0, n = ct.items.length; i < n; i++) {
            var c = ct.items.itemAt(i);
            
            this.checkRelHeight(c);

            if (!c.isVisible()) continue;

            // collapsed panel is treated as an element with absolute height
            if (c.collapsed) {
                var h = c.getFrameHeight();
                absHeightSum += h;
                c.setWidth(targetSize.width - c.getEl().getMargins('lr'));
            } else if (c.rowFit.hasAbsHeight) { // element that has an absolute height
            	
                absHeightSum += c.height;
                
                c.setSize({
                    width: targetSize.width - c.getEl().getMargins('lr'),
                    height: c.height
                });

            } else if (c.rowFit.relHeight) { // 'relative-heighted'
            	
                relHeightSum += c.rowFit.relHeight;
                relHeightElements.push(c);
                
            } else if (c.autoHeight) {
            	
            	absHeightSum += c.getEl().getHeight() + c.getEl().getMargins('tb');
            	c.setWidth(targetSize.width - c.getEl().getMargins('lr'));
            	
            } else {// element with no height given
                
                noHeightCount++;
                absHeightSum += c.getFrameHeight ? c.getFrameHeight() : 0;
//                    c.setSize({
//                        width: targetSize.width - c.getEl().getMargins('lr'),
//                        height: c.height
//                    });
                c.setWidth(targetSize.width - c.getEl().getMargins('lr'));
                relHeightElements.push(c);
                
            }
            
        }

        // if sum of relative heights <> 100% (e.g. error in config or consequence of collapsing/removing panels), scale 'em so it becomes 100%
        if (noHeightCount == 0 && relHeightSum != 100) {
            relHeightRatio = 100 / relHeightSum;
        }

        var freeHeight = target.getStyleSize().height - absHeightSum,       // "unallocated" height we have
        absHeightLeft = freeHeight; // track how much free space we have

        while (relHeightElements.length) {
            var c = relHeightElements.shift();
            // element we're working with
            
            var relH = c.rowFit.relHeight * relHeightRatio;
            // height of this element in percent
            
            var absH = 0; // height in pixels

            // no height in config
            if (!relH) {
                relH = (100 - relHeightSum) / noHeightCount;
            } 

            // last element takes all remaining space
            if (!relHeightElements.length) {
                absH = absHeightLeft;
            } else {
                absH = Math.round(freeHeight * relH / 100);
            }

            // anyway, height can't be negative
            if (absH < 0) absH = 0;

            c.rowFit.calcAbsHeight = absH;
            c.rowFit.calcRelHeight = relH;
            c.setSize({
                width: targetSize.width - c.getEl().getMargins('lr'),
                height: absH
            });

            absHeightLeft -= absH;
        }

        for (var i = 0,n = ct.items.length; i < n; i++) {
            
            var c = ct.items.itemAt(i);
            
            if (c.isSlider && c.el2resize) {
                // this.checkRelHeight(c);
                var split = new Ext.SplitBar(c.el, c.el2resize.el, Ext.SplitBar.VERTICAL, Ext.SplitBar.TOP);
                split.setAdapter(new Ext.ux.layout.RowFitLayout.SplitAdapter(split));
                c.el2resize.sliderId = c.getId();
                c.el2resize = false;
            }
        }

        if (!this.rendered) { // keep watching for changes of items
            ct.on('add', this.ctAddItem, this);
            ct.on('remove', this.ctDelItem, this);
            this.rendered = true;
        }
    },
    // private - called from Ext.Container
    setContainer: function(ct) {
        Ext.ux.layout.RowFitLayout.superclass.setContainer.call(this, ct);
        this._addSliders(ct);
    },

    // private
    _addSliders: function(ct) {
        var sh = ct.splitHeight || this.splitHeight;
        var skip1 = true;
        var n = ct.items.length;
        for (var i = n - 1; i >= 0; i--) {
            var c = ct.items.itemAt(i);

            this.checkRelHeight(c);
            if (c.isResizable) { // !c.rowFit.hasAbsHeight) {
                if (skip1) {
                    skip1 = false;
                    continue;
                }

                if (c.split) {
                    var slider = new Ext.Panel({
                        height: sh,
                        isSlider: true
                    });
                    slider.el2resize = c;
                    slider.addClass('x-splitbar-y');
                    ct.insert(i + 1, slider);
                }
            }
        }
    },

    /**
   * Add event listener for container children
   * @private
   */
    itemListener: function(item) {
        item.ownerCt.doLayout();
    },
    _item_show: function(comp) {
    	if (!this.monitorChildren) return;
    	
        if (!comp.isSlider && comp.sliderId) {
            var sl = comp.ownerCt.findById(comp.sliderId);
            if (!sl.isVisible()) {
                sl.show();
                return;
            }
        }
        comp.ownerCt.doLayout();
    },
    _item_hide: function(comp) {
    	if (!this.monitorChildren) return;
    	
        if (!comp.isSlider && comp.sliderId) {
            var sl = comp.ownerCt.findById(comp.sliderId);
            if (sl.isVisible()) {
                sl.hide();
                return;
            }
        }
        comp.ownerCt.doLayout();
    },
    _item_expand: function(comp) {
    	if (!this.monitorChildren) return;
    	
        this._item_show(comp);
    },
    _item_collapse: function(comp) {
    	if (!this.monitorChildren) return;
    	
        this._item_hide(comp);
    },

    /**
   * Event listener for the container (on add, remove)
   * @private
   */
    ctAddItem: function(ct, comp, idx) {
        // TODO: ev. add slider & splitbar
        ct.doLayout();
    },
    ctDelItem: function(ct, comp) {
        // TODO: ev. remove slider & splitbar
        ct.doLayout();
    }

});

// Split adapter
if (Ext.SplitBar.BasicLayoutAdapter) {

    /**
   * @param {Ext.SplitBar} splitbar to which adapter is applied.
   *   If supplied, will set correct minSize and maxSize.
   */
    Ext.ux.layout.RowFitLayout.SplitAdapter = function(splitbar) {
        if (splitbar && splitbar.el.dom.nextSibling) {
            var next = Ext.getCmp(splitbar.el.dom.nextSibling.id),
            resized = Ext.getCmp(splitbar.resizingEl.id);

            // skip abs-height non-resizable components
            while (next && (next.collapsed || !next.isVisible() || !next.isResizable)) {
                next = Ext.getCmp(next.el.dom.nextSibling.id);
            }

            if (next) {
                //splitbar.maxSize = (resized.height || resized.rowFit.calcAbsHeight) +
                splitbar.maxSize = (resized.rowFit.hasAbsHeight ? resized.rowFit.calcAbsHeight: resized.getSize().height) + next.getInnerHeight() - 1; // seems can't set height=0 in IE, "1" works fine
            }
            splitbar.minSize = resized.getFrameHeight() + 1;
        }
    };

    Ext.extend(Ext.ux.layout.RowFitLayout.SplitAdapter, Ext.SplitBar.BasicLayoutAdapter, {

        setElementSize: function(splitbar, newSize, onComplete) {
            var resized = Ext.getCmp(splitbar.resizingEl.id);

            // can't resize absent, collapsed or hidden panel
            if (!resized || resized.collapsed || !resized.isVisible()) {
                return;
            }

            // resizingEl has absolute height: just change it
            if (resized.rowFit.hasAbsHeight) {
                resized.setHeight(newSize);
            }
            // resizingEl has relative height: affects next sibling
            else {
                if (splitbar.el.dom.nextSibling) {
                    var nextSibling = Ext.getCmp(splitbar.el.dom.nextSibling.id);
                    // skip abs-height non-resizable components
                    while (nextSibling && (nextSibling.collapsed || !nextSibling.isVisible() || !nextSibling.isResizable)) {
                        nextSibling = Ext.getCmp(nextSibling.el.dom.nextSibling.id);
                    }

                    var deltaAbsHeight = newSize - resized.rowFit.calcAbsHeight,
                    // pixels
                    nsRf = nextSibling.rowFit,
                    // shortcut
                    rzRf = resized.rowFit,
                    // pixels in a percent
                    pctPxRatio = rzRf.calcRelHeight / rzRf.calcAbsHeight,
                    deltaRelHeight = pctPxRatio * deltaAbsHeight; // change in height in percent

                    rzRf.relHeight = rzRf.calcRelHeight + deltaRelHeight;

                    if (nsRf.hasAbsHeight) {
                        var newHeight = nextSibling.height - deltaAbsHeight;
                        nextSibling.height = newHeight;
                        nextSibling.setHeight(newHeight);
                    } else {
                        nsRf.relHeight = nsRf.calcRelHeight - deltaRelHeight;
                    }
                }
            }
            // recalculate heights
            resized.ownerCt.doLayout();
        } // of setElementSize

    }); // of SplitAdapter
}

Ext.Container.LAYOUTS['row-fit'] = Ext.ux.layout.RowFitLayout;