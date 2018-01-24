//this fixes a bug where a loadmask should be put on a hidden component and is removed w/o the component being shown
//the mask is still present
Ext.override(Ext.LoadMask, {
    // private
    onBeforeLoad : function() {
        var me = this,
            owner = me.ownerCt || me.floatParent,
            origin;
        if (!this.disabled) {
            // If the owning Component has not been layed out, defer so that the ZIndexManager
            // gets to read its layed out size when sizing the modal mask
            if (owner.componentLayoutCounter) {
                if (owner.el != null && owner.el.isVisible()) {
                  Ext.Component.prototype.show.call(me);
                }
                else {
                    this.showOnParentShow = true;
                }
            } else {
                // The code below is a 'run-once' interceptor.
                origin = owner.afterComponentLayout;
                owner.afterComponentLayout = function() {
                    owner.afterComponentLayout = origin;
                    origin.apply(owner, arguments);
                    if(me.loading) {
                        Ext.Component.prototype.show.call(me);
                    }
                };
            }
        }
    },
    onLoad : function() {
        this.loading = false;
        Ext.Component.prototype.hide.call(this);

        //since this comp is load mask and the mask should now be hidden, showOnParentShow should be false
        //there's no reason to show the load mask if the parent happened to be hidden when the load completed
        this.showOnParentShow = false;
    }
});
