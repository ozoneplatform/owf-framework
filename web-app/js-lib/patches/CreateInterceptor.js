Ext.apply(Ext.Function, {
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;

                //The patch is that these two lines
                //are commented out, as they seem useless and
                //may cause memory leaks
                //newFn.target = me;
                //newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ? 
                    origFn.apply(me || window, args) : returnValue || null;
            };
        }
    }
});
