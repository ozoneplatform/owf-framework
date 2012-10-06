// Begin Fix for OWF-3698, OWF-3756, OWF-4445
Ext.override(Ext.button.Button, {
    showMenu: function() {
        var me = this;
        if (me.rendered && me.menu) {
            if (me.tooltip && me.getTipAttr() != 'title') {
                Ext.tip.QuickTipManager.getQuickTip().cancelShow(me.btnEl);
            }
            if (me.menu.isVisible()) {
                me.menu.hide();
            }

            me.menu.showBy(me.el, me.menuAlign);

            // EXTJSIV-4481: sub-menus are sometimes not aligned. run it again to get re-aligned.
            me.menu.showBy(me.el, me.menuAlign);
        }
        return me;
    }
});

Ext.override(Ext.menu.Item, {
	deferExpandMenu: function() {
	    var me = this;

	    if (!me.menu.rendered || !me.menu.isVisible()) {
	        me.parentMenu.activeChild = me.menu;
	        me.menu.parentItem = me;
	        me.menu.parentMenu = me.menu.ownerCt = me.parentMenu;
	        me.menu.showBy(me, me.menuAlign);

            // EXTJSIV-4481: sub-menus are sometimes not aligned. run it again to get re-aligned.
            me.menu.showBy(me, me.menuAlign);
	    }
    }
});
// End Fix

