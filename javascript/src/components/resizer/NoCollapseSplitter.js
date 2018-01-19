Ext.define('Ozone.components.resizer.NoCollapseSplitter', {
    extend: 'Ext.resizer.Splitter',
    alias: 'widget.nocollapsesplitter',

    /**
     * @property orientation
     * @type String
     * Orientation of this Splitter. <code>'vertical'</code> when used in an hbox layout, <code>'horizontal'</code>
     * when used in a vbox layout.
     */

    onRender: function() {
        var me = this,
            target = me.getCollapseTarget(),
            collapseDir = me.getCollapseDirection();

        Ext.applyIf(me.renderData, {
            collapseDir: collapseDir,
            //only use the collapsible flag on the splitter
            collapsible: me.collapsible
        });

        me.addChildEls('collapseEl');

        this.callParent(arguments);

        // Add listeners on the mini-collapse tool unless performCollapse is set to false
        if (me.performCollapse !== false) {
            if (me.renderData.collapsible) {
                me.mon(me.collapseEl, 'click', me.toggleTargetCmp, me);
            }
            if (me.collapseOnDblClick) {
                me.mon(me.el, 'dblclick', me.toggleTargetCmp, me);
            }
        }

        // Ensure the mini collapse icon is set to the correct direction when the target is collapsed/expanded by any means
        me.mon(target, 'collapse', me.onTargetCollapse, me);
        me.mon(target, 'expand', me.onTargetExpand, me);

        me.el.addCls(me.baseCls + '-' + me.orientation);
        me.el.unselectable();

        me.tracker = Ext.create('Ext.resizer.SplitterTracker', {
            el: me.el
        });

        // Relay the most important events to our owner (could open wider later):
        me.relayEvents(me.tracker, [ 'beforedragstart', 'dragstart', 'dragend' ]);
    }

});

