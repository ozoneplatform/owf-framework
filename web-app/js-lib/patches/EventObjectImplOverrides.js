// TODO: review this when upgrading EXT
// Added for a bug in Ext 4.0.7: OWF-4308
// http://www.sencha.com/forum/showthread.php?160626-Ext.fly(...)-is-null-or-not-an-object

Ext.override(Ext.EventObjectImpl, {
    getTarget : function(selector, maxDepth, returnEl){

        // patch begin
        if(!this.target) {
            return null;
        }
        // patch end

        if (selector) {
            return Ext.fly(this.target).findParent(selector, maxDepth, returnEl);
        }
        return returnEl ? Ext.get(this.target) : this.target;
    }
});