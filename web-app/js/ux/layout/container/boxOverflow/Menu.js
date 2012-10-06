/**
 * @class Ozone.ux.layout.container.boxOverflow.Menu
 * @extends Ext.layout.container.boxOverflow.Menu
 * @private
 */
Ext.define('Ozone.ux.layout.container.boxOverflow.Menu', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.Menu',
    alternateClassName: 'Ext.layout.container.boxOverflow.StyleableMenu', // DO NOT CHANGE - Needed for toolbar's overflow menu
    
    /* End Definitions */

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
            	componentCls: me.componentCls ? me.componentCls : "widgetmenubar",
                listeners: {
                    scope: me,
                    beforeshow: me.beforeMenuShow
                }
            });

            /**
             * @private
             * @property menuTrigger
             * @type Ext.button.Button
             * The expand button which triggers the overflow menu to be shown
             */
            me.menuTrigger = Ext.create('Ext.button.Button', {
                ownerCt : me.layout.owner, // To enable the Menu to ascertain a valid zIndexManager owner in the same tree
                iconCls : me.layout.owner.menuTriggerCls,
                ui      : layout.owner instanceof Ext.toolbar.Toolbar ? 'default-toolbar' : 'default',
                menu    : me.menu,
                getSplitCls: function() { return '';},
                renderTo: me.afterCt
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
                me.menuItems.push(box.component);
                box.component.hide();
            }
        }
    }
});
