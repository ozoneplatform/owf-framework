Ext.override(Ext.grid.Panel, {
    /*
     * Set the tabIndex of EXT scroller to -1, so that it doesn't receive focus when using keyboard.
     */
    initComponent: function() {
        this.callParent(arguments);

        this.mon({
            scrollershow: function (scroller) {
                scroller.mon({
                    afterrender: function (scroller) {
                        scroller.scrollEl.dom.tabIndex = -1;
                    }
                });
            }
        });
    }
});