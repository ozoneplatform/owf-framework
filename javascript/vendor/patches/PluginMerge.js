Ext.override(Ext.AbstractComponent, {
    constructor: function(config) {

        //Add to the array of plugins instead of overwriting it
        if (config.plugins && this.plugins) {
            this.plugins = [].concat(this.plugins).concat(config.plugins);
            delete config.plugins;
        }

        this.callOverridden(arguments);
    }
});
